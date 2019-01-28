const express = require('express');

const logger = require('../logger.js');
const { createGroup } = require('../controller/groups');

const apiUsersProtected = express.Router();

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
          });
        })
        .catch(err => {
          logger.error(`💥 Failed to create group : ${err.stack}`);
          return res.status(500).send({
            success: false,
            message: `${err.name} : ${err.message}`,
          });
        })
);
