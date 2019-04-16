import { Variable } from "./Variable";

import { DataValue } from "./DataValue";
import { Simulation } from "./Simulation";

export interface ISimulationDevice {
    variables: { [name: string]: Variable};
    simulations:{[name:string]:Simulation};
    dataValues: { [name: string]: DataValue};
    getDataValue(name: string): DataValue;
    getVariable(name: string);
    getValue(name: string);
    setValue(name: string, value: any);
}