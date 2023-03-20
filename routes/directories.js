var express = require('express')
  , _ = require('lodash')
  , router = express.Router()
  , store = require('./../store/store')
  , idGenerator = require('./../store/id-generator')


const getDeletedIds = (id, directories, notices) => {
  let deletedIds = [id];
  _.each(directories, directory => {
    if (directory.parentId === id) {
      deletedIds = deletedIds.concat(getDeletedIds(directory.id, directories));
    }
  });
  return deletedIds;
};
  
const removeDirectories = (id, directories, notices) => {
  const deletedDirIds = getDeletedIds(id, directories);
  const updatedDirectories = _.reject(directories, directory => _.indexOf(deletedDirIds, directory.id) !== -1);
  const updatedNotices = _.reject(notices, notice => _.indexOf(deletedDirIds, notice.directoryId) !== -1);
  return { updatedDirectories, updatedNotices };
};

router
  .get('/', function (req, res) {
    res.send(store.directories)
  })
  .post('/', function (req, res) {
    var directory = _.pick(req.body, [
          'parentId',
          'name'
        ]
      )
      , parent = _.find(store.directories, function (dir) {
        return dir.id == directory.parentId
      })

    if (parent) {
      _.assign(directory, { id: idGenerator.getNext() })
      store.directories.push(directory)

      res.send(directory)
    } else {
      res.status(500).send('no parent')
    }
  })
  .put('/:id', function (req, res) {
    var directory = _.pick(req.body, [
          'id',
          'parentId',
          'name'
        ]
      )
      , oldEntityIndex = _.findIndex(store.directories, function (dir) {
        return dir.id == req.params.id
      })

    if (oldEntityIndex !== -1) {
      store.directories.splice(oldEntityIndex, 1, directory)
      res.send(directory)
    } else {
      res.status(500).send('no entity')
    }
  })
  .delete('/:id', function (req, res) {
    var directoryId = Number(req.params.id);

    if (directoryId == 1) {
      res.status(500).send('can not remove root directory');
      return;
    }

    try {
      const { updatedDirectories, updatedNotices } = removeDirectories(directoryId, store.directories, store.notices);
      if (updatedDirectories.length === store.directories.length) {
        throw new Error('No such directory!');
      }
      store.directories = updatedDirectories;
      store.notices = updatedNotices;
      res.sendStatus(200);
    } catch (ex) {
      res.status(500).send('no entity');
    }
  })

module.exports = router
