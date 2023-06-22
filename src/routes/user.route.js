const {
  UserIndex,
  userCreate,
  userFindById,
  userDelete,
  userUpdate,
} = require('../handler/user.handler');

const userRoute = [
  {
    method: 'GET',
    path: '/user',
    handler: UserIndex,
  },
  {
    method: 'GET',
    path: '/user/{id}',
    handler: userFindById,
  },
  {
    method: 'POST',
    path: '/user',
    handler: userCreate,
  },
  {
    method: 'DELETE',
    path: '/user/{uuid}',
    handler: userDelete,
  },
  {
    method: 'PUT',
    path: '/user/{id}',
    handler: userUpdate,
  },
];
module.exports = userRoute;
