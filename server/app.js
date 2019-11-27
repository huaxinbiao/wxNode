const Koa = require('koa')
const path = require('path')
const static = require('koa-static')
const koaBody = require('koa-body')
const bodyParser = require('koa-bodyparser')
const routers = require('./routers/index')

const app = new Koa()

// 静态资源目录对于相对入口文件index.js的路径
const staticPath = './static'

app.use(static(
  path.join( __dirname,  staticPath)
))
// 文件上传
app.use(koaBody({
	multipart: true,
	formidable:  {
		maxFileSize: 20*1024*1024    // 设置上传文件大小最大限制，默认2M
	}
}))
// 路由参数
app.use(bodyParser())
// 初始化路由中间件
app.use(routers.routes()).use(routers.allowedMethods())

app.listen(3000, () => {
  console.log('[demo] static-use-middleware is starting at port 3000')
})