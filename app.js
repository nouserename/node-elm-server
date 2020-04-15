import express from 'express';
import './mongodb/db.js';
import config from 'config-lite';
//引入路由配置文件
import router from './routes/index.js';
import cookieParser from 'cookie-parser'
import session from 'express-session';
import connectMongo from 'connect-mongo';
import path from 'path';
import history from 'connect-history-api-fallback';
import chalk from 'chalk';

const app = express();

app.all('*', (req, res, next) => {
  const { origin, Origin, referer, Referer } = req.headers;
  const allowOrigin = origin || Origin || referer || Referer || '*';
    res.header("Access-Control-Allow-Origin", allowOrigin);
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");//请求方式
    res.header("Access-Control-Allow-Credentials", true); //可以带cookies
    res.header("X-Powered-By", 'Express');
    if (req.method == 'OPTIONS') {
      res.sendStatus(200);
    } else {
    next();
    }
});

const MongoStore = connectMongo(session);
app.use(cookieParser());
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

//路由注册

router(app);


app.use(history());
app.use(express.static('./public'));
app.listen(config.port, () => {
    console.log(
        chalk.green(`成功监听端口：${config.port}`)
    )
});