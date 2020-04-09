import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    //modules,
    //严格模式启用后，数据状态的修改就必须通过mutations的方式提交，这样也便于查看状态变更
    strict: process.env.NODE_ENV !== 'production',
    state: {
        //用户登录后记录
		token: '', //用户登录后接口传回的token
		userInfos: {}, //用户授权信息
		goodsDetail: {}, //商品详情
		selectOrderGoods: [], //用户选择下单的商品
    },
	//数据修改，非异步
    mutations: {
		updateToken(state, newValue) {
			state.token = newValue
		},
		setUserInfos(state, newValue) {
			state.userInfos = newValue
		},
		setGoodsDetail(state, newValue) {
			state.goodsDetail = newValue
		},
		setSelectOrderGoods(state, newValue) {
			state.selectOrderGoods = newValue
		}
    },
	//异步方法，如果需要修改state中的数据，必须调用mutations里的方法
	actions: {
		// updateTokens(state, newValue) {
		// 	console.log('actions')
		// 	console.log(state, newValue)
		// 	//state.state.token = 'zjxs:' + newValue
		// 	state.commit('updateToken', 'zjxs:' + newValue)
		// }
	}
})