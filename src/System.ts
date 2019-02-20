import { BaseActor } from './core/BaseActor';
import { AccessType } from './modbus/AccessType';
import { NodeType } from './core/NodeType';
import { SiteProfile } from './core/SiteProfile';
import { BacnetDevice } from './bacnet/BacnetDevice';
import { ModbusTCP } from "./modbus/ModbusTCP";
import { ModbusSerialPort } from "./modbus/ModbusSerialPort";
import { ModbusTCPSerialBridge } from "./modbus/ModbusTCPSerialBridge";
import { ModbusDevice } from "./modbus/ModbusDevice";
import { ConfigurationManager } from './core/ConfigurationManager';
import actorRegistry from './core/ActorRegistry';
import { Node } from './core/Node';
import { SystemContext } from './core/SystemContext';

actorRegistry.registerActor("ModbusTCPActor", ModbusTCP);
actorRegistry.registerActor("ModbusDeviceActor", ModbusDevice);

const json=require('jsonfile')

export class System extends BaseActor {
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
        const device =  new ModbusDevice(slave_id,slaveConfig);
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


    
    createModbusTcpSerialBridge(config) {
        const {ip_address, port } = config.data;

        const modbusTcp = new ModbusTCPSerialBridge(ip_address, port);
        return modbusTcp;
    }

    processTCPSerialBridge(config) {
        const {ip_address, port, slaves } = config.data;

        const modbusTcpServer = this.createModbusTcpSerialBridge(config);
        
        for(const slave of slaves){
            let device=this.createSlaveDevice(slave);
            modbusTcpServer.addDevice(device);
            console.log(`Device ${device.id} created`);
        }


        //fIXME: think, where to start
        modbusTcpServer.connect();

        // load serial port, all the devices specific to serial port
    }



    createBacnetIP(config) {
        // const {ip_address, port } = config.data;

        // const modbusTcp = new ModbusTCP(ip_address, port);
        // return modbusTcp;
    }

    processBacnetIP(config) {
        //const {ip_address, port, slaves } = config.data;

        const modbusTcpServer = this.createBacnetIP(config);
        
        const device = new BacnetDevice(config);


        //fIXME: think, where to start
        device.connect();

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

            if(config.type_of == 'modbus-tcp-serial'){
                console.log('priocessing ', config);
                this.processTCPSerialBridge(config);        
            }


            if(config.type_of == 'bacnet-ip'){
                console.log('processing bacnet ip ', config);
                this.processBacnetIP(config);        
            }


        }
    }


    // new implementation

   

    configurationManager: ConfigurationManager;
    siteProfile: SiteProfile;
    context: SystemContext;

    async loadNew() {
        this.configurationManager = new ConfigurationManager();
        this.configurationManager.init();
        this.siteProfile = await this.configurationManager.loadSiteProfile("site");

        this.context = new SystemContext(this.configurationManager, this.siteProfile);
        for (const nodeRef of this.siteProfile.configuration) {
            //console.log('processing noderef', nodeRef);
            const node = this.siteProfile.getNode(nodeRef.id);
            this.launchActor(node);
        }
    }
}

