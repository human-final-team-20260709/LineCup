#!/usr/bin/env python3
import json
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer


EQUIPMENT_CODES = [
    "MIXER-01", "ROLLER-01", "NOODLE-01", "STEAMER-01", "CUTTER-01",
    "FRYER-01", "COOLER-01", "PACKER-01", "INSPECTOR-01",
]


class Handler(BaseHTTPRequestHandler):
    received = []

    def log_message(self, _format, *_args):
        return

    def do_GET(self):
        if self.path.startswith("/api/l2/work-orders/active"):
            self._send_json(200, {
                "workOrderId": 101,
                "productionLotId": 201,
                "status": "IN_PROGRESS",
                "targetQty": 20,
                "currentQty": 0,
                "hourlyTargetQty": 700,
                "equipmentCodes": EQUIPMENT_CODES,
            })
            return
        self.send_error(404)

    def do_POST(self):
        length = int(self.headers.get("Content-Length", "0"))
        body = self.rfile.read(length)
        try:
            payload = json.loads(body or b"{}")
        except json.JSONDecodeError:
            self.send_error(400)
            return
        self.received.append((self.path, payload))
        self._send_json(200, {"status": "OK"})

    def _send_json(self, status, payload):
        body = json.dumps(payload).encode()
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)


def serve(port=18080):
    server = ThreadingHTTPServer(("127.0.0.1", port), Handler)
    server.serve_forever()


if __name__ == "__main__":
    serve()
