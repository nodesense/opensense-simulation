import { FunctionCode } from './FunctionCode';
const { crc16modbus } = require('crc');


export class ResponseFrame {
    id: number;
    func: number;
    address: number;
    quantity: number;
    byteCount: number;
    data: Buffer = Buffer.alloc(255);
    crc: number;
    val:any;

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
        if (this.func === FunctionCode.READ_COILS) {
            response.writeUInt8(this.byteCount,2)
            //response.writeUInt8(this.dataLength, 2);
            responseLength += 1; // byte count 1 byte
            this.data.copy(response, 3,0,this.byteCount);
            responseLength+=this.byteCount;
        }
        if (this.func === FunctionCode.READ_DISCRETE_INPUTS) {
            response.writeUInt8(this.byteCount,2)
            //response.writeUInt8(this.dataLength, 2);
            responseLength += 1; // byte count 1 byte
            this.data.copy(response, 3,0,this.byteCount);
            responseLength+=this.byteCount;
        }
        if (this.func === FunctionCode.READ_HOLDING_REGISTERS) {
            response.writeUInt8(this.byteCount,2)
            //response.writeUInt8(this.dataLength, 2);
            responseLength += 1; // byte count 1 byte
            this.data.copy(response, 3,0,this.byteCount);
            responseLength+=this.byteCount;
        }
        if (this.func === FunctionCode.READ_INPUT_REGISTERS) {
            response.writeUInt8(this.byteCount,2)
            //response.writeUInt8(this.dataLength, 2);
            responseLength += 1; // byte count 1 byte
            this.data.copy(response, 3,0,this.byteCount);
            responseLength+=this.byteCount;
        }
        if (this.func === FunctionCode.WRITE_SINGLE_COIL) {
            //response.writeUInt8(this.byteCount,2)
            response.writeUInt16LE(this.address,2)
            responseLength += 2; // byte count 1 byte
            //this.data.copy(response, 3,0,1);
            response.writeUInt16LE(this.val,4);
            responseLength+=2;
        }
        if (this.func === FunctionCode.WRITE_SINGLE_REGISTER) {
            //response.writeUInt8(this.byteCount,2)
            response.writeUInt16LE(this.address,2)
            responseLength += 2; // byte count 1 byte
            //this.data.copy(response, 3,0,1);
            response.writeUInt16BE(this.val,4);
            responseLength+=2;
        }
        if (this.func === FunctionCode.WRITE_MULTIPLE_COILS) {
            //response.writeUInt8(this.byteCount,2)
            response.writeUInt16LE(this.address,2)
            responseLength += 2; // byte count 1 byte
            //this.data.copy(response, 3,0,1);
            response.writeUInt16LE(this.quantity,4);
            responseLength+=2;
        }
        if (this.func === FunctionCode.WRITE_MULTIPLE_REGISTERS) {
            //response.writeUInt8(this.byteCount,2)
            response.writeUInt16BE(this.address,2)
            responseLength += 2; // byte count 1 byte
            //this.data.copy(response, 3,0,1);
            response.writeUInt16BE(this.quantity,4);
            responseLength+=2;
        }


         // data leng


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