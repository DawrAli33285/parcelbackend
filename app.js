const express = require('express')
const cors = require('cors');

const app = express()
const adminroutes=require('./routes/admin/admin')
app.use(cors());
// webhooks
app.use('/api/webhook', require('./routes/v1/webhook'))

// middlewares
app.use(require('./middlewares'))
// routes
app.use('/api/v1', require('./routes/v1'))
app.use(adminroutes)

// error handler
app.use(require('./errorHandler'))

// 404
app.use((req, res) => res.status(404).end())

module.exports = app
