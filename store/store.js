var idGenerator = require('./id-generator')

var store = {
  directories: [
    {
      id: idGenerator.getNext(),
      name: 'root'
    }
  ],
  notices: []
}

module.exports = store
