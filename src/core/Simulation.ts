import { VariableRef } from './VariableRef';
export  interface Simulation {
    value: any;
    min: number;
    max: number;
    formula: string; 
    interval?: number;
    is_scheduled?: boolean; // enable timer
    monitored_variable?: VariableRef;
}