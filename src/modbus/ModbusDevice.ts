import { SimulationDevice } from './../core/SimulationDevice';
import { ModbusDeviceProfile } from './ModbusDeviceProfile';
import { BaseActor } from './../core/BaseActor';
const json=require('jsonfile')
import { DataItem } from './DataItem';
import { FunctionCode } from './FunctionCode';
import { RequestFrame } from "./RequestFrame";
import { ResponseFrame } from "./ResponseFrame";
import { AccessType } from './AccessType';
import { LocationType } from './LocationType';
import { DataType } from './DataType';
import { SystemContext } from '../core/SystemContext';
import { Node } from '../core/Node';
import { BaseThingActor } from '../core/BaseThingActor';


export class ModbusDevice extends SimulationDevice {
    public id:number = 1;
    public slaveConfig?:any;

        constructor(context: SystemContext, node: Node) {
                  super(context, node);

        console.log('**ModbusDevice created')
        this.slaveConfig = {
            "configPath":"src/modbus/devices_profiles/InverterDevice.json"
        }
         
    }
    modbusProfile;

    modbusDeviceProfile: ModbusDeviceProfile;
     
    responseFrame: ResponseFrame = new ResponseFrame();
    dataItemMap: {[key: string]: DataItem} = {};

    // coil address to data item
    coilsMap: {[key: number]: DataItem} = {};
    discreteInputsMap: {[key: number]: DataItem} = {};
    holdingRegistersMap: {[key: number]: DataItem} = {};
    inputRegistersMap: {[key: number]: DataItem} = {};


    loadConfig() {
        // try {
        //     //console.log(this.slaveConfig);
        //     this.modbusProfile=json.readFileSync(this.slaveConfig.configPath);
        // }
        // catch (err) {
        //     console.log('absent.json error', err.message);
        // }

        this.modbusDeviceProfile = this.context.configurationManager
                    .loadModbusDeviceProfile(this.thing.site_id, this.thing.profile_id);

        //console.log("modbus Device profile is ", this.modbusDeviceProfile)

       
    }

    init() {
        super.init();
        console.log("Modbus Device Init ");


        this.id = this.node.properties['slaveId'];
        
        
        this.loadConfig();
        //console.log(this.modbusProfile)
        // for(let profile of this.modbusProfile){
        //     const Profileobj = new DataItem();



        //     Profileobj.name =profile.name;
        //     Profileobj.dataType=profile.data_type;
        //     Profileobj.address = profile.address;
        //     Profileobj.quantity =profile.quantity;
        //     Profileobj.value = profile.value;
        //     Profileobj.accessType =profile.access_type;
        //     Profileobj.locationType = profile.location_type;  

        //     this.dataItemMap[Profileobj.name]=Profileobj;

        //     if(Profileobj.locationType==LocationType.COIL){
        //         this.coilsMap[Profileobj.address]=Profileobj;
        //     }            
        //     else if(Profileobj.locationType==LocationType.DISCRETE_INPUT){
        //         this.discreteInputsMap[Profileobj.address]=Profileobj;
        //     }
        //     else if(Profileobj.locationType==LocationType.HOLDING_REGISTER){
        //         this.holdingRegistersMap[Profileobj.address]=Profileobj;
        //     }
        //     else if(Profileobj.locationType==LocationType.INPUT_REGISTER){
        //         this.inputRegistersMap[Profileobj.address]=Profileobj;            
        //     }        
        // }

        for (const modbusRegister of this.modbusDeviceProfile.registers) {
          //  console.log("register is ", modbusRegister);
            const Profileobj = new DataItem();



            Profileobj.name =modbusRegister.name;
            Profileobj.dataType=modbusRegister.data_type;
            Profileobj.address = modbusRegister.address;
            Profileobj.quantity =modbusRegister.quantity;
            
            Profileobj.accessType =modbusRegister.access_type;
            Profileobj.locationType = modbusRegister.location;  

            // FIXME: get from simulation
            //Profileobj.value = modbusRegister.value;    
            Profileobj.value = 10;


            this.dataItemMap[Profileobj.name]=Profileobj;

            if(Profileobj.locationType==LocationType.COIL){
                this.coilsMap[Profileobj.address]=Profileobj;
            }            
            else if(Profileobj.locationType==LocationType.DISCRETE_INPUT){
                this.discreteInputsMap[Profileobj.address]=Profileobj;
            }
            else if(Profileobj.locationType==LocationType.HOLDING_REGISTER){
                this.holdingRegistersMap[Profileobj.address]=Profileobj;
            }
            else if(Profileobj.locationType==LocationType.INPUT_REGISTER){
                this.inputRegistersMap[Profileobj.address]=Profileobj;            
            }   
        }

    }


    readCoils(requestFrame: RequestFrame) {
        const totalBytes = Math.floor(requestFrame.quantity / 8) +(requestFrame.quantity % 8 > 0? 1 : 0); 
        this.responseFrame.byteCount=totalBytes;
        this.responseFrame.address=requestFrame.address;
        console.log("Total bytes to respond", totalBytes);
        let bitMerge = 0;
        let offset = 0;
        let index_count=0;
        for (let i = 0; i < requestFrame.quantity; i++) {
            console.log("Control is coming");
            const address = requestFrame.address + i;
            const dataItem = this.coilsMap[address];
            let value = dataItem.value;
            bitMerge = bitMerge | (value & 0x01);
            if (i !== 0 && (i+1)%8 === 0) {
                console.log("Written to buffer "+bitMerge+" loop is "+(i+1));
                this.responseFrame.writeUInt8(bitMerge,index_count);
                index_count++;
                bitMerge = 0;
                offset = offset + 1;
            }
            if(i<requestFrame.quantity-1){
                bitMerge = bitMerge << 1;
             }
        }
        console.log("out of control")
        if ( (requestFrame.quantity > 0  && 
              requestFrame.quantity % 8 === 0) ||
              requestFrame.quantity % 8 > 0) {
                this.responseFrame.writeUInt8(bitMerge,index_count);  
                bitMerge = 0;
                offset = offset + 1;
        }
    }




    // readCoils(requestFrame: RequestFrame) {
    //     const totalBytes = Math.floor(requestFrame.quantity / 8) +requestFrame.quantity % 8 > 0? 1 : 0; 
    //     this.responseFrame.byteCount=totalBytes;
    //     this.responseFrame.address=requestFrame.address;
    //     console.log("Total bytes to respond", totalBytes);
    //     let bitMerge = 0;
    //     let offset = 0;
    //     for (let i = 0; i < requestFrame.quantity; i++) {
    //         const address = requestFrame.address + i;
    //         const dataItem = this.coilsMap[address];
    //         let value = dataItem.value;
    //         bitMerge = bitMerge | (value & 0x01);
    //         bitMerge = bitMerge << 1;
    //         if (i !== 0 && i % 8 === 0) {
    //             this.responseFrame.writeUInt8(bitMerge);
    //             bitMerge = 0;
    //             offset = offset + 1;
    //         }
    //     }
    //     if ( (requestFrame.quantity > 0  && 
    //           requestFrame.quantity % 8 === 0) ||
    //           requestFrame.quantity % 8 > 0) {

    //             this.responseFrame.writeUInt8(bitMerge);  
    //             bitMerge = 0;
    //             offset = offset + 1;
    //     }
    // }




    readDiscreteInputs(requestFrame: RequestFrame) {
        const totalBytes = Math.floor(requestFrame.quantity / 8) +(requestFrame.quantity % 8 > 0? 1 : 0); 
        this.responseFrame.byteCount=totalBytes;
        this.responseFrame.address=requestFrame.address;
        console.log("Total bytes to respond", totalBytes);
        let bitMerge = 0;
        let offset = 0;
        let index_count=0;
        for (let i = 0; i < requestFrame.quantity; i++) {
            console.log("Control is coming");
            const address = requestFrame.address + i;
            const dataItem = this.discreteInputsMap[address];
            let value = dataItem.value;
            bitMerge = bitMerge | (value & 0x01);
            if (i !== 0 && (i+1)%8 === 0) {
                console.log("Written to buffer "+bitMerge+" loop is "+(i+1));
                this.responseFrame.writeUInt8(bitMerge,index_count);
                index_count++;
                bitMerge = 0;
                offset = offset + 1;
            }
            if(i<requestFrame.quantity-1){
                bitMerge = bitMerge << 1;
             }
        }
        if ( (requestFrame.quantity > 0  && 
              requestFrame.quantity % 8 === 0) ||
              requestFrame.quantity % 8 > 0) {
                this.responseFrame.writeUInt8(bitMerge,index_count);  
                bitMerge = 0;
                offset = offset + 1;
        }
    }





    // readDiscreteInputs(requestFrame: RequestFrame) {
       
    //     const totalBytes = Math.floor(requestFrame.quantity / 8) +requestFrame.quantity % 8 > 0? 1 : 0; 
    //     this.responseFrame.byteCount=totalBytes;
    //     this.responseFrame.address=requestFrame.address;
    //     console.log("Total bytes to respond", totalBytes);
    //     let bitMerge = 0;
    //     let offset = 0;
    //     for (let i = 0; i < requestFrame.quantity; i++) {
    //         const address = requestFrame.address + i;
    //         const dataItem = this.discreteInputsMap[address];
    //         let value = dataItem.value;
    //         bitMerge = bitMerge | (value & 0x01);
    //         bitMerge = bitMerge << 1;
    //         if (i !== 0 && i % 8 === 0) {
    //             this.responseFrame.writeUInt8(bitMerge);
    //             bitMerge = 0;
    //             offset = offset + 1;
    //         }
    //     }
    //     if ( (requestFrame.quantity > 0  && 
    //           requestFrame.quantity % 8 === 0) ||
    //           requestFrame.quantity % 8 > 0) {

    //             this.responseFrame.writeUInt8(bitMerge);  
    //             bitMerge = 0;
    //             offset = offset + 1;
    //     }
    // }

  
    
    
    readHoldingRegisters(requestFrame: RequestFrame) {
        console.log('read holding register'+JSON.stringify(requestFrame));
        this.responseFrame.address=requestFrame.address; 

        for (let registerIndex = 0; registerIndex < requestFrame.quantity; ) {           
            const address = (requestFrame.address) + (registerIndex);
            console.log('reading address ', address);
            const dataItem = this.holdingRegistersMap[address];
            console.log('data item is ', dataItem);

            if (!dataItem) {
                this.responseFrame.error = true;
                this.responseFrame.exceptionCode = 0x02;
                break;
            }

            registerIndex += dataItem.quantity;

            switch(dataItem.dataType) {

                case DataType.INT16: {
                    //FIXME: take value from dataValue
                    const value = this.getValue(dataItem.name);

                    // const value = dataItem.value;
                     
                    console.log("Value Int16 is " +value)
                    this.responseFrame.writeUInt16(value);
                } break;

                case DataType.INT32:{
                    const value = dataItem.value;
                    console.log("Value is "+value)
                    this.responseFrame.writeUInt32(value);
                }
                break;

                case DataType.FLOAT:{
                    const value = dataItem.value;
                    console.log("Value is "+value)
                    this.responseFrame.writeFloat(value);
                }
                break;

                case DataType.STRING:{
                    let value = dataItem.value;
                    let bytes=dataItem.quantity*2;
                    console.log("String Value is "+value)
                    this.responseFrame.writeString(value,bytes);
                    
                }
                break;

            } 
        }

        if (requestFrame.quantity * 2 != this.responseFrame.byteCount) {
            //FIXME: error
            this.responseFrame.error = true;
            this.responseFrame.exceptionCode = 0x02;
        }
        

    }


    
    readInputRegisters(requestFrame: RequestFrame) {
        console.log('read Input register'+JSON.stringify(requestFrame));
        this.responseFrame.address=requestFrame.address;  
        for (let registerIndex = 0; registerIndex < requestFrame.quantity; ) {           
            const address = (requestFrame.address) + (registerIndex);
            console.log('reading address ', address);
            const dataItem = this.inputRegistersMap[address];
            console.log('data item is ', dataItem);

            if (!dataItem) {
                this.responseFrame.error = true;
                this.responseFrame.exceptionCode = 0x02;
                break;
            }

            registerIndex += dataItem.quantity;

            switch(dataItem.dataType) {

                case DataType.INT16: {
                    const value = dataItem.value;
                    console.log("Value 16 is "+value)
                    this.responseFrame.writeUInt16(value);
                } break;

                case DataType.INT32:{
                    const value = dataItem.value;
                    console.log("Value is "+value)
                    this.responseFrame.writeUInt32(value);
                }
                break;

                case DataType.FLOAT:{

                    // const value = dataItem.value;

                    const value = this.getValue(dataItem.name);
                    console.log("Value is "+value)
                    this.responseFrame.writeFloat(value);
                }
                break;

                case DataType.STRING:{
                    let value = dataItem.value;
                    let bytes=dataItem.quantity*2;
                    console.log("Value is "+value)
                    this.responseFrame.writeString(value,bytes);
                    
                }
                break;

            } 
        }

        if (requestFrame.quantity * 2 != this.responseFrame.byteCount) {
            //FIXME: error
            this.responseFrame.error = true;
            this.responseFrame.exceptionCode = 0x02;
        }
        

      
    }


    writeSingleCoil(requestFrame: RequestFrame) {
        this.responseFrame.address = requestFrame.address;
        this.coilsMap[requestFrame.address].value=requestFrame.data.readUInt8(0)==255?1:0;
        this.responseFrame.val=this.coilsMap[requestFrame.address].value;
    }

    writeSingleRegister(requestFrame: RequestFrame) {
        this.responseFrame.address=requestFrame.address;
        let val=requestFrame.data.readUInt16BE(0);
        this.holdingRegistersMap[this.responseFrame.address].value=val;
        this.responseFrame.val=this.holdingRegistersMap[this.responseFrame.address].value;
    }
    
    _setCoils(address, byteValue, quantity) {
        for (let j = 0; j < quantity; j++) {
            let bitValue = (byteValue & 0x01);
            byteValue = byteValue >> 1;
            this.coilsMap[address+j].value=bitValue;
             console.log("_setCoils byteValue >> ", byteValue);
        }
    }

    writeMultipleCoils(requestFrame: RequestFrame) {      
        console.log("writeSingleCoil ");
        this.responseFrame.address=requestFrame.address;
        this.responseFrame.quantity=requestFrame.quantity;
        let address=requestFrame.address;
        for(let i=0;i<requestFrame.byteCount;i++){
            let value=requestFrame.data.readUInt8(i);
            console.log("Value recieved "+value);
            let bitsCount=8;
            if(i==requestFrame.byteCount-1){
                bitsCount=requestFrame.quantity % 8;                
            }
            address=address+i*8;
            this._setCoils(address, value, bitsCount);
        }
    }

    

    // writeMultipleRegisters(requestFrame: RequestFrame) {
    //     this.responseFrame.address=requestFrame.address;
    //     this.responseFrame.quantity=requestFrame.quantity;

    //     for(let i=0;i<requestFrame.quantity;i++){
    //         let val=requestFrame.data.readUInt16BE(i*2);
    //         console.log("Going to replace "+this.holdingRegistersMap[this.responseFrame.address+(i*2)].value+" as "+val);
    //     this.holdingRegistersMap[this.responseFrame.address+(i*2)].value=val;
    //     }

    // }

    writeMultipleRegisters(requestFrame: RequestFrame) {

        let address=requestFrame.address;
        const dataItem = this.holdingRegistersMap[requestFrame.address];
        this.responseFrame.address=requestFrame.address;
        this.responseFrame.quantity=requestFrame.quantity;
        if(dataItem.dataType==DataType.INT16){
            let val=requestFrame.data.readUInt16BE(0);
            this.holdingRegistersMap[this.responseFrame.address].value=val;
            this.responseFrame.val=this.holdingRegistersMap[this.responseFrame.address].value;
                }
        else  if(dataItem.dataType==DataType.INT32){
            let val=requestFrame.data.readUInt32BE(0);
            this.holdingRegistersMap[this.responseFrame.address].value=val;
            this.responseFrame.val=this.holdingRegistersMap[this.responseFrame.address].value;
                }

        else if(dataItem.dataType==DataType.FLOAT){
            let val=requestFrame.data.readFloatLE(0);
            this.holdingRegistersMap[this.responseFrame.address].value=val;
            console.log("Going to replace "+this.holdingRegistersMap[this.responseFrame.address].value+" as "+val);
            this.responseFrame.val=this.holdingRegistersMap[this.responseFrame.address].value;

        }
        else if(dataItem.dataType==DataType.STRING){
               let stringbuf=Buffer.alloc(dataItem.quantity);
               for(let i=0;i<requestFrame.quantity;i++){
                let val=requestFrame.data.readUInt16LE(i*2);
                stringbuf.writeInt16BE(val,i*2);
               }
             console.log("Going to replace "+this.holdingRegistersMap[this.responseFrame.address].value+" as "+stringbuf);
        this.holdingRegistersMap[this.responseFrame.address].value=stringbuf;
        }
    }

    processRequest(requestFrame: RequestFrame): ResponseFrame {

        console.log("Modbus Device ", requestFrame);

        //FIXME: for TCP and Serial
        this.responseFrame.transactionIdentifier = requestFrame.transactionIdentifier;
        this.responseFrame.protocolIdentifier = requestFrame.protocolIdentifier;
       

        this.responseFrame.reset();

        this.responseFrame.id = requestFrame.id;
        this.responseFrame.func = requestFrame.func;
         
        if (requestFrame.func === FunctionCode.READ_COILS) {
            this.readCoils(requestFrame);
        }
    
        if (requestFrame.func === FunctionCode.READ_DISCRETE_INPUTS) {
            this.readDiscreteInputs(requestFrame);   
        }
    
        if (requestFrame.func === FunctionCode.READ_HOLDING_REGISTERS) {
            this.readHoldingRegisters(requestFrame)
        }
    
        if (requestFrame.func === FunctionCode.READ_INPUT_REGISTERS) {
            this.readInputRegisters(requestFrame);
        }
    
        if (requestFrame.func === FunctionCode.WRITE_SINGLE_COIL) {
            this.writeSingleCoil(requestFrame);
        }
    
        if (requestFrame.func === FunctionCode.WRITE_SINGLE_REGISTER) {
            this.writeSingleRegister(requestFrame);
        }
    
        if (requestFrame.func === FunctionCode.WRITE_MULTIPLE_COILS) {
            this.writeMultipleCoils(requestFrame);
        }
    
        if (requestFrame.func === FunctionCode.WRITE_MULTIPLE_REGISTERS) {
            this.writeMultipleRegisters(requestFrame);
        }
    
        // FIXME: for Serial/TCP
        // const writeBuffer = this.responseFrame.buildTCP();
        
        // return writeBuffer;

        return this.responseFrame;
    }
}