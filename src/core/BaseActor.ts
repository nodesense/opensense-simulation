import { SystemContext } from "./SystemContext";

import { Node } from "./Node";
import { NodeType } from "./NodeType";
import actorRegistry from "./ActorRegistry";
import { AccessType } from "../modbus/AccessType";

export class BaseActor {
    childActors: any[] = [];

    constructor(public context?: SystemContext, public node?: Node) {
         
    }

    init() {
        console.log("BaseActor Init");

        if (this.node && this.node.children) {
            for (const nodeRef of this.node.children) {
                console.log('processing noderef', nodeRef);
                const node = this.context.siteProfile.getNode(nodeRef.id);
                this.launchActor(node);
            }
        }
        
    }

    
    launchActor(node: Node) {
//        console.log("Loading node", node);
        const nodeType: NodeType = this.context.siteProfile.getNodeType(node.nodetype_id);
        if (!nodeType) {
            console.log('could not find node type');
            return;
        }
        let  ActorType = actorRegistry.getActorType(nodeType.type_of);
        // console.log("ActorType is ", ActorType);

        if (!ActorType) {
            console.log("ACount not find actor type class for ", nodeType.type_of);
            ActorType = actorRegistry.getActorType('PlaceHolderActor')
        }

        const actor:BaseActor  = new ActorType(this.context, node);
        actor.init();

        this.childActors.push(actor);
    }
}