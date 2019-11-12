const router = require('koa-router')()
const userInfoController = require('./../controllers/user')

const routers = router
  .get('/user/userInfo', userInfoController.getLoginUserInfo)
  // .post('/user/login', userInfoController.signIn)

module.exports = routers