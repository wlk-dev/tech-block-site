const withAuth = (req, res, next) => {
    console.log('here', req.session.logged_in)
    if(!req.session.logged_in) {
      res.redirect('/login')
    } else {
      next(); // this says just continue down the logic
    }
  };
  
  module.exports = withAuth;
  