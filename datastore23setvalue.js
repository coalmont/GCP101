// File: index.js (where this source code should be placed)
// Function: (as named by cloudService, below)
// Lesson: (as declared by lessonURL, below)
// Source: https://github.com/ri4c/GCP101/blob/master/datastore23setvalue.js

'use strict'; // Code syntax is to be in strict mode

const dataStore = require('@google-cloud/datastore')();
// The above line requires the following in package.json:
// {"dependencies": { "@google-cloud/datastore": "1.3.3" } }

const cloudService = "datastore23setvalue"; // As found on console.cloud.google.com/functions/list
const serviceVersion = "1.0";
const versionDate = '2018-02-14 5:57 AM';
const versionInfo = cloudService+' '+serviceVersion+' '+versionDate;

const lessonURL = 'https://seekonkjourney.wordpress.com/gcp101-chapter-23-datastore23setvalue-cloud-service/';
var dataExample1 = `{ "kind":"mytable1", "key":"myrow204", "value":{"mycolumn3":"mydata205", "urlOfLesson": "${lessonURL}"}}`;

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

function getKey (requestData) { // Start of getKey
  if (!requestData.key) { throw new Error('L19 Key missing'); }
  if (!requestData.kind) { throw new Error('L20 Kind missing'); }
  return dataStore.key([requestData.kind, requestData.key]);
} // End of getKey

exports.setValue = (req, res) => { // Start of setValue
  // Step A - Abort with an error if the parent JSON does not include valid name in the third field.
  
  // Step B - Abort with an error if the parent JSON does not include valid name in the third field.
  if (!req.body.value) { throw new Error('L25 Data missing. Example:\n' + dataExample1); }
  
  // Step C - Determines where the target data is in Datastore.
  const key = getKey(req.body);
  
  // Step D - Prepare the input entity for the Datastore
  const entity = { key: key, data: req.body.value };

  var outMsg = `{"Cloud":"${simpleTimestamp()}", "Result":"Entity saved: ${key.path.join('/')}", "Version":"${versionInfo}"}, "Lesson":"${lessonURL}"}`;
  
  // Step E - Save the input as a new or the updated entity in the Datastore
  // Step F - Also, notify the user of the result produced by the cloud service.
  var returnCode = dataStore.save(entity).then(() => res.status(200).send(outMsg)).catch((err) => {
      console.error(err);
      res.status(500).send(err.message);
      return Promise.reject(err);
  });
  console.log(outMsg);
  return returnCode;
  
}; // End of setValue
