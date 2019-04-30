import { NodeRef } from "./NodeRef";

export class Node {
    id: string;
    name: string;
    site_id: string;
    type_of: string;

    nodetype_id: string;

    is_field_device: boolean;
    device_id: string;

    children: NodeRef[] = [];

    properties: any = {};


}