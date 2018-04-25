const express = require('express');
const app = express();
const morgan = require('morgan');
const errorHandler = require('./util/error-handler');

app.use(express.json());
app.use(morgan('dev'));

const auth = require('./routes/auth');
const actors = require('./routes/actors');
const films = require('./routes/films');
const reviews = require('./routes/reviews');
const reviewers = require('./routes/reviewers');
const studios = require('./routes/studios');

app.use('/auth', auth);
app.use('/actors', actors);
app.use('/films', films);
app.use('/reviews', reviews);
app.use('/reviewers', reviewers);
app.use('/studios', studios);

app.use(errorHandler());

module.exports = app;