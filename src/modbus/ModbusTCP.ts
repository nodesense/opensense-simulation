import { ModbusDevice } from './ModbusDevice';
import { RequestState } from './RequestState';
import { RequestFrame } from './RequestFrame';
import {FunctionCode} from './FunctionCode';
import { ModbusTempDevice } from './ModbusTempDevice';
var net = require('net');

export class ModbusTCP {
    
    server;
    socket;

    requestState: RequestState = RequestState.TCP_TRANSACTION_ID;

    requestFrame: RequestFrame = new RequestFrame();
    expected: number = 1;

    // map of slave id to modbus device object
    deviceMap: {[key: number]: ModbusDevice} = {};
    
    constructor(public port:string,
                public options: any, ) {
        this.socket = null;
    }

    connect() {

      this.server = net.createServer((socket) => {
        this.socket = socket;
        //socket.write('Echo server\r\n');
        //socket.pipe(socket);


        this.socket.on('open', () => {
          console.log('client connected')
        });
        this.socket.on('data', (data: any) => {});
        this.socket.on('readable', (err: any) => this.readable());
        this.socket.on('close', (err: any) => {
          console.log('Client disconnected')
        });
      });

      this.server.listen(5020, '127.0.0.1');

    }

    
    readable()  {
        console.log("readable length ", this.socket.readableLength);
        while (this.socket.readableLength > 0) {
            //console.log('Data:', this.serialPort.read(1))
            this.read();
        }
    }


    readBytes(bytes: number) {
        
        return this.socket.read(bytes)
    
    }

    
    readInt8() {
        let valBuf = this.readBytes(1);
        
        let value = valBuf[0];
        //console.log("value is ", value);
        return value;
      }
    
      readInt16() {
        let valBuf = this.readBytes(2);
        
        let value = valBuf[0] << 8 | valBuf[1];
       // console.log("value is ", value);
        return value;
      }
    

  readID() {
    this.requestFrame.id = this.readInt8();;
    console.log("*ID=", this.requestFrame.id);
    this.requestState = RequestState.FUNC;
    this.expected = 1;
  }
   
  readFunc() {
    this.requestFrame.func = this.readInt8();
    console.log("FC", this.requestFrame.func);
    this.requestState = RequestState.ADDRESS;
    this.expected = 2;
  }


  readAddress() {
    this.requestFrame.address = this.readInt16();
    console.log("Addr", this.requestFrame.address);

    if (this.requestFrame.func === FunctionCode.READ_COILS ||
      this.requestFrame.func === FunctionCode.READ_DISCRETE_INPUTS ||
      this.requestFrame.func === FunctionCode.READ_HOLDING_REGISTERS ||
      this.requestFrame.func === FunctionCode.READ_INPUT_REGISTERS || 
      this.requestFrame.func === FunctionCode.WRITE_MULTIPLE_COILS || 
      this.requestFrame.func === FunctionCode.WRITE_MULTIPLE_REGISTERS) {
        this.requestState = RequestState.QUANTITY;
        this.expected = 2;
      }

    if (this.requestFrame.func === FunctionCode.WRITE_SINGLE_COIL ||
        this.requestFrame.func === FunctionCode.WRITE_SINGLE_REGISTER ) {
      this.requestState = RequestState.DATA;
      this.expected = 2;
    }
  }
 

  readLength() {
    this.requestFrame.quantity = this.readInt16();
    console.log("Q", this.requestFrame.quantity);

    if (this.requestFrame.func === FunctionCode.WRITE_MULTIPLE_COILS || 
        this.requestFrame.func === FunctionCode.WRITE_MULTIPLE_REGISTERS) {
        this.requestState = RequestState.BYTE_COUNT;
        this.expected = 1;
    } else {
      this.processRequest();
      // this.requestState = RequestState.CRC;
      // this.expected = 2;
    }
  }


  readByteCount() {
    this.requestFrame.byteCount = this.readInt8();
    console.log("BC", this.requestFrame.byteCount);
    this.expected = this.requestFrame.byteCount;
    this.requestState = RequestState.DATA;
  }


  readData() {
    let length = 0;

    if (this.requestFrame.func === FunctionCode.WRITE_MULTIPLE_COILS  || 
        this.requestFrame.func === FunctionCode.WRITE_MULTIPLE_REGISTERS) {
      length = this.requestFrame.byteCount;
    }
 
    if (this.requestFrame.func === FunctionCode.WRITE_SINGLE_COIL ||
        this.requestFrame.func === FunctionCode.WRITE_SINGLE_REGISTER ) {
          length = 2;
        }

    this.requestFrame.data = this.readBytes(length);

    console.log("DX",     this.requestFrame.data);
 
    this.processRequest();
    // this.expected = 2;
    // this.requestState = RequestState.CRC;
  }


  readCrc() {
    this.requestFrame.crc = this.readInt16();
    console.log("CRC", this.requestFrame.crc);

    this.requestState = RequestState.DEVICE_ID;
    this.expected = 1;

    this.checkCrc();
  }

  readTransactionIdentifier() {
    this.requestFrame.transactionIdentifier = this.readInt16();
    console.log("transactionIdentifier", this.requestFrame.transactionIdentifier);

    this.requestState = RequestState.TCP_PROTOCOL_IDENTIFIER;
    this.expected = 2;
  }


  readProtocolIdentifier() {
    this.requestFrame.protocolIdentifier = this.readInt16();
    console.log("protocolIdentifier", this.requestFrame.protocolIdentifier);

    this.requestState = RequestState.TCP_FRAME_LENGTH;
    this.expected = 2;
  }

  readFrameLength() {
    this.requestFrame.tcpFrameLength = this.readInt16();
    console.log("tcpFrameLength", this.requestFrame.tcpFrameLength);

    this.requestState = RequestState.DEVICE_ID;
    this.expected = 1;
  }


  checkCrc() {
    //TODO: check CRC valid or not
    //console.log("checking crc ..");
    //FIXME: If CRC valid, call this
    console.log("Processing Request");
    this.processRequest();
  }


  read() {

    if (this.requestState === RequestState.TCP_TRANSACTION_ID) {
      return this.readTransactionIdentifier();
    }


    if (this.requestState === RequestState.TCP_PROTOCOL_IDENTIFIER) {
      return this.readProtocolIdentifier();
    }


    if (this.requestState === RequestState.TCP_FRAME_LENGTH) {
      return this.readFrameLength();
    }

    if (this.requestState === RequestState.DEVICE_ID) {
      return this.readID();
    }

    if (this.requestState === RequestState.FUNC) {
      return this.readFunc();
    }

    if (this.requestState === RequestState.ADDRESS) {
      return this.readAddress();
    }

    if (this.requestState === RequestState.QUANTITY) {
      return this.readLength();
    }

    if (this.requestState === RequestState.BYTE_COUNT) {
      return this.readByteCount();
    }

    if (this.requestState === RequestState.DATA) {
      return this.readData();
    } 

    if (this.requestState === RequestState.CRC) {
      return this.readCrc();
    }
   
  }

  processRequest() {
    this.requestState = RequestState.TCP_TRANSACTION_ID;
    
    if (this.requestFrame.id < 1 || this.requestFrame.id > 247) {
        console.log('error, slave id out of bound');
        return;
    }

    const device = this.deviceMap[this.requestFrame.id];

    if (!device) {
        console.log(`slave ${this.requestFrame.id} not found`);
        return;
    }
    
    const  responseFrame = device.processRequest(this.requestFrame);

    if (responseFrame) {
      const writeBuffer = responseFrame.buildTCP();
      this.write(writeBuffer);
    }
 }


    write(buffer: Buffer) {
     // this.serialPort.write(buffer);
     this.socket.write(buffer);
    }

    disconnect() {

    }


    addDevice(device: ModbusDevice) {
        this.deviceMap[device.id] = device;
    }


}
