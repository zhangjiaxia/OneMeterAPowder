import req from './request.js' //引入请求api
import store from '@/store' //引入全局变量的token

const isFormal = false //是否正式,false:测试，true:正式

const baseUrlTest = "https://api-emi.bidou88.cn/api"; //测试域名，平时开发用测试域名
const baseUrlFormal = "https://shop.yimiefen.com/api"; //正式域名，提交文件时要切换到正式域名
const baseUrl = isFormal ? baseUrlFormal : baseUrlTest;

/**后台>http://admin-emi.bidou88.cn/
 * 后台账号：  密码： 123123123
 * 后台接口》http://www.sosoapi.com/pass/apidoc/share/show.htm?shareKey=1c34a46bb3e1e626daace5f5d09d83b4
 * 配置接口定义，请求方式默认为get，post方式需明确指定
 * 根据指引》https://www.jianshu.com/p/edd9a1aac8bd
 */
const interfaceurl = {
    /**
     * 错误弹窗
     */
    showErr(err) {
        uni.hideLoading();
        const msg = req.errPicker(err);
        //正式，由于正式环境不可在用户面前暴露过多问题，所以像500,404这些未正常请求到后台的异常直接提示‘wifi信号弱’
        if (isFormal) {
            uni.showToast({
                title: msg,//'wifi信号弱'
                icon: 'none',
                duration: 2000
            });
        } else { //测试,尽可能的暴露问题
            uni.showModal({
                showCancel: false,
                content: msg
            });
        }
    },
    /**
     * 数据格式业务处理
     */
    showBussisnessErr(res) {
        //console.log('showBussisnessErr',res);
        //res.respCode为0则是正常，其它数值代表请求有正常跑完全程，后台接口能够捕获到的异常处理
		if(res.code == 0) {
			return true
		} else {
			if(res.code == 401) {
				store.commit('updateToken', '');
				uni.setStorageSync('token', '');
				interfaceurl.login()
				uni.showToast({
					title: '用户登录过期,请重新操作',
					icon: 'none',
					duration: 2000
				});
			} else {
				uni.showToast({
					title: res.msg,
					icon: 'none',
					duration: 2000
				});
			}
			return false
		}
    },
	/**
	 * 用户登录并授权手机号，若用户授权登录后，检查登录状态失效，就要重新登录
	 */
	login(detail, successBack) {
		uni.login({
		  success (res) {
		    if (res.code) {
				//这里直接用原生请求就行了
				uni.request({
					url: `${baseUrl}/v1/login/getToken`,
					data: {
					  code: res.code
					},
					success (res) {
						if(res.data.code != 0) {
							uni.showToast({
								title: res.data.msg,
								icon: 'none',
								duration: 2000
							});
							return;
						}
						uni.showToast({
							title: '授权成功',
							icon: 'none',
							duration: 2000
						});
						let loginResp = res.data.data;
						uni.setStorageSync('token', loginResp.token)
						store.commit('updateToken', loginResp.token)
						//首次授权登录需要保存用户信息
						if(detail.userInfo) {
							interfaceurl.checkAuth(interfaceurl.saveInfo, {
							    nickName: detail.userInfo.nickName,
								gender: detail.userInfo.gender,
								avatarUrl: detail.userInfo.avatarUrl
							}).then((res) => {
								let userInfo = {
									nickName: detail.userInfo.nickName,
									avatarUrl: detail.userInfo.avatarUrl
								}
								store.commit('setUserInfos', userInfo)
								uni.setStorageSync('userInfo', userInfo);
							});
						}
						if(successBack) {
							successBack();
						}
					},
					fail(res) {
						interfaceurl.showErr(res)
					}
				})
		    } else {
		      uni.showToast({
				  title: '登录失败！' + res.errMsg,
				  icon: 'none',
				  duration: 2000
		      });
		    }
		  }
		})
	},
	/**
	 * 检查登录状态，每次调用权限接口时都要检查登录状态
	 */
	checkLogin(){
	  return new Promise(function(resolve,reject){
	    wx.checkSession({
	      success: resolve,
	      fail: reject
	    })
	  })
	},
	//小程序接口,标记false的接口都是开放接口，其余的为权限接口
	//接口返回的价格单位都是分
	
	/*登录*/
	//获取token
	getToken(data) { return req.request({ url: `${baseUrl}/v1/login/getToken`, data }, false) },
	/*首页*/
	bannerList(data) { return req.request({ url: `${baseUrl}/v1/home/bannerList`, data }, false) },
	iconTypeList(data) { return req.request({ url: `${baseUrl}/v1/home/iconTypeList`, data }, false) },
	specialAreaList(data) { return req.request({ url: `${baseUrl}/v1/home/specialAreaList`, data }, false) },
	specialGoodsList(data) { return req.request({ url: `${baseUrl}/v1/home/specialGoodsList`, data }, false) },
	championList(data) { return req.request({ url: `${baseUrl}/v1/home/championList`, data }, false) },
	/*商品*/
	selectList(data) { return req.request({ url: `${baseUrl}/v1/category/selectList`, data }, false) },
	firstList(data) { return req.request({ url: `${baseUrl}/v1/category/firstList`, data }, false) },
	childList(data) { return req.request({ url: `${baseUrl}/v1/category/childList`, data }, false) },
	categoryList(data) { return req.request({ url: `${baseUrl}/v1/goods/categoryList`, data }, false) },
	goodsDetail(data) { return req.request({ url: `${baseUrl}/v1/goods/detail`, data }, false) },
	pageGoodsList(data) { return req.request({ url: `${baseUrl}/v1/home/pageGoodsList`, data }, false) },
	categoryChildrenList(data) { return req.request({ url: `${baseUrl}/v1/category/childrenList`, data }, false) },
	childrenGoodsList(data) { return req.request({ url: `${baseUrl}/v1/category/childrenGoodsList`, data }, false) },
	/*系统*/
	getSystemKey(data) { return req.request({ url: `${baseUrl}/v1/setting/getSystemKey`, data }, false) },
	getArticleKey(data) { return req.request({ url: `${baseUrl}/v1/setting/getArticleKey`, data }, false) },
	
	//权限接口调用前先检查下用户登录状态
	checkAuth(bussinessInterfaceurl, data, isAuth = true) {
		return new Promise(function (resolve, reject) {
			uni.showLoading({
				title: '',
				mask: true,
				duration:3000
			});
			if(isAuth) {
				interfaceurl.checkLogin().then((res) => { //login API 获取code
					//权限接口调用
					bussinessInterfaceurl(data).then((res) => {
						uni.hideLoading();
						if(interfaceurl.showBussisnessErr(res)){
							resolve(res); //接口200时返回的数据
						} 
					}).catch(interfaceurl.showErr); //异常捕获
				}).catch((err) => {
					//interfaceurl.showErr(err)	弹出session通道失效
					interfaceurl.login()
				});
			} else {
				//开放接口调用
				bussinessInterfaceurl(data).then((res) => {
					uni.hideLoading();
					if(interfaceurl.showBussisnessErr(res)){
						resolve(res); //接口200时返回的数据
					} 
				}).catch(interfaceurl.showErr); //异常捕获
			}
		})
	},
	
	/*购物车*/
	cartCreate(data) { return req.request({ url: `${baseUrl}/v1/cart/create`, data, method: 'POST' }) },
	cartUpdate(data) { return req.request({ url: `${baseUrl}/v1/cart/update`, data, method: 'POST' }) },
	cartPageList(data) { return req.request({ url: `${baseUrl}/v1/cart/pageList`, data }) },
	cartDelete(data) { return req.request({ url: `${baseUrl}/v1/cart/delete`, data, method: 'DELETE' }) },
	cartDirectBuy(data) { return req.request({ url: `${baseUrl}/v1/cart/directBuy`, data, method: 'POST' }) },
	orderFreight(data) { return req.request({ url: `${baseUrl}/v1/order/freight`, data }) },
	/*订单*/
	orderPayment(data) { return req.request({ url: `${baseUrl}/v1/order_payment/payment`, data, method: 'POST' }) },
	orderPageList(data) { return req.request({ url: `${baseUrl}/v1/order/pageList`, data }) },
	orderDetail(data) { return req.request({ url: `${baseUrl}/v1/order/detail`, data }) },
	orderExpressInfo(data) { return req.request({ url: `${baseUrl}/v1/order/expressInfo`, data }) },
	orderConfirm(data) { return req.request({ url: `${baseUrl}/v1/order/confirm`, data, method: 'POST' }) },
	orderApplyRefund(data) { return req.request({ url: `${baseUrl}/v1/order/applyRefund`, data, method: 'POST' }) },
	orderReturnRefund(data) { return req.request({ url: `${baseUrl}/v1/order/returnRefund`, data, method: 'POST' }) },
	orderCancelApply(data) { return req.request({ url: `${baseUrl}/v1/order/cancelApply`, data, method: 'POST' }) },
	orderExpressInfo(data) { return req.request({ url: `${baseUrl}/v1/order/returnOrderStatuts`, data }) },
	orderReturnGoods(data) { return req.request({ url: `${baseUrl}/v1/order/returnGoods`, data, method: 'POST' }) },
	/*收货地址*/
	addressCreate(data) { return req.request({ url: `${baseUrl}/v1/address/create`, data, method: 'POST' }) },
	addressUpdate(data) { return req.request({ url: `${baseUrl}/v1/address/update`, data, method: 'POST' }) },
	addressPageList(data) { return req.request({ url: `${baseUrl}/v1/address/pageList`, data }) },
	addressDelete(data) { return req.request({ url: `${baseUrl}/v1/address/delete`, data, method: 'DELETE' }) },
	addressInfo(data) { return req.request({ url: `${baseUrl}/v1/address/info`, data }) },
	/*会员*/
	vipPayment(data) { return req.request({ url: `${baseUrl}/v1/vip_payment/payment`, data, method: 'POST' }) },
	//绑定用户
	bingUser(data) { return req.request({ url: `${baseUrl}/v1/user/bingUser`, data, method: 'POST' }) },
	/*用户*/
	showDetail(data) { return req.request({ url: `${baseUrl}/v1/user/showDetail`, data }) },
	saveInfo(data) { return req.request({ url: `${baseUrl}/v1/user/saveInfo`, data, method: 'POST' }) },
	getAppletCode(data) { return req.request({ url: `${baseUrl}/v1/user/getAppletCode`, data, method: 'POST' }) },
	getPhoneNumber(data) { return req.request({ url: `${baseUrl}/v1/user/getPhoneNumber`, data, method: 'POST' }) },
	/*团队*/
	surveyList(data) { return req.request({ url: `${baseUrl}/v1/user_team/surveyList`, data }) },
	teamPageList(data) { return req.request({ url: `${baseUrl}/v1/user_team/pageList`, data }) },
	teamAllList(data) { return req.request({ url: `${baseUrl}/v1/user_team/allList`, data }) },
	teamRankingList(data) { return req.request({ url: `${baseUrl}/v1/user_team/rankingList`, data }) },
	/*收益*/
	profitRecord(data) { return req.request({ url: `${baseUrl}/v1/user/profitRecord`, data }) },
	cashOutSubmit(data) { return req.request({ url: `${baseUrl}/v1/cash_out/submit`, data, method: 'POST' }) },
	cashOutRecord(data) { return req.request({ url: `${baseUrl}/v1/cash_out/record`, data }) },
}

export default interfaceurl;