import { Variable } from '../Variable';
import { Formula } from "./Formula";
import { Simulation } from '../Simulation';
import { ISimulationDevice } from '../ISimulationDevice';
import { Counter } from './Counter';

export class Maximum extends Formula {
    timer: any;
    constructor(variable: Variable,
                 device: ISimulationDevice) {
        super(variable, device);
    }
max:number;
flag=true;
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
            console.log("Maximum var  monitored  is ",this.variable.simulation.monitored_variable.name);
            const monitoredDataValue = this.device.getDataValue(this.variable.simulation.monitored_variable.name);
            monitoredDataValue.changed$.subscribe( mdv => {
                const tempvalue=mdv.value;
                console.log(" *************************Energy Min is ",tempvalue);
                if(this.flag==true){
                    this.max=tempvalue;
                    this.flag=false;
                }
                else{
                    if(tempvalue>this.max)
                    this.max=tempvalue;
                }
                  this.dataValue.value = this.max;

            });
        }

     }
 
      stop = () => {
        // to stop timer,
      }

    run = () => {
        console.log("Maximum "+this.variable.name+" is ",this.dataValue.value);
    }
}