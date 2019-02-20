const fetch = require('node-fetch');
const Bluebird = require('bluebird');
fetch.Promise = Bluebird;

import { ConfigurationManager } from './core/ConfigurationManager';
import { System } from './System';

let system =new System();
// system.load('src/modbus/data/site.json');

system.loadNew();

// let manager = new ConfigurationManager();
// manager.init();
// manager.loadSiteProfile("site");
// manager.sync();
