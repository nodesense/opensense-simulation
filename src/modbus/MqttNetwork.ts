import { BaseActor } from '../core/BaseActor';
import { ModbusDevice } from './ModbusDevice';
import { RequestState } from './RequestState';
import { RequestFrame } from './RequestFrame';
import {FunctionCode} from './FunctionCode';
import { Node } from '../core/Node';
import { SystemContext } from '../core/SystemContext';
import { MqttDevice } from './MqttDevice';

export class MqttNetwork extends BaseActor {

  deviceMap: {[key: number]: MqttDevice} = {};
    constructor(context: SystemContext, node: Node) {
                  super(context, node);
                  console.log("**Mqtt Network 1  Created", node);
    }

    init() {
      console.log("Mqtt Network Init");
      super.init();
      for(const childActor of this.childActors) {
        this.addDevice(childActor);
}
    }

    addDevice(device: MqttDevice) {
      this.deviceMap[device.id] = device;
  }



  }
