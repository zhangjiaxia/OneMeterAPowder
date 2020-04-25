<template>
	<view class="container">
		<view>
			<view class="bar-sticky">
				<navigationBar custom="true">
					<view class="uni-flex uni-row vertical search-bar">
						<view class="search-img">
							<image src="/static/logo.png" class="icon-logo"></image>
						</view>
						<view class="">
							<view class="uni-flex uni-row vertical search" @click="$turnPage('/pages/category/search/search', 'navigateTo')">
								<view class="icon-search search-icon"></view>
								<text>搜索</text>
							</view>
						</view>
					</view>
				</navigationBar>
			</view>
			<view style="position: relative;height: 290rpx;background: white;">
				<view class="bgColor"></view>
				<swiper class="banner-swiper" :autoplay="autoplay" circular :interval="interval" :duration="duration">
					<swiper-item v-for="(item,index) in bannerList" :key="index">
						<image :src="item.bannerUrl" class="banner-img"></image>
					</swiper-item>
				</swiper>
			</view>
			<view class="tab-list" style="background: #FFFFFF;margin-bottom: -10rpx;">
				<view class="advantage-item">
					<text>VIP购物</text>
				</view>
				<view class="advantage-item">
					<text>源头直供</text>
				</view>
				<view class="advantage-item">
					<text>消费创业</text>
				</view>
				<view class="advantage-item">
					<text>积分配股</text>
				</view>
			</view>
			<view class="tab-list" style="padding-top: 40rpx;background: #FFFFFF;">
				<view v-for="(item,index) in iconTypeList" :key="index" class="tab-item" @click="shopListPage(item)">
					<authPage>
						<image :src="item.iconTypeUrl" class="type-icon"></image>
						<view class="classify">{{item.iconTypeName}}</view>
					</authPage>
				</view>
			</view>
			<view class="type-list">
				<view class="type-item" :style="{'margin-right': index % 2 == 0 ? '10rpx' : '0'}"
					v-for="(item, index) in specialAreaPicList" :key="index" 
					@click="$turnPage('/pages/category/search/category-detail?indexId=-1&category='+item.specialName+'&cateId='+item.specialId, 'navigateTo')">
					<text class="text-item" :class="{'text-item-space': index > 1}">{{item.specialName}}</text>
					<image :src="item.specialImgUrl" :style="{'width': index > 1 ? '350rpx' : '710rpx'}"></image>
				</view>
			</view>
			<view class="category-list">
				<view class="category-item" v-for="(item,index) in specialAreaTextList" :key="index" @click="selectTab(index, item.isGoods)">
					<view><text :class="{'category-item-active':tabIndex == index}">{{item.specialName}}</text></view>
					<view><text class="category-item-text" :class="{'category-text-active':tabIndex == index}">{{item.specialTitle}}</text></view>
				</view>
			</view>
			<view class="shop-list">
				<view class="shop-item" v-for="(content,dex) in tempList" :key="dex" @click="shopDetailPage(content)">
					<image :src="content.mainImgUrl" class="shop-img"></image>
					<view class="shop-item-content">
						<view class="shop-item-title">{{content.name.substring(0,20) + '...'}}</view>
						<view class="shop-item-bottom">
							<text class="shop-item-price">
								<text style="font-size: 24rpx;">￥</text>
								{{content.retailPrice[0] || 0}}
							</text>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="uni-flex content" style="width: 100%;" v-if="isGoods == 1">
			<view class="empty-text" v-if="(specialGoodsList.length == specialGoodsData.total) && specialGoodsList.length > 0">已经到底了</view>
			<view class="empty-text" v-if="specialGoodsList.length == 0">暂无数据</view>
		</view>
		<view class="uni-flex content" style="width: 100%;" v-else>
			<view class="empty-text" v-if="(championList.length == championData.total) && championList.length > 0">已经到底了</view>
			<view class="empty-text" v-if="championList.length == 0">暂无数据</view>
		</view>
		<view class="share">
			<authPage>
				<image src="/static/share.png" @click="startShare"></image>
			</authPage>
		</view>
		<!--分享弹窗-->
		<sharePoster :bgImg="bgImg" ref="share"></sharePoster>
	</view>
</template>

<script>
	import interfaceurl from '@/utils/interface.js'
	import navigationBar from '@/components/navigation-bar.vue' //引入自定义导航栏
	import authPage from '@/components/authorization-page.vue' //引入授权窗体
	import sharePoster from '@/components/shop-business/share-poster.vue' //引入授权窗体
	export default {
		components: {
			navigationBar,
			authPage,
			sharePoster
		},
		data() {
			return {
				//海报分享背景图
				bgImg: 'https://early-education.oss-cn-beijing.aliyuncs.com/meter_power/default/20200415/adca2eb7dab97a2c39a53f1515128588.png',
				//轮播图参数
				indicatorDots: true,
				autoplay: true,
				interval: 3000,
				duration: 500,
				bannerList: [], //轮播图
				iconTypeList: [], //小图标
				specialAreaPicList: [], //专区图片
				specialAreaTextList: [], //专区文字
				tabIndex: 0, //选择的专区索引
				specialGoodsData: {}, //专区商品数据
				specialGoodsList: [], //专区商品列表
				params: {
					page: 1,
					size: 10,
					specialId: 0 //选择的专区索引
				}, //专区商品参数
				championParams: {
					page: 1,
					size: 10,
					specialId: 0 //销量冠军索引
				}, //专区商品参数
				championData: {}, //销量冠军数据
				championList: [], //销量冠军列表
				tempList: [], //临时存储专区或销量冠军列表，避免数据显示跳脱问题
				isGoods: 1 //判断是否为销量冠军，0是，1不是
			}
		},
		onShareAppMessage: function( options ){
		　　var that = this;
			let userInfo = uni.getStorageSync('userInfo')
			let code = uni.getStorageSync('code')
			console.log('onShareAppMessage', code)
		　　// 设置菜单中的转发按钮触发转发事件时的转发内容
		　　var shareObj = {
		　　　　title: userInfo.nickName + ' 为您推荐好货', // 默认是小程序的名称(可以写slogan等)
		　　　　path: '/pages/index/index?code=' + code, // 默认是当前页面，必须是以‘/’开头的完整路径
		　　　　imageUrl: that.bgImg, //自定义图片路径，可以是本地文件路径、代码包文件路径或者网络图片路径，支持PNG及JPG，不传入 imageUrl 则使用默认截图。显示图片长宽比是 5:4
		　　　　success: function(res){
		　　　　　　// 转发成功之后的回调
		　　　　　　if(res.errMsg == 'shareAppMessage:ok'){
		　　　　　　}
		　　　　},
		　　　　fail: function(){
		　　　　　　// 转发失败之后的回调
		　　　　　　if(res.errMsg == 'shareAppMessage:fail cancel'){
		　　　　　　　　// 用户取消转发
		　　　　　　}else if(res.errMsg == 'shareAppMessage:fail'){
		　　　　　　　　// 转发失败，其中 detail message 为详细失败信息
		　　　　　　}
		　　　　},
		　　　　complete: function(){
		　　　　　　// 转发结束之后的回调（转发成不成功都会执行）
		　　　　}
		　　};
		　　// 来自页面内的按钮的转发
		　　if( options.from == 'button' ){
		　　　　var eData = options.target.dataset;
		　　　　console.log( eData.name );     // shareBtn
		　　　　// 此处可以修改 shareObj 中的内容
		　　　　shareObj.path = '/pages/index/index?code=' + code
		　　}
		　　// 返回shareObj
		　　return shareObj;
		},
		onLoad(options) {
			console.log('获取场景值',options)
			// scene 需要使用 decodeURIComponent 才能获取到生成二维码时传入的 scene
			var scene = decodeURIComponent(options.scene)
			var code = options.code
			if(scene == 'undefined' || scene == '') {
				console.log('场景值为空,改用分享值' + code)
				scene = code
			}
			//绑定上下级关系
			this.bindUser(scene)
			//获取首页数据
			this.getBannerList()
			this.getIconTypeList()
			this.getSpecialAreaList(1)
			this.getSpecialAreaList(2)
			this.tabIndex = 0
			this.specialGoodsData = {}
			this.specialGoodsList = []
		},
		onShow() {

		},
		//到达页面底部时触发的事件
		onReachBottom() {
			if (this.isGoods == 0) {
				if(this.championList.length > 0) {
					console.log(this.championList.length, this.championData.total)
					if (this.championList.length >= this.championData.total) {
						return;
					}
					this.championParams.page++;
					this.getChampionList()
				}
			} else {
				if (this.specialGoodsList.length >= this.specialGoodsData.total) {
					return;
				}
				this.params.page++;
				this.getSpecialGoodsList()
			}
		},
		methods: {
			//获取二维码携带的参数值并绑定下级
			bindUser(scene) {
				console.log('scene', scene)
				let that = this
				let baseUrl = 'https://shop.yimiefen.com/api'
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
								console.log('授权成功')
								let loginResp = res.data.data;
								uni.setStorageSync('token', loginResp.token)
								that.$store.commit('updateToken', loginResp.token)
								//获取到用户token后再获取用户邀请码保存
								interfaceurl.checkAuth(interfaceurl.showDetail, {}).then((res) => {
									uni.setStorageSync('code', res.data.invitation_code)
								});
								//如果存在分享id
								if(scene != 'undefined' && scene != '') {
									console.log('存在分享值', scene)
									let that = this
									interfaceurl.checkAuth(interfaceurl.bingUser, {scene_value: scene}, false).then((res) => {
										console.log("绑定成功")
										uni.setStorageSync("bind", scene)
									})
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
			selectTab(index, isGoods) {
				this.tabIndex = index
				this.isGoods = isGoods
				this.initData()
			},
			shopDetailPage(item) {
				this.$store.commit('setGoodsDetail', item)
				this.$turnPage('/pages/index/business/shop-detail?spuId='+item.spuId, 'navigateTo')
			},
			shopListPage(item) {
				switch (item.link) {
					case '1':
						this.$turnPage('/pages/vip/rule/vip-mainrule', 'navigateTo')
						break;
					case '2':
						this.$turnPage('/pages/index/business/original-equity', 'navigateTo')
						break;
					case '3':
						this.$turnPage('/pages/vip/rule/vip-index', 'navigateTo')
						break;
					case '4':
						this.$turnPage('/pages/index/business/Integral-stake', 'navigateTo')
						break;
					case '5':
						this.$turnPage('/pages/index/business/business-school', 'navigateTo')
						break;
					default:
						this.$turnPage('/pages/category/search/goods-list?cateId=' + item.link + '&cateName=' + item.iconTypeName,
							'navigateTo')
				}
			},
			//获取轮播图
			getBannerList() {
				let that = this;
				interfaceurl.checkAuth(interfaceurl.bannerList, {}, false).then((res) => {
					that.bannerList = res.data
				});
			},
			//获取分类小图标
			getIconTypeList() {
				let that = this;
				interfaceurl.checkAuth(interfaceurl.iconTypeList, {}, false).then((res) => {
					that.iconTypeList = res.data
				});
			},
			//获取专区1:图片位置2:标题位置
			getSpecialAreaList(specialType) {
				let that = this;
				interfaceurl.checkAuth(interfaceurl.specialAreaList, {
					specialType: specialType
				}, false).then((res) => {
					if (specialType == 1) {
						that.specialAreaPicList = res.data
					} else {
						that.specialAreaTextList = res.data
						//设置第一个tab的类型（判断是否为销售冠军）
						that.isGoods = that.specialAreaTextList[0].isGoods
					}
					if (that.specialAreaTextList.length > 0) {
						that.initData();
					}
				});
			},
			initData() {
				//重置分页参数
				if (this.isGoods == 0) {
					this.championData = {}
					this.championList = []
					this.championParams.page = 1
					this.getChampionList();
				} else {
					this.specialGoodsData = {}
					this.specialGoodsList = []
					this.params.page = 1
					this.getSpecialGoodsList();
				}
			},
			//获取专区商品列表
			getSpecialGoodsList() {
				let that = this;
				that.params.specialId = that.specialAreaTextList[that.tabIndex].specialId
				interfaceurl.checkAuth(interfaceurl.specialGoodsList, this.params, false).then((res) => {
					that.specialGoodsData = res.data
					if (that.params.page == 1) {
						that.specialGoodsList = res.data.data
					} else {
						that.specialGoodsList = that.specialGoodsList.concat(res.data.data)
					}
					that.tempList = that.specialGoodsList
				});
			},
			//销量冠军
			getChampionList() {
				let that = this;
				interfaceurl.checkAuth(interfaceurl.championList, this.championParams, false).then((res) => {
					that.championData = res.data
					if (that.championParams.page == 1) {
						that.championList = res.data.data
					} else {
						that.championList = that.championList.concat(res.data.data)
					}
					that.tempList = that.championList
				});
			},
			/*海报相关*/
			startShare() {
				this.$refs.share.getQrcode()
			}
		}
	}
</script>

<style lang="scss">
	/* uni.css - 通用组件、模板样式库，可以当作一套ui库应用 */
	@import '/common/uni.css';
	/*自定义公共样式*/
	@import '/common/custom.css';

	page {
		background: #F0EDF1;
	}

	.search-bar {
		width: 100%;
		position: relative;

		.search-img {
			// position: absolute;
			// left: 16rpx;
			// top: 8rpx;
			position: relative;
			top: 10rpx;
		}

		.icon-logo {
			width: 60rpx;
			height: 60rpx;
			margin-left: 16rpx;
			margin-right: 8rpx;
		}

		input {
			width: 330rpx;
			height: 50rpx;
			background: rgba(255, 255, 255, 1);
			box-shadow: 0px 2rpx 3rpx 0px rgba(255, 255, 255, 0.2);
			border-radius: 25rpx;
		}

		.search {
			// margin-left: 96rpx;
			width: 440upx;
			height: 50upx;
			background: #EEEEEE;
			border-radius: 30upx;
			display: flex;
			justify-content: center;
			align-items: center;
			font-size: 26upx;
			color: #000000;
		}
	}

	.bgColor {
		width: 100%;
		height: 160rpx;
		background: #fff;
		position: absolute;
		z-index: 10;
		top: 44;
	}

	.banner-swiper {
		width: 710rpx;
		height: 280rpx;
		position: absolute;
		z-index: 99;
		top: 20rpx;
		left: 20rpx;

		.banner-img {
			width: 100%;
			height: 100%;
			border-radius: 20rpx;
		}
	}

	.classify {
		font-size: 22rpx;
		color: #333333;
	}

	.sharebtn {
		height: 100rpx;
		position: relative;
		top: -110rpx;
		opacity: 0;
	}

	.search-container {
		height: 230upx;
		background: #ff0033;
		display: flex;
		padding: 30upx;
		box-sizing: border-box;
	}

	.logo {
		width: 160upx;
		height: 39upx;
		margin-right: 20upx;
		position: relative;
		top: 10upx;
	}

	.search-icon {
		font-size: 30rpx !important;
		color: #000000;
		margin-right: 10rpx;
		position: relative;
		top: 2px;
	}

	.swiper {
		width: 100%;
		height: 280upx;
	}

	.banner-img {
		width: 100%;
		height: 100%;
		border-radius: 20rpx;
	}

	.advantage-item {
		flex: 1;
		text-align: center;
		color: #999999;
		font-size: 24rpx;
	}

	.advantage-icon {
		width: 69upx;
		height: 20upx;
	}

	.tab-list {
		padding: 20upx 30upx;
		display: flex;
		flex-wrap: wrap;
		// background: #ffffff;
		justify-content: space-between;
	}

	.tab-item {
		width: 120upx;
		text-align: center;
		color: #222222;
		font-size: 22upx;
		margin-bottom: 20upx;
	}

	.type-icon {
		width: 90upx;
		height: 90upx;
	}

	.type-list {
		padding: 20upx;
		// display: flex;
		// justify-content: space-between;
		// flex-wrap: wrap;
		background: #ffffff;
	}

	.type-item {
		// width: 350upx;
		display: inline-flex;
		position: relative;
	}
	
	.text-item {
		position: absolute;
		top: 67rpx;
		left: 37rpx;
		color: #333333;
		font-size: 36rpx;
	}
	
	.text-item-space {
		top: 26rpx;
		left: 36rpx;
	}

	.type-item image {
		width: 350rpx;
		height: 220rpx;
		border-radius: 20rpx;
	}

	.shop-item-bottom {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 10upx;
		padding-left: 10rpx;
	}

	.pay-btn {
		display: inline-block;
		width: 32upx;
		height: 32upx;
		line-height: 26upx;
		border-radius: 100%;
		text-align: center;
		color: #ff0033;
		color: #ffffff;
		background: #ff0033;
	}

	.share {
		width: 100upx;
		height: 100upx;
		border-radius: 100%;
		position: fixed;
		right: 30upx;
		bottom: 30upx;
	}

	.share image {
		width: 100upx;
		height: 100upx;
	}

	.category-list {
		display: flex;
		align-items: center;
		padding: 30upx;
		padding-top: 10upx;
		color: #333333;
		font-size: 32upx;
	}

	.category-item {
		flex: 1;
		text-align: center;
		view {
			line-height: 1.3;
		}
	}

	.category-item-text {
		font-size: 23upx;
		color: #999999;
	}

	.category-item-active {
		color: #ff0033;
		font-weight: bold;
	}

	.category-text-active {
		background: #ff0033;
		color: #FFFFFF;
		border-radius: 40rpx;
		padding: 4rpx 6rpx;
	}
	
	//商品展示
	.shop-list {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		width: 700rpx;
		margin: 0 auto;
	}
	
	.shop-item {
		width: 340rpx;
		margin-bottom: 20rpx;
		background-color: #ffffff;
		border-radius: 20rpx;
	}
	
	.shop-img {
		width: 100%;
		height: 300rpx;
		border-top-left-radius: 20rpx;
		border-top-right-radius: 20rpx;
	}
	
	.shop-item-content {
		// padding: 0rpx 20rpx;
		padding-top: 10rpx;
		padding-bottom: 20rpx;
	}
	
	.shop-item-title {
		height: 60rpx;
		font-size: 26rpx;
		color: #333333;
		margin: 10rpx;
	}
	.shop-item-content view {
		line-height: 1.2;
	}
	
	.shop-item-text {
		color: #999999;
		margin-top: 20rpx;
		font-size: 26rpx;
		display: inline-block;
		max-width: 260rpx;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	
	.shop-item-bottom {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	
	.shop-item-price {
		color: #ff0033;
		font-size: 30rpx;
	}
</style>
