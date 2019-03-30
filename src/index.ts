import 'source-map-support/register'

const fetch = require('node-fetch');
const Bluebird = require('bluebird');
fetch.Promise = Bluebird;

import configurationManager from './core/ConfigurationManager';
import { System } from './System';
import server from './server';


let system =new System();
// system.load('src/modbus/data/site.json');

system.loadNew();

const PORT = 3001;
server.listen(PORT, () => console.log('Example app2 listening on port 3000!'))


configurationManager.init();
// configurationManager.sync();
