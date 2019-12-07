const router = require('koa-router')()
const userInfoController = require('./../controllers/user')
const userDynamicController = require('./../controllers/dynamic')


const routers = router
	.all('*', userInfoController.verifToken)
  .get('/user/wxlogin', userInfoController.wxLogin)
  .post('/user/loginUserInfo', userInfoController.loginUserInfo)
  .post('/upload', userDynamicController.upload)
  .post('/dynamic/save', userDynamicController.dynamicSave)
  .get('/dynamic/list', userDynamicController.dynamicList)

module.exports = routers