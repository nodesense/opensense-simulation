import { FieldDevice } from './FieldDevice';
import { BaseActor } from './BaseActor';
import { SystemContext } from "./SystemContext";

import { Node } from "./Node";
import { NodeType } from "./NodeType";
import actorRegistry from "./ActorRegistry";
import { AccessType } from "../modbus/AccessType";

export class BaseFieldDeviceActor extends BaseActor {
    
    fieldDevice: FieldDevice;

    constructor(public context?: SystemContext, public node?: Node) {
         super(context, node);
    }

    init() {
        console.log("BaseFieldDeviceActor Init");
        super.init();

        if (this.node.device_id) {
            this.fieldDevice = this.context.gatewayProfile.getFieldDevice(this.node.device_id);
        }
    }
}