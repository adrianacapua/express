const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');

const sessionRouter = require('./src/routers/sessionsRouter');
const adminRouter = require('./src/routers/adminRouter');
const authRouter = require('./src/routers/authRouter');

const PORT = process.env.PORT || 3000;
const app = express();

// middlewares
app.use(express.static(path.join(__dirname, '/public/')));
app.use(express.json()); // body parser
app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser);
app.use(session( { 
    secret: 'globomantics',
    resave: true,
    saveUninitialized: true
}));

require('./src/config/passport.js')(app);

app.set('views', './src/views');
app.set('view engine', 'ejs');

// routes
app.use('/sessions', sessionRouter);
app.use('/admin', adminRouter);
app.use('/auth', authRouter);

app.get('/', (req, res) => {
    res.render('index', { title: 'Welcome to Globomantics', data: ['a', 'b', 'c'] });
});

app.listen(3000, () => {
    console.log('Listening on port 3000');
})
