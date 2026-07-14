#include <assert.h>
#include <stdint.h>
#include <stdio.h>

#include "protocol.h"
#include "types.h"

static void verify_round_trip(uint8_t type, int32_t value)
{
    uint8_t packet[MES_PACKET_SIZE];
    protocol_build(packet, type, value);
    assert(protocol_validate(packet));
    assert(protocol_get_type(packet) == type);
    assert(protocol_get_value(packet) == value);
}

int main(void)
{
    verify_round_trip(MSG_TEMPERATURE, -1234);
    verify_round_trip(MSG_HUMIDITY, INT32_MAX);
    verify_round_trip(MSG_SPEED, INT32_MIN);
    verify_round_trip(MSG_COMMAND_START, 1000);

    uint8_t packet[MES_PACKET_SIZE];
    protocol_build(packet, MSG_INSPECTION_RESULT, DEFECT_SEALING);
    packet[0] = 0;
    assert(!protocol_validate(packet));
    protocol_build(packet, MSG_INSPECTION_RESULT, DEFECT_SEALING);
    packet[6] = 0;
    assert(!protocol_validate(packet));
    assert(protocol_type_is_known(MSG_COMMAND_STOP));
    assert(!protocol_type_is_known(0x7f));
    puts("test_protocol: OK");
    return 0;
}
