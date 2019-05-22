const fetch = require('node-fetch');

import { SiteRef } from './SiteRef';
import { ModbusDeviceProfile } from './../modbus/ModbusDeviceProfile';
import { DeviceProfile } from './DeviceProfile';
import { GatewayProfile } from "./GatewayProfile";
import { GatewayConfig } from './GatewayConfig';
import { Restful } from './Restful';
import { BacnetDeviceProfile } from '../bacnet/BacnetDeviceProfile';

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

    async downloadGatewayProfile(gatewayId: string) {
        console.log("Downloading site id", gatewayId);
        try {
           const siteProfileJson = await Restful.getJson(`${this.gatewayConfig.siteProfileApiEndPoint}/${gatewayId}`)
           //console.log(siteProfileJson);
           const paths = [this.getSitePath(), gatewayId];
           const siteDirPath = path.join(...paths);
           console.log("Site config path 4", siteDirPath);
           fs.mkdirSync(siteDirPath, {recursive: true});
           fs.mkdirSync(path.join(...paths, 'device-profiles'), {recursive: true});
           fs.mkdirSync(path.join(...paths, 'modbus-profiles'), {recursive: true});
           fs.mkdirSync(path.join(...paths, 'bacnet-profiles'), {recursive: true});

           jsonfile.writeFileSync(path.join(...paths, `${gatewayId}.json`), siteProfileJson, {spaces: 2, EOL: '\r\n' })
           const gatewayProfile = await this.loadSiteProfile(gatewayId)
            return gatewayProfile;
        } catch(error) {
            console.log(error);
            throw error;
        }
    }

    async downloadDeviceProfile(gatewayId: string, profileId: string) {
        try {
            const deviceProfileJson = await Restful.getJson(`${this.gatewayConfig.deviceProfileApiEndPoint}/${profileId}`)
            //console.log(siteProfileJson);

            const paths = [this.getSitePath(), gatewayId, 'device-profiles', `${profileId}.json`];
 
            console.log('path is ', paths);

            const deviceProfilePath = path.join(...paths);
            console.log("device profile  config path 4", deviceProfilePath);
            jsonfile.writeFileSync(deviceProfilePath, deviceProfileJson, {spaces: 2, EOL: '\r\n' })

            const deviceProfile = await this.loadDeviceProfile(gatewayId, profileId)
            return deviceProfile;
         } catch(error) {
             console.log(error);
             throw error;
         }
    }

    async downloadModbusDeviceProfile(gatewayId: string, profileId: string) {
        try {
            const deviceProfileJson = await Restful.getJson(`${this.gatewayConfig.modbusProfileApiEndPoint}/${profileId}`)
            //console.log(siteProfileJson);
 
            const paths = [this.getSitePath(), gatewayId, 'modbus-profiles', `${profileId}.json`];
 
            const deviceProfilePath = path.join(...paths);
            console.log("device profile  config path 4", deviceProfilePath);
            jsonfile.writeFileSync(deviceProfilePath, deviceProfileJson, {spaces: 2, EOL: '\r\n' })

            const modbusDeviceProfile = await this.loadModbusDeviceProfile(gatewayId, profileId)
            return modbusDeviceProfile;
         } catch(error) {
             console.log(error);
             throw error;
         }
    }

    async downloadBacnetDeviceProfile(gatewayId: string, profileId: string) {
        try {
            const deviceProfileJson = await Restful.getJson(`${this.gatewayConfig.bacnetProfileApiEndPoint}/${profileId}`)
            //console.log(siteProfileJson);
 
            const paths = [this.getSitePath(), gatewayId, 'bacnet-profiles', `${profileId}.json`];
 
            const deviceProfilePath = path.join(...paths);
            console.log("device profile  config path 4", deviceProfilePath);
            jsonfile.writeFileSync(deviceProfilePath, deviceProfileJson, {spaces: 2, EOL: '\r\n' })

            const modbusDeviceProfile = await this.loadBacnetDeviceProfile(gatewayId, profileId)
            return modbusDeviceProfile;
         } catch(error) {
             console.log(error);
             throw error;
         }
    }

    loadSiteProfile(gatewayId: string): GatewayProfile {
        const paths = [this.getSitePath(), gatewayId, `${gatewayId}.json`];
        const siteConfigPath = path.join(...paths);
        console.log("Site config path 4", siteConfigPath);
       
        const siteProfileJson: any = jsonfile.readFileSync(siteConfigPath);

        const gatewayProfile: GatewayProfile = new GatewayProfile(siteProfileJson);
        gatewayProfile.initialize();
        gatewayProfile.show();
        return gatewayProfile;
    }

    loadDeviceProfile(gatewayId: string, profileId: string): DeviceProfile {
        const paths = [this.getSitePath(), gatewayId, 'device-profiles',  `${profileId}.json`];

        const configPath = path.join(...paths);
        console.log("Device config path to load", configPath);
       
        const deviceProfile: DeviceProfile = jsonfile.readFileSync(configPath);

        return deviceProfile;
    }

    loadModbusDeviceProfile(gatewayId: string, profileId: string): ModbusDeviceProfile {
        const paths = [this.getSitePath(), gatewayId, 'modbus-profiles',  `${profileId}.json`];

        const configPath = path.join(...paths);
        console.log("Device config path 42", configPath);
       
        const deviceProfile: ModbusDeviceProfile = jsonfile.readFileSync(configPath);

        return deviceProfile;
    }

    loadBacnetDeviceProfile(gatewayId: string, profileId: string): BacnetDeviceProfile {
        const paths = [this.getSitePath(), gatewayId, 'bacnet-profiles',  `${profileId}.json`];

        const configPath = path.join(...paths);
        console.log("Device config path 4", configPath);
       
        const deviceProfile: BacnetDeviceProfile = jsonfile.readFileSync(configPath);

        return deviceProfile;
    }



    async downloadFieldDeviceConfiguration(gatewayProfile: GatewayProfile) {
        for(const fieldDevice of gatewayProfile.devices) {
            // FIXME: This download same profile multiple times
                this.downloadDeviceProfile(gatewayProfile.id, fieldDevice.profile_id);
                this.downloadModbusDeviceProfile(gatewayProfile.id, fieldDevice.profile_id);
                this.downloadBacnetDeviceProfile(gatewayProfile.id, fieldDevice.profile_id);
        }
    }

    async syncSite(gatewayId: string) {
        console.log('syncing site ', gatewayId);
        try {
            const gatewayProfile: GatewayProfile =  await this.downloadGatewayProfile(gatewayId);
            console.log('Site Profile is ', gatewayProfile.id)

            await this.downloadFieldDeviceConfiguration(gatewayProfile);
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
        if  (this.gatewayConfig.id) {
            this.syncSite(this.gatewayConfig.id);
        }
    }
}

const configurationManager = new ConfigurationManager();
export default configurationManager;