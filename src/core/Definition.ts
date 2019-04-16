import { VariableRef } from './VariableRef';
export  class Definition {
    value: any;
    min: number;
    max: number;
    step:number;
    formatformula:string;
    formula: string; 
    interval?: number;
    is_scheduled?: boolean; // enable timer
    monitored_variable?: VariableRef;
    variable:any;
    reportType:number;
    connectors:[];
}