import { Thing } from './Thing';
import { BaseActor } from './BaseActor';
import { SystemContext } from "./SystemContext";

import { Node } from "./Node";
import { NodeType } from "./NodeType";
import actorRegistry from "./ActorRegistry";
import { AccessType } from "../modbus/AccessType";

export class BaseThingActor extends BaseActor {
    
    thing: Thing;

    constructor(public context?: SystemContext, public node?: Node) {
         super(context, node);
    }

    init() {
        console.log("BaseThingActor Init");
        super.init();

        if (this.node.thing_id) {
            this.thing = this.context.siteProfile.getThing(this.node.thing_id);
            console.log("Thing is ", this.thing);
        }
    }
}