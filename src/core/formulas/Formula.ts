import { Variable } from "../Variable";
import { ISimulationDevice } from "../ISimulationDevice";

export abstract class Formula {
    constructor(public variable: Variable, 
                public device: ISimulationDevice) {
    }

    abstract start();
    abstract run();
    abstract stop();
 }