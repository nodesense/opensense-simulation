import { Variable } from './../Variable';
import { Formula } from "./Formula";
import { Simulation } from '../Simulation';
import { ISimulationDevice } from '../ISimulationDevice';

export class Fixed extends Formula {
    
    constructor(simulation: Simulation,
        device: ISimulationDevice) {
super(simulation, device);
}

     start = () => {
         

     }
 
      stop = () => {
         
      }

    run = () => {
         
    }
}