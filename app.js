import express from 'express';
//自动读取 config 文件加配置
import config from 'config-lite';
//cookie 处理中间件
import cookieParser from 'cookie-parser'
//数据库保存 session ,防止服务器问题导致用户异常，购物车 sig 保证
import session from 'express-session';
//连接 mongodb 驱动
import connectMongo from 'connect-mongo';
//connect-history-api-fallback 处理单页应用通过地址改变前端路由导致 404 的问题
import history from 'connect-history-api-fallback';
//chalk 终端输入优化，指定终端输出文字 颜色，方便查看运行情况
import chalk from 'chalk';

//引入db 连接数据库
import './mongodb/db.js'
import './models/test_db.js'

const app = express();

//配置请求头信息
app.all('*', (req, res, next) => {
  const { origin, Origin, referer, Referer } = req.headers;
  const allowOrigin = origin || Origin || referer || Referer || '*';
    res.header("Access-Control-Allow-Origin", allowOrigin);
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Credentials", true); //可以带cookies
    res.header("X-Powered-By", 'Express');
    if (req.method == 'OPTIONS') {
      res.sendStatus(200);
    } else {
    next();
    }
});

//引入中间件处理 cookie
app.use(cookieParser());

const MongoStore = connectMongo(session);
// 将session保存到mongodb中
app.use(session({
  name: config.session.name,
    secret: config.session.secret,
    resave: true,
    saveUninitialized: false,
    cookie: config.session.cookie,
    store: new MongoStore({
      url: config.url
    })
}))
//辅助前端路由重定向到根路由
app.use(history());
app.use(express.static('./public'));
//应用运行端口
app.listen(config.port, () => {
    console.log(
        chalk.green(`成功监听端口：${config.port}`)
    )
});