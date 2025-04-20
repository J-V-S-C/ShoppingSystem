require('dotenv').config();
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session'); 

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var loginRouter = require('./routes/login');
var postsRouter = require('./routes/post');
var registerRouter = require("./routes/register");
var itensRouter = require("./routes/itens")
var cartRouter = require('./routes/cart')
var categoriasRouter = require('./routes/categorias');

var app = express();

app.use(cookieParser());
app.use(session({
  secret: 'oçefoisçfoisngfksldnfpnseifsldkmfpsnefvslmvopsejfsnegsoiegnsoinegosnoiw083h0290249-nq03inw0ifnsoeifnaspibguebgrdu9sbgr9a-çbegr9-8bq4g8-9sakpdjngaiubdrgaubr9b429bse',   
  resave: false,                
  saveUninitialized: true,      
  cookie: { secure: false }     
}));


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use((req, res, next) => {
  res.locals.usuario = req.usuario;
  res.locals.session = req.session;
  next();
});

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/login', loginRouter);
app.use('/posts', postsRouter);
app.use('/register', registerRouter)
app.use('/itens', itensRouter)
app.use('/cart', cartRouter)
app.use('/categorias', categoriasRouter)

app.use(function (req, res, next) {
  next(createError(404));
});

app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
