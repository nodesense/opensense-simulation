import { Variable } from './Variable';
import{Simulation} from './Simulation';
export class DeviceProfile {
    id: string;
    name: string;
    simulations:Simulation[]=[];
    variables: Variable[] = [];
}