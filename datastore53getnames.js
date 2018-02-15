// File: index.js (where this source code should be placed)
// Function: (as named by cloudService, below)
// Lesson: (as declared by lessonURL, below)
// Source: https://github.com/ri4c/GCP101/blob/master/datastore53getnames.js

'use strict'; // Code syntax is to be in strict mode

const dataStore = require('@google-cloud/datastore')();
// The above line requires the following in package.json:
// {"dependencies": { "@google-cloud/datastore": "1.3.3" } }

const cloudService = "datastore53getnames"; // As found on console.cloud.google.com/functions/list
const serviceVersion = "0.3";
const versionDate = '2018-02-14 8:49 PM';
const versionInfo = cloudService+' '+serviceVersion+' '+versionDate;

const lessonURL = `https://seekonkjourney.wordpress.com/gcp101-chapter-53-datastore53getnames-cloud-service/`; // *** TO BE DECLARED ***
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
  
  /*
  var requestData = req.body;
  if (!requestData) { throw new Error('L51 Data missing. Example:\n' + dataExample1); }
  if (!requestData.kind) { throw new Error('L52 Kind missing. Example:\n' + dataExample1); }
  
  // Step B - Determine where the target data is in Datastore.
  //const key = getKey(req.body);
  
  // const query = dataStore.createQuery(requestData.kind).select('id').order('id', {descending: false} );
  console.log(`L59 Kind:${requestData.kind}`);
  const query = dataStore.createQuery(requestData.kind);
  */
  
  const query = dataStore.createQuery('mytable1');
  return dataStore.runQuery(query).then( results => {
    
    // console.log(`L63 results:${JSON.stringify(results)}`);

    const entities = results[0];
    // console.log(`L66 entities:${JSON.stringify(entities)}`);

    const namespaces = entities.map(entity => entity[dataStore.KEY].name);
    // console.log(`L69 namespaces:${JSON.stringify(namespaces)}`);

    // console.log(`L71 Namespaces:`);

    namespaces.forEach(namespace => {
      // console.log(`L74 Namespace: ${namespace}`)
    });
    
    var jsonResult = {
      time: simpleTimestamp(),
      kind: requestData.kind,
      names: namespaces 
    }
    console.log(`L79 jsonResult:${JSON.stringify(jsonResult)}`);
    
    res.header('Access-Control-Allow-Headers', 'Origin, Content Type');
  	res.header('Access-Control-Allow-Origin', "*");
  	res.header('Access-Control-Allow-Methods', 'GET, POST');
    
    res.status(200).send(jsonResult);

    // return namespaces;
    
  }); // End of dataStore.runQuery
  
}; // End of getNames
