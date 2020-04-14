'use strict';

import AddressComponent from '../../prototype/addressComponent';
import Cities from '../../models/v1/cities';
import CityHandle from './cities'

class SearchPlace extends AddressComponent{
	constructor(){
		super()
		this.search = this.search.bind(this)
	}
    //根据 city_id 和 关键字，搜索详细地址
	async search(req, res, next){
		let {type = 'search', city_id, keyword} = req.query;
		if (!keyword) {
			res.send({
				name: 'ERROR_QUERY_TYPE',
				message: '参数错误',
			})
			return
		}else if(isNaN(city_id)){
			try{
				const cityname = await CityHandle.getCityName(req);
				const cityInfo = await Cities.cityGuess(cityname);
				city_id = cityInfo.id;
			}catch(err){
				console.log('搜索地址时，获取定位城失败')
				res.send({
					name: 'ERROR_GET_POSITION',
					message: '获取数据失败',
				})
			}
		}
		try{
            //根据城市 id 查询城市基础信息
			const cityInfo = await Cities.getCityById(city_id);
            //根据 地址基类，的searchPlace 方法，根据关键字获取详细地址
			const resObj = await this.searchPlace(keyword, cityInfo.name, type);
			const cityList = [];
            //将匹配到的相关详细地址 转换成 数组形式 [{},{}]
			resObj.data.forEach((item, index) => {
				cityList.push({
					name: item.title,
					address: item.address,
					latitude: item.location.lat,
					longitude: item.location.lng,
					geohash: item.location.lat + ',' + item.location.lng,
				})
			});
            //返回 数据
			res.send(cityList);
		}catch(err){
			res.send({
				name: 'GET_ADDRESS_ERROR',
				message: '获取地址信息失败',
			});
		}
	}
}

export default new SearchPlace();