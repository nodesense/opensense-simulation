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
import { Counter } from './formulas/Counter';
import { Totalizer } from './formulas/Totalizer';
import { Average } from './formulas/Average';
import { Minimum } from './formulas/Minimum';
import { Maximum } from './formulas/Maximum';
import { SuccessFailure } from './formulas/SuccessFailure';
export class Listener {
    connectors:[];
    subscription:[];
    constructor(context: SystemContext, node: Node) {
        
    }

    init() {
             }

}