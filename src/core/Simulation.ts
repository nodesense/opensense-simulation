import { VariableRef } from './VariableRef';
export  class Simulation {
    definition:any;
    value: any;
    min: number;
    max: number;
    step:number;
    formatformula:string;
    formula: string; 
    interval?: number;
    is_scheduled?: boolean; // enable timer
    monitored_variable?: VariableRef;
    variables:any;
    reportType:number;
    connectors:[];
}