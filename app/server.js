const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
// cors lets two servers talk to one another (Client/Frontend with App/Backend)
const cors = require('cors');
const path = require('path');
// api function being imported
const link = require('./services/api');

const PORT = process.env.PORT || 3001;

const app = express();
const router = express.Router();

app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/', express.static(path.join(`${__dirname}/dist/public`)));
app.use('/', router);
app.use(cors());

app.use('*', (err, req, res, next) => {
  res.status(400).json({
    error: err,
    message: err.message
  });
});

app.use((err, req, res, next) => {
  res.status(500).json({
    error: err,
    message: err.message
  });
});

const handle404 = (err, req, res, next) => {
  console.log(err);
  res.sendStatus(404);
};

app.listen(PORT, () => {
  console.log(`Standby on PORT:${PORT}, in ${app.get('env')} mode.`);
});
// specifying what will happen once a certain action is made under the indicated url/path
// once a GET request in made to '/', the link function triggers
// we use res.locals.data to access that stored info in order to wrap it in an object ready to send
// if you want to make sure your data is accurate before sending
// type your backend url in your browser, in this case 'http://localhost:3001'
// what you should see is the response object we display with the line below
router.get('/', link, (req, res) => res.json({ data: res.locals.data }));
// from here go to 'client/src/services/api' to follow along the flow of data thats being passed
router.use(handle404);
