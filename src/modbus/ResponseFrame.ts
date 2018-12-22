import { FunctionCode } from './FunctionCode';
const { crc16modbus } = require('crc');


export class ResponseFrame {
    id: number;
    func: number;
    address?: number;
    quantity?: number;
    byteCount: number;
    data: Buffer = Buffer.alloc(255);
    crc: number;

    dataLength = 0;

    writeInt8(value: number) {
        this.data.writeUInt8(value, this.dataLength);
        this.dataLength += 1;
    }

    writeUInt8(value: number) {
        this.data.writeUInt8(value, this.dataLength);
        this.dataLength += 1;
    }

    writeInt16(value: number) {
        this.data.writeUInt16BE(value, this.dataLength);
        this.dataLength += 2;
    }
    
    writeUInt16(value: number) {
        this.data.writeUInt16BE(value, this.dataLength);
        this.dataLength += 2;
    }

    // generate a buffer with modbus response bytes
    build() {
        const response: Buffer = Buffer.alloc(255);
        response.writeUInt8(this.id, 0);
        response.writeUInt8(this.func, 1);

        let responseLength = 2;  // device id + func code (2 bytes)

        console.log('data length is ', this.dataLength);

        if (this.func === FunctionCode.READ_HOLDING_REGISTERS) {
            response.writeUInt8(this.dataLength, 2);
            responseLength += 1; // byte count 1 byte
            this.data.copy(response, 3, 0, this.dataLength);
        }

        responseLength += this.dataLength; // data length


        const crcBuffer = Buffer.alloc(responseLength)

        response.copy(crcBuffer, 0, 0, responseLength);
 
        let crc =  crc16modbus(crcBuffer);
        console.log("CRC is ", crc);

        response.writeUInt8((crc  & 0xff), responseLength); //**
        response.writeUInt8((crc >> 8) & 0xff, responseLength + 1); //**
    
        console.log("res buffer ", response);

        responseLength += 2; // for crc 2 bytes
 
        const writeBuffer = Buffer.alloc(responseLength)

        response.copy(writeBuffer, 0, 0, responseLength);
    
        console.log(">>", writeBuffer);
        return writeBuffer;


    }
}