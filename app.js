const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const cors = require('cors');

const productsRoute = require('./routes/productsRoutes');
const usersRoute = require('./routes/usersRoutes');
const app = express();

app.use(morgan('dev'));

app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser());

app.use('/api/v1/products', productsRoute);
app.use(usersRoute);
app.all('*', (req, res, next) => {
  let url = req.originalUrl;
  res.status(404).json({
    status: 'error',
    error: `cant find ${url} on this server`,
  });
});

app.use((err, req, res, next) => {
  res.status(err.statusCode || 500).json({
    status: 'error',
    error: err.message,
  });
});
module.exports = app;
