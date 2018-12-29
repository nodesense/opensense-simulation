import { ModbusDevice } from './ModbusDevice';
import { DataItem } from './DataItem';
import { AccessType } from './AccessType';
import { LocationType } from './LocationType';
import { DataType } from './DataType';
import {default as data} from './profile'
import { ModbusTCP } from './ModbusTcp';

export class ModbusTempDevice extends ModbusDevice {

    constructor(x:number) {
        super();
        this.id=x;
    }

    init() {  /*
        console.log(data.config.length); 
        for(let i=0;i<data.config.length;i++){

            if(data.config[i].location=="COIL")
            {

            }
            if(data.config[i].location=="DISCRETE_INPUT")
            {

            }
            if(data.config[i].location=="INPUT_REGISTER")
            {

            }
            if(data.config[i].location=="HOLDING_REGISTER")
            {


            }

        }


      */  const Light1 = new DataItem();
        Light1.name = "Light1";
        Light1.dataType=DataType.BOOLEAN;
        Light1.address = 1;
        Light1.quantity =1;
        Light1.value = 0;
        Light1.accessType = AccessType.READWRITE;
        Light1.locationType = LocationType.COIL;    


        const Light2 = new DataItem();
        Light2.name = "Light2";
        Light2.dataType=DataType.BOOLEAN;
        Light2.address = 2;
        Light2.quantity =1;
        Light2.value = 1;
        Light2.accessType = AccessType.READWRITE;
        Light2.locationType = LocationType.COIL;

        const Light3 = new DataItem();
        Light3.name = "Light3";
        Light3.dataType=DataType.BOOLEAN;
        Light3.address = 3;
        Light3.quantity =1;
        Light3.value = 1;
        Light3.accessType = AccessType.READWRITE;
        Light3.locationType = LocationType.COIL;

        const Fan1 = new DataItem();
        Fan1.name = "Fan1";
        Fan1.dataType=DataType.BOOLEAN;
        Fan1.address = 1;
        Fan1.quantity =1;
        Fan1.value = 1;
        Fan1.accessType = AccessType.READWRITE;
        Fan1.locationType = LocationType.DISCRETE_INPUT;

        const Fan2 = new DataItem();
        Fan2.name = "Fan2";
        Fan2.dataType=DataType.BOOLEAN;
        Fan2.address = 2;
        Fan2.quantity =1;
        Fan2.value = 1;
        Fan2.accessType = AccessType.READWRITE;
        Fan2.locationType = LocationType.DISCRETE_INPUT;

        const Fan3 = new DataItem();
        Fan3.name = "Fan3";
        Fan3.dataType=DataType.BOOLEAN;
        Fan3.address = 3;
        Fan3.quantity =1;
        Fan3.value = 1;
        Fan3.accessType = AccessType.READWRITE;
        Fan3.locationType = LocationType.DISCRETE_INPUT;

        const ambientTemp = new DataItem();
        ambientTemp.name = "AmbientTemp";
        ambientTemp.dataType=DataType.INT16;
        ambientTemp.address = 1;
        ambientTemp.quantity = 1;
        ambientTemp.value = 40;
        ambientTemp.accessType = AccessType.READWRITE;
        ambientTemp.locationType = LocationType.HOLDING_REGISTER;

        const boxTemp = new DataItem();
        boxTemp.name = "BoxTemp";
        boxTemp.dataType=DataType.INT16;
        boxTemp.address = 2;
        boxTemp.quantity = 1;
        boxTemp.value = 50;
        boxTemp.accessType = AccessType.READWRITE;
        boxTemp.locationType = LocationType.HOLDING_REGISTER;

        const airTemp = new DataItem();
        airTemp.name = "AirTemp";
        airTemp.dataType=DataType.INT16;
        airTemp.address = 3;
        airTemp.quantity = 1;
        airTemp.value = 60;
        airTemp.accessType = AccessType.READWRITE;
        airTemp.locationType = LocationType.HOLDING_REGISTER;


        const ambientTemp1 = new DataItem();
        ambientTemp1.name = "ambientTemp1";
        ambientTemp1.dataType=DataType.FLOAT;
        ambientTemp1.address = 4;
        ambientTemp1.quantity = 2;
        ambientTemp1.value = 34645.66;
        ambientTemp1.accessType = AccessType.READWRITE;
        ambientTemp1.locationType = LocationType.HOLDING_REGISTER;

        const BoxTemp1 = new DataItem();
        BoxTemp1.name = "BoxTemp1";
        BoxTemp1.dataType=DataType.INT16;
        BoxTemp1.address = 6;
        BoxTemp1.quantity = 1;
        BoxTemp1.value = 8999;
        BoxTemp1.accessType = AccessType.READWRITE;
        BoxTemp1.locationType = LocationType.HOLDING_REGISTER;

        const airTemp1 = new DataItem();
        airTemp1.name = "airTemp1";
        airTemp1.dataType=DataType.INT32;
        airTemp1.address = 7;
        airTemp1.quantity = 2;
        airTemp1.value = 100000;
        airTemp1.accessType = AccessType.READWRITE;
        airTemp1.locationType = LocationType.HOLDING_REGISTER;


        
        const serialNumber = new DataItem();
        serialNumber.name = "serialNumber";
        serialNumber.dataType=DataType.STRING;
        serialNumber.address = 9;
        serialNumber.quantity = 4;
        serialNumber.value = "Hello123";
        serialNumber.accessType = AccessType.READWRITE;
        serialNumber.locationType = LocationType.HOLDING_REGISTER;


        const serialNumber2 = new DataItem();
        serialNumber2.name = "serialNumber2";
        serialNumber2.dataType=DataType.STRING;
        serialNumber2.address = 13;
        serialNumber2.quantity = 4;
        serialNumber2.value = "ItsWorld";
        serialNumber2.accessType = AccessType.READWRITE;
        serialNumber2.locationType = LocationType.HOLDING_REGISTER;

        const Temp1 = new DataItem();
        Temp1.name = "Temp1";
        Temp1.dataType=DataType.INT16;
        Temp1.address = 1;
        Temp1.quantity = 1;
        Temp1.value = 10;
        Temp1.accessType = AccessType.READWRITE;
        Temp1.locationType = LocationType.INPUT_REGISTER;

         
       const Temp2 = new DataItem();
       Temp2.name = "Temp2";
       Temp2.dataType=DataType.INT16;
       Temp2.address = 2;
       Temp2.quantity = 1;
       Temp2.value = 20;
       Temp2.accessType = AccessType.READWRITE;
       Temp2.locationType = LocationType.INPUT_REGISTER;


      const Temp3 = new DataItem();
      Temp3.name = "Temp3";
      Temp3.dataType=DataType.INT16;
      Temp3.address = 3;
      Temp3.quantity = 1;
      Temp3.value = 30;
      Temp3.accessType = AccessType.READWRITE;
      Temp3.locationType = LocationType.INPUT_REGISTER;

        
        this.dataItemMap[Light1.name]=Light1;
        this.dataItemMap[Light2.name]=Light2;
        this.dataItemMap[Light3.name]=Light3;
        this.dataItemMap[Fan1.name]=Fan1;
        this.dataItemMap[Fan2.name]=Fan2;
        this.dataItemMap[Fan3.name]=Fan3;
        this.dataItemMap[ambientTemp.name]=ambientTemp;
        this.dataItemMap[boxTemp.name]=boxTemp;
        this.dataItemMap[airTemp.name]=airTemp;
        this.dataItemMap[ambientTemp1.name] = ambientTemp1;
        this.dataItemMap[BoxTemp1.name] = BoxTemp1;
        this.dataItemMap[airTemp1.name]=airTemp1;
        this.dataItemMap[serialNumber.name]=serialNumber;
        this.dataItemMap[serialNumber2.name]=serialNumber2;
        this.dataItemMap[Temp1.name]=Temp1;
        this.dataItemMap[Temp2.name]=Temp2;
        this.dataItemMap[Temp3.name]=Temp3;

        this.coilsMap[Light1.address]=Light1;
        this.coilsMap[Light2.address]=Light2;
        this.coilsMap[Light3.address]=Light3;
        this.discreteInputsMap[Fan1.address]=Fan1;
        this.discreteInputsMap[Fan2.address]=Fan2;
        this.discreteInputsMap[Fan3.address]=Fan3;
        this.holdingRegistersMap[ambientTemp.address]=ambientTemp;
        this.holdingRegistersMap[boxTemp.address]=boxTemp;
        this.holdingRegistersMap[airTemp.address]=airTemp;
        this.holdingRegistersMap[ambientTemp1.address] =ambientTemp1;
        this.holdingRegistersMap[BoxTemp1.address] = BoxTemp1;
        this.holdingRegistersMap[airTemp1.address]=airTemp1;
        this.holdingRegistersMap[serialNumber.address]=serialNumber;
        this.holdingRegistersMap[serialNumber2.address]=serialNumber2;
        this.inputRegistersMap[Temp1.address]=Temp1;
        this.inputRegistersMap[Temp2.address]=Temp2;
        this.inputRegistersMap[Temp3.address]=Temp3;
    
    }
}
