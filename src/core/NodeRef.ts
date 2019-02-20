export class NodeRef {
    id: string;
    name: string;
    site_id: string;
    nodetype_id: string;
    type_of: string;

    children: NodeRef[] = [];
}