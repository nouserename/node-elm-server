//引入安装好的 mongoose
import mongoose from 'mongoose';
//引入配置管理包 config-lite 会自动访问 config文件中的配置
import config from 'config-lite';
//引入 chalk，终端提示文字颜色区别
import chalk from 'chalk';
//连接数据库

// config 文件夹下的 default.js 

// module.exports = {
// 	port: parseInt(process.env.PORT, 10) || 8888,
// 	url: 'mongodb://localhost:27017/elm',
// 	session: {
// 		name: 'SID',
// 		secret: 'SID',
// 		cookie: {
// 			httpOnly: true,
// 	    secure:   false,
// 	    maxAge:   365 * 24 * 60 * 60 * 1000,
// 		}
// 	}
// }
mongoose.connect(config.url, {useMongoClient:true});
mongoose.Promise = global.Promise;
//连接数据库，抛出游标
const db = mongoose.connection;

db.once('open' ,() => {
    //终端打印绿色的提示信息
	console.log(
    chalk.green('连接数据库成功')
  );
})

db.on('error', function(error) {
    //打印红色的错误提示信息
    console.error(
      chalk.red('Error in MongoDb connection: ' + error)
    );
    mongoose.disconnect();
});

db.on('close', function() {
    console.log(
      chalk.red('数据库断开，重新连接数据库')
    );
    mongoose.connect(config.url, {server:{auto_reconnect:true}});
});


export default db;
