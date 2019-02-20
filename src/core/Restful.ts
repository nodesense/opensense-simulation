const fetch = require('node-fetch');
const Bluebird = require('bluebird');
fetch.Promise = Bluebird;

export class Restful {
  
 static async fetchJson(url, options = undefined) {
 

    console.log("Reaching");
    return fetch(url, options)
           .then ( response =>  {
               console.log("response is ", response);
             
               //best practice
               //check for response.status == 400, 403, 404, and show custom error

               if (response.status == 400)
               throw new Error( "bad request, check token or token expired");

               if (response.status == 404)
                throw new Error("Resource not found");

                if (response.status == 403)
                 throw new Error("Not permitted, auth needed");

                //generic
                if (response.state >= 400 && response.status < 500) {
                    throw new Error("client error");
                }

                if (response.status >= 500)
                    throw new Error("Server error ");

                if (response.status == 0)
                    throw new Error("Check network connection ");

              //since we can't know exact error
               if (!response.ok) {
                throw new Error("Request failed");
               }
               
               return response.json()
           })
           
           //response.json() returns a promise
    }
    
    static async getJson(url: string, options?: any) {
        console.log('getting json ', url);
        return Restful.fetchJson(url, options);
    }


    static async postJson(url, data, headers = undefined) {
        return Restful.fetchJson(url, {
            method: 'POST',
            headers: Object.assign({
                        'Content-Type': 'application/json'
                    }, headers),
            body: JSON.stringify(data)
        })
    }


    static async putJson(url, data, headers = undefined) {
    return Restful.fetchJson(url, {
        method: 'PUT',
        headers: Object.assign({
                    'Content-Type': 'application/json'
                 }, headers),
        body: JSON.stringify(data)
    })
}

  static async  deleteJson(url) {
    console.log("deleting ", url);

    return Restful.fetchJson(url, {
        method: 'DELETE'
    })
}
}