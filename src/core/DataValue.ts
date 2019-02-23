import { Variable } from './Variable';
import {BehaviorSubject} from 'rxjs';

export class DataValue {
    private _value: any;
     changed$: BehaviorSubject<DataValue>;

    constructor(public variable: Variable) {
        this.changed$ = new BehaviorSubject<DataValue> (this);
        this.value = this.variable.simulation.value;
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