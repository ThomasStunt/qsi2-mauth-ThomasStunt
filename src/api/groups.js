const express = require('express');

const logger = require('../logger.js');
const { createGroup, getAllGroups, addMember, removeMember } = require('../controller/groups');

const apiGroupsProtected = express.Router();

apiGroupsProtected.post('/', (req, res) =>
  !req.body.title || !req.body.Owner
  ? res.status(400).send({
      success: false,
      message: 'Title and ownerId required',
    })
  : createGroup(req.body)
    .then(group => {
      res.status(200).send({
        success: true,
        profile: group,
        message: 'group created',
      })
    })
    .catch(err => {
      logger.error(`💥 Failed to create group : ${err.stack}`);
      return res.status(500).send({
        success: false,
        message: `${err.name} : ${err.message}`
    })
  })
);

apiGroupsProtected.get('/', (req, res) =>
  getAllGroups()
    .then(list =>
      res.status(200).send({
        success: true,
        profile: list,
        message: 'groups available'
      })
    ).catch(err => {
      logger.error(`💥 Failed to get list of groups : ${err.stack}`);
      return res.status(500).send({
        success: false,
        message: `${err.name} : ${err.message}`,
      })
    })
);

apiGroupsProtected.post('/member', (req, res) =>
  !req.body.groupId || !req.body.userId
  ? res.status(400).send({
      success: false,
      message: 'Group Id and User Id required'
    })
  : addMember(req.body)
    .then(() => {
      res.status(200).send({
        success: true,
        message: 'user was added to the group',
      })
    })
    .catch(err => {
      logger.error(`💥 Failed to add member to group : ${err.stack}`);
      return res.status(500).send({
        success: false,
        message: `${err.name} : ${err.message}`,
      })
    })
);

apiGroupsProtected.delete('/member', (req, res) =>
  !req.body.groupId || !req.body.userId
  ? res.status(400).send({
      success: false,
      message: 'Group Id and User Id required'
    })
  : removeMember(req.body)
    .then(() => {
      res.status(200).send({
        success: true,
        message: 'user was removed from the group'
      })
    })
    .catch(err => {
      logger.error(`💥 Failed to remove member from group : ${err.stack}`);
      return res.status(500).send({
        success: false,
        message: `${err.name} : ${err.message}`,
      })
    })
);

module.exports = { apiGroupsProtected };
