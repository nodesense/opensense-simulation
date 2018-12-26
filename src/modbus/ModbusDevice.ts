import { DataItem } from './DataItem';
import { FunctionCode } from './FunctionCode';
import { RequestFrame } from "./RequestFrame";
import { ResponseFrame } from "./ResponseFrame";


export class ModbusDevice {
    id: number = 1;
    responseFrame: ResponseFrame = new ResponseFrame();

    dataItemMap: {[key: string]: DataItem} = {};

    // coil address to data item
    coilsMap: {[key: number]: DataItem} = {};
    discreteInputsMap: {[key: number]: DataItem} = {};
    holdingRegistersMap: {[key: number]: DataItem} = {};
    inputRegistersMap: {[key: number]: DataItem} = {};

    readCoils(requestFrame: RequestFrame) {

        const totalBytes = Math.floor(requestFrame.quantity / 8) +requestFrame.quantity % 8 > 0? 1 : 0; 
        this.responseFrame.byteCount=totalBytes;
        this.responseFrame.address=requestFrame.address;
        console.log("Total bytes to respond", totalBytes);
        let bitMerge = 0;
        let offset = 0;
        for (let i = 0; i < requestFrame.quantity; i++) {
            const address = requestFrame.address + i;
            const dataItem = this.coilsMap[address];
            let value = dataItem.value;
            bitMerge = bitMerge | (value & 0x01);
            bitMerge = bitMerge << 1;
            if (i !== 0 && i % 8 === 0) {
                this.responseFrame.writeUInt8(bitMerge);
                bitMerge = 0;
                offset = offset + 1;
            }
        }
        if ( (requestFrame.quantity > 0  && 
              requestFrame.quantity % 8 === 0) ||
              requestFrame.quantity % 8 > 0) {

                this.responseFrame.writeUInt8(bitMerge);  
                bitMerge = 0;
                offset = offset + 1;
        }
    }

    readDiscreteInputs(requestFrame: RequestFrame) {
       
        const totalBytes = Math.floor(requestFrame.quantity / 8) +requestFrame.quantity % 8 > 0? 1 : 0; 
        this.responseFrame.byteCount=totalBytes;
        this.responseFrame.address=requestFrame.address;
        console.log("Total bytes to respond", totalBytes);
        let bitMerge = 0;
        let offset = 0;
        for (let i = 0; i < requestFrame.quantity; i++) {
            const address = requestFrame.address + i;
            const dataItem = this.discreteInputsMap[address];
            let value = dataItem.value;
            bitMerge = bitMerge | (value & 0x01);
            bitMerge = bitMerge << 1;
            if (i !== 0 && i % 8 === 0) {
                this.responseFrame.writeUInt8(bitMerge);
                bitMerge = 0;
                offset = offset + 1;
            }
        }
        if ( (requestFrame.quantity > 0  && 
              requestFrame.quantity % 8 === 0) ||
              requestFrame.quantity % 8 > 0) {

                this.responseFrame.writeUInt8(bitMerge);  
                bitMerge = 0;
                offset = offset + 1;
        }
    }

    readHoldingRegisters(requestFrame: RequestFrame) {
        console.log('read holding register');
        this.responseFrame.address=requestFrame.address;
        this.responseFrame.byteCount=requestFrame.quantity*2;
        for (let i = 0; i < requestFrame.quantity; i++) {
            const address = (requestFrame.address) + (i * 2);
            console.log('reading address ', address);
            const dataItem = this.holdingRegistersMap[address];
            console.log('data item is ', dataItem);            
            const value = dataItem.value;
            console.log("Value is "+value)
            this.responseFrame.writeUInt16(value);
        }
        

    }

    readInputRegisters(requestFrame: RequestFrame) {
        console.log('read holding register');
        this.responseFrame.address=requestFrame.address;
        this.responseFrame.byteCount=requestFrame.quantity*2;
        for (let i = 0; i < requestFrame.quantity; i++) {
            const address = (requestFrame.address) + (i * 2);
            console.log('reading address ', address);
            const dataItem = this.inputRegistersMap[address];
            console.log('data item is ', dataItem);            
            const value = dataItem.value;
            console.log("Value is "+value)
            this.responseFrame.writeUInt16(value);
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

    

    writeMultipleRegisters(requestFrame: RequestFrame) {
        this.responseFrame.address=requestFrame.address;
        this.responseFrame.quantity=requestFrame.quantity;
        for(let i=0;i<requestFrame.quantity;i++){
            let val=requestFrame.data.readUInt16BE(i*2);
            console.log("Going to replace "+this.holdingRegistersMap[this.responseFrame.address+(i*2)].value+" as "+val);
        this.holdingRegistersMap[this.responseFrame.address+(i*2)].value=val;
        }        

    }


    processRequest(requestFrame: RequestFrame): ResponseFrame {

        console.log("Modbus Device ", requestFrame);

        //FIXME: for TCP and Serial
        this.responseFrame.transactionIdentifier = requestFrame.transactionIdentifier;
        this.responseFrame.protocolIdentifier = requestFrame.protocolIdentifier;
        this.responseFrame.dataLength = 0;

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