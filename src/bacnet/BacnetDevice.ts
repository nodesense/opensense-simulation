const bacnet = require('bacstack');
const PropertyIds = bacnet.enum.PropertyIds;
const ObjectTypes = bacnet.enum.ObjectTypes;

const debug   = require('debug')('bacstack-device');

interface BacnetConfig {
    id: number; // not used
    type_of : string;
    name: string; // not used
    device_id: number,
    vendor_id: number,
    port: number
}
//console.log("Enum is ", bacnet.enum);

const dataStore = {
  '1:0': {
    [PropertyIds.PROP_OBJECT_IDENTIFIER]: [{value: {type: ObjectTypes.OBJECT_ANALOG_OUTPUT, instance: 0}, type: 12}],    // PROP_OBJECT_IDENTIFIER
    [PropertyIds.PROP_OBJECT_NAME]: [{value: 'Analog Output 1', type: 7}],          // PROP_OBJECT_NAME
    [PropertyIds.PROP_OBJECT_TYPE]: [{value: 1, type: 9}],                          // PROP_OBJECT_TYPE
    [PropertyIds.PROP_PRESENT_VALUE]: [{value: 5, type: 4}]                           // PROP_PRESENT_VALUE
  },

  '1:1': {
    [PropertyIds.PROP_OBJECT_IDENTIFIER]: [{value: {type: ObjectTypes.OBJECT_ANALOG_OUTPUT, instance: 1}, type: 12}],    // PROP_OBJECT_IDENTIFIER
    [PropertyIds.PROP_OBJECT_NAME]: [{value: 'Analog Output 2', type: 7}],          // PROP_OBJECT_NAME
    [PropertyIds.PROP_OBJECT_TYPE]: [{value: 1, type: 9}],                          // PROP_OBJECT_TYPE
    [PropertyIds.PROP_PRESENT_VALUE]: [{value: 50, type: 4}]                           // PROP_PRESENT_VALUE
  },

  '8:443': {
    [PropertyIds.PROP_OBJECT_IDENTIFIER]: [{value: {type: ObjectTypes.OBJECT_DEVICE, instance: 443}, type: 12}],  // PROP_OBJECT_IDENTIFIER
    [PropertyIds.PROP_OBJECT_LIST]: [
      {value: {type: ObjectTypes.OBJECT_DEVICE, instance: 443}, type: 12},
      {value: {type: ObjectTypes.OBJECT_ANALOG_OUTPUT, instance: 0}, type: 12},
      {value: {type: ObjectTypes.OBJECT_ANALOG_OUTPUT, instance: 1}, type: 12}
    ],                                                  // PROP_OBJECT_IDENTIFIER
    [PropertyIds.PROP_OBJECT_NAME]: [{value: 'my-device-443', type: 7}],            // PROP_OBJECT_NAME
    [PropertyIds.PROP_OBJECT_TYPE]: [{value: 8, type: 9}],                          // PROP_OBJECT_TYPE
    [PropertyIds.PROP_DESCRIPTION]: [{value: 'Test Device #443', type: 7}]          // PROP_DESCRIPTION
  },


  '8:444': {
    [PropertyIds.PROP_OBJECT_IDENTIFIER]: [{value: {type: ObjectTypes.OBJECT_DEVICE, instance: 444}, type: 12}],  // PROP_OBJECT_IDENTIFIER
    [PropertyIds.PROP_OBJECT_LIST]: [
      {value: {type: ObjectTypes.OBJECT_DEVICE, instance: 444}, type: 12},
      {value: {type: ObjectTypes.OBJECT_ANALOG_OUTPUT, instance: 0}, type: 12},
      {value: {type: ObjectTypes.OBJECT_ANALOG_OUTPUT, instance: 1}, type: 12}
    ],                                                  // PROP_OBJECT_IDENTIFIER
    [PropertyIds.PROP_OBJECT_NAME]: [{value: 'my-device-444', type: 7}],            // PROP_OBJECT_NAME
    [PropertyIds.PROP_OBJECT_TYPE]: [{value: 8, type: 9}],                          // PROP_OBJECT_TYPE
    [PropertyIds.PROP_DESCRIPTION]: [{value: 'Test Device #444', type: 7}]          // PROP_DESCRIPTION
  },

  '8:445': {
    [PropertyIds.PROP_OBJECT_IDENTIFIER]: [{value: {type: ObjectTypes.OBJECT_DEVICE, instance: 445}, type: 12}],  // PROP_OBJECT_IDENTIFIER
    [PropertyIds.PROP_OBJECT_LIST]: [
      {value: {type: ObjectTypes.OBJECT_DEVICE, instance: 445}, type: 12},
      {value: {type: ObjectTypes.OBJECT_ANALOG_OUTPUT, instance: 0}, type: 12},
      {value: {type: ObjectTypes.OBJECT_ANALOG_OUTPUT, instance: 1}, type: 12}
    ],                                                  // PROP_OBJECT_IDENTIFIER
    [PropertyIds.PROP_OBJECT_NAME]: [{value: 'my-device-445', type: 7}],            // PROP_OBJECT_NAME
    [PropertyIds.PROP_OBJECT_TYPE]: [{value: 8, type: 9}],                          // PROP_OBJECT_TYPE
    [PropertyIds.PROP_DESCRIPTION]: [{value: 'Test Device #445', type: 7}]          // PROP_DESCRIPTION
  }
};

 


export class BacnetDevice {
    client: any;

    constructor(public config: BacnetConfig) {

    }

    connect() {
        // Initialize BACStack
        this.client = new bacnet({ 
            port: this.config.port || 47808, //BAC0
            apduTimeout: 6000
        });

        // Discover Devices
        this.client.on('iAm', this.onIAm);

        this.client.on('whoIs', this.onWhoIs);


            this.client.on('readProperty', this.onReadProperty);
        
            this.client.on('writeProperty', this.onWriteProperty);


            this.client.on('whoHas', this.onWhoHas);
            
            this.client.on('timeSync', this.onTimeSync);
            
            this.client.on('timeSyncUTC', this.onTimeSyncUTC);

            
            this.client.on('readPropertyMultiple', this.onReadPropertyMultiple);
        
        this.client.on('writePropertyMultiple', this.onWritePropertyMultiple);
        
            

        this.client.on('atomicWriteFile', this.onAtomicWriteFile);

        this.client.on('atomicReadFile', this.onAtomicReadFile);

        this.client.on('subscribeCOV', this.onSubscribeCOV);

        this.client.on('subscribeProperty',this.onSubscribeProperty);

        this.client.on('deviceCommunicationControl', this.onDeviceCommunicationControl);

        this.client.on('reinitializeDevice', this.onReinitializeDevice);

        this.client.on('readRange', this.onReadRange);

        this.client.on('createObject', this.onCreateObject);

        this.client.on('deleteObject', this.onDeleteObject);
    }

    onIAm = (device) => {
        console.log('iAM');
        console.log('address: ', device.address);
        console.log('deviceId: ', device.deviceId);
        console.log('maxApdu: ', device.maxApdu);
        console.log('segmentation: ', device.segmentation);
        console.log('vendorId: ', device.vendorId);
    }

    onWhoIs = (data) => {
        debug(data);
        if (data.lowLimit && data.lowLimit > this.config.device_id) return;
        if (data.highLimit && data.highLimit < this.config.device_id) return;
    
        //this.client.iAmResponse(444, bacnet.enum.Segmentations.SEGMENTATION_BOTH, this.config.vendor_id);
        this.client.iAmResponse(this.config.device_id, bacnet.enum.Segmentations.SEGMENTATION_BOTH, this.config.vendor_id);

        // client.iAmResponse(settings2.deviceId, bacnet.enum.Segmentations.SEGMENTATION_BOTH, settings2.vendorId);
    
    }

    onReadProperty = (data) => {
        console.log('*onReadProperty * ', data)

        const object = dataStore[data.request.objectId.type + ':' + data.request.objectId.instance];
        debug('object', object);
        // if object not found
        if (!object) return this.client.errorResponse(data.address, bacnet.enum.ConfirmedServices.SERVICE_CONFIRMED_READ_PROPERTY, data.invokeId, bacnet.enum.ErrorClasses.ERROR_CLASS_OBJECT, bacnet.enum.ErrorCodes.ERROR_CODE_UNKNOWN_OBJECT);
        
        const property = object[data.request.property.id];
        debug('object', property);
        // if property not found
        if (!property) return this.client.errorResponse(data.address, bacnet.enum.ConfirmedServices.SERVICE_CONFIRMED_READ_PROPERTY, data.invokeId, bacnet.enum.ErrorClasses.ERROR_CLASS_PROPERTY, bacnet.enum.ErrorCodes.ERROR_CODE_UNKNOWN_PROPERTY);
        
        if (data.request.property.index === 0xFFFFFFFF) {
            this.client.readPropertyResponse(data.address, data.invokeId, data.request.objectId, data.request.property, property);
        } else {
          const slot = property[data.request.property.index];
          if (!slot) return this.client.errorResponse(data.address, bacnet.enum.ConfirmedServices.SERVICE_CONFIRMED_READ_PROPERTY, data.invokeId, bacnet.enum.ErrorClasses.ERROR_CLASS_PROPERTY, bacnet.enum.ErrorCodes.ERROR_CODE_INVALID_ARRAY_INDEX);
          this.client.readPropertyResponse(data.address, data.invokeId, data.request.objectId, data.request.property, [slot]);
        }
      }

    onWriteProperty = (data) => {
        console.log('write data property ', data);
        
      const object = dataStore[data.request.objectId.type + ':' + data.request.objectId.instance];
      if (!object) return this.client.errorResponse(data.address, data.service, data.invokeId, bacnet.enum.ErrorClasses.ERROR_CLASS_OBJECT, bacnet.enum.ErrorCodes.ERROR_CODE_UNKNOWN_OBJECT);
      let property = object[data.request.value.property.id];
      if (!property) return this.client.errorResponse(data.address, data.service, data.invokeId, bacnet.enum.ErrorClasses.ERROR_CLASS_PROPERTY, bacnet.enum.ErrorCodes.ERROR_CODE_UNKNOWN_PROPERTY);
      if (data.request.value.property.index === 0xFFFFFFFF) {
          console.log('INDEX FfFFFF')
        property = data.request.value.value;
        console.log('property is ', property)
        this.client.simpleAckResponse(data.address, data.service, data.invokeId);
      } else {
        console.log('INDEX Slot')
    
        let slot = property[data.request.value.property.index];
        if (!slot) return this.client.errorResponse(data.address, data.service, data.invokeId, bacnet.enum.ErrorClasses.ERROR_CLASS_PROPERTY, bacnet.enum.ErrorCodes.ERROR_CODE_INVALID_ARRAY_INDEX);
        slot = data.request.value.value[0];
        this.client.simpleAckResponse(data.address, data.service, data.invokeId);
      }
    }




    onWhoHas = (data) => {
        console.log('onWhoHas*****')
        debug(data);
        if (data.lowLimit && data.lowLimit > this.config.device_id) return;
        if (data.highLimit && data.highLimit < this.config.device_id) return;
        if (data.objId) {
          var object = dataStore[data.objId.type + ':' + data.objId.instance];
          if (!object) return;
          this.client.iHaveResponse(this.config.device_id, {type: data.objId.type, instance: data.objId.instance}, object[77][0].value);
        }
        if (data.objName) {
          // TODO: Find stuff...
          this.client.iHaveResponse(this.config.device_id, {type: 1, instance: 1}, 'test');
        }
      }

    onTimeSync = (data) => {
        // TODO: Implement
        console.log('timesync called *')
      }

    onTimeSyncUTC = (data) => {
        // TODO: Implement
        console.log('timeSyncUTC called *')
      }

    onReadPropertyMultiple  = (data) => {
        console.log('*onReadPropertyMultiple * ', data)
        debug(data.request.properties);
        const responseList = [];
        const properties = data.request.properties;
        properties.forEach((property) => {
          if (property.objectId.type === bacnet.enum.ObjectTypes.OBJECT_DEVICE && property.objectId.instance === 4194303) {
            property.objectId.instance = this.config.device_id;
          }
          const object = dataStore[property.objectId.type + ':' + property.objectId.instance];
          if (!object) return; // TODO: Add error
          const propList = [];
          property.properties.forEach((item) => {
            if (item.id === bacnet.enum.PropertyIds.PROP_ALL) {
              for (let key in object) {
                propList.push({property: {id: key, index: 0xFFFFFFFF}, value: object[key]});
              }
              return;
            }
            const prop = object[item.id];
            let content;
            if (!prop) return; // TODO: Add error
            if (item.index === 0xFFFFFFFF) {
              content = prop;
            } else {
              const slot = prop[item.index];
              if (!prop) return; // TODO: Add error
              content = [slot];
            }
            propList.push({property: {id: item.id, index: item.index}, value: content});
          });
          responseList.push({objectId: {type: property.objectId.type, instance: property.objectId.instance}, values: propList});
        });

        // FIXME: hardcoded ip, need to take ip from data param
        this.client.readPropertyMultipleResponse('192.168.178.255', data.invokeId, responseList);
      }

    onWritePropertyMultiple = (data) => {
        // TODO: Implement
        // TODO: valuesRefs
        //if () client.simpleAckResponse(data.address, data.service, data.invokeId);
        //else client.errorResponse(data.address, data.service, data.invokeId, bacnet.enum.ErrorClasses.ERROR_CLASS_OBJECT, bacnet.enum.ErrorCodes.ERROR_CODE_UNKNOWN_OBJECT);
      }
    

      onAtomicWriteFile = (data) => {
      }

      onAtomicReadFile = (data) => {
      }

      onSubscribeCOV = (data) => {
        console.log('subscribe CoV called', data);
    }
    
    onSubscribeProperty =  (data) => {
      }

      onDeviceCommunicationControl = (data) => {
    }
      onReinitializeDevice = (data) => {
        }

    onReadRange = (data) => {
    }

    onCreateObject = (data) => {
    }

      onDeleteObject = (data) => {
    }


}