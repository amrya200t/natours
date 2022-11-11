const path = require('path');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const viewRouter = require('./routes/viewRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const bookingRouter = require('./routes/bookingRoutes');

const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

//* 1) GLOBAL MIDDLEWAREs
//? Implement CORS
app.use(
  cors({
    credentials: true,
    origin: 'http://localhost:8000/',
  })
);

app.options('*', cors());
app.options('/api/v1/tours/:id', cors());

//? Serving Static Files
app.use(express.static(path.join(__dirname, 'public')));

//? SET: Security HTTP headers
// app.use(helmet());
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'", 'data:', 'blob:', 'https:', 'ws:'],
        baseUri: ["'self'"],
        fontSrc: ["'self'", 'https:', 'data:'],
        scriptSrc: [
          "'self'",
          'https:',
          'http:',
          'blob:',
          'https://*.mapbox.com',
          'https://*.cloudflare.com',
          'https://m.stripe.network',
          'https://*.stripe.com',
        ],
        frameSrc: ["'self'", 'https://*.stripe.com'],
        objectSrc: ["'none'"],
        styleSrc: ["'self'", 'https:', "'unsafe-inline'"],
        workerSrc: [
          "'self'",
          'data:',
          'blob:',
          'https://*.tiles.mapbox.com',
          'https://api.mapbox.com',
          'https://events.mapbox.com',
          'https://m.stripe.network',
        ],
        childSrc: ["'self'", 'blob:'],
        imgSrc: ["'self'", 'data:', 'blob:', 'https://*.stripe.com'],
        formAction: ["'self'"],
        connectSrc: [
          "'self'",
          "'unsafe-inline'",
          'data:',
          'blob:',
          // 'wss://<HEROKU-SUBDOMAIN>.herokuapp.com:<PORT>/',
          'https://*.stripe.com',
          'https://*.mapbox.com',
          'https://*.cloudflare.com/',
          'https://bundle.js:*',
          'ws://localhost:*/',
          'https://checkout.stripe.com',
        ],
        upgradeInsecureRequests: [],
      },
    },
  })
);

//? Development Logging
// app.use(morgan('combined'));
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

//? Limit requests from same API
const limiter = rateLimit({
  max: 100, // 100 request
  windowMs: 60 * 60 * 1000, // 1 Hour
  message: 'Too many requests form this IP, please try again in an hour!',
});
app.use('/api', limiter);

//? Body parse, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
// Parse data from a url encoded form => eg: HTML Form.
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

//? Data Sanitization against NoSQL query injection.
app.use(mongoSanitize());

//? Data Sanitization against XSS
app.use(xss());

//? Prevent Parameter Pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'price',
      'maxGroupSize',
      'difficulty',
    ],
  })
);

//? Test Middleware
app.use((req, res, next) => {
  // eslint-disable-next-line no-console
  console.log('Hello from the middleware %c(⊙ˍ⊙)', 'color:#ff5722');
  next();
});
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.cookies);
  next();
});

//////////////////////////////////////////////////////////////
//* ROUTES
//! WEBSITE ROUTES
app.use('/', viewRouter);

//! API ROUTES
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/bookings', bookingRouter);

app.all('*', (req, res, next) => {
  // const err = new Error(`Can not find ${req.originalUrl} on this server!`);
  // err.statusCode = 404;
  // err.status = 'fail';

  next(new AppError(`Can not find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

//////////////////////////////////////////////////////////////
module.exports = app;
