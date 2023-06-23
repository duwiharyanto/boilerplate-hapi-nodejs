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
    options: {
      payload: {
        output: 'file',
        parse: true,
        allow: 'multipart/form-data',
        maxBytes: 1024 * 1024 * 10, // Batasan ukuran file (10MB dalam contoh ini)
        multipart: true,
      },
    },
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
