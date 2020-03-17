const { google } = require('googleapis');
// this is the file we download after creating credentials
const key = require('../keys.json');
// client gets passed as an argument
const gsrun = async cl => {
  try {
    const gsapi = google.sheets({
      version: 'v4',
      auth: cl
    });
    const opt = {
      // found in the url of the google sheet you wish to pull from
      spreadsheetId: '1BXL2Z04IzC1heJpruHD7xZLZEx8hVHwns0LK99tvovU',
      // specify start / end block
      // visit https://developers.google.com/sheets/api/reference/rest/v4/spreadsheets.values/get for more info
      range: 'A2:C20'
    };
    // response the api provides of our connected spreadsheet after specifying exactly what we want
    const res = await gsapi.spreadsheets.values.get(opt);
    let data;
    data = res.data;
    return data;
  } catch (e) {
    throw Error(
      `The gsrun async function under api.js ran into a problem. Error: ${e}`
    );
  }
};
// middleware fuction that handles authenticating our spreadsheet with the credentials we created and downloaded
const link = async (req, res, next) => {
  const client = new google.auth.JWT(key.client_email, null, key.private_key, [
    'https://www.googleapis.com/auth/spreadsheets'
  ]);
  // check to see if client email matches the email shared in spreadsheet (that we made in 'create credentials')
  client.authorize(async (err, tokens) => {
    if (err) {
      console.log(err);
      return;
    } else {
      console.log('Connected!');
      // everything looks good so now we run the function on top passing our credential info
      const response = await gsrun(client);
      // storing our response object to access later on
      // visit https://expressjs.com/en/api.html to learn more about res.locals / Express
      res.locals.data = response;
      // next just directs are backend to the next piece of middleware
      // middleware is just a command thats being fired / ran
      next();
    }
  });
};
// exporting this to another file (server.js)
module.exports = link;
