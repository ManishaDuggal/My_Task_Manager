const express = require('express');
const passportSetup = require('./config/passport-setup');
var cookieParser = require('cookie-parser');
var session = require('express-session');
const app = express();
app.set('view engine','ejs');
app.use(cookieParser());
app.use(session({secret: "Shh, its a secret!",resave:false,saveUninitialized:false,cookie:{maxAge:1000*24*60*60}}));
const passport = require('passport');
app.use(passport.initialize());
app.use(passport.session());

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static('public'));



const authRoutes = require('./routes/auth-routes');
const profileRoutes = require('./routes/profile-routes');
const signupRoutes = require('./routes/signup-routes');
const taskRoutes = require('./routes/task-routes');
const labelRoutes = require('./routes/label-routes');
const passwordRoutes = require('./routes/password-routes');
// set view engine
app.set('view engine', 'ejs');

// set up routes
app.use('/auth', authRoutes);
app.use('/profile', profileRoutes);
app.use('/signup', signupRoutes);
app.use('/label', labelRoutes);
app.use('/task', taskRoutes);
app.use('/changepassword',passwordRoutes)


app.listen(3000,() => {
    console.log('app now listening for requests on port 3000');
});
