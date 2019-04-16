import { Variable } from '../Variable';
import { Formula } from "./Formula";
import { Simulation } from '../Simulation';
import { ISimulationDevice } from '../ISimulationDevice';
import { Counter } from './Counter';

export class Average extends Formula {
    timer: any;
    constructor(simulation: Simulation,
                 device: ISimulationDevice) {
        super(simulation, device);
    }
averagevalue=0.0;
count=-1;

 dataValue=this.device.getDataValue(this.simulation.definition.variable.name);;
   
 start = () => {
        // start timer
        const {definition} = this.simulation;
        if (definition && definition.is_scheduled) {
            const interval = definition.interval || 5000;
            this.timer = setInterval( this.run, interval);
        }
        if(this.simulation.definition.monitored_variable)
        {
            console.log("Var monitored  is ",this.simulation.definition.monitored_variable);
            const monitoredDataValue = this.device.getDataValue(this.simulation.definition.monitored_variable);
            monitoredDataValue.changed$.subscribe( mdv => {
                this.count++;
                const totalvalue=mdv.value;    
                 this.averagevalue=totalvalue/this.count;
                 console.log("Before Average ",totalvalue/this.count);
                  this.dataValue.value =Math.round(this.averagevalue*100)/100;

            });
        }

     }
 
      stop = () => {
        // to stop timer,
      }

    run = () => {
        console.log(" "+this.simulation.definition.variable.name+" is ",this.dataValue.value);
    }
}