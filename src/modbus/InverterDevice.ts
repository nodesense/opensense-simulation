const json=require('jsonfile')
import { ModbusDevice } from './ModbusDevice';
import { DataItem } from './DataItem';
import { AccessType } from './AccessType';
import { LocationType } from './LocationType';
import { DataType } from './DataType';
import {default as data} from './profile'
import { ModbusTCP } from './ModbusTcp';

export class InverterDevice extends ModbusDevice {

    constructor(x:number,slaveConfig) {
        super(slaveConfig);
        this.id=x;
    }
//    file="src/modbus/devices_profiles/InverterDevice.json";
    // modbusProfile;
    // loadConfig(filepath) {
    //     try {
    //         this.modbusProfile=json.readFileSync(filepath);
    //     }
    //     catch (err) {
    //         console.log('absent.json error', err.message);
    //     }
    // }

    // init() {
    //     for(let profile of this.modbusProfile){
    //         const Profileobj = new DataItem();
    //         Profileobj.name =profile.name;
    //         Profileobj.dataType=profile.data_type;
    //         Profileobj.address = profile.address;
    //         Profileobj.quantity =profile.quantity;
    //         Profileobj.value = profile.value;
    //         Profileobj.accessType =profile.access_type;
    //         Profileobj.locationType = profile.locationtype;  

    //         this.dataItemMap[Profileobj.name]=Profileobj;
    //         if(Profileobj.locationType==LocationType.COIL){
    //             this.coilsMap[Profileobj.address]=Profileobj;
    //         }            
    //         else if(Profileobj.locationType==LocationType.DISCRETE_INPUT){
    //             this.discreteInputsMap[Profileobj.address]=Profileobj;
    //         }
    //         else if(Profileobj.locationType==LocationType.HOLDING_REGISTER){
    //             this.holdingRegistersMap[Profileobj.address]=Profileobj;
    //         }
    //         else if(Profileobj.locationType==LocationType.INPUT_REGISTER){
    //             this.inputRegistersMap[Profileobj.address]=Profileobj;
    //         }

            
    //     }

    // }
}
