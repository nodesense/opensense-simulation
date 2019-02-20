import { LocationType } from "./LocationType";
import { AccessType } from "./AccessType";
import { DataType } from "./DataType";

export class ModbusRegister {
    id: string;
    name: string;
    location: LocationType;
    address: number;
    quantity: number;
    access_type: AccessType;
    
    data_type: DataType;
    mapping_type: string;
    register_type: string;

    description: any;
    label: any;

    type_of: string;
    manufacturer_id: string;
    device_id: string;
    profile_id: string;
 
    properties: any = {};
    definition: any = {};
    data: any = {};




   //  Profileobj.value = profile.value;
}