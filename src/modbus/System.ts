import { ModbusTempDevice } from "./ModbusTempDevice";
import { ModbusTCP } from "./ModbusTcp";
import { ModbusSerialPort } from "./ModbusSerialPort";
import { InverterDevice } from "./InverterDevice";

const json=require('jsonfile')

export class System {
     siteConfig;
    load(filepath:string) {
        try {
            this.siteConfig=json.readFileSync(filepath);
            this.process();
        }
        catch (err) {
            console.log('absent.json error', err.message);
        }
    }

    createSlaveDevice(slaveConfig) {
        const {slave_id} = slaveConfig;
        const device =  new InverterDevice(slave_id,slaveConfig);
        device.init();
        return device;
    }


    processSerial(config) {
        const {port, options, slaves } = config.data;
        const serialPort = new ModbusSerialPort(port, options);

        for(const slave of slaves){
            let device=this.createSlaveDevice(slave)
            console.log(`Serial Device${device.id} created`);
            serialPort.addDevice(device);
        } 
        serialPort.connect();
    }

    createModbusTcp(config) {
        const {ip_address, port } = config.data;

        const modbusTcp = new ModbusTCP(ip_address, port);
        return modbusTcp;
    }

    processTCP(config) {
        const {ip_address, port, slaves } = config.data;

        const modbusTcpServer = this.createModbusTcp(config);
        
        for(const slave of slaves){
            let device=this.createSlaveDevice(slave);
            modbusTcpServer.addDevice(device);
            console.log(`Device ${device.id} created`);
        }


        //fIXME: think, where to start
        modbusTcpServer.connect();

        // load serial port, all the devices specific to serial port
    }

    process() {
        for(let config of this.siteConfig.simulation){
            //FIXME: add strong types
            
            if(config.type_of=="modbus-tcp"){
                console.log('priocessing ', config);
                this.processTCP(config);        
            }

            if(config.type_of=="modbus-rtu"){
                console.log('priocessing ', config);
                this.processSerial(config);        
            }
        }
    }
}

