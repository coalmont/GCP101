// File: index.js (where this source code should be placed)
// Function: (as named by cloudService, below)
// Lesson: (as declared by lessonURL, below)
// Source: (URL for Chapter 53)  // *** TO BE DECLARED ***

'use strict'; // Code syntax is to be in strict mode

const dataStore = require('@google-cloud/datastore')();
// The above line requires the following in package.json:
// {"dependencies": { "@google-cloud/datastore": "1.3.3" } }

const cloudService = "datastore53getnames"; // As found on console.cloud.google.com/functions/list
const serviceVersion = "0.2";
const versionDate = '2018-02-14 8:24 PM';
const versionInfo = cloudService+' '+serviceVersion+' '+versionDate;

const lessonURL = null; // *** TO BE DECLARED ***
var dataExample1 = `{ "kind":"mytable1"}`;

function padLeadZeros(number, zeroCount) { // No tracing of a low-level utility
	// Unit Test: https://codepen.io/ri4c/pen/XZMPdK
	
	var x = number;
	
	switch (zeroCount) {
		case 2: x = number <= 99 ? ("00"+number).slice(-2) : number; break;
		case 3: x = number <= 999 ? ("000"+number).slice(-3) : number; break;
		case 4: x = number <= 9999 ? ("0000"+number).slice(-4) : number; break;
		default: x = number;
	}
	
	return x;
}

function simpleTimestamp() { // No tracing of a low-level utility
	//
	
	var xNow = new Date();
	
	var xHours = padLeadZeros(xNow.getHours(),2);
	var xMinutes = padLeadZeros(xNow.getMinutes(),2);
	var xSeconds = padLeadZeros(xNow.getSeconds(),2);
	var xMilliseconds = padLeadZeros(xNow.getMilliseconds(),3);
	
	return xHours + ':' + xMinutes + ':' + xSeconds + '.' + xMilliseconds;
}

exports.getNames = (req, res) => { // Start of getValue
  // Step A – Receive input from the web request object req.
  
  var requestData = req.body;
  if (!requestData) { throw new Error('L51 Data missing. Example:\n' + dataExample1); }
  if (!requestData.kind) { throw new Error('L52 Kind missing. Example:\n' + dataExample1); }
  
  // Step B - Determine where the target data is in Datastore.
  //const key = getKey(req.body);
  
  // const query = dataStore.createQuery(requestData.kind).select('id').order('id', {descending: false} );
  console.log(`L59 Kind:${requestData.kind}`);
  const query = dataStore.createQuery(requestData.kind);
  
  return dataStore.runQuery(query).then( results => {
    
    console.log(`L63 results:${JSON.stringify(results)}`);

    const entities = results[0];
    console.log(`L66 entities:${JSON.stringify(entities)}`);

    const namespaces = entities.map(entity => entity[dataStore.KEY].name);
    console.log(`L69 namespaces:${JSON.stringify(namespaces)}`);

    console.log(`L71 Namespaces:`);

    namespaces.forEach(namespace => {
      console.log(`L74 Namespace: ${namespace}`)
    });
    
    res.status(200).send(namespaces);

    return namespaces;
    
  }); // End of dataStore.runQuery
  
/*  
  
    .then( (results) => {
    
      const entities = results[0];
	  console.log(`L66 Entities:${JSON.stringify(entities)}`);
      console.log('L67 Entities:');
    
      entities.forEach( entity => {
        
        console.log(`L71 Entity: ${JSON.stringify(entity)}`);
        
        // try {
          var id = entity.getId();
          console.log(`L75 Key: ${id}`);
          var name = entity.getName();
          console.log(`L77 Key: ${name}`);
        // } catch { }
        
      } ); // End of entities.forEach
    
      // if (!entities) { throw new Error(`No ${requestData.kind} entities found.`); }
    
      // var keys = results.map( function(entity) { return entity[dataStore.KEY]; });
	  // console.log(`keys:${JSON.stringify(keys)}`);
    
      res.status(200).send(entities); // Valid and good but use instead...
      // res.status(200).send(keys);
    
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send(err.message);
      return Promise.reject(err);
    });
*/
  
}; // End of getNames
