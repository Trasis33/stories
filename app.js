const path = require('path')

const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv').config({ path: './config/config.env' }) // eslint-disable-line no-unused-vars
const morgan = require('morgan')
const hbs = require('express-handlebars')
const methodOverride = require('method-override')
const passport = require('passport')
const session = require('express-session')
const SessionStore = require('connect-mongo')(session)
const connectDB = require('./config/db')

// passport
require('./config/passport')(passport)

connectDB()

const app = express()

app.use(express.urlencoded({ extended: false }))

// method override for PUT
app.use(
  methodOverride((req, res) => {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
      let method = req.body._method
      delete req.body._method
      return method
    }
  })
)

// logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

const { formatDate, truncate, stripTags, editIcon, select } = require('./helpers/hbs')

// template engine
app.engine(
  '.hbs',
  hbs({ helpers: { formatDate, truncate, stripTags, editIcon, select }, defaultLayout: 'main', extname: '.hbs' })
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

// global var for access to logged in user in templates
app.use((req, res, next) => {
  res.locals.user = req.user || null
  next()
})

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
