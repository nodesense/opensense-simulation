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

        if (this.node.field_device_id) {
            this.fieldDevice = this.context.siteProfile.getFieldDevice(this.node.field_device_id);
        }
    }
}