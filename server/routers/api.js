const router = require('koa-router')()
const userInfoController = require('./../controllers/user')
const userDynamicController = require('./../controllers/dynamic')
const movieController = require('./../controllers/movie')


const routers = router
	.all('/user/*', userInfoController.verifToken)
  .get('/user/wxlogin', userInfoController.wxLogin)
  .post('/user/loginUserInfo', userInfoController.loginUserInfo)
  .post('/user/upload', userDynamicController.upload)
  .post('/user/dynamic/save', userDynamicController.dynamicSave)
  .get('/user/dynamic/list', userDynamicController.dynamicList)
  .get('/movie', userInfoController.verifToken, movieController.movieList)
  .get('/movie/info', userInfoController.verifToken, movieController.movieInfo)

module.exports = routers