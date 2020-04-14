//以下模块在提供的初识化项目中包文件信息中加入了的，不用再次 npm install
// node-fetch node环境下的异步请求工具包 
import fetch from 'node-fetch';
//引入定义的 ids 模型
import Ids from '../models/ids'
//表单数据处理工具
import formidable from 'formidable'
//相对路径转换
import path from 'path'
//fs 文件操作包
import fs from 'fs'
//七牛云 图片上传到七牛云
import qiniu from 'qiniu'
//gm 图片处理包，可以实现图片裁剪，水印，创建图片等功能
import gm from 'gm'
//七牛云密钥
qiniu.conf.ACCESS_KEY = 'Ep714TDrVhrhZzV2VJJxDYgGHBAX-KmU1xV1SQdS';
qiniu.conf.SECRET_KEY = 'XNIW2dNffPBdaAhvm9dadBlJ-H6yyCTIJLxNM_N6';

//创建并导出一个 基类
export default class BaseComponent {
    //构造函数
	constructor(){
		//指定能操作的 id列表
		this.idList = ['restaurant_id', 'food_id', 'order_id', 'user_id', 'address_id', 'cart_id', 'img_id', 'category_id', 'item_id', 'sku_id', 'admin_id', 'statis_id'];
		//图片分类
        this.imgTypeList = ['shop', 'food', 'avatar','default'];
        //bind修改this 指向
		this.uploadImg = this.uploadImg.bind(this)
		this.qiniu = this.qiniu.bind(this)
    }
    //创建 fetch 方法
	async fetch(url = '', data = {}, type = 'GET', resType = 'JSON'){
		type = type.toUpperCase();
		resType = resType.toUpperCase();
		if (type == 'GET') {
			let dataStr = ''; //数据拼接字符串
			Object.keys(data).forEach(key => {
				dataStr += key + '=' + data[key] + '&';
			})

			if (dataStr !== '') {
				dataStr = dataStr.substr(0, dataStr.lastIndexOf('&'));
				url = url + '?' + dataStr;
			}
		}

		let requestConfig = {
			method: type,
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
		}

		if (type == 'POST') {
			Object.defineProperty(requestConfig, 'body', {
				value: JSON.stringify(data)
			})
		}
		let responseJson;
		try {
			const response = await fetch(url, requestConfig);
			if (resType === 'TEXT') {
				responseJson = await response.text();
			}else{
				responseJson = await response.json();
			}
		} catch (err) {
			console.log('获取http数据失败', err);
			throw new Error(err)
		}
		return responseJson
	}
	//获取id列表
	async getId(type){
		if (!this.idList.includes(type)) {
			console.log('id类型错误');
			throw new Error('id类型错误');
			return
		}
		try{
            const idData = await Ids.findOne();
            // ids img_id 自增1
			idData[type] ++ ;
			await idData.save();
			return idData[type]
		}catch(err){
			console.log('获取ID数据失败');
			throw new Error(err)
		}
	}
    //获取图片
	async uploadImg(req, res, next){
		const type = req.params.type;
		try{
			//const image_path = await this.qiniu(req, type);
			const image_path = await this.getPath(req, res);
			res.send({
				status: 1,
				image_path,
			})
		}catch(err){
			console.log('上传图片失败', err);
			res.send({
				status: 0,
				type: 'ERROR_UPLOAD_IMG',
				message: '上传图片失败'
			})
		}
	}

    //获取图片路径
	async getPath(req, res){
		return new Promise((resolve, reject) => {
			const form = formidable.IncomingForm();
			form.uploadDir = './public/img';
			form.parse(req, async (err, fields, files) => {
				let img_id;
				try{
					img_id = await this.getId('img_id');
				}catch(err){
					console.log('获取图片id失败');
					fs.unlinkSync(files.file.path);
					reject('获取图片id失败');
                }
                //定义一个 hash 图片名称，时间戳+随机数+图片 id
                const hashName = (new Date().getTime() + Math.ceil(Math.random()*10000)).toString(16) + img_id;
                //为了严谨性，验证图片名字是否重复
				const extname = path.extname(files.file.name);
				if (!['.jpg', '.jpeg', '.png'].includes(extname)) {
					fs.unlinkSync(files.file.path);
					res.send({
						status: 0,
						type: 'ERROR_EXTNAME',
						message: '文件格式错误'
					})
					reject('上传失败');
					return 
				}
				const fullName = hashName + extname;
				const repath = './public/img/' + fullName;
				try{
                    //图片重命名，并保存到./public/img/ 目录下
					fs.renameSync(files.file.path, repath);
					gm(repath)
					.resize(200, 200, "!")
					.write(repath, async (err) => {
						resolve(fullName)
					})
				}catch(err){
					console.log('保存图片失败', err);
					if (fs.existsSync(repath)) {
						fs.unlinkSync(repath);
					} else {
						fs.unlinkSync(files.file.path);
					}
					reject('保存图片失败')
				}
			});
		})
	}
    //图片保存到七牛云
	async qiniu(req, type = 'default'){
		return new Promise((resolve, reject) => {
			const form = formidable.IncomingForm();
			form.uploadDir = './public/img';
			form.parse(req, async (err, fields, files) => {
				let img_id;
				try{
                    //获取当前图片编号
					img_id = await this.getId('img_id');
				}catch(err){
					console.log('获取图片id失败');
					fs.unlinkSync(files.file.path);
					reject('获取图片id失败')
				}
				const hashName = (new Date().getTime() + Math.ceil(Math.random()*10000)).toString(16) + img_id;
				const extname = path.extname(files.file.name);
				const repath = './public/img/' + hashName + extname;
				try{
					const key = hashName + extname;
					await fs.rename(files.file.path, repath);
					const token = this.uptoken('node-elm', key);
					const qiniuImg = await this.uploadFile(token.toString(), key, repath);
					fs.unlinkSync(repath);
					resolve(qiniuImg)
				}catch(err){
					console.log('保存至七牛失败', err);
					fs.unlinkSync(files.file.path)
					reject('保存至七牛失败')
				}
			});

		})
    }
    //获取七牛云 token 令牌
	uptoken(bucket, key){
		var putPolicy = new qiniu.rs.PutPolicy(bucket+":"+key);
  		return putPolicy.token();
    }
    //上传
	uploadFile(uptoken, key, localFile){
		return new Promise((resolve, reject) => {
            var extra = new qiniu.io.PutExtra();
            //上传到七牛云
		    qiniu.io.putFile(uptoken, key, localFile, extra, function(err, ret) {
			    if(!err) {  
			    	resolve(ret.key)
			    } else {
			    	console.log('图片上传至七牛失败', err);
			    	reject(err)
			    }
		  	});

		})
	}	
}
