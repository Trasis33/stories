const path = require('path')

const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv').config({ path: './config/config.env' }) // eslint-disable-line no-unused-vars
const morgan = require('morgan')
const hbs = require('express-handlebars')
const passport = require('passport')
const session = require('express-session')
const SessionStore = require('connect-mongo')(session)
const connectDB = require('./config/db')

// passport
require('./config/passport')(passport)

connectDB()

const app = express()

app.use(express.urlencoded({ extended: false }))

// logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

const { formatDate } = require('./helpers/hbs')

// template engine
app.engine(
  '.hbs',
  hbs({ helpers: { formatDate }, defaultLayout: 'main', extname: '.hbs' })
)
app.set('view engine', '.hbs')

// session
app.use(
  session({
    secret: 'cat keyboard',
    resave: false,
    saveUninitialized: false,
    store: new SessionStore({ mongooseConnection: mongoose.connection })
  })
)

// passport middleware
app.use(passport.initialize())
app.use(passport.session())

// static folder
app.use(express.static(path.join(__dirname, 'public')))

// routes
app.use('/', require('./routes/index'))
app.use('/auth', require('./routes/auth'))
app.use('/stories', require('./routes/stories'))

const PORT = process.env.PORT || 3000

app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
)
