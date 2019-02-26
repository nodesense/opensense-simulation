import { Variable } from './../Variable';
import { Formula } from "./Formula";
import { Simulation } from '../Simulation';
import { ISimulationDevice } from '../ISimulationDevice';

export class Random extends Formula {
    timer: any;
    constructor(variable: Variable,
                 device: ISimulationDevice) {
        super(variable, device);
    }

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
        console.log("Random simulator running");
        // check min, max range
        const dataValue = this.device.getDataValue(this.variable.name);
        dataValue.value = Math.ceil(Math.random() * 100);
        console.log("Value for " + this.variable.name, " is ", dataValue.value);
    }
}