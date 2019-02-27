import { Variable } from '../Variable';
import { Formula } from "./Formula";
import { Simulation } from '../Simulation';
import { ISimulationDevice } from '../ISimulationDevice';

export class Counter extends Formula {
    timer: any;
    constructor(variable: Variable,
                 device: ISimulationDevice) {
        super(variable, device);
    }
reminderval=0;
     start = () => {
        // start timer
        const {simulation} = this.variable;
        if (simulation && simulation.is_scheduled) {
            const interval = simulation.interval || 5000;
            this.timer = setInterval( this.run, interval);
        }

     }
 
      stop = () => {
        // to stop timer,
      }

    run = () => {

        // console.log("Counter simulator running");
        // // check min, max range
        // const dataValue = this.device.getDataValue(this.variable.name);
        // let value= Math.ceil(Math.random() * this.variable.simulation.max)
        // if(value>=this.variable.simulation.min&&value<=this.variable.simulation.max){
        // dataValue.value = value;
        // console.log("Value for " + this.variable.name, " is ", dataValue.value);
        // }
        console.log("Counter Simulator running");
        const dataValue=this.device.getDataValue(this.variable.name);
        this.reminderval=this.reminderval+this.variable.simulation.step;
        if(this.reminderval>this.variable.simulation.max){
            this.reminderval=this.variable.simulation.min;
        }
        dataValue.value=this.reminderval;
        console.log("Value for "+this.variable.name+" is ",dataValue.value);

    }
}