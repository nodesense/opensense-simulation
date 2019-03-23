import { BaseActor } from "../core/BaseActor";
import { SystemContext } from "../core/SystemContext";
import { Node } from "../core/Node";
import { concat } from "rxjs";
import { SimulationDevice } from "../core/SimulationDevice";
import { ModbusDevice } from "./ModbusDevice";
var mqtt=require('mqtt');
export class MqttDevice extends BaseActor{
dataToSend="";
  server="mqtt://mqtt.nodesense.ai";
  // publishTopic="testit";
  // client;
  opts={};
  constructor(context: SystemContext, node: Node) {
    super(context, node);
    console.log("**MqttDevice Created", node);
}
setdata(data:string){
  this.dataToSend=data;
}
init() {
  console.log("MqttDevice Init");
  // this.send();
  super.init();
  if (this.node.properties) {
    var server = this.node.properties['server']
    var publishTopic=this.node.properties['publishTopic']
  }
  var client=mqtt.connect(server,this.opts)
  // console.log("The topic is ",this.publishTopic)
  client.on('connect',function(){
    client.publish(publishTopic,"Publishing data");
  }) 
  var i=0;

  var myfunc = setInterval(function(){
  
      i = i + 1;
      console.log('Hello World at '+ 2*i + ' seconds'); 
  
  }, 2000);

var j=0;
  var myfunc = setInterval(function(){
  
    j = j + 1;
    console.log('Hello Universe at '+ 2*j + ' seconds'); 

    // if(i==5) {
    //     clearInterval(myfunc);
    // }

}, 2000);

}




send(){
 

  if (this.node.properties) {
    var server = this.node.properties['server']
    var publishTopic=this.node.properties['publishTopic']
  }
  var client=mqtt.connect(server,this.opts)
  client.on('connect',function(){

    //for success data.....
    var myfunc = setInterval(function(){
      // client.publish(publishTopic,JSON.stringify());
      }, 5000);

  }) 

}









}