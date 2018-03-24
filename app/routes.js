const auth = require('./controllers/auth');

const apiRoutes = (app, io) => {
  auth(app);
};

module.exports = apiRoutes;
