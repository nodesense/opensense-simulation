import { ModbusTempDevice } from "./ModbusTempDevice";
import { ModbusTCP } from "./ModbusTcp";
import { ModbusSerialPort } from "./ModbusSerialPort";
import { InverterDevice } from "./InverterDevice";

const json=require('jsonfile')

export class System {
     siteConfig;
    load(filepath:string) {
        try {
            // console.log("...............................................")
            // let y=new InverterDevice(1);
            // y.loadfile();
            // y.init()
            // //console.log(y.inverterProfile)
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

    processSerial2(serialConfig) {
        let simulationId=serialConfig.id;
        let simulatonName=serialConfig.name;
        let typeOf=serialConfig.type_of;
        let holdData=serialConfig.data;
        let options=holdData.options;
        let baudRate=options.baudrate;
        let parity=options.parity;
        let stopbits=options.stopbits;
        let port=holdData.port;
        let slaves=holdData.slaves;
        let totalSlaves=slaves.length;
        for(let i=0;i<totalSlaves;i++){
            let device=this.createSlaveDevice(slaves[i].slave_id)
            console.log(`Serial Device${device.id} created`);
        }


        // load serial port, all the devices specific to serial port

//        call createSlaveDevice
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

    process2() {
        // for (let conf in this.siteConfig) {
        //     if (config.typeof == 'modbus-tru'')
        //         this.processSerial(config)

        //     if (config.typeof == 'tcp)
        //         this.processTCP(config);
        // }



        for(let config in this.siteConfig){
            console.log(config);
            if(config=="simulation"){
                let totalSimulation=this.siteConfig.simulation.length;
                console.log(totalSimulation)
                for(let simulationOffset=0;simulationOffset<totalSimulation;simulationOffset++){
                    if(this.siteConfig.simulation[simulationOffset].type_of=="modbus-tcp"){
                        this.processTCP(this.siteConfig.simulation[simulationOffset]);        
                    }
                    if(this.siteConfig.simulation[simulationOffset].type_of=="modbus-rtu"){
                        this.processSerial(this.siteConfig.simulation[simulationOffset]);        
                    }
                }
                
            }
        
        }

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



// index.ts

// system = new System()
// system.load('../json.josn)