import { ModbusTempDevice } from "./ModbusTempDevice";
import { ModbusTCP } from "./ModbusTcp";

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

    createSlaveDevice(slaveid) {
        return new ModbusTempDevice(slaveid);
    }

    processSerial(serialConfig) {
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


    processTCP(tcpConfig) {
        let simulationId=tcpConfig.id;
        let simulatonName=tcpConfig.name;
        let typeOf=tcpConfig.type_of;
        let holdData=tcpConfig.data;
        let ipaddress=holdData.ip_address;
        let port=holdData.port;
        let totalSlaves=holdData.slaves.length;
        for(let i=0;i<totalSlaves;i++){
            let device=this.createSlaveDevice(holdData.slaves[i].slave_id);
            device.init();
            console.log(`Device ${device.id} created`);
        }

        // load serial port, all the devices specific to serial port
    }

    process() {
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
}



// index.ts

// system = new System()
// system.load('../json.josn)