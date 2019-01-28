const { Groups } = require('../model');

const createGroup = ({ title, description, metaData, Owner }) =>
  Groups.create({
    title,
    description,
    metaData,
    ownerId: Owner
  });
