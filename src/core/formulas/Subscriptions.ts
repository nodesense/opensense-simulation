import { Variable } from '../Variable';
import { Formula } from "./Formula";
import { Simulation } from '../Simulation';
import { ISimulationDevice } from '../ISimulationDevice';
import { MqttConnect } from '../MqttConnect';

export class Subscriptions extends Formula {
    timer: any;
    constructor(variable: Variable,
                 device: ISimulationDevice) {
        super(variable, device);
    }
reminderval=0.0;
 dataValue=this.device.getDataValue(this.variable.name);
     start = () => {
         console.log("Subscription started........");
        // start timer
        const {simulation} = this.variable;
        if (simulation && simulation.is_scheduled) {
            const interval = simulation.interval || 5000;
            this.timer = setInterval( this.run, interval);
        }
        if(this.variable.simulation.variables.length>0)
        {
            // let mc=new MqttConnect();
            for(let i=0;i<this.variable.simulation.variables.length;i++){
                // console.log("Var monitored  is ",this.variable.simulation.variables[i]);
                const monitoredDataValue = this.device.getDataValue(this.variable.simulation.variables[i]);
                monitoredDataValue.changed$.subscribe( mdv => {
                    console.log("Value of ",this.variable.simulation.variables[i],"is ",mdv.value); 
                    let mc=new MqttConnect();
                    mc.send("sendit",{"name":this.variable.simulation.variables[i],"value":mdv.value});

                    //  this.dataValue = this.device.getDataValue(this.variable.name);
                    //   this.dataValue.value = this.reminderval;
                });

            }

            // console.log("Var monitored  is ",this.variable.simulation.monitored_variable.name);
            // const monitoredDataValue = this.device.getDataValue(this.variable.simulation.monitored_variable.name);
            // monitoredDataValue.changed$.subscribe( mdv => {
            //     this.reminderval = this.reminderval + mdv.value;    
            //     //  this.dataValue = this.device.getDataValue(this.variable.name);
            //       this.dataValue.value = this.reminderval;
            // });
        }

     }
 
      stop = () => {
        // to stop timer,
      }

    run = () => {

        // console.log("Totalizer simulator running");
        // // check min, max range
        // const dataValue = this.device.getDataValue(this.variable.name);
        // let value= Math.ceil(Math.random() * this.variable.simulation.max)
        // if(value>=this.variable.simulation.min&&value<=this.variable.simulation.max){
        // dataValue.value = value;
        // console.log("Value for " + this.variable.name, " is ", dataValue.value);
        // }
        // console.log("Totalizer Simulator running");
        // const dataValue=this.device.getDataValue(this.variable.name);
        // let value=(Math.random() * this.variable.simulation.max);
        // this.reminderval=this.reminderval+value;
        // if(this.reminderval>this.variable.simulation.max){
        //     this.reminderval=this.variable.simulation.min;
        // }

        // dataValue.value=this.reminderval;
        // console.log(" Total "+this.variable.name+" is ",this.dataValue.value);

    }
}