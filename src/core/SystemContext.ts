import { ConfigurationManager } from './ConfigurationManager';
import { GatewayProfile } from './GatewayProfile';
export class SystemContext {
    constructor(public configurationManager: ConfigurationManager, public gatewayProfile: GatewayProfile) {

    }
}