import { ModbusTempDevice } from './modbus/ModbusTempDevice';
import { ModbusSerialPort } from './modbus/ModbusSerialPort';
import {ModbusTCP} from './modbus/ModbusTcp';

function serial() {
    const PORT = "/dev/ttys005";
    const options = {
        baudRate:9600,
        databits: 8,
        parity: 'none',
        stopBits: 1,
        flowControl: false
        };
    
    const serialPort = new ModbusSerialPort(PORT, options);
    const tempDevice2 = new ModbusTempDevice();
    
    tempDevice2.init();
    
    serialPort.addDevice(tempDevice2);
    
    serialPort.connect();
    
}

function tcp() {
const server = new ModbusTCP("", {});
server.connect();

const tempDevice1 = new ModbusTempDevice();

tempDevice1.init();

server.addDevice(tempDevice1);
}

serial()
tcp();