import { Variable } from '../Variable';
import { Formula } from "./Formula";
import { Simulation } from '../Simulation';
import { ISimulationDevice } from '../ISimulationDevice';

export class Rolling extends Formula {
    timer: any;
    variablearray:number[];

    constructor(variable: Variable,
                 device: ISimulationDevice) {
        super(variable, device);
    }
rollPosition=-1;
flag=0;
    // dataValue=this.device.getDataValue(this.variable.name);
     start = () => {
         console.log("Rolling started.................",this.variable.simulation.formatformula);
        // start timer
        
        let variableVal=this.variable.simulation.value;
        this.variablearray=variableVal.split(",").map(function(item){return parseInt(item)});

        
        const {simulation} = this.variable;
        if (simulation && simulation.is_scheduled) {
            const interval = simulation.interval || 5000;
            this.timer = setInterval( this.run, interval);
        }

     }
      stop = () => {
        // to stop timer,
      }

    run = () => {
       const  dataValue=this.device.getDataValue(this.variable.name);
        if(this.variablearray.length>0){
            if(this.flag==0){
                this.rollPosition=0;
                this.flag=1;
            }
            if(this.rollPosition<this.variablearray.length && this.rollPosition>-1){
                console.log("Current Rolling val is",this.variablearray[this.rollPosition])
                dataValue.value=this.variablearray[this.rollPosition];
                this.rollPosition++;
            }
            else{
                this.rollPosition=-1;
                this.flag=0;
            }
        }
     
        }
    }
