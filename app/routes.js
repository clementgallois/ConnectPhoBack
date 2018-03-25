const auth = require('./controllers/auth');

const apiRoutes = (app) => {
  auth(app);
};

module.exports = apiRoutes;
