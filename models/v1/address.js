//引入 mongoose 
import mongoose from 'mongoose'

//Schema 类
const Schema = mongoose.Schema;

// 定义address集合的文档结构
const addressSchema = new Schema({
    id: Number,//id 类型 数值型
    address: String,//address 类型 字符型
    phone: String,//手机号码
    user_id: Number,//用户id
    is_valid: {type: Number, default: 1},
    created_at: {type: Date, default: Date.now()},//创建时间
    phone_bk: String,//其他号码
    tag_type: Number,//地址信息标记 家、公司、学校
    name: String,//名字
    st_geohash: String,//经纬度
    address_detail: String,//详细地址
    poi_type: {type: Number, default: 0},
    sex: {type: Number, default: 1},//性别
    city_id: {type: Number, default: 1},//城市 id
    tag: {type: String, default: '家'},
    is_user_default: {type: Boolean, default: true},//默认地址
    is_deliverable: {type: Boolean, default: true},
    agent_fee: {type: Number, default: 0},
    deliver_amount: {type: Number, default: 0},//距离
    phone_had_bound: {type: Boolean, default: true},
})

addressSchema.index({id: 1});//主键 id 1开始

// 定义能操作address集合数据的Model
const Address = mongoose.model('Address', addressSchema);

//向外暴露
export default Address