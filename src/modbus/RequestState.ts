export enum RequestState {
    DEVICE_ID = 0,
    FUNC = 1,
    ADDRESS = 2,
    QUANTITY = 3,
    BYTE_COUNT = 4,
    DATA = 5,
    CRC = 6,


    // TCP parts
    TCP_TRANSACTION_ID = 100,
    TCP_PROTOCOL_IDENTIFIER = 101,
    TCP_FRAME_LENGTH = 102
}