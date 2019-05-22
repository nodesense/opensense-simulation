import { DataValue } from './DataValue';
import { Variable } from './Variable';
import { BaseFieldDeviceActor } from "./BaseFieldDeviceActor";
import { SystemContext } from "./SystemContext";
import { Node } from "./Node";
import { Formula } from './formulas/Formula';
import { DeviceProfile } from './DeviceProfile';
import { Random } from './formulas/Random';
import { ISimulationDevice } from './ISimulationDevice';
import { Simulation } from './Simulation';
import { Fixed } from './formulas/Fixed';
import { Counter } from './formulas/Counter';
import { Totalizer } from './formulas/Totalizer';
import { Average } from './formulas/Average';
import { Minimum } from './formulas/Minimum';
import { Maximum } from './formulas/Maximum';
import { SuccessFailure } from './formulas/SuccessFailure';
import { Rolling } from './formulas/Rolling';
import { Subscription } from 'rxjs';
import { Subscriptions } from './formulas/Subscriptions';
import { Success } from './formulas/Success';
import { Failure } from './formulas/Failure';
import { Status } from './formulas/Status';
import { Definition } from './Definition';

export class SimulationDevice  extends BaseFieldDeviceActor implements ISimulationDevice {
    simulations:{[name:string]:Simulation}={};
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
            this.formulaRegistry['Counter']=Counter;
            this.formulaRegistry['Totalizer']=Totalizer;
            this.formulaRegistry['Average']=Average;
            this.formulaRegistry['Minimum']=Minimum;
            this.formulaRegistry['Maximum']=Maximum;
            this.formulaRegistry['SuccessFailure']=SuccessFailure;
            this.formulaRegistry['Rolling']=Rolling;
            this.formulaRegistry['Subscriptions']=Subscriptions;
            this.formulaRegistry['Success']=Success;
            this.formulaRegistry['Failure']=Failure;
            this.formulaRegistry['Status']=Status;
            
    }

    init() {
        super.init();

        console.log('***SimulationDevice Init');

        // device profile contains variables, enumeration, metrics
        this.deviceProfile = this.context.configurationManager
        .loadDeviceProfile(this.context.configurationManager.gatewayConfig.id, this.fieldDevice.profile_id);
        console.log('Simulation Var length', this.deviceProfile.simulations.length);
        // for(const simul of this.deviceProfile.simulations){
        //     console.log("Simulations are ",simul);
        // }
        for (const simulation of this.deviceProfile.simulations){
            console.log("****** Simulated Variable  Name is",simulation.definition.variable.name);
            let definition:Definition;
            definition=simulation.definition;
            simulation.definition=definition;
            this.variables[definition.variable.name];
            this.dataValues[definition.variable.name] = new DataValue(simulation);
            if (simulation.definition && simulation.definition.formula) {
                 const FormulaClass = this.formulaRegistry[simulation.definition.formula];
                 if (FormulaClass) {
                     const formula = new FormulaClass(simulation, this)
                     this.formulas[simulation.definition.variable.name] = formula;
                 }

             }

        }
        // for (const variable of this.deviceProfile.variables) {
        //     console.log('----Variable', variable.name);
        //     // FIXME: should be coming from backend/db
        //     let simulation: Simulation;
        //         simulation=variable.simulation;
        //     variable.simulation = simulation;
        //      this.variables[variable.name] = variable;
        //      this.dataValues[variable.name] = new DataValue(variable);
        //      let formula: Formula;
        //      if (variable.simulation && variable.simulation.formula) {
        //         // Fixed Random
        //          const FormulaClass = this.formulaRegistry[variable.simulation.formula];
        //          if (FormulaClass) {
        //              const formula = new FormulaClass(variable, this)
        //              this.formulas[variable.name] = formula;
        //          }

        //      }

        // }

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
            return dataValue.value;
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