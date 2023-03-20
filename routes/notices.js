var express = require('express')
  , _ = require('lodash')
  , router = express.Router()
  , store = require('./../store/store')
  , idGenerator = require('./../store/id-generator')

router
  .get('/', function (req, res) {
    res.send(store.notices)
  })
  .post('/', function (req, res) {
    var notice = _.pick(req.body, [
          'directoryId',
          'title',
          'description',
          'tags'
        ]
      )
      , directory = _.find(store.directories, function (dir) {
        return dir.id == notice.directoryId
      })
      , position = _.filter(store.notices, function (not) {
        return not.directoryId == notice.directoryId
      }).length

    if (directory) {
      _.assign(notice, { id: idGenerator.getNext(), position: position })

      store.notices.push(notice)
      res.send(notice)
    } else {
      res.status(500).send('no directory')
    }
  })
  .put('/:id', function (req, res) {
    var notice = _.pick(req.body, [
          'id',
          'directoryId',
          'position',
          'title',
          'description',
          'tags'
        ]
      )
      , oldEntityIndex = _.findIndex(store.notices, function (not) {
        return not.id == req.params.id
      })

    if (oldEntityIndex !== -1) {
      store.notices.splice(oldEntityIndex, 1, notice)
      res.send(notice)
    } else {
      res.status(500).send('no entity')
    }
  })
  .delete('/:id', function (req, res) {
    var entityIndex = _.findIndex(store.notices, function (not) {
        return not.id == req.params.id
      })
      , notice = store.notices[entityIndex]
      , tmpPosition = 0
    
    _.each(store.notices, function (not) {
      if (not.directoryId == notice.directoryId && not.id != notice.id) {
        not.position = tmpPosition++;
      }
    })

    if (entityIndex !== -1) {
      store.notices.splice(entityIndex, 1)
      res.send(notice)
    } else {
      res.status(500).send('no entity')
    }
  })

module.exports = router
