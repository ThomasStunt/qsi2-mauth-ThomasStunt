const { Groups } = require('../model');

const createGroup = ({ title, description, metaData, Owner }) =>
  Groups.create({
    title,
    description,
    metaData,
    ownerId: Owner
  });

const getAllGroups = () => Groups.findAll();

const addMember = ({ groupId, userId }) =>
  Groups.findOne({
    where: { id: groupId }
  }).then(g =>
    g.id ? g.addUser(userId) : Promise.reject('UNKNOWN OR DELETED GROUP')
  );

const removeMember = ({ groupId, userId }) =>
  Groups.findOne({
    where: { id: groupId }
  }).then(g =>
    g.id ? g.removeUser(userId) : Promise.reject('UNKNOWN OR DELETED GROUP')
  );

const getPosts = ({ groupId, userId }) =>
  Groups.findOne(
    { where: { id: groupId }},
    { attributes: 'metadata'}
  )

module.exports = { createGroup, getAllGroups, addMember, removeMember, getPosts }
