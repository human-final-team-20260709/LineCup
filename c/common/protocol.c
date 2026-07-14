#include "protocol.h"

void protocol_build(uint8_t output[MES_PACKET_SIZE], uint8_t type, int32_t value)
{
    uint32_t raw = (uint32_t)value;
    output[0] = MES_PACKET_STX;
    output[1] = type;
    output[2] = (uint8_t)(raw & 0xffu);
    output[3] = (uint8_t)((raw >> 8) & 0xffu);
    output[4] = (uint8_t)((raw >> 16) & 0xffu);
    output[5] = (uint8_t)((raw >> 24) & 0xffu);
    output[6] = MES_PACKET_ETX;
}

int protocol_validate(const uint8_t packet[MES_PACKET_SIZE])
{
    return packet != 0 && packet[0] == MES_PACKET_STX && packet[6] == MES_PACKET_ETX;
}

int protocol_type_is_known(uint8_t type)
{
    return (type >= MSG_TEMPERATURE && type <= MSG_SPEED) ||
           type == MSG_INSPECTION_RESULT ||
           (type >= MSG_COMMAND_START && type <= MSG_COMMAND_STOP);
}

uint8_t protocol_get_type(const uint8_t packet[MES_PACKET_SIZE])
{
    return packet[1];
}

int32_t protocol_get_value(const uint8_t packet[MES_PACKET_SIZE])
{
    uint32_t raw = (uint32_t)packet[2] |
                   ((uint32_t)packet[3] << 8) |
                   ((uint32_t)packet[4] << 16) |
                   ((uint32_t)packet[5] << 24);
    return (int32_t)raw;
}
