
'use strict';
//引入地址工具
import AddressComponent from '../../prototype/addressComponent'
//formidable处理前端传回的表单数据
import formidable from 'formidable'
//引入用户信息 模型
import UserInfoModel from '../../models/v2/userInfo'
//引入用户模型，保存账号密码，基础信息
import UserModel from '../../models/v2/user'
//密码库，用于加密密码
import crypto from 'crypto'
//时间格式化包
import dtime from 'time-formater'

class User extends AddressComponent {
    constructor(){
        super()
        this.login = this.login.bind(this);
        this.encryption = this.encryption.bind(this);
        this.chanegPassword = this.chanegPassword.bind(this);
        this.updateAvatar = this.updateAvatar.bind(this);
    }
    //登录处理
    async login(req, res, next){
        const cap = req.cookies.cap;
        if (!cap) {
            console.log('验证码失效')
            res.send({
                status: 0,
                type: 'ERROR_CAPTCHA',
                message: '验证码失效',
            })
            return
        }
        //表单数据处理
        const form = new formidable.IncomingForm();
        form.parse(req, async (err, fields, files) => {
            const {username, password, captcha_code} = fields;
            try{
                if (!username) {
                    throw new Error('用户名参数错误');
                }else if(!password){
                    throw new Error('密码参数错误');
                }else if(!captcha_code){
                    throw new Error('验证码参数错误');
                }
            }catch(err){
                console.log('登录参数错误', err);
                res.send({
                    status: 0,
                    type: 'ERROR_QUERY',
                    message: err.message,
                })
                return
            }
            if (cap.toString() !== captcha_code.toString()) {
                res.send({
                    status: 0,
                    type: 'ERROR_CAPTCHA',
                    message: '验证码不正确',
                })
                return
            }
            //密码加密
            const newpassword = this.encryption(password);
            try{
                const user = await UserModel.findOne({username});
                //创建一个新的用户
                if (!user) {
                    //生成基础信息
                    const user_id = await this.getId('user_id');
                    //获取地址
                    const cityInfo = await this.guessPosition(req);
                    //生成注册时间
                    const registe_time = dtime().format('YYYY-MM-DD HH:mm');
                    //用户基础数据
                    const newUser = {username, password: newpassword, user_id};
                    //用户其他数据
                    const newUserInfo = {username, user_id, id: user_id, city: cityInfo.city, registe_time, };
                    //数据添加进集合
                    UserModel.create(newUser);
                    const createUser = new UserInfoModel(newUserInfo);
                    const userinfo = await createUser.save();
                    req.session.user_id = user_id;
                    res.send(userinfo);
                }else if (user.password.toString() !== newpassword.toString()) {
                    console.log('用户登录密码错误')
                    res.send({
                        status: 0,
                        type: 'ERROR_PASSWORD',
                        message: '密码错误',
                    })
                    return 
                }else{
                    req.session.user_id = user.user_id;
                    const userinfo = await UserInfoModel.findOne({user_id: user.user_id}, '-_id');
                    res.send(userinfo) 
                }
            }catch(err){
                console.log('用户登录失败', err);
                res.send({
                    status: 0,
                    type: 'SAVE_USER_FAILED',
                    message: '登录失败',
                })
            }
        })
    }
    //获取用户信息
    // 牵涉到注册登录，必定会涉及 session 和 cookie，根据 cookie 或 session ,处理用户数据库操作或者登录维持等。在这里我们有购物车这种比较严谨的场景，我们就使用 mongodb 将 session 保存到数据库中，防止服务器问题，导致用户信息异常。app.js 我们初始化项目就已经配置好了
    /**
     * const MongoStore = connectMongo(session);
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
     * 
     * **/
    async getInfo(req, res, next){
        const sid = req.session.user_id;
        const qid = req.query.user_id;
        //用户请求 user_id 与服务器 session一致
        const user_id = sid || qid;
        if (!user_id || !Number(user_id)) {
            // console.log('获取用户信息的参数user_id无效', user_id)
            res.send({
                status: 0,
                type: 'GET_USER_INFO_FAIELD',
                message: '通过session获取用户信息失败',
            })
            return 
        }
        try{
            //根据user_id 查找。并返回用户信息。
            const userinfo = await UserInfoModel.findOne({user_id}, '-_id');
            res.send(userinfo) 
        }catch(err){
            console.log('通过session获取用户信息失败', err);
            res.send({
                status: 0,
                type: 'GET_USER_INFO_FAIELD',
                message: '通过session获取用户信息失败',
            })
        }
    }
    //通过 user_id ，查询用户信息
    async getInfoById(req, res, next){
        const user_id = req.params.user_id;
        if (!user_id || !Number(user_id)) {
            console.log('通过ID获取用户信息失败')
            res.send({
                status: 0,
                type: 'GET_USER_INFO_FAIELD',
                message: '通过用户ID获取用户信息失败',
            })
            return 
        }
        try{
            const userinfo = await UserInfoModel.findOne({user_id}, '-_id');
            //返回用户信息
            res.send(userinfo) 
        }catch(err){
            console.log('通过用户ID获取用户信息失败', err);
            res.send({
                status: 0,
                type: 'GET_USER_INFO_FAIELD',
                message: '通过用户ID获取用户信息失败',
            })
        }
    }
    //退出登录
    async signout(req, res, next){
        delete req.session.user_id;
        res.send({
            status: 1,
            message: '退出成功'
        })
    }
    //修改密码
    async chanegPassword(req, res, next){
        const cap = req.cookies.cap;
        if (!cap) {
            console.log('验证码失效')
            res.send({
                status: 0,
                type: 'ERROR_CAPTCHA',
                message: '验证码失效',
            })
            return
        }
        const form = new formidable.IncomingForm();
        // 前端请求 表单
        form.parse(req, async (err, fields, files) => {
            const {username, oldpassWord, newpassword, confirmpassword, captcha_code} = fields;
            try{
                if (!username) {
                    throw new Error('用户名参数错误');
                }else if(!oldpassWord){
                    throw new Error('必须添加旧密码');
                }else if(!newpassword){
                    throw new Error('必须填写新密码');
                }else if(!confirmpassword){
                    throw new Error('必须填写确认密码');
                }else if(newpassword !== confirmpassword){
                    throw new Error('两次密码不一致');
                }else if(!captcha_code){
                    throw new Error('请填写验证码');
                }
            }catch(err){
                console.log('修改密码参数错误', err);
                res.send({
                    status: 0,
                    type: 'ERROR_QUERY',
                    message: err.message,
                })
                return
            }
            if (cap.toString() !== captcha_code.toString()) {
                res.send({
                    status: 0,
                    type: 'ERROR_CAPTCHA',
                    message: '验证码不正确',
                })
                return
            }
            const md5password = this.encryption(oldpassWord);
            try{
                const user = await UserModel.findOne({username});
                if (!user) {
                    res.send({
                        status: 0,
                        type: 'USER_NOT_FOUND',
                        message: '未找到当前用户',
                    })
                }else if(user.password.toString() !== md5password.toString()){
                    res.send({
                        status: 0,
                        type: 'ERROR_PASSWORD',
                        message: '密码不正确',
                    })
                }else{
                    user.password = this.encryption(newpassword);
                    user.save();
                    res.send({
                        status: 1,
                        success: '密码修改成功',
                    })
                }
            }catch(err){
                console.log('修改密码失败', err);
                res.send({
                    status: 0,
                    type: 'ERROR_CHANGE_PASSWORD',
                    message: '修改密码失败',
                })
            }
        })
    }
    //加密
    encryption(password){
        const newpassword = this.Md5(this.Md5(password).substr(2, 7) + this.Md5(password));
        return newpassword
    }
    Md5(password){
        const md5 = crypto.createHash('md5');
        return md5.update(password).digest('base64');
    }
    //后台管理 获取用户列表数据
    async getUserList(req, res, next){
        const {limit = 20, offset = 0} = req.query;
        try{
            const users = await UserInfoModel.find({}, '-_id').sort({user_id: -1}).limit(Number(limit)).skip(Number(offset));
            res.send(users);
        }catch(err){
            console.log('获取用户列表数据失败', err);
            res.send({
                status: 0,
                type: 'GET_DATA_ERROR',
                message: '获取用户列表数据失败'
            })
        }
    }
    //后台管理获取 总用户数
    async getUserCount(req, res, next){
        try{
            //count() 方法，返回就是总共的文档 数
            const count = await UserInfoModel.count();
            res.send({
                status: 1,
                count,
            })
        }catch(err){
            console.log('获取用户数量失败', err);
            res.send({
                status: 0,
                type: 'ERROR_TO_GET_USER_COUNT',
                message: '获取用户数量失败'
            })
        }
    }
    //更新头像
    async updateAvatar(req, res, next){
        const sid = req.session.user_id;
        const pid = req.params.user_id;
        const user_id = sid || pid;
        if (!user_id || !Number(user_id)) {
            console.log('更新头像，user_id错误', user_id)
            res.send({
                status: 0,
                type: 'ERROR_USERID',
                message: 'user_id参数错误',
            })
            return 
        }

        try{
            const image_path = await this.getPath(req);
            await UserInfoModel.findOneAndUpdate({user_id}, {$set: {avatar: image_path}});
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
} 

export default new User()