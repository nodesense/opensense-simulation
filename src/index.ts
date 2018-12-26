import { ModbusTempDevice } from './modbus/ModbusTempDevice';
import { ModbusSerialPort } from './modbus/ModbusSerialPort';
import {ModbusTCP} from './modbus/ModbusTcp';

// const PORT = "COM1";
// const options = {
//     baudRate:9600,
//     databits: 8,
//     parity: 'none',
//     stopBits: 1,
//     flowControl: false
//     };

// const serialPort = new ModbusSerialPort(PORT, options);
// const tempDevice1 = new ModbusTempDevice();

// tempDevice1.init();

// serialPort.addDevice(tempDevice1);

// serialPort.connect();

const server = new ModbusTCP("", {});
server.connect();

const tempDevice1 = new ModbusTempDevice();

tempDevice1.init();

server.addDevice(tempDevice1);
