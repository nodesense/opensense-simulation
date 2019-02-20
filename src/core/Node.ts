import { NodeRef } from "./NodeRef";

export class Node {
    id: string;
    name: string;
    site_id: string;
    type_of: string;

    nodetype_id: string;

    is_thing: boolean;
    thing_id: string;

    children: NodeRef[] = [];

    properties: any = {};


}