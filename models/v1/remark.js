import mongoose from 'mongoose'
import remarkData from '../../InitData/remark'
const Schema  = mongoose.Schema;

const remarkSchema = new Schema({
    remarks: [],
})

const Remark = mongoose.model('Remark', remarkSchema);
//如果没有查询到数据，将初始化静态数据保存到备注集合中 
Remark.findOne((err, data) => {
    if(!data){
        Remark.create(remarkData)
    }
})

export default Remark