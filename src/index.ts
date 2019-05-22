import 'source-map-support/register'

const fetch = require('node-fetch');
const Bluebird = require('bluebird');
const path = require('path');
const fs = require('fs');

fetch.Promise = Bluebird;

import configurationManager from './core/ConfigurationManager';
import { System } from './System';
import server from './server';


let system =new System();
// system.load('src/modbus/data/site.json');
 
const configDirName = path.join(__dirname, 'configuration');
 
try {
fs.mkdirSync(configDirName, {recursive: true});
}
catch (ex) {

}

system.loadNew();

const PORT = 3001;
server.listen(PORT, () => console.log(`Example app2 listening on port ${PORT}!`))


configurationManager.init();
// configurationManager.sync();
