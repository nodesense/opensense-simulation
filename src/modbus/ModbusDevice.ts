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

        const totalBytes = Math.floor(requestFrame.quantity / 8) + 
                        requestFrame.quantity % 8 > 0? 1 : 0; 
 

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
        const totalBytes = Math.floor(requestFrame.quantity / 8) + 
        requestFrame.quantity % 8 > 0? 1 : 0; 


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

        for (let i = 0; i < requestFrame.quantity; i++) {
            const address = (requestFrame.address) + (i * 2);
            console.log('reading address ', address);
            const dataItem = this.holdingRegistersMap[address];
            console.log('data item is ', dataItem);
            
            const value = dataItem.value;
 
            this.responseFrame.writeUInt16(value);
        }

    }

    readInputRegisters(requestFrame: RequestFrame) {
        for (let i = 0; i < requestFrame.quantity; i++) {
            const address = (requestFrame.address) + (i * 2);

            const dataItem = this.inputRegistersMap[address];
            
            const value = dataItem.value;
 
            this.responseFrame.writeUInt16(value);
        }
    }

    writeSingleCoil(requestFrame: RequestFrame) {
        const address = requestFrame.address;

        const dataItem = this.coilsMap[address];
        // FIXME:  set data from request
        //dataItem.value = requestFrame.data
    }


    writeSingleRegister(requestFrame: RequestFrame) {

    }

    writeMultipleCoils(requestFrame: RequestFrame) {

    }


    writeMultipleRegisters(requestFrame: RequestFrame) {

    }


    processRequest(requestFrame: RequestFrame) {

        console.log("Modbus Device ", requestFrame);

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
    
        const writeBuffer = this.responseFrame.build();
        this.responseFrame.dataLength = 0;
        
        return writeBuffer;
    }
}