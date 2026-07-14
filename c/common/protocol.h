#ifndef MES_PROTOCOL_H
#define MES_PROTOCOL_H

#include <stdint.h>

#define MES_PACKET_SIZE 7
#define MES_PACKET_STX 0x02
#define MES_PACKET_ETX 0x03

typedef enum {
    MSG_TEMPERATURE = 0x10,
    MSG_HUMIDITY = 0x11,
    MSG_SPEED = 0x12,
    MSG_INSPECTION_RESULT = 0x20,
    MSG_COMMAND_START = 0x30,
    MSG_COMMAND_HOLD = 0x31,
    MSG_COMMAND_RESUME = 0x32,
    MSG_COMMAND_STOP = 0x33
} MessageType;

void protocol_build(uint8_t output[MES_PACKET_SIZE], uint8_t type, int32_t value);
int protocol_validate(const uint8_t packet[MES_PACKET_SIZE]);
int protocol_type_is_known(uint8_t type);
uint8_t protocol_get_type(const uint8_t packet[MES_PACKET_SIZE]);
int32_t protocol_get_value(const uint8_t packet[MES_PACKET_SIZE]);

#endif
