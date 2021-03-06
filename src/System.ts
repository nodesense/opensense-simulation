import { BaseActor } from './core/BaseActor';
import { AccessType } from './modbus/AccessType';
import { NodeType } from './core/NodeType';
import { GatewayProfile } from './core/GatewayProfile';
import { BacnetDevice } from './bacnet/BacnetDevice';
import { ModbusTCP } from "./modbus/ModbusTCP";
import { ModbusTCPSerialBridge } from "./modbus/ModbusTCPSerialBridge";
import { ModbusDevice } from "./modbus/ModbusDevice";
import { ConfigurationManager } from './core/ConfigurationManager';
import actorRegistry from './core/ActorRegistry';
import { Node } from './core/Node';
import { SystemContext } from './core/SystemContext';
import { ModbusSerialPort } from './modbus/MobusSerialPort';
import { PlaceHolderActor } from './core/PlaceHolderActor';
import { MqttDevice } from './modbus/MqttDevice';
import { MqttNetwork } from './modbus/MqttNetwork';
actorRegistry.registerActor("SimulationMqttNetworkActor",MqttNetwork);
actorRegistry.registerActor("SimulationMqttDeviceActor",MqttDevice);
actorRegistry.registerActor("SimulationModbusRTUActor", ModbusSerialPort);
actorRegistry.registerActor("SimulationModbusTCPActor", ModbusTCP);
actorRegistry.registerActor("SimulationModbusTCPSerialActor", ModbusTCPSerialBridge);
actorRegistry.registerActor("SimulationModbusDeviceActor", ModbusDevice);
actorRegistry.registerActor("PlaceHolderActor", PlaceHolderActor);
actorRegistry.registerActor("SimulationBacnetDeviceActor", BacnetDevice);


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

        // const modbusTcpServer = this.createBacnetIP(config);
        
        // const device = new BacnetDevice(config);


        //fIXME: think, where to start
        // device.connect();

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
    gatewayProfile: GatewayProfile;
    context: SystemContext;

    async loadNew() {
        this.configurationManager = new ConfigurationManager();
        this.configurationManager.init();

        if (this.configurationManager.gatewayConfig.id) {
            console.log("Loading Gateway config ", this.configurationManager.gatewayConfig);

            this.gatewayProfile = await this.configurationManager.loadSiteProfile(this.configurationManager.gatewayConfig.id);
            this.context = new SystemContext(this.configurationManager, this.gatewayProfile);
            for (const nodeRef of this.gatewayProfile.configuration) {
                console.log('***processing noderef', nodeRef);
                const node = this.gatewayProfile.getNode(nodeRef.id);
                console.log("**launch Node ",node);
                this.launchActor(node);
            }
        }
    }
}

