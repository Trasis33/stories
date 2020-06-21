const express = require('express')
const dotenv = require('dotenv').config({ path: './config/config.env' }) // eslint-disable-line no-unused-vars
const morgan = require('morgan')
const hbs = require('express-handlebars')
const connectDB = require('./config/db')

connectDB()

const app = express()

// logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

// template engine
app.engine('.hbs', hbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', '.hbs')

// routes
app.use('/', require('./routes/index'))

const PORT = process.env.PORT || 3000

app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`))
