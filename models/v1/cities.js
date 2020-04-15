import mongoose from 'mongoose';
//引入初始化城市数据
import cityData from '../../InitData/cities'
//定义集合结构，只有一个data文档
const citySchema = new mongoose.Schema({
    data: {}
});
// citySchema.statics.cityGuess 在集合上定义一个静态方法，
// 城市拼音查询城市，后面逻辑处理就可以直接调用这个方法
citySchema.statics.cityGuess = function(name){
    //返回一个 promise ，方便回调查询出来的数据
    return new Promise(async (resolve, reject) => {
        const firtWord = name.substr(0,1).toUpperCase();
        try{
            const city = await this.findOne();//等价于返回全部数据，因为只定义了一个 data
            //遍历城市数据，根据传入的拼音与数据库数据比对，返回该城市数据
            Object.entries(city.data).forEach(item => {
                if(item[0] == firtWord){
                    item[1].forEach(cityItem => {
                        if (cityItem.pinyin == name) {
                            //成功回调，传入这个城市的数据
                            resolve(cityItem)
                        }
                    })
                }
            })
        }catch(err){
            //失败回调
            reject({
                name: 'ERROR_DATA',
                message: '查找数据失败',
            });
            console.error(err);
        }
    })
}
//定义集合静态方法  热门城市数据
citySchema.statics.cityHot = function (){
    return new Promise(async (resolve, reject) => {
        try{
            const city = await this.findOne();
            //成功回调，返回热门城市数据
            resolve(city.data.hotCities)
        }catch(err){
            reject({
                name: 'ERROR_DATA',
                message: '查找数据失败',
            });
            console.error(err);
        }
    })
}

//城市列表
citySchema.statics.cityGroup = function (){
    return new Promise(async (resolve, reject) => {
        try{
            const city = await this.findOne();
            const cityObj = city.data;
            //删除 _id 和热门城市列表
            delete(cityObj._id)
            delete(cityObj.hotCities)
            resolve(cityObj)
        }catch(err){
            reject({
                name: 'ERROR_DATA',
                message: '查找数据失败',
            });
            console.error(err);
        }
    })
}

//静态方法 通过城市 id ，查询城市信息
citySchema.statics.getCityById = function(id){
    return new Promise(async (resolve, reject) => {
        try{
            const city = await this.findOne();
            Object.entries(city.data).forEach(item => {
                if(item[0] !== '_id' && item[0] !== 'hotCities'){
                    item[1].forEach(cityItem => {
                        if (cityItem.id == id) {
                            resolve(cityItem)
                        }
                    })
                }
            })
        }catch(err){
            reject({
                name: 'ERROR_DATA',
                message: '查找数据失败',
            });
            console.error(err);
        }
    })
}

//创建模型
const Cities = mongoose.model('Cities', citySchema);

//定义方法 如果查询到没有数据，就从定义的初始化数据（./../InitData/cities）中加入数据
Cities.findOne((err, data) => {
    if (!data) {
        Cities.create({data: cityData});
    }
});

export default Cities