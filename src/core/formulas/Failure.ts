import { Variable } from '../Variable';
import { Formula } from "./Formula";
import { Simulation } from '../Simulation';
import { ISimulationDevice } from '../ISimulationDevice';

export class Failure extends Formula {
    timer: any;
    constructor(simulation: Simulation,
        device: ISimulationDevice) {
super(simulation, device);
}
dataValue=this.device.getDataValue(this.simulation.definition.variable.name);;
start = () => {
        // start timer
        const {definition} = this.simulation;
        if (definition && definition.is_scheduled) {
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
        // const dataValue = this.device.getDataValue(this.variable.name);
        let value= Math.ceil(Math.random() * this.simulation.definition.max)
        if(value>=this.simulation.definition.min&&value<=this.simulation.definition.max){
            this.simulation.definition.value.value=value;
            this.dataValue.value=this.simulation.definition.value;
        // console.log("Value for " + this.variable.name, " is ", dataValue.value);
        }
        else{
            this.simulation.definition.value.value=1;
            this.dataValue.value=this.simulation.definition.value;
        }
    }
}