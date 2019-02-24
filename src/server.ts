import express from 'express'
import configurationManager from './core/ConfigurationManager';
const server = express()

// respond with "hello world" when a GET request is made to the homepage
server.get('/', function (req, res) {
  res.send('hello world')
})


server.get('/sync', function (req, res) {
    res.send('sync world')
    console.log("Syncing  the configuration");
<<<<<<< HEAD
    configurationManager.sync();
=======
     configurationManager.sync();
>>>>>>> 114e298e716b9be82b08e2336098bd9c5bb1b972
  })
  

server.get('/start', function (req, res) {
res.send('start world')
})


server.get('/stop', function (req, res) {
    res.send('stop world')
    })

export default server;
