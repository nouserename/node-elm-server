//引入 mongoose
import mongoose from 'mongoose'

// 目标 1.创建数据库，连接数据库时我们指定了 mongodb://localhost:27017/elm ，如果没有 elm 这个数据库，会自动创建
// 目标 2.创建集合（相当于mysql中的表）
    //2.1 使用 mongoose.Schema SchemaType 处理字段路径各种属性的定义
const Schema = mongoose.Schema
    //2.2 指定集合字段
const testSchema = new Schema({
    name:String,//规定name这个字段为字符类型
    age:{type:Number,required:true},//定义 age 字段 类型为数值型，而且是必要的
    sex:{type:String,default:'男'}//定义 sex 性别字段，类型为字符型号，默认值为 男
})
// 目标 3.创建可以操作这个集合的集合模型

const testModel = mongoose.model('test',testSchema)


// 目标 4.插入数据到 test 集合中
    //4.1 使用 save() 方法
const testData = {
    name:'syl',
    age:18,
    sex:'女'
}

    //4.2 创建新的记录行（文档）,并保存到集合中
new testModel(testData).save()
    //4.3 不指定sex 字段值，会使用定义的默认值
const testData2 = {
    name:'syl',
    age:20,
}
new testModel(testData2).save()

// 目标 5.查询数据，使用 find(),查询年龄为 20 的数据

testModel.find({age:20},function(error,data){
    if(error){
        console.log('查询有错')
    }else{
        console.log(data)
    }
})

// 目标 6.修改数据

testModel.update({age:20},{age:33},function(error,data){
    if(error){
        console.log('更新出错');
    }else{
        console.log('更新成功')
    }
})
// 目标 7.删除数据
testModel.deleteMany({age:33},function(error,data){
    if(error){
        console.log('删除失败');
    }else{
        console.log('删除成功');
    }
})


