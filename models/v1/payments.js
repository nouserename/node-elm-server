import mongoose from 'mongoose'
//引入支付方式初始化数据
import paymentsData from '../../InitData/payments'

const Schema = mongoose.Schema;

//定义支付集合结构
const paymentsSchema = new Schema({
    description: String,
    disabled_reason: String,
    id: Number,
    is_online_payment: Boolean,
    name: String,
    promotion: [],
    select_state: Number,
})

//建立模型
const Payments = mongoose.model('Payments', paymentsSchema);

//如果没有查询到数据，将初始化静态数据保存到支付集合中 
Payments.findOne((err, data) => {
    if (!data) {
        paymentsData.forEach(item => {
            //将初始化静态数据保存到支付集合中 和 save()方法一样
            Payments.create(item);
        })
    }
})    


export default Payments