const express = require('express');
const { apiUsers, apiUsersProtected } = require('./users');
const { isAuthenticated, initAuth } = require('../controller/auth');
const { apiGroupsProtected } = require('./groups');
// create an express Application for our api
const api = express();
initAuth();

// apply a middelware to parse application/json body
api.use(express.json({ limit: '1mb' }));
api.use(helmet());
api.use(hpp());
api.use(enforce.HTTPS({ trustProtoHeader: true }));
// create an express router that will be mount at the root of the api
const apiRoutes = express.Router();
apiRoutes
  // test api
  .get('/', (req, res) =>
    res.status(200).send({ message: 'hello from my api' })
  )
  // connect api users router
  .use('/users', apiUsers)
  // api bellow this middelware require Authorization
  .use(isAuthenticated)
  .use('/users', apiUsersProtected)
  .use('/groups', apiGroupsProtected)
  .use((err, req, res, next) => {
    res.status(403).send({
      success: false,
      message: `${err.name} : ${err.message}`,
    });
    next();
  });

// root of our API will be http://localhost:5000/api/v1
api.use('/api/v1', apiRoutes);
module.exports = api;
