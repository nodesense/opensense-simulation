import { Variable } from "./Variable";

import { DataValue } from "./DataValue";

export interface ISimulationDevice {
    variables: { [name: string]: Variable};
    dataValues: { [name: string]: DataValue};
    getDataValue(name: string): DataValue;
    getVariable(name: string);
    getValue(name: string);
    setValue(name: string, value: any);
}