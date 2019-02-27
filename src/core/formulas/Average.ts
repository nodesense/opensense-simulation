import { Variable } from '../Variable';
import { Formula } from "./Formula";
import { Simulation } from '../Simulation';
import { ISimulationDevice } from '../ISimulationDevice';
import { Counter } from './Counter';

export class Average extends Formula {
    timer: any;
    constructor(variable: Variable,
                 device: ISimulationDevice) {
        super(variable, device);
    }
averagevalue=0.0;
count=-1;

 dataValue=this.device.getDataValue(this.variable.name);;
     start = () => {
        // start timer
        const {simulation} = this.variable;
        if (simulation && simulation.is_scheduled) {
            const interval = simulation.interval || 5000;
            this.timer = setInterval( this.run, interval);
        }
        if(this.variable.simulation.monitored_variable)
        {
            console.log("Var monitored  is ",this.variable.simulation.monitored_variable.name);
            const monitoredDataValue = this.device.getDataValue(this.variable.simulation.monitored_variable.name);
            monitoredDataValue.changed$.subscribe( mdv => {
                this.count++;
                const totalvalue=mdv.value;    
                 this.averagevalue=totalvalue/this.count;
                  this.dataValue.value = this.averagevalue;

            });
        }

     }
 
      stop = () => {
        // to stop timer,
      }

    run = () => {
        console.log(" "+this.variable.name+" is ",this.dataValue.value);
    }
}