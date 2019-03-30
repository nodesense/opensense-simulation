var mqtt = require('mqtt')
var client  = mqtt.connect('mqtt://mqtt.nodesense.ai')

sources=[  {
            type: "success",
            value:1
            },
           {
            type: "success",
            value:1
            },
            {
            type: "success",
            value:1
            },
            {
              type: "rejection",
              rejection_type: 1
            },
            {
              type: "success",
              value:1
              },
             {
              type: "success",
              value:1
              },
              {
              type: "success",
              value:1
              },
              {
                type: "success",
                value:1
                },
                {
                  type: "rejection",
                  rejection_type: 2
                },
               {
                type: "success",
                value:1
                },
                {
                type: "success",
                value:1
                },
                {
                  type: "success",
                  value:1
                  },
                 {
                  type: "success",
                  value:1
                  },
                  {
                    type: "rejection",
                    rejection_type: 3
                  },      
                  {
                  type: "success",
                  value:1
                  },
                  {
                    type: "rejection",
                    rejection_type: 4
                  },
                  {
                    type: "success",
                    value:1
                    },
                   {
                    type: "success",
                    value:1
                    },
                    {
                    type: "success",
                    value:1
                    },
                    {
                      type: 'alert',
                      value: 1,
                      name: 'low-fuel',
                      severity: 1,
                      ack: 1
                    }
          ]
  
          data={
            "type": "process",
            "id": 123,
            "timestamp":new Date().getTime(),
            "device_id": "323123123",
            "assembly_id": "2343433",
            "payload": [
                {
                    "name": "success",
                    "value": 1
                }
            ]
        };
temp_id=data.id;
publish_topic=""
client.on('connect', function () {
console.log(" Time ",new Date()); 
for(source of sources){
  temp_id++;
  data.id=temp_id;
  data.timestamp=new Date().getTime();
if(source.type=="success"){
  publish_topic="discrete_results"
  data.payload[0]={"name":source.type,"value":source.value}
}
else if(source.type=="rejection"){
  publish_topic="discrete_results"
  data.payload[0]={"name":source.type,"value":source.rejection_type}
}
else if(source.type=="alert"){
  publish_topic="alert"
  data.payload[0]={"name":source.name,"value":source.value,"severity":source.severity,"ack":source.ack}
}
console.log('sending ', data);
client.publish(publish_topic,JSON.stringify(data))
}
})
client.on('message', function (topic, message) {
  console.log("topic ", topic)
  console.log("Msg", message.toString())
})


subscribe:

var mqtt = require('mqtt')
var client  = mqtt.connect('mqtt://mqtt.nodesense.ai')

client.on('connect', function () {
  client.subscribe('discrete_results', function (err) {
  })
  client.subscribe('alert', function (err) {
  })
})

client.on('message', function (topic, message) {
  // console.log(" Time ",new Date());
  // console.log("topic ", topic)
  console.log("Msg", message.toString())
})