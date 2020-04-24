<template>
	<view>
		<view class="bar-sticky">
			<navigationBar :navigationBarStyle="navigationBarStyle"></navigationBar>
		</view>
		<view class="content">
			<view class="shop-list" v-if="tempList.length > 0">
				<view class="shop-item" v-for="(content,dex) in tempList" @click="shopDetailPage(content)" :key="dex">
					<image :src="content.mainImgUrl" class="shop-img"></image>
					<view class="shop-item-content">
						<view class="shop-item-title">{{content.name.substring(0,15) + '...'}}</view>
						<view class="shop-item-bottom">
							<text class="shop-item-price">
								<text style="font-size: 24rpx;">￥</text>
								{{content.retailPrice[0] || 0}}
							</text>
							<!-- <text class="pay-btn">+</text> -->
						</view>
					</view>
				</view>
			</view>
			<view class="uni-flex content" style="width: 100%;" v-if="indexId == '-1'">
				<view class="empty-text" v-if="(specialGoodsList.length == specialGoodsData.total) && specialGoodsList.length > 0">已经到底了</view>
				<view class="empty-text" v-if="specialGoodsData.total == 0">暂无数据</view>
			</view>
			<view class="uni-flex content" style="width: 100%;" v-else>
				<view class="empty-text" v-if="(shopList.length == shopData.total) && shopList.length > 0">已经到底了</view>
				<view class="empty-text" v-if="shopData.total == 0">暂无数据</view>
			</view>
		</view>
	</view>
</template>

<script>
	import interfaceurl from '@/utils/interface.js'
	import navigationBar from '@/components/navigation-bar.vue' //引入自定义导航栏
	export default {
		components: {
			navigationBar
		},
		data() {
			return {
				//设置导航栏样式
				navigationBarStyle: {
					// background: '#ff0033',
					// fontColor: '#FFFFFF',
					// iconColor: '#FFFFFF',
					iconText: '类目详情' //导航栏文字
				},
				params: {
					cateId: '', //5034
					page: 1,
					size: 10
				}, //分类详情参数
				shopData: {}, //分类详情数据
				shopList: [], //分类详情列表
				loading: true,
				specialParams: {
					specialId: '',
					page: 1,
					size: 10
				}, //专区特卖的分页参数
				specialGoodsData: {}, //专区商品数据
				specialGoodsList: [], //专区商品列表
				tempList: [], //临时存储专区或分类详情列表，避免数据显示跳脱问题
				indexId: '-1' //判断是否是首页跳转
			}
		},
		onLoad(options) {
			console.log(options)
			this.indexId = options.indexId
			this.navigationBarStyle.iconText = options.category
			if(options.indexId == '-1') {
				this.specialParams.specialId = options.cateId
				this.getSpecialGoodsList()
			} else {
				this.params.cateId = options.cateId //5034
				this.getCagetogyList()
			}
		},
		onShow() {

		},
		//到达页面底部时触发的事件
		onReachBottom() {
			if(this.indexId == '-1') {
				if (this.specialGoodsList.length >= this.specialGoodsData.total) {
					return;
				}
				this.specialParams.page++;
				this.getSpecialGoodsList()
			} else {
				if (this.shopList.length >= this.shopData.total) {
					return;
				}
				this.params.page++;
				this.getCagetogyList()
			}
		},
		methods: {
			initData() {
				//重置分页参数
				if(this.indexId == '-1') {
					this.specialGoodsData = {}
					this.specialGoodsList = []
					this.specialParams.page = 1
					this.getSpecialGoodsList()
				} else {
					this.shopData = {}
					this.shopList = []
					this.params.page = 1
					this.getCagetogyList()
				}
			},
			//获取分类下的商品列表
			getCagetogyList() {
				let that = this;
				interfaceurl.checkAuth(interfaceurl.categoryList, this.params, false).then((res) => {
					that.loading = false
					that.shopData = res.data
					if(that.params.page == 1) {
						that.shopList = res.data.data
					} else {
						that.shopList = that.shopList.concat(res.data.data)
					}
					that.tempList = that.shopList
				});
			},
			shopDetailPage(item) {
				this.$store.commit('setGoodsDetail', item)
				this.$turnPage('/pages/index/business/shop-detail?spuId='+item.spuId, 'navigateTo')
			},
			//获取专区商品列表
			getSpecialGoodsList() {
				let that = this;
				interfaceurl.checkAuth(interfaceurl.specialGoodsList, this.specialParams, false).then((res) => {
					that.specialGoodsData = res.data
					if (that.specialParams.page == 1) {
						that.specialGoodsList = res.data.data
					} else {
						that.specialGoodsList = that.specialGoodsList.concat(res.data.data)
					}
					that.tempList = that.specialGoodsList
					console.log('getSpecialGoodsList',that.tempList)
				});
			},
		}
	}
</script>

<style lang="scss">
	page {
		background: #F0F0F0;
	}

	.content {
		padding-top: 10rpx;
	}

	.shop-title {
		display: flex;
		align-items: center;
		font-size: 32rpx;
		color: #000000;
		font-weight: 500;
	}

	.shop-title-line {
		display: inline-block;
		width: 10rpx;
		height: 32rpx;
		background-color: #FF8336;
		margin-right: 20rpx;
	}

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
		padding: 0rpx 20rpx;
		padding-top: 10rpx;
		padding-bottom: 20rpx;
	}

	.shop-item-title {
		height: 60rpx;
		font-size: 26rpx;
		color: #333333;
		margin: 10rpx;
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

	.pay-btn {
		display: inline-block;
		width: 32rpx;
		height: 32rpx;
		line-height: 26rpx;
		border-radius: 100%;
		text-align: center;
		color: #ff0033;
		color: #ffffff;
		background: #ff0033;
	}
</style>
