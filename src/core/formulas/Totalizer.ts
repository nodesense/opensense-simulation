import { Variable } from '../Variable';
import { Formula } from "./Formula";
import { Simulation } from '../Simulation';
import { ISimulationDevice } from '../ISimulationDevice';

export class Totalizer extends Formula {
    timer: any;
    constructor(variable: Variable,
                 device: ISimulationDevice) {
        super(variable, device);
    }
reminderval=0.0;
 dataValue=this.device.getDataValue(this.variable.name);
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
                this.reminderval = this.reminderval + mdv.value;    
                //  this.dataValue = this.device.getDataValue(this.variable.name);
                  this.dataValue.value = this.reminderval;
            });
        }

     }
 
      stop = () => {
        // to stop timer,
      }

    run = () => {
        console.log(" Total "+this.variable.name+" is ",this.dataValue.value);

    }
}