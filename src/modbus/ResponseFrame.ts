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

    //this.byteCount = 0;
    error: boolean = false;
    exceptionCode: number = 0;
    reset() {
        this.byteCount = 0;
        this.error = false;
        this.exceptionCode = 0;
    }

    //tcp
    transactionIdentifier: number;
    protocolIdentifier: number;
    tcpFrameLength: number;

    // writeInt8(value: number) {
    //     this.data.writeUInt8(value, this.byteCount);
    //     this.byteCount += 1;
    // }
    
    writeInt8(value: number) {
        this.data.writeUInt8(value, this.byteCount);
        this.byteCount += 1;
    }

    // writeUInt8(value: number) {
    //     this.data.writeUInt8(value, this.byteCount);
    //     this.byteCount += 1;
    // }
    
    writeUInt8(value: number,index:number) {
        this.data.writeUInt8(value,index);
    }

    writeInt16(value: number) {
        this.data.writeUInt16BE(value, this.byteCount);
        this.byteCount += 2;
    }
    
    writeUInt16(value: number) {
        this.data.writeUInt16BE(value, this.byteCount);
        this.byteCount += 2;
    }
    writeUInt32(value: number) {
        this.data. writeInt32BE(value, this.byteCount);
        this.byteCount += 4;
    }
    
    writeFloat(value: number) {
        this.data.writeFloatBE(value, this.byteCount);
        this.byteCount += 4;
    }
    writeString(value: string,length:number) {
        this.data.write(value,this.byteCount,length);
//        this.byteCount+=length>2?length-2:2;
        this.byteCount += length;
    }
 

    // generate a buffer with modbus response bytes
    // for serial port
    buildError() {
        const response: Buffer = Buffer.alloc(255);
        response.writeUInt8(this.id, 0);
        const func = 0x80 | this.func;
        response.writeUInt8(func, 1);
 
        response.writeUInt8(this.exceptionCode, 2)

        let responseLength = 3;  // device id + func code (2 bytes)
 

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

    // generate a buffer with modbus response bytes
    build() {
        const response: Buffer = Buffer.alloc(255);
        response.writeUInt8(this.id, 0);
        response.writeUInt8(this.func, 1);
        let responseLength = 2;  // device id + func code (2 bytes)
        console.log('data length is ', this.byteCount);
        if (this.func === FunctionCode.READ_COILS) {
            response.writeUInt8(this.byteCount,2)
            console.log("Total res len "+this.byteCount)
            //response.writeUInt8(this.byteCount, 2);
            responseLength += 1; // byte count 1 byte
            this.data.copy(response, 3,0,this.byteCount);
            responseLength+=this.byteCount;
        }
        if (this.func === FunctionCode.READ_DISCRETE_INPUTS) {
            response.writeUInt8(this.byteCount,2)
            //response.writeUInt8(this.byteCount, 2);
            responseLength += 1; // byte count 1 byte
            this.data.copy(response, 3,0,this.byteCount);
            responseLength+=this.byteCount;
        }
        if (this.func === FunctionCode.READ_HOLDING_REGISTERS) {
            response.writeUInt8(this.byteCount,2)
            //response.writeUInt8(this.byteCount, 2);
            responseLength += 1; // byte count 1 byte
            this.data.copy(response, 3,0,this.byteCount);
            responseLength+=this.byteCount;
        }
        if (this.func === FunctionCode.READ_INPUT_REGISTERS) {
            response.writeUInt8(this.byteCount,2)
            //response.writeUInt8(this.byteCount, 2);
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


    // generate a buffer with modbus response bytes
    buildTCP() {
        const response: Buffer = Buffer.alloc(255);

          
    response.writeUInt16BE(this.transactionIdentifier, 0)
    response.writeUInt16BE(this.protocolIdentifier,2)
    // Wrong here
    response.writeUInt16BE(this.tcpFrameLength,4)

        response.writeUInt8(this.id, 6);
        response.writeUInt8(this.func, 7);

        let responseLength = 8;  // device id + func code (2 bytes)

        console.log('data length is ', this.byteCount);
        if (this.func === FunctionCode.READ_COILS) {
            response.writeUInt8(this.byteCount,8)
            //response.writeUInt8(this.byteCount, 2);
            responseLength += 1; // byte count 1 byte
            this.data.copy(response, 9,0,this.byteCount);
            responseLength+=this.byteCount;
        }
        if (this.func === FunctionCode.READ_DISCRETE_INPUTS) {
            response.writeUInt8(this.byteCount,8)
            //response.writeUInt8(this.byteCount, 2);
            responseLength += 1; // byte count 1 byte
            this.data.copy(response, 9,0,this.byteCount);
            responseLength+=this.byteCount;
        }
        if (this.func === FunctionCode.READ_HOLDING_REGISTERS) {
            response.writeUInt8(this.byteCount, 8)
            //response.writeUInt8(this.byteCount, 2);
            responseLength += 1; // byte count 1 byte
            this.data.copy(response, 9,0,this.byteCount);
            responseLength+=this.byteCount;
        }
        if (this.func === FunctionCode.READ_INPUT_REGISTERS) {
            response.writeUInt8(this.byteCount,8)
            //response.writeUInt8(this.byteCount, 2);
            responseLength += 1; // byte count 1 byte
            this.data.copy(response, 9,0,this.byteCount);
            responseLength+=this.byteCount;
        }
        if (this.func === FunctionCode.WRITE_SINGLE_COIL) {
            //response.writeUInt8(this.byteCount,2)
            response.writeUInt16LE(this.address,8)
            responseLength += 2; // byte count 1 byte
            //this.data.copy(response, 3,0,1);
            response.writeUInt16LE(this.val,10);
            responseLength+=2;
        }
        if (this.func === FunctionCode.WRITE_SINGLE_REGISTER) {
            //response.writeUInt8(this.byteCount,2)
            response.writeUInt16LE(this.address, 8)
            responseLength += 2; // byte count 1 byte
            //this.data.copy(response, 3,0,1);
            response.writeUInt16BE(this.val, 10);
            responseLength+=2;
        }
        if (this.func === FunctionCode.WRITE_MULTIPLE_COILS) {
            //response.writeUInt8(this.byteCount,2)
            response.writeUInt16LE(this.address, 8)
            responseLength += 2; // byte count 1 byte
            //this.data.copy(response, 3,0,1);
            response.writeUInt16LE(this.quantity, 10);
            responseLength+=2;
        }
        if (this.func === FunctionCode.WRITE_MULTIPLE_REGISTERS) {
            //response.writeUInt8(this.byteCount,2)
            response.writeUInt16BE(this.address,8)
            responseLength += 2; // byte count 1 byte
            //this.data.copy(response, 3,0,1);
            response.writeUInt16BE(this.quantity,10);
            responseLength+=2;
        }

 
        response.writeUInt16BE(responseLength - 6, 4)

        const writeBuffer = Buffer.alloc(responseLength)

        response.copy(writeBuffer, 0, 0, responseLength);
    
        console.log(">>", writeBuffer);
        return writeBuffer;
    }
      // generate a buffer with modbus response bytes
    // for serial port
    buildErrorTcp() {
        const response: Buffer = Buffer.alloc(255);
        response.writeUInt16BE(this.transactionIdentifier, 0)
        response.writeUInt16BE(this.protocolIdentifier,2)
        // Wrong here
        response.writeUInt16BE(this.tcpFrameLength,4)
        response.writeUInt8(this.id, 6);
        const func = 0x80 | this.func;
        response.writeUInt8(func, 7);
        response.writeUInt8(this.exceptionCode, 8)
        let responseLength = 9;  // device id + func code (2 bytes)
         // data leng
         response.writeUInt16BE(responseLength - 6, 4)

         const writeBuffer = Buffer.alloc(responseLength)
 
         response.copy(writeBuffer, 0, 0, responseLength);
     
         console.log(">>", writeBuffer);
         return writeBuffer;
    }
}