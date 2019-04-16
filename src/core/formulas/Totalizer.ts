import { Variable } from '../Variable';
import { Formula } from "./Formula";
import { Simulation } from '../Simulation';
import { ISimulationDevice } from '../ISimulationDevice';

export class Totalizer extends Formula {
    timer: any;
    constructor(simulation: Simulation,
        device: ISimulationDevice) {
super(simulation, device);
}
reminderval=0.0;
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

            const monitoredDataValue = this.device.getDataValue(this.simulation.definition.monitored_variable.name);
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
        console.log(" Total "+this.simulation.definition.variable.name+" is ",this.dataValue.value);

    }
}