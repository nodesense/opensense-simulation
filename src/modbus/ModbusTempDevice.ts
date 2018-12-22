import { ModbusDevice } from './ModbusDevice';
import { DataItem } from './DataItem';
import { AccessType } from './AccessType';
import { LocationType } from './LocationType';

export class ModbusTempDevice extends ModbusDevice {
    constructor() {
        super();
    }

    init() {
        const ambientTemp = new DataItem();
        ambientTemp.name = "AmbientTemp";
        ambientTemp.address = 1;
        ambientTemp.quantity = 1;
        ambientTemp.value = 40;
        ambientTemp.accessType = AccessType.READWRITE;
        ambientTemp.locationType = LocationType.HOLDING_REGISTER;

        const boxTemp = new DataItem();
        boxTemp.name = "BoxTemp";
        boxTemp.address = 2;
        boxTemp.quantity = 1;
        boxTemp.value = 30;
        boxTemp.accessType = AccessType.READWRITE;
        boxTemp.locationType = LocationType.HOLDING_REGISTER;

        this.dataItemMap[ambientTemp.name] = ambientTemp;
        this.dataItemMap[boxTemp.name] = boxTemp;

        this.holdingRegistersMap[ambientTemp.address] =ambientTemp;
        this.holdingRegistersMap[boxTemp.address] = boxTemp;

    }
}