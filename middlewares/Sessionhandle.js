module.exports={
  verifyAdminLoggedIn:(req, res, next) => {
    if (req.session.login) {
      res.redirect('/admin')
    } else {
      next()
    }
  },
  verifyAdminLoggedOut:(req, res, next) => {
    if (req.session.login) {
      next()
    } else {
      res.redirect('/admin/login')
    }
  },
}