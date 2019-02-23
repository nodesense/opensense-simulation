import { Variable } from './../Variable';
import { Formula } from "./Formula";
import { Simulation } from '../Simulation';
import { ISimulationDevice } from '../ISimulationDevice';

export class Fixed extends Formula {
    
    constructor(variable: Variable,
                 device: ISimulationDevice) {
        super(variable, device);
    }

     start = () => {
         

     }
 
      stop = () => {
         
      }

    run = () => {
         
    }
}