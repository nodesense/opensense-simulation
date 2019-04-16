import { Variable } from './Variable';
import {BehaviorSubject} from 'rxjs';
import { Simulation } from './Simulation';

export class DataValue {
    private _value: any;
     changed$: BehaviorSubject<DataValue>;

    constructor(public simulation: Simulation) {
        this.changed$ = new BehaviorSubject<DataValue> (this);
        this.value = this.simulation.definition.value;
    }
    
    get value() {
        return this._value;
    }

    set value(v : any) {
        this._value = v;

        // publish
        this.changed$.next(this);
    }
 
}