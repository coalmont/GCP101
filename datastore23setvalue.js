'use strict'; // Code to be executed in strict mode.
const dataStore = require('@google-cloud/datastore')();
// The above line requires the following in package.json:
// {"dependencies": { "@google-cloud/datastore": "1.3.3" } }

const lessonURL = 'https://seekonkjourney.wordpress.com/gcp101-chapter-23-datastore23setvalue-cloud-service/';
var dataExample1 = `{ "kind":"mytable1", "key":"myrow204", "value":{"mycolumn3":"mydata205", "urlOfLesson": "${lessonURL}"}}`;

function localTime() {
	var xNow = new Date();
	var xHours = xNow.getHours(); if (xHours<10) {xHours = '0' + xHours;}
	var xMinutes = xNow.getMinutes(); if (xMinutes<10) {xMinutes = '0' + xMinutes;}
	var xSeconds = xNow.getSeconds(); if (xSeconds<10) {xSeconds = '0' + xSeconds;}
	var xTime = xHours + ':' + xMinutes + ':' + xSeconds
	return xTime;
} // End of localTime

function getKey (requestData) { // Start of getKey
  if (!requestData.key) { throw new Error('L19 Key missing'); }
  if (!requestData.kind) { throw new Error('L20 Kind missing'); }
  return dataStore.key([requestData.kind, requestData.key]);
} // End of getKey

exports.setValue = (req, res) => { // Start of setValue
  if (!req.body.value) { throw new Error('L25 Data missing. Example:\n' + dataExample1); }

  //set JSON content type and CORS headers for the response
  res.header('Content-Type','application/json');
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  
  const key = getKey(req.body);
  const entity = { key: key, data: req.body.value };

  return dataStore.save(entity)
    .then(() => res.status(200).send(`{"Result of Cloud Service":"Entity ${key.path.join('/')} saved.", "Time of Cloud Service":"${new Date()}", "Origin of Cloud Service":"${lessonURL}"}`))
    .catch((err) => {
      console.error(err);
      res.status(500).send(err.message);
      return Promise.reject(err);
    });
  
}; // End of setValue
