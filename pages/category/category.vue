<template>
	<view class="container">
		<view class="content">
			<scroll-view class="category-left" scroll-y="true">
				<view v-for="(item,index) in topCagetogyList" :key="index" class="category-item" :class="{'category-item-active':item.cateId == id}" 
					@click="selectTab(item)">
					{{item.cateName}}
				</view>
			</scroll-view>
			<view class="category-right">
				<view class="shop-list">
					<view class="classify" v-for="(item, index) in categoryList" :key="index">
						<view class="goodstitle" style="margin-bottom: 20rpx;" 
							@click="$turnPage('/pages/category/category-detail?cateId='+item.cateId, 'navigateTo')">
							{{item.cateName}}
						</view>
						<view>
							<view class="space" v-for="(subItem, i) in item.childList" :key="i" 
								@click="$turnPage('/pages/category/category-detail?cateId='+subItem.cateId, 'navigateTo')">
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
	export default {
		data() {
			return {
				indicatorDots: true,
				autoplay: true,
				interval: 2000,
				duration: 500,
				bannerList: [],
				id: 1,
				//动态参数
				topCagetogyList: [], //获取一级分类
				categoryList: [] //获取二级和三级分类
			}
		},
		onLoad(options) {
			
		},
		onShow() {
			this.getTopCagetogyList()
		},
		methods: {
			//获取一级分类
			getTopCagetogyList() {
				let that = this;
				interfaceurl.checkAuth(interfaceurl.firstList, {}, false).then((res) => {
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
				this.id = item.cateId
				this.getCategoryList();
			}
		}
	}
</script>

<style lang="scss">
.content{
	height: 100%;
	display: flex;
}
.swiper{
	width: 100%;
	height: 320upx;
  margin-bottom: 20upx;
}
.banner-img{
	width: 100%;
	height: 100%;
	border-radius: 10upx;
}
.category-left{
	height: 100vh;
	width: 180upx;
	background-color: #EEEEEE;
}
.category-right{
	flex: 1;
	height: 100vh;
	padding: 20upx;
	padding-bottom: 130upx;
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
	background-color: #0071CF;
	position: absolute;
	left: 0px;
	top: 20upx;
}
.shop-list{
	padding: 10upx;
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
		.space {
			float: left;
			margin-right: 50rpx;
		}
		.goodsimg {
			width: 120rpx;
			height: 120rpx;
		}
		.goodstitle {
			color: #333333;
			font-size: 24rpx;
		}
	}
</style>
