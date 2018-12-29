import SerialPort from 'serialport';
import { ModbusDevice } from './ModbusDevice';
import { RequestState } from './RequestState';
import { RequestFrame } from './RequestFrame';
import {FunctionCode} from './FunctionCode';

export class ModbusSerialPort {
    serialPort: SerialPort;
    requestState: RequestState = RequestState.DEVICE_ID;

    requestFrame: RequestFrame = new RequestFrame();
    expected: number = 1;

    // map of slave id to modbus device object
    deviceMap: {[key: number]: ModbusDevice} = {};
    
    constructor(public port:string,
                public options: any, ) {
        this.serialPort = null;
    }

    connect() {
        this.serialPort = new SerialPort(this.port, this.options);
        this.serialPort.on('open', () => {});
        this.serialPort.on('data', (data: any) => {});
        this.serialPort.on('readable', (err: any) => this.readable());
        this.serialPort.on('close', (err: any) => {});
    }

    
    readable()  {
        console.log("readable length ", this.serialPort.readableLength);
        while (this.serialPort.readableLength > 0) {
            //console.log('Data:', this.serialPort.read(1))
            this.read();
        }
    }


    readBytes(bytes: number) {
        return this.serialPort.read(bytes)
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
      this.requestState = RequestState.CRC;
      this.expected = 2;
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
 
 
    this.expected = 2;
    this.requestState = RequestState.CRC;
  }


  readCrc() {
    this.requestFrame.crc = this.readInt16();
    console.log("CRC", this.requestFrame.crc);

    this.requestState = RequestState.DEVICE_ID;
    this.expected = 1;

    this.checkCrc();
  }

  checkCrc() {
    //TODO: check CRC valid or not
    //console.log("checking crc ..");
    //FIXME: If CRC valid, call this
    console.log("Processing Request");
    this.processRequest();
  }


  read() {
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
     
    if (this.requestFrame.id < 1 || this.requestFrame.id > 247) {
        console.log('error, slave id out of bound');
        return;
    }

    const device = this.deviceMap[this.requestFrame.id];

    if (!device) {
        console.log(`slave ${this.requestFrame.id} not found`);
        return;
    }
    

    const responseFrame = device.processRequest(this.requestFrame);
    if (responseFrame) {
      const writeBuffer = !responseFrame.error? responseFrame.build(): responseFrame.buildError();
      this.write(writeBuffer)
    }
 }

    write(buffer: Buffer) {
      this.serialPort.write(buffer);
    }

    disconnect() {

    }


    addDevice(device: ModbusDevice) {
        this.deviceMap[device.id] = device;
    }


}
