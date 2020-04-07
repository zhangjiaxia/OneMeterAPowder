<template>
	<view class="container">
    
		<view style="background: #ffffff;">
		  <view class="search-container">
			<image src="/static/logo.png" class="logo"></image>
			<view class="search" @click="searchPage">
			  <image src="/static/search.png" class="search-icon"></image>
			  <text>搜索</text>
			</view>
		  </view>

		  <view style="padding:0upx 30upx;transform: translateY(-100upx);">
			<swiper class="swiper" :autoplay="autoplay" circular :interval="interval" :duration="duration">
			  <swiper-item v-for="(item,index) in bannerList" :key="index">
				 <image :src="item.bannerUrl" class="banner-img"></image>
			  </swiper-item>
			</swiper>  
		  </view>

		  <view class="tab-list" style="padding-top: 0px;padding-bottom: 0px;position: relative;top:-50upx;">
			<view class="advantage-item">
			  <image src="/static/advantage1.png" class="advantage-icon"></image>
			</view>
			<view class="advantage-item">
			  <image src="/static/advantage2.png" class="advantage-icon"></image>
			</view>
			<view class="advantage-item">
			  <image src="/static/advantage3.png" class="advantage-icon"></image>
			</view>
			<view class="advantage-item">
			  <image src="/static/advantage4.png" class="advantage-icon"></image>
			</view>
		  </view>

		  <view class="tab-list" style="padding-top: 0px;">
			<view v-for="(item,index) in iconTypeList" :key="index" class="tab-item" @click="shopListPage(item)"> 
			  <image :src="item.iconTypeUrl" class="type-icon"></image>
			  <view>{{item.iconTypeName}}</view>
			</view>
		  </view>

		  <view class="type-list">
			<view class="type-item" v-for="(item, index) in specialAreaPicList" :key="index">
			  <image :src="item.specialImgUrl"></image>
			</view>
		  </view>

		  <view class="category-list">
			<view class="category-item" v-for="(item,index) in specialAreaTextList" :key="index" @click="selectTab(index)">
			  <view><text :class="{'category-item-active':tabIndex == index}">{{item.specialTitle}}</text></view>
			  <view><text class="category-item-text">{{item.specialName}}</text></view>
			</view>
		  </view>
		</view>

		<view class="content">
			<view class="shop-list">
				<view class="shop-item" v-for="(content,dex) in specialGoodsList" @click="shopDetailPage(content)" :key="dex">
					<image :src="content.mainImgUrl" class="shop-img"></image>
					<view class="shop-item-content">
						<view class="shop-item-bottom">
						  <text class="shop-item-price">￥{{content.goods_price}}</text>
						  <text class="pay-btn">+</text>
						</view>
						<view class="shop-item-title">{{content.name}}</view>
					</view>
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
  // import { apiBannerList, apiShopList, apiUserCode, apiUserInfo, apiUserBind, apiUserLogin, apiTypeList } from '@/service/index'
	import interfaceurl from '@/utils/interface.js'
	export default {
		data() {
			return {
				indicatorDots: true,
				autoplay: true,
				interval: 2000,
				duration: 500,
				shopList: [{
				  goods_cover_img: '/static/shop.png',
				  goods_name: '红牡丹抽色润颜霜 均匀亮白十全十美套盒',
				  goods_price: '30.00'
				}],
				categoryList: [{
				  title: '今日特卖',
				  remark: '特价销售'
				}, {
				  title: '人气商品',
				  remark: '大家都在买'
				}, {
				  title: '热卖商店',
				  remark: '大家都在逛'
				}, {
				  title: '销量冠军',
				  remark: '最多人买'
				}],
				invitation_code: '',
				typeList: [{
				  type_icon_img: '/static/tab1.png',
				  type_name: '送礼优选'
				}, {
				  type_icon_img: '/static/tab2.png',
				  type_name: '数码CP'
				}, {
				  type_icon_img: '/static/tab3.png',
				  type_name: '女神专属'
				}, {
				  type_icon_img: '/static/tab4.png',
				  type_name: '节日专区'
				}, {
				  type_icon_img: '/static/tab5.png',
				  type_name: '生鲜特卖'
				}, {
				  type_icon_img: '/static/tab6.png',
				  type_name: '佣金'
				}, {
				  type_icon_img: '/static/tab7.png',
				  type_name: '原始股权'
				}, {
				  type_icon_img: '/static/tab8.png',
				  type_name: 'VIP会员'
				}, {
				  type_icon_img: '/static/tab9.png',
				  type_name: '积分股权'
				}, {
				  type_icon_img: '/static/tab10.png',
				  type_name: '商学院'
				}],
				//动态数据
				bannerList: ['/static/banner.png'], //轮播图
				iconTypeList: [], //小图标
				specialAreaPicList: [], //专区图片
				specialAreaTextList: [], //专区文字
				tabIndex: 0, //选择的专区索引
				specialGoodsList: [], //专区商品
				championList: [] //销量冠军
			}
		},
    onShareAppMessage(res) {
      return {
        title: '一米一粉',
        path: '/pages/index/index?code='+this.invitation_code,
        imageUrl: '/static/banner.png'
      }
    },
    onLoad(options) {
      console.log('options')
      console.log(options)
      return
      const login = uni.getStorageSync('login');
      if(!login) {
        return
        uni.login({
          provider: 'weixin',
          success: function (res) {
            apiUserLogin({
              code: res.code
            })
            .then((res) => {
              if(res.code == 0) {
                uni.setStorageSync('token', res.data.token);
                uni.setStorageSync('login', true);
                if(options.code) {
                  apiUserBind({
                    scene_value: options.code
                  })
                  .then((res) => {

                  })
                }
                if(options.scene) {
                   apiUserBind({
                     scene_value: options.scene
                   })
                   .then((res) => {

                   })
                }
                if(options.query && options.query.scene) {
                   apiUserBind({
                     scene_value: options.query.scene
                   })
                   .then((res) => {

                   })
                }
              }
            })
          }
        });
      }else {
        return
        if(options.code) {
          apiUserBind({
            scene_value: options.code
          })
          .then((res) => {

          })
        }
        if(options.scene) {
           apiUserBind({
             scene_value: options.scene
           })
           .then((res) => {

           })
        }
        if(options.query && options.query.scene) {
           apiUserBind({
             scene_value: options.query.scene
           })
           .then((res) => {

           })
        }
      }
    },
		onShow() {
			this.getBannerList()
			this.getIconTypeList()
			this.getSpecialAreaList(1)
			this.getSpecialAreaList(2)
			//this.getSpecialGoodsList()
			//this.getChampionList()
      // this.getShopList()
      // this.getUserCode()
      // this.getTypeList()
		},
		methods: {
			 selectTab(index) {
				this.tabIndex = index
				this.getSpecialGoodsList()
			 },
			  getUserCode() {
				apiUserInfo()
				.then((res) => {
				  if(res.code == 0) {
					this.invitation_code = res.data.invitation_code
				  }
				})
			  },
			  getTypeList() {
				apiTypeList()
				.then((res) => {
				  if(res.code == 0) {
					this.typeList = res.data
				  }
				})
			  },
			  shopDetailPage(item) {
				this.$store.commit('setGoodsDetail', item)
				this.$turnPage('/pages/index/shop-detail', 'navigateTo')
			  },
			  shopListPage(item) {
				uni.navigateTo({
					url: '/pages/shop-list/shop-list?id='+item.goods_type_id
				});
			  },
			  searchPage() {
				uni.navigateTo({
					url: '/pages/index/search'
				});
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
				  interfaceurl.checkAuth(interfaceurl.specialAreaList, {specialType: specialType}, false).then((res) => {
					  if(specialType == 1) {
						  that.specialAreaPicList = res.data
					  } else {
						  that.specialAreaTextList = res.data
					  }
					  if(that.specialAreaTextList.length > 0) {
						  that.getSpecialGoodsList();
					  }
				  });
			  },
			  //获取专区商品列表
			  getSpecialGoodsList() {
				  let that = this;
				  let params = {
					  page: 1,
					  size: 2,
					  specialId: that.specialAreaTextList[that.tabIndex].specialId
				  }
				  interfaceurl.checkAuth(interfaceurl.specialGoodsList, params, false).then((res) => {
						that.specialGoodsList = res.data.data
						console.log('that.specialGoodsList',that.specialGoodsList)
				  });
			  },
			  //销量冠军
			  getChampionList() {
				  let that = this;
				  let params = {
					  page: 1,
					  size: 2
				  }
				  interfaceurl.checkAuth(interfaceurl.championList, params, false).then((res) => {
				  		that.championList = res.data
				  });
			  },
			  getShopList() {
				apiShopList({
				  page: 1
				})
				.then((res) => {
				  if(res.code == 0) {
					this.shopList = res.data.data
				  }
				})
			  }
		}
	}
</script>

<style>
	.sharebtn {
		height: 100rpx;
		position: relative;
		top: -110rpx;
		opacity: 0;
	}
.search-container{
  height: 230upx;
  background: #0071CF;
  display: flex;
  padding: 30upx;
  box-sizing: border-box;
}
.logo{
  width: 160upx;
  height: 39upx;
  margin-right: 20upx;
  position: relative;
  top: 10upx;
}
.search{
  width: 360upx;
  height: 60upx;
  background: #ffffff;
  border-radius: 30upx;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 26upx;
  color: #000000;
}
.search-icon{
  width: 30upx;
  height: 30upx;
  margin-right: 10upx;
}
.swiper{
	width: 100%;
	height: 390upx;
}
.banner-img{
	width: 100%;
	height: 100%;
}
.advantage-item{
  flex: 1;
  text-align: center;
}
.advantage-icon{
  width: 69upx;
  height: 20upx;
}
.tab-list{
  padding: 20upx 30upx;
  display: flex;
  flex-wrap: wrap;
  background: #ffffff;
  justify-content: space-between;
}
.tab-item{
  width: 120upx;
  text-align: center;
  color: #222222;
  font-size: 22upx;
  margin-bottom: 20upx;
}
.type-icon{
  width: 90upx;
  height: 90upx;
}
.type-list{
  padding: 20upx 30upx;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  background: #ffffff;
}
.type-item{
  width: 336upx;
  height: 170upx;
  margin-bottom: 10upx;
}
.type-item image{
  width: 100%;
  height: 100%;
}
.content{
	padding: 0upx 10upx;
}
.shop-title{
	display: flex;
	align-items: center;
	font-size: 32upx;
	color: #000000;
	font-weight: 500;
}
.shop-title-line{
	display: inline-block;
	width: 10upx;
	height: 32upx;
	background-color: #FF8336;
	margin-right: 20upx;
}
.shop-list{
	display: flex;
	flex-wrap: wrap;
	justify-content: space-between;
  margin-top: 10upx;
}
.shop-item{
	width: 360upx;
	margin-bottom: 20upx;
	background-color: #ffffff;
}
.shop-img{
	width: 100%;
	height: 300upx;
}
.shop-item-content{
	padding: 0upx 20upx;
	padding-top: 10upx;
	padding-bottom: 20upx;
}
.shop-item-title{
	font-size: 26upx;
	color: #333333;
	font-weight: bold;
}
.shop-item-text{
	color: #999999;
	margin-top: 20upx;
	font-size: 26upx;
  display: inline-block;
  max-width: 260upx;
  overflow: hidden;
  text-overflow:ellipsis;
  white-space: nowrap;
}
.shop-item-bottom{
	display: flex;
	justify-content: space-between;
	align-items: center;
  margin-bottom: 10upx;
}
.shop-item-price{
	font-weight: bold;
  color: #0071CF;
  font-size: 36upx;
}
.pay-btn{
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
.share{
  width: 100upx;
  height: 100upx;
  border-radius: 100%;
  position: fixed;
  right: 30upx;
  bottom: 30upx;
}
.share image{
  width: 100%;
  height: 100%;
}
.category-list{
  display: flex;
  align-items: center;
  padding: 30upx;
  padding-top: 10upx;
  color: #333333;
  font-size: 32upx;
  background: #ffffff;
}
.category-item{
  flex: 1;
  text-align: center;
}
.category-item-text{
  font-size: 23upx;
  color: #999999;
}
.category-item-active{
  color: #F13646;
}
</style>
