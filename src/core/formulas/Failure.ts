import { Variable } from '../Variable';
import { Formula } from "./Formula";
import { Simulation } from '../Simulation';
import { ISimulationDevice } from '../ISimulationDevice';

export class Failure extends Formula {
    timer: any;
    constructor(variable: Variable,
                 device: ISimulationDevice) {
        super(variable, device);
    }
    dataValue=this.device.getDataValue(this.variable.name);
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
        // console.log("Random simulator running");
        // // check min, max range
        // const dataValue = this.device.getDataValue(this.variable.name);
        let value= Math.ceil(Math.random() * this.variable.simulation.max)
        if(value>=this.variable.simulation.min&&value<=this.variable.simulation.max){
            this.variable.simulation.value.value=value;
            this.dataValue.value=this.variable.simulation.value;
        // console.log("Value for " + this.variable.name, " is ", dataValue.value);
        }
        else{
            this.variable.simulation.value.value=1;
            this.dataValue.value=this.variable.simulation.value;
        }
    }
}