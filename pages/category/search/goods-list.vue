<template>
	<view>
		<navigationBar :navigationBarStyle="navigationBarStyle"></navigationBar>
		<view class="banner">
			<image src="/static/bussiness.png" class="banner-img"></image>
		</view>
		<view>
			<!-- :class="{'tab-hover': scrollTop < currentScrollTop}" 
				:style="{top: scrollTop < currentScrollTop ? '64px': '0'}"-->
			<scroll-view scroll-x="true" class="tab-list">
				<view class="tab" v-for="(item, index) in categoryChildrenList" :key="index" @click="selectTab(item.cateId)">
					<text class="tab-text" :class="{'tab-active': params.cateId == item.cateId}">{{item.cateName}}</text>
				</view>
			</scroll-view>
		</view>
		<view class="space">
			<view class="goods" :style="{'margin-right': index % 2 == 0 ? '20rpx' : '0'}"
				v-for="(item, index) in childrenGoodsList" :key="index" @click="shopDetailPage(item)">
				<view style="width: 100%;">
					<image :src="item.mainImgUrl" class="goodsimg"></image>
				</view>
				<view class="title">{{item.name.substring(0,25) + '...'}}</view>
				<view class="price">
					<text style="font-size: 24rpx;">￥</text>
					<text>{{item.retailPrice[0]}}</text>
				</view>
			</view>
		</view>
		<view class="empty-text" v-if="childrenGoodsList.length == 0 && !loading">暂无商品数据</view>
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
					iconText: '美妆护肤' //导航栏文字
				},
				currentScrollTop: 0, //当前页面的滚动高度
				//scrollTop: 140, //判断tablist是否悬浮的标准
				params: {
					page: 1,
					size: 10,
					cateId: 5034 //分类ID,选中的tab分类ID
				}, //二级分类下的商品
				categoryChildrenList: [] ,//tab栏数据
				childrenGoodsData: {}, //分类商品数据
				childrenGoodsList: [], //分类商品列表
				loading: true //加载中
			}
		},
		onLoad(options) {
			//this.getScrollTop()
			this.params.cateId = options.cateId
			this.navigationBarStyle.iconText = options.cateName
			this.getCategoryChildrenList();
		},
		// onPageScroll(e) {
		// 	//console.log('滚动监听',e)
		// 	this.currentScrollTop = e.scrollTop
		// },
		//到达页面底部时触发的事件
		onReachBottom() {
			if (this.childrenGoodsList.length >= this.childrenGoodsData.total) {
				return;
			}
			this.params.page++;
			this.getChildrenGoodsList()
		},
		methods: {
			//获取tablist是否滚动的阈值
			// getScrollTop() {
				
			// },
			shopDetailPage(item) {
				this.$store.commit('setGoodsDetail', item)
				this.$turnPage('/pages/index/business/shop-detail', 'navigateTo')
			},
			initData() {
				//重置分页参数
				this.loading = true
				this.childrenGoodsData = {}
				this.childrenGoodsList = []
				this.params.page = 1
				this.getChildrenGoodsList();
			},
			selectTab(cateId) {
				this.params.cateId = cateId
				this.initData()
			},
			getCategoryChildrenList() {
				let that = this;
				interfaceurl.checkAuth(interfaceurl.categoryChildrenList, { cateId: this.params.cateId }, false).then((res) => {
					that.categoryChildrenList = res.data
					that.params.cateId = that.categoryChildrenList[0].cateId
					this.initData();
				});
			},
			getChildrenGoodsList() {
				let that = this;
				interfaceurl.checkAuth(interfaceurl.childrenGoodsList, this.params, false).then((res) => {
					that.loading = false
					that.childrenGoodsData = res.data
					if(that.params.page == 1) {
						that.childrenGoodsList = res.data.data
					} else {
						that.childrenGoodsList = that.childrenGoodsList.concat(res.data.data)
					}
				});
			}
		}
	}
</script>

<style lang="scss">
	page {
		background: #F0EDF1;
	}
	.banner {
		.banner-img {
			width: 100%;
			height: 270rpx;
		}
	}
	.tab-hover {
		position: fixed;
		top: 0;
		z-index: 200;
	}
	.tab-list {
		height: 80rpx;
		background: #FFFFFF;
		//一行显示
		display: flex;
		flex-direction: row;
		white-space: nowrap;
		.tab {
			line-height: 76rpx;
			text-align: center;
			display: inline-block;
			// width: 120rpx;
			margin: 0 20rpx;
			.tab-text {
				font-size: 30rpx;
				color: #333333;
				height: 100%;
				display: block;
			}
			.tab-active {
				border-bottom: 4rpx solid #0071CF;
				color: #0071CF;
			}
		}
	}
	.space {
		//-webkit-overflow-scrolling: touch;
		width: 700rpx;
		margin: 0rpx auto;
		padding-top: 20rpx;
		margin-bottom: 40rpx;
		//父级div高度同子级高度
		height: auto;
		overflow: auto;
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
