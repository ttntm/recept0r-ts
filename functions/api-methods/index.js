const Create = require('./create')
const Read = require('./read')
const ReadAll = require('./readAll')
const ReadUser = require('./readUser')
const Update = require('./update')
const Delete = require('./delete')

module.exports = {
  create: Create,
  read: Read,
  readAll: ReadAll,
  readUser: ReadUser,
  update: Update,
  delete: Delete
}