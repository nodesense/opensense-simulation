import { DataType } from './DataType';
import { AccessType } from './AccessType';
import { LocationType } from './LocationType';

export class DataItem {
    name: string;
    
    dataType: DataType; // int/char/etc
    accessType: AccessType; //

    value: any; // string, value, etc
    
    address: number; // modbus address
    quantity: number; // ?
    locationType: LocationType; 
}
