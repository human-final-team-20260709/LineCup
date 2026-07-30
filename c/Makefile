CC ?= gcc
PKGS = libcurl libcjson
CPPFLAGS = -Icommon -Il1 -Il2
CFLAGS ?= -std=c11 -Wall -Wextra -Wpedantic -O2
THREAD_FLAGS = -pthread
HTTP_CFLAGS = $(shell pkg-config --cflags $(PKGS))
HTTP_LIBS = $(shell pkg-config --libs $(PKGS))

COMMON_SRCS = common/types.c common/platform.c common/protocol.c common/net.c
L1_SRCS = l1/main.c l1/machine_common.c \
	l1/machine_mixer.c l1/machine_roller.c l1/machine_noodle.c \
	l1/machine_steamer.c l1/machine_cutter.c l1/machine_fryer.c \
	l1/machine_cooler.c l1/machine_packer.c l1/machine_inspector.c
L2_SRCS = l2/main.c l2/collector.c l2/device_manager.c l2/command_poller.c \
	l2/api_client.c l2/hourly_aggregator.c l2/spool.c

L1_TARGET = mes_l1
L2_TARGET = mes_l2

ifeq ($(OS),Windows_NT)
L1_TARGET := mes_l1.exe
L2_TARGET := mes_l2.exe
PLATFORM_LIBS = -lws2_32 -lpthread
else
PLATFORM_LIBS = $(THREAD_FLAGS)
endif

.PHONY: all l1 l2 test integration-test sanitize clean

all: l1 l2

l1: $(L1_TARGET)

l2: $(L2_TARGET)

$(L1_TARGET): $(COMMON_SRCS) $(L1_SRCS)
	$(CC) $(CPPFLAGS) $(CFLAGS) $(THREAD_FLAGS) -o $@ $^ $(PLATFORM_LIBS) -lm

$(L2_TARGET): $(COMMON_SRCS) $(L2_SRCS)
	$(CC) $(CPPFLAGS) $(CFLAGS) $(HTTP_CFLAGS) $(THREAD_FLAGS) -o $@ $^ $(PLATFORM_LIBS) $(HTTP_LIBS)

test_protocol: tests/test_protocol.c common/protocol.c
	$(CC) $(CPPFLAGS) $(CFLAGS) -o $@ $^

test_aggregator: tests/test_aggregator.c common/types.c common/platform.c l2/hourly_aggregator.c
	$(CC) $(CPPFLAGS) $(CFLAGS) $(THREAD_FLAGS) -o $@ $^ $(PLATFORM_LIBS)

test_spool: tests/test_spool.c common/types.c common/platform.c l2/spool.c
	$(CC) $(CPPFLAGS) $(CFLAGS) $(HTTP_CFLAGS) $(THREAD_FLAGS) -o $@ $^ $(PLATFORM_LIBS) $(HTTP_LIBS)

test: test_protocol test_aggregator test_spool
	./test_protocol
	./test_aggregator
	./test_spool

integration-test: all
	python3 tests/integration_smoke.py

sanitize: CFLAGS += -O1 -g -fsanitize=address,undefined -fno-omit-frame-pointer
sanitize: clean all test

clean:
	rm -f mes_l1 mes_l2 mes_l1.exe mes_l2.exe test_protocol test_aggregator test_spool
