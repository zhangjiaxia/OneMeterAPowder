<template>
	<view class="container">
		<view>
			<navigationBar custom="true">
				<!-- <view class="search-container">
					<image src="/static/logo.png" class="logo"></image>
					<view class="search" @click="$turnPage('/pages/category/search/search', 'navigateTo')">
						<view class="icon-search search-icon"></view>
						<text>搜索</text>
					</view>
				</view> -->
				<view class="uni-flex uni-row vertical search-bar">
					<view class="uni-flex">
						<image src="/static/logo.png" class="icon-logo"></image>
					</view>
					<view class="uni-flex">
						<view class="uni-flex uni-row vertical search" @click="$turnPage('/pages/category/search/search', 'navigateTo')">
							<view class="icon-search search-icon"></view>
							<text>搜索</text>
						</view>
					</view>
				</view>
			</navigationBar>
			<!-- <view class="search-container">
				<image src="/static/logo.png" class="logo"></image>
				<view class="search" @click="$turnPage('/pages/category/search/search', 'navigateTo')">
					<view class="icon-search search-icon"></view>
					<text>搜索</text>
				</view>
			</view> -->
			<view style="padding:0upx 20upx;transform: translateY(-100upx); margin-top: 90px;">
				<swiper class="swiper" :autoplay="autoplay" circular :interval="interval" :duration="duration">
					<swiper-item v-for="(item,index) in bannerList" :key="index">
						<image :src="item.bannerUrl" class="banner-img"></image>
					</swiper-item>
				</swiper>
			</view>
			<view class="tab-list" style="padding-top: 0px;padding-bottom: 0px;position: relative;top:-90upx;background: #F0EDF1;">
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
			<view class="tab-list" style="padding-top: 40rpx;margin-top: -60rpx;">
				<view v-for="(item,index) in iconTypeList" :key="index" class="tab-item" @click="shopListPage(item)">
					<authPage>
						<image :src="item.iconTypeUrl" class="type-icon"></image>
						<view>{{item.iconTypeName}}</view>
					</authPage>
				</view>
			</view>
			<view class="type-list">
				<view class="type-item" v-for="(item, index) in specialAreaPicList" :key="index">
					<image :src="item.specialImgUrl"></image>
				</view>
			</view>
			<view class="category-list">
				<view class="category-item" v-for="(item,index) in specialAreaTextList" :key="index" @click="selectTab(index, item.isGoods)">
					<view><text :class="{'category-item-active':tabIndex == index}">{{item.specialName}}</text></view>
					<view><text class="category-item-text" :class="{'category-text-active':tabIndex == index}">{{item.specialTitle}}</text></view>
				</view>
			</view>
		</view>
		<view class="space">
			<view class="goods" :style="{'margin-right': index % 2 == 0 ? '20rpx' : '0'}" v-if="isGoods == 1"
				v-for="(item, index) in specialGoodsList" :key="index" @click="shopDetailPage(item)">
				<view style="width: 100%;">
					<image :src="item.mainImgUrl" class="goodsimg"></image>
				</view>
				<view class="title">{{item.name.substring(0,20) + '...'}}</view>
				<view class="price">
					<text style="font-size: 24rpx;">￥</text>
					<text>{{item.retailPrice[0]}}</text>
				</view>
			</view>
			<view class="goods" :style="{'margin-right': index % 2 == 0 ? '20rpx' : '0'}" v-if="isGoods == 0"
				v-for="(item, index) in championList" :key="index" @click="shopDetailPage(item)">
				<view style="width: 100%;">
					<image :src="item.mainImgUrl" class="goodsimg"></image>
				</view>
				<view class="title">{{item.name.substring(0,20) + '...'}}</view>
				<view class="price">
					<text style="font-size: 24rpx;">￥</text>
					<text>{{item.retailPrice[0]}}</text>
				</view>
			</view>
		</view>
		<view class="share">
			<image src="/static/share.png"></image>
			<button open-type="share" class="sharebtn"></button>
		</view>
	</view>
</template>

<script>
	import interfaceurl from '@/utils/interface.js'
	import navigationBar from '@/components/navigation-bar.vue' //引入自定义导航栏
	import authPage from '@/components/authorization-page.vue' //引入授权窗体
	export default {
		components: {
			navigationBar,
			authPage
		},
		data() {
			return {
				//轮播图参数
				indicatorDots: true,
				autoplay: false,
				interval: 3000,
				duration: 500,
				invitation_code: '', //分销邀请码
				bannerList: ['/static/banner.png'], //轮播图
				iconTypeList: [], //小图标
				specialAreaPicList: [], //专区图片
				specialAreaTextList: [], //专区文字
				tabIndex: 0, //选择的专区索引
				specialGoodsData: {}, //专区商品数据
				specialGoodsList: [], //专区商品列表
				params: {
					page: 1,
					size: 2,
					specialId: 0 //选择的专区索引
				}, //专区商品参数
				championData: {}, //销量冠军数据
				championList: [], //销量冠军列表
				isGoods: 1 //判断是否为销量冠军，0是，1不是
			}
		},
		onShareAppMessage(res) {
			return {
				title: '一米一粉',
				path: '/pages/index/index?code=' + this.invitation_code,
				imageUrl: '/static/banner.png'
			}
		},
		onLoad(options) {
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
			if(this.isGoods == 0) {
				if(this.championList.length >= this.championData.total) {
					return;
				}
				this.params.page++;
				this.getChampionList()
			} else {
				if (this.specialGoodsList.length >= this.specialGoodsData.total) {
					return;
				}
				this.params.page++;
				this.getSpecialGoodsList()
			}
		},
		methods: {
			selectTab(index, isGoods) {
				this.tabIndex = index
				this.isGoods = isGoods
				this.initData()
			},
			shopDetailPage(item) {
				this.$store.commit('setGoodsDetail', item)
				this.$turnPage('/pages/index/business/shop-detail', 'navigateTo')
			},
			shopListPage(item) {
				switch(item.link) {
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
				        this.$turnPage('/pages/category/search/goods-list?cateId='+item.link, 'navigateTo')
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
				this.specialGoodsData = {}
				this.specialGoodsList = []
				this.params.page = 1
				if(this.isGoods == 0) {
					this.getChampionList();
				} else {
					this.getSpecialGoodsList();
				}
			},
			//获取专区商品列表
			getSpecialGoodsList() {
				let that = this;
				that.params.specialId = that.specialAreaTextList[that.tabIndex].specialId
				interfaceurl.checkAuth(interfaceurl.specialGoodsList, this.params, false).then((res) => {
					that.specialGoodsData = res.data
					if(that.params.page == 1) {
						that.specialGoodsList = res.data.data
					} else {
						that.specialGoodsList = that.specialGoodsList.concat(res.data.data)
					}
				});
			},
			//销量冠军
			getChampionList() {
				let that = this;
				interfaceurl.checkAuth(interfaceurl.championList, this.params, false).then((res) => {
					that.championData = res.data
					if(that.params.page == 1) {
						that.championList = res.data.data
					} else {
						that.championList = that.specialGoodsList.concat(res.data.data)
					}
				});
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
		.icon-logo {
			width: 154rpx;
			height: 37rpx;
			margin-left: 30rpx;
			margin-right: 16rpx;
		}
		input {
			width:330rpx;
			height:50rpx;
			background:rgba(255,255,255,1);
			box-shadow:0px 2rpx 3rpx 0px rgba(255,255,255,0.2);
			border-radius:25rpx;
		}
	}
	.sharebtn {
		height: 100rpx;
		position: relative;
		top: -110rpx;
		opacity: 0;
	}

	.search-container {
		height: 230upx;
		background: #0071CF;
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

	.search {
		width: 300upx;
		height: 60upx;
		background: #ffffff;
		border-radius: 30upx;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 26upx;
		color: #000000;
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
		background: #ffffff;
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
		padding: 20upx 30upx;
		display: flex;
		justify-content: space-between;
		flex-wrap: wrap;
		background: #ffffff;
	}

	.type-item {
		width: 336upx;
		height: 170upx;
		margin-bottom: 10upx;
	}

	.type-item image {
		width: 100%;
		height: 100%;
	}
	
	.shop-item-bottom {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 10upx;
	}

	.shop-item-price {
		font-weight: bold;
		color: #0071CF;
		font-size: 36upx;
	}

	.pay-btn {
		display: inline-block;
		width: 32upx;
		height: 32upx;
		line-height: 26upx;
		border-radius: 100%;
		text-align: center;
		color: #0071CF;
		color: #ffffff;
		background: #0071CF;
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
		width: 100%;
		height: 100%;
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
	}

	.category-item-text {
		font-size: 23upx;
		color: #999999;
	}

	.category-item-active {
		color: #0071CF;
	}
	
	.category-text-active {
		background: #0071CF;
		color: #FFFFFF;
		border-radius: 40rpx;
		padding: 2rpx;
	}
	//商品列表
	.space {
		width: 700rpx;
		margin: 0rpx auto;
		.goods {
			width: 340rpx;
			background: #FFFFFF;
			border-radius: 20rpx;
			float: left;
			margin-bottom: 20rpx;
			.goodsimg {
				width: 340rpx;
				height: 340rpx;
				border-top-left-radius: 20rpx;
				border-top-right-radius: 20rpx;
			}
			.title {
				font-size: 24rpx;
				color: #333333;
				margin: 10rpx;
			}
			.price {
				font-size: 30rpx;
				color: #0071CF;
				margin-left: 10rpx;
				margin-bottom: 20rpx;
			}
			view {
				line-height: 1.2;
			}
		}
	}
</style>
