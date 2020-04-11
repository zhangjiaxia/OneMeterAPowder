<template>
	<view>
		<navigationBar :navigationBarStyle="navigationBarStyle"></navigationBar>
		<view class="content">
			<view class="shop-list" v-if="shopList.length > 0">
				<view class="shop-item" v-for="(content,dex) in shopList" @click="shopDetailPage(content)" :key="dex">
					<image :src="content.mainImgUrl" class="shop-img"></image>
					<view class="shop-item-content">
						<view class="shop-item-bottom">
							<text class="shop-item-price">￥{{content.retailPrice[0] || 0}}</text>
							<text class="pay-btn">+</text>
						</view>
						<view class="shop-item-title">{{content.name}}</view>
					</view>
				</view>
			</view>
			<view class="empty-text" v-else>
				<template v-if="!loading">
					<view>暂无数据</view>
				</template>
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
					background: '#0071CF',
					fontColor: '#FFFFFF',
					iconColor: '#FFFFFF',
					iconText: '类目详情' //导航栏文字
				},
				shopList: [],
				loading: true
			}
		},
		onLoad(options) {
			this.navigationBarStyle.iconText = options.category
			this.getCagetogyList(options.cateId)
		},
		onShow() {

		},
		methods: {
			//获取分类下的商品列表
			getCagetogyList(cateId) {
				let that = this;
				let params = {
					cateId: cateId, //5034
					page: 1,
					size: 10
				}
				interfaceurl.checkAuth(interfaceurl.categoryList, params, false).then((res) => {
					that.loading = false
					that.shopList = res.data.data
				});
			},
			shopDetailPage(item) {
				this.$store.commit('setGoodsDetail', item)
				this.$turnPage('/pages/index/business/shop-detail', 'navigateTo')
			}
		}
	}
</script>

<style lang="scss">
	page {
		background: #F0F0F0;
	}

	.content {
		padding: 0rpx 10rpx;
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
	}

	.shop-item {
		width: 360rpx;
		margin-bottom: 20rpx;
		background-color: #ffffff;
	}

	.shop-img {
		width: 100%;
		height: 300rpx;
	}

	.shop-item-content {
		padding: 0rpx 20rpx;
		padding-top: 10rpx;
		padding-bottom: 20rpx;
	}

	.shop-item-title {
		font-size: 26rpx;
		color: #333333;
		font-weight: bold;
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
		margin-bottom: 10rpx;
	}

	.shop-item-price {
		font-weight: bold;
		color: #0071CF;
		font-size: 36rpx;
	}

	.pay-btn {
		display: inline-block;
		width: 32rpx;
		height: 32rpx;
		line-height: 26rpx;
		border-radius: 100%;
		text-align: center;
		color: #0071CF;
		color: #ffffff;
		background: #0071CF;
	}
</style>
