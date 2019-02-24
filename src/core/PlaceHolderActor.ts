import { BaseActor } from "./BaseActor";
import { Node } from "./Node";
import { SystemContext } from "./SystemContext";

export class PlaceHolderActor extends BaseActor {
    
    constructor(context: SystemContext, node: Node) {
        super(context, node);

        console.log('**PlaceHolderActor created')
 

}
}