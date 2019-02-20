import { Thing } from './Thing';
import { Node } from './Node';
import { NodeRef } from './NodeRef';
import { NodeType } from './NodeType';

export class SiteProfile {
    id: string;
    name: string;

    things: Thing[] = [];
    nodes: Node[] = [];

    node_types: NodeType[] = [];

    configuration: NodeRef[] = [];

    nodeMap: any = {};

    nodeTypeMap: any = {};

    thingMap: any = {};
    

    constructor(jsonConf?: any) {

        if (jsonConf) {
            Object.assign(this, jsonConf)
        }
        
    }

    show() {
        console.log("All nodes");
        for (const node of this.nodes) {
            console.log("node ", node);
        }
    }




    getThing(thingId: string):Thing {
        console.log("Getting Thing " + thingId);
        return this.thingMap[thingId];
    }

     getNode( nodeId: string):Node {
        console.log("Getting node " + nodeId);
        return this.nodeMap[nodeId];
    }

     getNodeType(nodeTypeId: string): NodeType {
        return this.nodeTypeMap[nodeTypeId];
    }

     fixTypeOf(nodeRef: NodeRef) {
        console.log("Building nodeRef ", nodeRef);
         const nodeType:NodeType = this.getNodeType(nodeRef.nodetype_id);

        const node: Node = this.getNode(nodeRef.id);

        if (nodeType != null)  {
            node.type_of = nodeType.type_of;
        }
        else {
            console.log("Node Type not found");
        }

        if (nodeRef.children) {
            for(const childNodeRef of nodeRef.children) {
                this.fixTypeOf(childNodeRef);
            }
        }
    }

    fixChildren( nodeRef: NodeRef) {
        console.log("Building nodeRef childing ", nodeRef);

        const node:Node = this.getNode(nodeRef.id);

        if (node != null)  {
            node.children = nodeRef.children;
        }
        else {
            console.log("Node  not found for Fix");
        }

        if (nodeRef.children) {
            for(const childNodeRef of nodeRef.children) {
                this.fixChildren(childNodeRef);
            }
        }
       
    }

     initialize() {
        for (const node of this.nodes) {
            this.nodeMap[node.id] = node;
        }

        for (const nodeType of this.node_types) {
            this.nodeTypeMap[nodeType.id] = nodeType;
        }

        for (const thing of this.things) {
            this.thingMap[thing.id] = thing;
        }


        for (const nodeRef of this.configuration) {
            this.fixTypeOf(nodeRef);
        }


        for (const nodeRef of  this.configuration) {
            this.fixChildren(nodeRef);
        }



    }
}