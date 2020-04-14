'use strict';
// captchapng 可以生产验证码图片
import captchapng from 'captchapng';

class Captchas {
	constructor(){

	}
	//验证码
	async getCaptchas(req, res, next){
        //随机四位数字
        const cap = parseInt(Math.random()*9000+1000);
        //创建验证码图片
    	const p = new captchapng(80,30, cap);
        p.color(0, 0, 0, 0); 
        p.color(80, 80, 80, 255);
        //转为 64位编码格式
        const base64 = p.getBase64();
        //向客户端发送一个验证码 cookie
        res.cookie('cap', cap, { maxAge: 300000, httpOnly: true });
        //返回一张 64位编码图片 给前端
        res.send({
            status: 1,
        	code: 'data:image/png;base64,' + base64
        });
	}
}
//创建实例
export default new Captchas()