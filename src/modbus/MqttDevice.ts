import { BaseActor } from "../core/BaseActor";
import { SystemContext } from "../core/SystemContext";
import { Node } from "../core/Node";
import { concat } from "rxjs";
import { SimulationDevice } from "../core/SimulationDevice";
import { start } from "repl";
var mqtt=require('mqtt');
export class MqttDevice extends SimulationDevice{
  public id:number = 1;
  server="mqtt://mqtt.nodesense.ai";
  // publishTopic="testit";
  // client;
  opts={};
  constructor(context: SystemContext, node: Node) {
    super(context, node);
    console.log("**MqttDevice Created", node);
}

init() {
  console.log("MqttDevice Init");
  super.init();
  this.id = this.node.properties['slaveId'];
  var that=this;
  // this.send();

  if (this.node.properties) {
    var server = this.node.properties['server']
    var publishTopic=this.node.properties['publishTopic']
  }
  var client=mqtt.connect(server,this.opts)
  client.on('connect',function(){

    var myfunc = setInterval(function(){
      var status=that.getValue("Status");
      // console.log(status);
      client.publish(publishTopic,JSON.stringify(status));
        
        }, 2000);
      
  }) 

}

// sendit(this){
//   if (this.node.properties) {
//     var server = this.node.properties['server']
//     var publishTopic=this.node.properties['publishTopic']
//   }
//   var client=mqtt.connect(server,this.opts)
//   client.on('connect',function(){

//     var myfunc = setInterval(function(){
        
//     client.publish(publishTopic,JSON.stringify(this.getValue("Status")));
        
//         }, 2000);
      
//   }) 

// }
send(){
  let flag=0;
  console.log("Send Method called");

  var data={
    "type": "process",
    "id": 123,
    "timestamp":new Date().getTime(),
    "thing_id": "323123123",
    "payload": [
        {
            "name": "success",
            "value": 1
        }
    ]
};

var temp_id=data.id;

var successArray=[{name:"success",value:1}];
var rejArray=[{
  name: "rejection",
  value: 1
},{
  name: "rejection",
  value: 2
},{
  name: "rejection",
  value: 3
},{
  name: "rejection",
  value: 4
},{
  name: "rejection",
  value: 5
}
];


var server;
var publishTopic;
  if (this.node.properties) {
     server = this.node.properties['server']
     publishTopic=this.node.properties['publishTopic']
  }
  console.log("Server and topic is ",server,publishTopic);
  var client=mqtt.connect(server,this.opts)
  client.on('connect',function(){
    //for success data.....
    var myfunc = setInterval(function(){
      temp_id++;
      data.id=temp_id;
      data.timestamp=new Date().getTime();
      data.payload[0]=successArray[0];
      if(flag!=1)
      client.publish(publishTopic,JSON.stringify(data));
      else
      flag=0;
      }, 2000);

      //for rejection data.....
    var myfunc = setInterval(function(){
      temp_id++;
      data.id=temp_id;
      data.timestamp=new Date().getTime();
      data.payload[0]=rejArray[Math.ceil(Math.random() * rejArray.length)];
      if(!data.payload[0]){
        data.payload[0]=rejArray[0];
      }
      client.publish(publishTopic,JSON.stringify(data));
      flag=1;

      },10000);

  }) 

}









}