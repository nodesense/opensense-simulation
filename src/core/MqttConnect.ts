import { inherits } from "util";
import { ClientRequest } from "http";

const EventEmitter=require('events')
const mqtt=require('mqtt')
export class MqttConnect extends EventEmitter{
    //dataValue;
   prei=0;
   pid=0;
      
    server="mqtt://mqtt.nodesense.ai"
    topic="testit";
    // client=mqtt.connect("mqtt://mqtt.nodesense.ai");
    constructor(){
        super();
        // this.client=mqtt.connect("mqtt://mqtt.nodesense.ai");
    }
    init(){

    }
    send(event,dataValue:any) {
        // console.log("Send Method called");
        this.on('sendit',()=>{
            // console.log("Event also called")
            let client=mqtt.connect("mqtt://mqtt.nodesense.ai");
                client.on('connect',function(){
                    this.preid=dataValue.id;
                    if(this.pid!=this.preid){    
                client.publish("testit",JSON.stringify(dataValue));
                this.preid=this.pid;
                    }
            })
           
        })  
        this.emit(event);
      }
}