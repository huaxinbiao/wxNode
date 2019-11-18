const Koa = require('koa')
const path = require('path')
const static = require('koa-static')
const bodyParser = require('koa-bodyparser');
const routers = require('./routers/index')

const app = new Koa()

// 静态资源目录对于相对入口文件index.js的路径
const staticPath = './static'

app.use(static(
  path.join( __dirname,  staticPath)
))

app.use(bodyParser())
// 初始化路由中间件
app.use(routers.routes()).use(routers.allowedMethods())

app.listen(3000, () => {
  console.log('[demo] static-use-middleware is starting at port 3000')
})