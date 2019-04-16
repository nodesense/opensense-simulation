import { Variable } from "../Variable";
import { ISimulationDevice } from "../ISimulationDevice";
import { Simulation } from "../Simulation";

export abstract class Formula {
    constructor(public simulation: Simulation, 
                public device: ISimulationDevice) {
    }
    abstract start();
    abstract run();
    abstract stop();
 }