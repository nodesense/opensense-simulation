import { DataValue } from './DataValue';
import { Variable } from './Variable';
import { BaseThingActor } from "./BaseThingActor";
import { SystemContext } from "./SystemContext";
import { Node } from "./Node";
import { Formula } from './formulas/Formula';
import { DeviceProfile } from './DeviceProfile';
import { Random } from './formulas/Random';
import { ISimulationDevice } from './ISimulationDevice';
import { Simulation } from './Simulation';
import { Fixed } from './formulas/Fixed';

export class SimulationDevice  extends BaseThingActor implements ISimulationDevice {
    variables: { [name: string]: Variable} = {};
    dataValues: { [name: string]: DataValue} = {};
    formulas:  { [name: string]: Formula} = {};
    deviceProfile: DeviceProfile;
    formulaRegistry: { [name: string]: any} = {};

    constructor(context: SystemContext, node: Node) {
        super(context, node);
            console.log('**SimulationDeviceDevice created')
            this.formulaRegistry['Random'] = Random;
            this.formulaRegistry['Fixed'] = Fixed;
    }

    init() {
        super.init();

        console.log('***SimulationDevice Init');

        // device profile contains variables, enumeration, metrics
        this.deviceProfile = this.context.configurationManager
        .loadDeviceProfile(this.thing.site_id, this.thing.profile_id);
        console.log('Var length', this.deviceProfile.variables.length);
        for (const variable of this.deviceProfile.variables) {
            console.log('----Variable', variable.name);
            // FIXME: should be coming from backend/db
            let simulation: Simulation;
            if (variable.name == 'TemperatureUnitCode') {
               simulation = {
                    value: "Hello",
                    min: 1,
                    max: 10,
                    formula: 'Random',
                    interval: 2000,
                    is_scheduled: true
                };
            } else{

                simulation = {
                    value: 1,
                    min: 1,
                    max: 10,
                    formula: 'Random',
                    interval: 2000,
                    is_scheduled: true
                }
            }

            variable.simulation = simulation;
             this.variables[variable.name] = variable;
             this.dataValues[variable.name] = new DataValue(variable);
             let formula: Formula;
             if (variable.simulation && variable.simulation.formula) {
                // Fixed Random
                 const FormulaClass = this.formulaRegistry[variable.simulation.formula];
                 if (FormulaClass) {
                     const formula = new FormulaClass(variable, this)
                     this.formulas[variable.name] = formula;
                 }

             }

        }

        for(const key in this.formulas) {
            this.formulas[key].start();
        }

    }

    getDataValue(name: string): DataValue {
        return this.dataValues[name];
    }

    getVariable(name: string) {
        return this.variables[name];
    }

    getValue(name: string) {
        const dataValue = this.getDataValue(name);
        if (dataValue) {
            return dataValue.value
        }
    }

    setValue(name: string, value: any) {
        const dataValue = this.getDataValue(name);
        if (dataValue) {
            // setter
             dataValue.value = value;
        }
    }
}