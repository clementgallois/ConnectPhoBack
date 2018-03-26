const auth = require('./controllers/auth');
const lobby = require('./controllers/lobby');

const apiRoutes = (app, io) => {
  auth(app);
  lobby(io);
};

module.exports = apiRoutes;
