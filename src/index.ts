import { ModbusTempDevice } from './modbus/ModbusTempDevice';
import { ModbusSerialPort } from './modbus/ModbusSerialPort';
import {ModbusTCP} from './modbus/ModbusTcp';
import { System } from './modbus/System';

let system =new System();
system.load('src/modbus/data/site.json');



// function serial() {
//     const PORT = "COM2";
//     const options = {
//         baudRate:9600,
//         databits: 8,
//         parity: 'none',
//         stopBits: 1,
//         flowControl: false
//         };
    
//     const serialPort = new ModbusSerialPort(PORT, options);
//     const tempDevice2 = new ModbusTempDevice(1);
    
//     tempDevice2.init();
    
//     serialPort.addDevice(tempDevice2);
    
//     serialPort.connect();
    
// }

// function tcp() {
// const server = new ModbusTCP("", {});
// server.connect();

// }
// serial()
// tcp();