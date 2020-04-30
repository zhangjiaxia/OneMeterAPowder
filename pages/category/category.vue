<template>
	<view class="container">
		<view class="bar-sticky">
			<navigationBar :navigationBarStyle="navigationBarStyle" :showBack="false" @getHeight="getBarHeight"></navigationBar>
		</view>
		<view class="category-content" :style="{height: scrollHeight}">
			<scroll-view class="category-left" scroll-y="true">
				<view v-for="(item,index) in topCagetogyList" :key="index" class="category-item" :class="{'category-item-active':item.cateId == id}" 
					@click="selectTab(item)">
					{{item.cateName}}
				</view>
			</scroll-view>
			<view class="category-right">
				<view class="shop-list">
					<view class="banner" v-if="chooseItem.iconImgUrl">
						<image :src="chooseItem.iconImgUrl" class="banner-img"></image>
					</view>
					<view class="classify" v-for="(item, index) in categoryList" :key="index">
						<view class="goodstitle" style="margin-bottom: 20rpx;text-align: left;" 
							@click="$turnPage('/pages/category/search/category-detail?indexId=0&cateId='+item.cateId, 'navigateTo')">
							{{item.cateName}}
						</view>
						<view style="height: auto;overflow: auto;">
							<view class="uni-flex content space" v-for="(subItem, i) in item.childList" :key="i" 
								@click="$turnPage('/pages/category/search/category-detail?indexId=0&cateId='+subItem.cateId+'&category='+subItem.cateName, 'navigateTo')">
								<image :src="subItem.iconImgUrl" class="goodsimg"></image>
								<view class="goodstitle">{{subItem.cateName}}</view>
							</view>
						</view>
					</view>
					<view class="empty-text" v-if="categoryList.length == 0">暂无商品数据</view>
				</view>
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
					iconText: '类目' //导航栏文字
				},
				scrollHeight: '0rpx', //设置滚动区域的高度
				indicatorDots: true,
				autoplay: true,
				interval: 2000,
				duration: 500,
				bannerList: [],
				id: 1,
				//动态参数
				chooseItem: {}, //当前选中的一级分类
				topCagetogyList: [], //获取一级分类
				categoryList: [] //获取二级和三级分类
			}
		},
		onLoad(options) {
			this.getTopCagetogyList()
		},
		onShow() {
			
		},
		methods: {
			getBarHeight(systemInfo) {
				//滚动区域等于窗体高度（不包含底部tab高度）-状态栏高度-导航栏高度
				this.scrollHeight = (systemInfo.ktxWindowHeight - systemInfo.ktxStatusHeight - systemInfo.navigationHeight) + 'rpx'
			},
			//获取一级分类
			getTopCagetogyList() {
				let that = this;
				interfaceurl.checkAuth(interfaceurl.firstList, {}, false).then((res) => {
					that.chooseItem = res.data[0]
					console.log('chooseItem', that.chooseItem)
					that.topCagetogyList = res.data
					that.id = that.topCagetogyList[0].cateId
					that.getCategoryList()
				});
			},
			//获取子分类
			getCategoryList() {
				let that = this;
				let params = {
					cateId: that.id,
					page: 2,
					size: 10
				}
				interfaceurl.checkAuth(interfaceurl.childList, params, false).then((res) => {
					that.categoryList = res.data
				});
			},
			selectTab(item) {
				this.chooseItem = item
				this.id = item.cateId
				this.getCategoryList();
			}
		}
	}
</script>

<style lang="scss">
	/* uni.css - 通用组件、模板样式库，可以当作一套ui库应用 */
	@import '/common/uni.css';
	/*自定义公共样式*/
	@import '/common/custom.css';
	.swiper{
		width: 100%;
		height: 320upx;
	  margin-bottom: 20upx;
	}
	.banner-img{
		width: 530rpx;
		height: 175rpx;
		border-radius: 10upx;
		// width: 100%;
		// height: 100%;
	}
	.category-content {
		height: 100%;
		display: flex;
	}
	.category-left{
		height: 100%;
		width: 180upx;
		background-color: #EEEEEE;
	}
	.category-right{
		flex: 1;
		height: 100%;
		padding-top: 20rpx;
		padding-left: 20rpx;
		background: #ffffff;
		box-sizing: border-box;
		overflow: auto;
	}
	.category-item{
		height: 100upx;
		line-height: 100upx;
		text-align: center;
	}
	.category-item-active{
		background-color: #FFFFFF;
		position: relative;
		color: #333333;
	}
	.category-item-active:after{
		content: '';
		width: 6upx;
		height: 60upx;
		background-color: #ff0033;
		position: absolute;
		left: 0px;
		top: 20upx;
	}
	.shop-list{
		// padding: 10upx;
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
	}
	.empty-text{
		display: inline-block;
		width: 100%;
		text-align: center;
	}
	.classify {
		margin-bottom: 60rpx;
		width: 100%;
		.space {
			float: left;
			width: 180rpx;
			margin-bottom: 30rpx;
			// height: 204rpx;
		}
		.goodsimg {
			width: 120rpx;
			height: 120rpx;
		}
		.goodstitle {
			color: #333333;
			font-size: 24rpx;
			text-align: center;
		}
	}
</style>
