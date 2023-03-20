var express = require('express')
  , bodyParser = require('body-parser')
  , chalk = require('chalk')
  , cors = require('cors')
  , app = express()
  , directoriesRouter = require('./routes/directories')
  , noticesRouter = require('./routes/notices')

app.use(cors())
app.use(express.static('public'))
app.use(bodyParser.json())

app.get('/', function (req, res) {
  res.sendFile('index.html', { root: 'public' })
})

app.use('/directories', directoriesRouter)
app.use('/notices', noticesRouter)

var server = app.listen(4000, function () {
  var port = server.address().port
  console.log('Server for course started at %s port', chalk.green(port))
})
