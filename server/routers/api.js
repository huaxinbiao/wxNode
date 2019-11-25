const router = require('koa-router')()
const userInfoController = require('./../controllers/user')


const routers = router
	.all('*', userInfoController.verifToken)
  .get('/user/wxlogin', userInfoController.wxLogin)
  .post('/user/loginUserInfo', userInfoController.loginUserInfo)
  .get('/dynamic/list', userInfoController.dynamicList)

module.exports = routers