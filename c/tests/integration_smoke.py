#!/usr/bin/env python3
import os
import signal
import subprocess
import tempfile
import threading
import time

from mock_backend import Handler, ThreadingHTTPServer


def stop_process(process):
    if process.poll() is not None:
        return
    process.send_signal(signal.SIGINT)
    try:
        process.wait(timeout=8)
    except subprocess.TimeoutExpired:
        process.kill()
        process.wait(timeout=3)


def main():
    Handler.received = []
    server = ThreadingHTTPServer(("127.0.0.1", 18080), Handler)
    thread = threading.Thread(target=server.serve_forever, daemon=True)
    thread.start()

    with tempfile.TemporaryDirectory() as temporary:
        env = os.environ.copy()
        env.update({
            "MES_BASE_URL": "http://127.0.0.1:18080",
            "MES_COMMAND_POLL_MS": "200",
            "MES_TELEMETRY_BATCH_MS": "500",
            "MES_AGGREGATION_SECONDS": "2",
            "MES_SENSOR_INTERVAL_MS": "100",
            "MES_INSPECTION_INTERVAL_MS": "200",
            "MES_DEFECT_RATE_PERCENT": "100",
            "MES_RANDOM_SEED": "42",
            "MES_SPOOL_PATH": os.path.join(temporary, "pending.jsonl"),
        })
        l1 = subprocess.Popen(["./mes_l1"], env=env, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        time.sleep(0.5)
        l2 = subprocess.Popen(["./mes_l2"], env=env, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        try:
            deadline = time.time() + 10
            required = {
                "/api/l2/telemetry/batch",
                "/api/l2/hourly-productions",
                "/api/l2/defects",
                "/api/l2/status/heartbeat",
            }
            while time.time() < deadline:
                paths = {path for path, _ in Handler.received}
                if required.issubset(paths):
                    break
                if l1.poll() is not None or l2.poll() is not None:
                    raise RuntimeError("L1 or L2 exited before smoke test completed")
                time.sleep(0.1)
            paths = {path for path, _ in Handler.received}
            missing = required - paths
            if missing:
                raise AssertionError(f"missing API calls: {sorted(missing)}")
            heartbeats = [payload for path, payload in Handler.received if path == "/api/l2/status/heartbeat"]
            if not any(item.get("connectedL1Count") == 9 for item in heartbeats):
                raise AssertionError("heartbeat never reported all 9 L1 connections")
        finally:
            stop_process(l2)
            stop_process(l1)
            server.shutdown()
            server.server_close()
    print("integration_smoke: OK")


if __name__ == "__main__":
    main()
