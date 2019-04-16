import { Variable } from './../Variable';
import { Formula } from "./Formula";
import { Simulation } from '../Simulation';
import { ISimulationDevice } from '../ISimulationDevice';

export class Random extends Formula {
    timer: any;
    constructor(simulation: Simulation,
        device: ISimulationDevice) {
super(simulation, device);
}

     start = () => {
        // start timer
        const {definition} = this.simulation;
        console.log("Random Log is ",definition);
        if (definition && definition.is_scheduled) {
            console.log("Yes its.........................");
            const interval = definition.interval || 5000;
            this.timer = setInterval( this.run, interval);
        }
     }
      stop = () => {
        // to stop timer,
      }

    run = () => {
        // console.log("Random simulator running");
        // // check min, max range
        const dataValue = this.device.getDataValue(this.simulation.definition.variable.name);
        let value= Math.ceil(Math.random() * this.simulation.definition.max)
        if(value>=this.simulation.definition.min&&value<=this.simulation.definition.max){
        dataValue.value = value;
        console.log("Value for " + this.simulation.definition.variable.name, " is ", dataValue.value);
        }
    }
}