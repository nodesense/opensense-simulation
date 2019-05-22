import { SiteRef } from "./SiteRef";

export class GatewayConfig {
    name: string;
    id: string;
    deviceProfileApiEndPoint: string;
    siteProfileApiEndPoint: string;
    modbusProfileApiEndPoint: string;
    bacnetProfileApiEndPoint: string;
    
    sites: SiteRef[] = [];
}