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
}
