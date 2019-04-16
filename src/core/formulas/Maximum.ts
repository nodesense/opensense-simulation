import { Variable } from '../Variable';
import { Formula } from "./Formula";
import { Simulation } from '../Simulation';
import { ISimulationDevice } from '../ISimulationDevice';
import { Counter } from './Counter';

export class Maximum extends Formula {
    timer: any;
    constructor(simulation: Simulation,
        device: ISimulationDevice) {
super(simulation, device);
}
max:number;
flag=true;
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
        console.log("Maximum "+this.simulation.definition.variable.name+" is ",this.dataValue.value);
    }
}