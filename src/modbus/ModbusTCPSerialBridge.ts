import { BaseActor } from './../core/BaseActor';
import { ModbusDevice } from './ModbusDevice';
import { RequestState } from './RequestState';
import { RequestFrame } from './RequestFrame';
import {FunctionCode} from './FunctionCode';
import { Node } from '../core/Node';
import { SystemContext } from '../core/SystemContext';
import { ResponseFrame } from './ResponseFrame';
var ModbusRTU = require("modbus-serial");
var net = require('net');
class ConnectedClient {
  socket;
  constructor(socket) {
    this.socket = socket;
  }
}

export class ModbusTCPSerialBridge extends BaseActor {
    client;
    server;
    socket;
    portName;
    baudRate;
    requestState: RequestState = RequestState.TCP_TRANSACTION_ID;

    requestFrame: RequestFrame = new RequestFrame();
    expected: number = 1;
    // map of slave id to modbus device object
    deviceMap: {[key: number]: ModbusDevice} = {};
    public ip_address: string = '0.0.0.0';
    public port: number = 502;
    constructor(context: SystemContext, node: Node) {
                  super(context, node);

                  console.log("**ModbusTCP Serial Bridge Created", node);
        this.socket = null;
    }

    init() {
      console.log("Modbus TCP Serial Bridge Init");
      super.init();

      if (this.node.properties) {
        this.port = this.node.properties['port']        
        this.portName=this.node.properties['portName']
        this.baudRate=this.node.properties['baudRate']
        console.log("Port details",this.port,this.portName,this.baudRate);
      }

      for(const childActor of this.childActors) {
        this.addDevice(childActor);
      }

      this.connect();
    }

    connect() {

      console.log('Creating TCP Server');
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

      console.log('Binding to port ', this.port);
      this.server.listen(this.port, this.ip_address);
      this.client=new ModbusRTU();

      this.client.connectRTU(this.portName, { baudRate: this.baudRate }, () => {
        console.log(this.portName," connnected");
      });

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

  respond(requestFrame: RequestFrame, result: any) {
    const responseFrame  = new ResponseFrame();
    console.log('Got Result ', result);
    //FIXME: for TCP and Serial
    responseFrame.reset();
    responseFrame.transactionIdentifier = requestFrame.transactionIdentifier;
    responseFrame.protocolIdentifier = requestFrame.protocolIdentifier;
    responseFrame.id = requestFrame.id;
    responseFrame.func = requestFrame.func;
    responseFrame.address=requestFrame.address;  
    responseFrame.data = result.buffer;
    responseFrame.byteCount = result.buffer ? result.buffer.length : 0;
       const writeBuffer = !responseFrame.error?responseFrame.buildTCP():responseFrame.buildErrorTcp();
       console.log("Response frame ", responseFrame)
       console.log("Bufffer is ", writeBuffer);
       this.write(writeBuffer);
  }

  processRequest() {
    this.requestState = RequestState.TCP_TRANSACTION_ID;
    console.log('got a request from tcp client ', this.requestFrame);    
    const requestFrame = this.requestFrame;
    this.client.setID(requestFrame.id);
    console.log("Modbus Device ", requestFrame);
    if(requestFrame.func==FunctionCode.READ_COILS){
      this.client.readCoils(requestFrame.address, requestFrame.quantity)
          .then(result => {
            this.respond(this.requestFrame, result);
          });
        }
    else if(requestFrame.func==FunctionCode.READ_HOLDING_REGISTERS){
    this.client.readHoldingRegisters(requestFrame.address, requestFrame.quantity)
        .then(result => {
          this.respond(this.requestFrame, result);
        });
      }
      else if(requestFrame.func==FunctionCode.WRITE_MULTIPLE_COILS){
        this.client.writeCoils(requestFrame.address,requestFrame.data)
            .then(result => {
              this.respond(this.requestFrame, result);
            });
          }
    else if(requestFrame.func==FunctionCode.WRITE_MULTIPLE_REGISTERS){
        let data = [];
        let source = requestFrame.data;
        for(let i=0;i<requestFrame.byteCount; i += 2){
          let regValue =  ((source[i] << 8) & 0xff00) | (source[i+1] & 0xff);
          data.push(regValue) 
        }

        console.log('data to write is ', data)

        this.client.writeRegisters(requestFrame.address, data)
            .then(result => {
              this.respond(this.requestFrame, result);
            });
          }
    // const  responseFrame = device.processRequest(this.requestFrame);

    // if (responseFrame) {
    //   const writeBuffer = !responseFrame.error?responseFrame.buildTCP():responseFrame.buildErrorTcp();
    //   this.write(writeBuffer);
    // }

 }


//   processRequest() {
//     this.requestState = RequestState.TCP_TRANSACTION_ID;
    
//     if (this.requestFrame.id < 1 || this.requestFrame.id > 247) {
//         console.log('error, slave id out of bound');
//         return;
//     }

//     const device = this.deviceMap[this.requestFrame.id];
//     if (!device) {
//         console.log(`slave ${this.requestFrame.id} not found`);
//         return;
//     }
    
    
//     const  responseFrame = device.processRequest(this.requestFrame);

//     if (responseFrame) {
//       const writeBuffer = !responseFrame.error?responseFrame.buildTCP():responseFrame.buildErrorTcp();
//       this.write(writeBuffer);
//     }
//  }


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
