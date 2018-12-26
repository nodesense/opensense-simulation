import { ModbusTempDevice } from './modbus/ModbusTempDevice';
import { ModbusSerialPort } from './modbus/ModbusSerialPort';
// export * from './lib/async';
// export * from './lib/hash';
// export * from './lib/number';

const PORT = "COM1";
const options = {
    baudRate:9600,
    databits: 8,
    parity: 'none',
    stopBits: 1,
    flowControl: false
    };

const serialPort = new ModbusSerialPort(PORT, options);
const tempDevice1 = new ModbusTempDevice();

tempDevice1.init();

serialPort.addDevice(tempDevice1);

serialPort.connect();