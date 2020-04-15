//引入 mongoose 
import mongoose from 'mongoose'

const Schema = mongoose.Schema;
// 定义cart集合的文档结构
const cartSchema = Schema({
    id: Number,
    cart: {
        id: Number,
        groups: [
            [
                {
                    attrs: [],
                    extra: [],
                    id: Number,
                    new_specs: [],
                    name: String,
                    price: Number,//价格
                    quantity: Number,//数量
                    specs: [String],//规格
                    packing_fee: Number,//打包费
                    sku_id: Number,//规格id
                    stock: Number,//存量
                }
            ]
        ],
        extra: [{
            description: String,//描述信息 （商家不支持货到付款）
            name: {type: String, default: '餐盒'},
            price: {type: Number, default: 0},
            quantity: {type: Number, default: 0},
            type: {type: Number, default: 0},
        }],
        deliver_amount: Number,
        deliver_time: String,//派送时间
        discount_amount: String,//折扣
        dist_info: String,
        is_address_too_far: {type: Boolean, default: false},//距离商家太远
        is_deliver_by_fengniao: Boolean,//是否为蜂鸟专送
        is_online_paid: {type: Number, default: 1},//在线支付
        is_ontime_available: {type: Number, default: 0},
        must_new_user: {type: Number, default: 0},
        must_pay_online: {type: Number, default: 0},//必须在线支付
        ontime_status: {type: Number, default: 0},//支付时间
        ontime_unavailable_reason: String,//支付结果
        original_total: Number,
        phone: String,
        promise_delivery_time: {type: Number, default: 0},
        restaurant_id: Number,
        restaurant_info: Schema.Types.Mixed,
        restaurant_minimum_order_amount: Number,
        restaurant_name_for_url: String,
        restaurant_status: {type: Number, default: 1},
        service_fee_explanation: {type: Number, default: 0},
        total: Number,
        user_id: Number,
    },
    delivery_reach_time: String,
    invoice: {
        is_available: {type: Boolean, default: false},
        status_text: String,
    },
    sig: String,
    current_address: {},
    payments: [{
        description: String,
        disabled_reason: String,
        id: Number,
        is_online_payment: {type: Boolean, default: true},
        name: String,
        promotion:[],
        select_state: Number,
    }],
    deliver_times: [],
    deliver_times_v2: [],
    merchant_coupon_info: {},
    number_of_meals: {},
    discount_rule: {},
    hongbao_info: {},
    is_support_coupon: {type: Boolean, default: false},
    is_support_ninja: {type: Number, default: 1},
})

cartSchema.index({id: 1});

const Cart = mongoose.model('Cart', cartSchema);

export default Cart