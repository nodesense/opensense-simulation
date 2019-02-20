import { ConfigurationManager } from './ConfigurationManager';
import { SiteProfile } from './SiteProfile';
export class SystemContext {
    constructor(public configurationManager: ConfigurationManager, public siteProfile: SiteProfile) {

    }
}