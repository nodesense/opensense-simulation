import { Variable } from '../Variable';
import { Formula } from "./Formula";
import { Simulation } from '../Simulation';
import { ISimulationDevice } from '../ISimulationDevice';

export class SuccessFailure extends Formula {
    timer: any;
    constructor(simulation: Simulation,
        device: ISimulationDevice) {
super(simulation, device);
}
     data={
        "type": "process",
        "id": 123,
        "timestamp":new Date().getTime(),
        "device_id": "323123123",
        "payload": [
            {
                "name": "success",
                "value": 1
            }
        ]
    };
    success_payload= {
        "name": "success",
        "value": 1
    };
    failure_payload= {
        "name": "rejection",
        "value": 1
    };
    flag=0;
    data_id=this.data.id
 dataValue=this.device.getDataValue(this.simulation.definition.variable.name);
     start = () => {
        // start timer
        const {definition} = this.simulation;
        if (definition && definition.is_scheduled) {
            const interval = definition.interval || 5000;
            this.timer = setInterval( this.run, interval);
        }
        if(this.simulation.definition.monitored_variable)
        {
            console.log("Var1 monitored  is ",this.simulation.definition.monitored_variable.name);
            const monitoredDataValue = this.device.getDataValue(this.simulation.definition.monitored_variable.name);
            monitoredDataValue.changed$.subscribe( mdv => {           
                this.failure_payload.value=Math.ceil(Math.random()*5);
                this.data.timestamp=new Date().getTime();
                this.data.id=this.data_id;
                this.data.payload[0]=this.failure_payload;
                let tempfaildata=JSON.stringify(this.data)
                //  this.dataValue = this.device.getDataValue(this.variable.name);
                  this.dataValue.value =tempfaildata;
                  this.data_id++;
                  this.flag=1;
            });
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
        if(this.flag==1){
            this.flag=0;
        }
        else{
            this.data.timestamp=new Date().getTime();
            this.data.id=this.data_id;
            this.data.payload[0]=this.success_payload;
            let tempsuccessdata=JSON.stringify(this.data)
            //  this.dataValue = this.device.getDataValue(this.variable.name);
              this.dataValue.value =tempsuccessdata;
              this.data_id++;
        }
        console.log(" Sucess and Failure data is "+this.simulation.definition.variable.name+" is ",this.dataValue.value);

    }
}