const routes = [
  {
    method: 'GET',
    path: '/',
    handler: (request, h) => h.response('Svc Boilerplate HAPI Framework'),
  },
];
module.exports = routes;
