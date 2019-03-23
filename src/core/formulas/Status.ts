import { Variable } from '../Variable';
import { Formula } from "./Formula";
import { Simulation } from '../Simulation';
import { ISimulationDevice } from '../ISimulationDevice';
import { MqttConnect } from '../MqttConnect';

export class Status extends Formula {
    timer: any;
    constructor(variable: Variable,
                 device: ISimulationDevice) {
        super(variable, device);
    }
    id:number;
    flag=0;
    flag2=0;
//  dataValue=this.device.getDataValue(this.variable.name);
//  mc=new MqttConnect();
     start = () => {
         const  dataValue=this.device.getDataValue(this.variable.name);
         this.id=this.variable.simulation.value.id;
         console.log("Subscription started........");
        // start timer
        const {simulation} = this.variable;
        if (simulation && simulation.is_scheduled) {
            const interval = simulation.interval || 5000;
            this.timer = setInterval( this.run, interval);
        }
       

            const monitoredDataValue = this.device.getDataValue(this.variable.simulation.variables.var2);
                monitoredDataValue.changed$.subscribe( mdv => {
                    if(this.flag2==0){
                    this.variable.simulation.value.id=this.id;
                    this.variable.simulation.value.timestamp=new Date().getTime();
                    this.variable.simulation.value.payload[0]=mdv.value;
                   dataValue.value=this.variable.simulation.value;
                    this.id++;
                //    console.log("Fail Data",dataValue.value);
                   this.flag=1;
                    // let mc=new MqttConnect();
                    // mc.send("sendit",dataValue.value);
                    this.flag2=1;
                    }
                    
                });


            // for(let i=0;i<this.variable.simulation.variables.length;i++){
            //     const monitoredDataValue = this.device.getDataValue(this.variable.simulation.variables[i]);
            //     monitoredDataValue.changed$.subscribe( mdv => {
            //         this.variable.simulation.value.id=this.id;
            //         this.variable.simulation.value.timestamp=new Date().getTime();
            //         this.variable.simulation.value.payload[0]=mdv.value;
            //        this.dataValue.value=this.variable.simulation.value;
            //         this.id++;
            //        console.log("Data",this.dataValue.value)
            //         // let mc=new MqttConnect();
            //         // mc.send("sendit",this.variable.simulation.value);
                   
                    
            //     });

            // }

     }
 
      stop = () => {
        // to stop timer,
      }

    run = () => {
        console.log("Total")
        if(this.flag==1){
            this.flag=0;
        }
        else {
            const  dataValue=this.device.getDataValue(this.variable.name);
            const monitoredDataValue = this.device.getDataValue(this.variable.simulation.variables.var1);
            this.variable.simulation.value.id=this.id;
            this.variable.simulation.value.timestamp=new Date().getTime();
            this.variable.simulation.value.payload[0]=monitoredDataValue.value;
            dataValue.value=this.variable.simulation.value;
            this.id++;
            // console.log("Sucess value is",dataValue.value);
            // let mc=new MqttConnect();
            // mc.send("sendit",dataValue.value);
            this.flag2=0;
            // console.log("Data",this.dataValue.value)
        }


    }
}