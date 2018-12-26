export class RequestFrame  {
    id: number;
    func: number;
    address: number;
    quantity: number;
    data: Buffer;
    byteCount: number;
    crc: number;

    //tcp
    transactionIdentifier: number;
    protocolIdentifier: number;
    tcpFrameLength: number;
  };