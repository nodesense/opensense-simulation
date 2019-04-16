const fetch = require('node-fetch');

import { SiteRef } from './SiteRef';
import { ModbusDeviceProfile } from './../modbus/ModbusDeviceProfile';
import { DeviceProfile } from './DeviceProfile';
import { SiteProfile } from "./SiteProfile";
import { GatewayConfig } from './GatewayConfig';
import { Restful } from './Restful';

const fs = require('fs');
const path = require('path');

const jsonfile = require('jsonfile');



export class ConfigurationManager {
    gatewayConfig: GatewayConfig;
    constructor() {

    }

    getSitePath() {
        return path.join(this.getAppPath(),  'configuration');
    }

    async downloadSiteProfile(siteId: string) {
        console.log("Downloading site id", siteId);
        try {
           const siteProfileJson = await Restful.getJson(`${this.gatewayConfig.siteProfileApiEndPoint}/${siteId}`)
           //console.log(siteProfileJson);
           const paths = [this.getSitePath(), siteId];
           const siteDirPath = path.join(...paths);
           console.log("Site config path 4", siteDirPath);
           fs.mkdirSync(siteDirPath, {recursive: true});
           fs.mkdirSync(path.join(...paths, 'device-profiles'), {recursive: true});
           fs.mkdirSync(path.join(...paths, 'modbus-profiles'), {recursive: true});
           jsonfile.writeFileSync(path.join(...paths, `${siteId}.json`), siteProfileJson, {spaces: 2, EOL: '\r\n' })
           const siteProfile = await this.loadSiteProfile(siteId)
            return siteProfile;
        } catch(error) {
            console.log(error);
            throw error;
        }
    }

    async downloadDeviceProfile(siteId: string, profileId: string) {
        try {
            const deviceProfileJson = await Restful.getJson(`${this.gatewayConfig.deviceProfileApiEndPoint}/${profileId}`)
            //console.log(siteProfileJson);

            const paths = [this.getSitePath(), siteId, 'device-profiles', `${profileId}.json`];
 
            const deviceProfilePath = path.join(...paths);
            console.log("device profile  config path 4", deviceProfilePath);
            jsonfile.writeFileSync(deviceProfilePath, deviceProfileJson, {spaces: 2, EOL: '\r\n' })

            const deviceProfile = await this.loadDeviceProfile(siteId, profileId)
            return deviceProfile;
         } catch(error) {
             console.log(error);
             throw error;
         }
    }

    async downloadModbusDeviceProfile(siteId: string, profileId: string) {
        try {
            const deviceProfileJson = await Restful.getJson(`${this.gatewayConfig.modbusProfileApiEndPoint}/${profileId}`)
            //console.log(siteProfileJson);
 
            const paths = [this.getSitePath(), siteId, 'modbus-profiles', `${profileId}.json`];
 
            const deviceProfilePath = path.join(...paths);
            console.log("device profile  config path 4", deviceProfilePath);
            jsonfile.writeFileSync(deviceProfilePath, deviceProfileJson, {spaces: 2, EOL: '\r\n' })

            const modbusDeviceProfile = await this.loadModbusDeviceProfile(siteId, profileId)
            return modbusDeviceProfile;
         } catch(error) {
             console.log(error);
             throw error;
         }
    }

    loadSiteProfile(siteId: string): SiteProfile {
        const paths = [this.getSitePath(), siteId, `${siteId}.json`];
        const siteConfigPath = path.join(...paths);
        console.log("Site config path 4", siteConfigPath);
       
        const siteProfileJson: any = jsonfile.readFileSync(siteConfigPath);

        const siteProfile: SiteProfile = new SiteProfile(siteProfileJson);
        siteProfile.initialize();
        siteProfile.show();
        return siteProfile;
    }

    loadDeviceProfile(siteId: string, profileId: string): DeviceProfile {
        const paths = [this.getSitePath(), siteId, 'device-profiles',  `${profileId}.json`];

        const configPath = path.join(...paths);
        console.log("Device config path 4", configPath);
       
        const deviceProfile: DeviceProfile = jsonfile.readFileSync(configPath);

        return deviceProfile;
    }

    loadModbusDeviceProfile(siteId: string, profileId: string): ModbusDeviceProfile {
        const paths = [this.getSitePath(), siteId, 'modbus-profiles',  `${profileId}.json`];

        const configPath = path.join(...paths);
        console.log("Device config path 4", configPath);
       
        const deviceProfile: ModbusDeviceProfile = jsonfile.readFileSync(configPath);

        return deviceProfile;
    }



    async downloadFieldDeviceConfiguration(siteProfile: SiteProfile) {
        for(const fieldDevice of siteProfile.field_devices) {
            // FIXME: This download same profile multiple times
                this.downloadDeviceProfile(fieldDevice.site_id, fieldDevice.profile_id);
                this.downloadModbusDeviceProfile(fieldDevice.site_id, fieldDevice.profile_id);
        }
    }

    async syncSite(siteId: string) {
        console.log('syncing site ', siteId);
        try {
            const siteProfile: SiteProfile =  await this.downloadSiteProfile(siteId);
            console.log('Site Profile is ', siteProfile.id)

            await this.downloadFieldDeviceConfiguration(siteProfile);
        }
        catch(ex) {
            console.log(ex);
        }
    }

    getAppPath() {
        return process.cwd();
    }
    

    getGatewayConfigPath() {
        return path.join(this.getAppPath(),  "settings.json")
    }

    loadGatewayConfig() {
        this.gatewayConfig = jsonfile.readFileSync(this.getGatewayConfigPath())
    }

    init() {
        const currentPath = process.cwd();
        console.log("Current path is ", this.getGatewayConfigPath());
        this.loadGatewayConfig();
        // console.log("Gateway config", this.gatewayConfig);
    }

    sync() {
        console.log("Syning gateway config", this.gatewayConfig);
        for (let siteRef of this.gatewayConfig.sites) {
            this.syncSite(siteRef.id);
        }
    }
}

const configurationManager = new ConfigurationManager();
export default configurationManager;