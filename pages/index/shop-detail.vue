<template>
	<view class="container">
		<swiper class="swiper" circular :autoplay="autoplay" :interval="interval" :duration="duration">
      <swiper-item v-for="(item,index) in bannerList" :key="index">
         <image :src="item" class="banner-img"></image>
      </swiper-item>
    </swiper>
    
    <view class="shop-message">
    	<view class="shop-title">{{goodsDetail.name || ''}}</view>
    	<view class="shop-price">￥{{detail.goods_price || '0.00'}}</view>
    </view>

    <view class="tab-list">
      <view class="tab-item">
        <image src="/static/pay-success.png" class="tab-icon"></image>
        <text>正品保证</text>
      </view>
    	<view class="tab-item">
    		<image src="/static/pay-success.png" class="tab-icon"></image>
    		<text>全场包邮</text>
    	</view>
    	<view class="tab-item">
    		<image src="/static/pay-success.png" class="tab-icon"></image>
    		<text>全场钜惠</text>
    	</view>
    	<view class="tab-item">
    		<image src="/static/pay-success.png" class="tab-icon"></image>
    		<text>售后无忧</text>
    	</view>
    </view>

    <view class="detail">
      <view class="rich-text">
        <view v-html="detail.goods_details"></view>
      </view>
    </view>

    <view class="detail-bottom">
    	<view class="detail-bottom-left">
    		<view class="detail-bottom-item">
    			<image src="/static/share-icon.png" class="share-icon"></image>
    			<view>分享</view>
          <button type="primary" open-type="share" class="share-btn"></button>
    		</view>
    		<view class="detail-bottom-item">
    			<image src="/static/shopping-icon.png" class="share-icon"></image>
    			<view @click="shoppingPage">购物车</view>
    		</view>
    	</view>
    	<view class="shop-btn" @click="confrimOrderPage">加入购物车</view>
    	<view class="pay-btn" @click="confrimOrderPage">立即购买</view>
      <button class="search-btn" open-type="getUserInfo" lang="zh_CN" @getuserinfo="getUserInfo" v-if="!userInfo"></button>
    </view>


    <view class="confirm-modal" v-show="confirmModal">
    	<view class="confirm-modal-content">
    		<view class="modal-shop-message">
    			<image :src="detail.goods_cover_img" class="modal-shop-img"></image>
    			<view class="modal-shop-content">
    				<view>{{detail.goods_name}}</view>
    				<view class="shop-price">￥{{detail.goods_price}}</view>
    				<view class="amount">库存 {{detail.goods_stock}} 件</view>
    			</view>
    		</view>

    		<!-- <view class="spec-content">
    			<view></view>
    			<view class="spec-list">
    				<text class="spec-item spec-active">50ml</text>
    				<text class="spec-item">80ml</text>
    				<text class="spec-item">100ml</text>
    			</view>
    		</view> -->

    		<view class="shop-item-bottom">
    			<text>购买数量</text>
    			<view class="shop-num">
    				<text class="reduct-btn" @click="reduceNum">-</text>
    				<text class="num">{{shopNum}}</text>
    				<text class="add-btn" @click="addNum">+</text>
    			</view>
    		</view>

    		<view class="modal-bottom">
          <text class="modal-bottom-right" @click="confirmModal = false">查看详情</text>
    			<text class="modal-bottom-left" @click="handleConfirm">确认</text>
    		</view>
    	</view>
    </view>

	</view>
</template>

<script>
  // import { apiShopDetail, apiShoppingAdd, apiUserInfo, apiUserBind, apiUserInfoSave, apiUserLogin } from '@/service/index'
  import interfaceurl from '@/utils/interface.js'
  //引入store的内容
  import {
  	mapState,
  	mapMutations,
  	mapActions
  } from 'vuex'
  export default {
  	computed: mapState(['goodsDetail']),
		data() {
			return {
				id: '',
				confirmModal: false,
				indicatorDots: false,
				autoplay: true,
				interval: 2000,
				duration: 500,
				detail: {
				  goods_name: '红牡丹抽色润颜霜 均匀亮白十全十美套盒'
				},
				shopNum: 1,
				type: 1,
						bannerList: ['/static/banner.png'],
				shopItem: {},
				invitation_code: '',
				userInfo: {},
				is_cash_back: '0'
			}
		},
    onShareAppMessage(res) {
      return {
        title: '一米一粉',
        path: '/pages/shop-detail/shop-detail?id='+this.id + '&code='+ this.invitation_code,
        imageUrl: '/static/share-banner.png'
      }
    },
    onLoad(options) {
      console.log('detail')
      console.log(options)
      return
      this.id = options.id
      this.is_cash_back = options.is_cash_back
      const login = uni.getStorageSync('login');
      const self = this
      if(!login) {
        console.log('aaa')
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
                  console.log('code')
                  apiUserBind({
                    scene_value: options.code
                  })
                  .then((res) => {
                     
                  })
                }
                self.getShopDetail()
                self.getUserCode()
              }
            })
          }
        });
      }else {
        console.log('bbb')
        if(options.code) {
          apiUserBind({
            scene_value: options.code
          })
          .then((res) => {
             
          })
        }
        this.getShopDetail()
        this.getUserCode()
      }
    },
    onShow() {
		console.log('goodsDetail',this.goodsDetail)
      const value = wx.getStorageSync('userInfo')
      if(value){
        this.userInfo = value
      }
    },
		methods: {
			addCart() {
				let that = this;
				let params = {
					code: '' ,//商品sku
					quantity: 1
				}
				interfaceurl.checkAuth(interfaceurl.cartCreate, {}, false).then((res) => {
					that.bannerList = res.data
				});
			},
      getUserInfo(e) {
        console.log(e)
        this.userInfo = e.detail.userInfo
        if(e.detail.rawData){
          this.userInfo = JSON.parse(e.detail.rawData)
        }
        this.saveUserInfo()
      },
      saveUserInfo() {
        apiUserInfoSave({
          nickName: this.userInfo.nickName,
          gender: this.userInfo.gender,
          avatarUrl: this.userInfo.avatarUrl
        })
        .then((res) => {
          if(res.code == 0) {
            wx.setStorageSync('userInfo', this.userInfo)
          }
        })
      },
      getUserCode() {
        apiUserInfo()
        .then((res) => {
          if(res.code == 0) {
            this.invitation_code = res.data.invitation_code
          }
        })
      },
      reduceNum() {
        if(this.shopNum <= 1) {
         this.shopNum = 1
        }
        this.shopNum--
      },
      addNum() {
        this.shopNum++
      },
      handlePay(type) {
				if(type == 1 && this.is_cash_back == 1) {
					uni.showToast({
					  title: '全返商品请直接购买',
					  icon: 'none',
					  duration: 2000
					});
					return
				}
        this.type = type
        this.confirmModal = true
      },
      shoppingPage() {
        uni.switchTab({
          url: '/pages/shopping/shopping'
        });
      },
      handleConfirm() {
        this.confirmModal = false
        if(this.type == 1) {
          apiShoppingAdd({
            goods_id: this.id,
            buy_number: this.shopNum
          })
          .then((res) => {
            if(res.code == 0) {
              uni.showToast({
                title: '已加入购物车',
                icon: 'none',
                duration: 2000
              });
            }
          })
        }else{
          this.confrimOrderPage()
        }
      },
      getShopDetail() {
        apiShopDetail({
          goods_id: this.id
        })
        .then((res) => {
          if(res.code == 0) {
            this.bannerList = res.data.goods_banner
            this.detail = res.data
            this.detail.goods_details = this.handleImgHtml(res.data.goods_details)
          }
        })
      },
      handleImgHtml (str) {
        var richtext=  str
        const regex = new RegExp('<img', 'gi');
        richtext= richtext.replace(regex, `<img style="max-width: 100%;margin: 0px;padding:0px;vertical-align: top;"`);
        return richtext;
      },
			confrimOrderPage() {
        const shopItem = {
          goods_id: this.id,
          goods_price: this.detail.goods_price,
          goods_name: this.detail.goods_name,
          goods_cover_img: this.detail.goods_cover_img,
          is_cash_back: this.is_cash_back,
          shopNum: this.shopNum,
          cart_id: ''
        }
        let shopList = []
        shopList.push(shopItem)
        uni.setStorageSync('shopList', shopList)
				uni.navigateTo({
				  url: '/pages/confirm-order/confirm-order'
				});
			}
		}
	}
</script>

<style>
.container{
	background: #ffffff;
  padding-bottom: 130upx;
}
.swiper{
	width: 100%;
	height: 590upx;
}
.banner-img{
	width: 100%;
	height: 100%;
}
.shop-message{
	padding: 30upx;
	background: #ffffff;
}
.shop-title{
	font-size: 32upx;
	font-weight: bold;
}
.shop-price{
	font-size: 32upx;
	margin-top: 20upx;
	color: #FF0000;
}
.advantage{
	height: 80upx;
	padding: 0upx 30upx;
	background: #F5F5FA;
	color: #999999;
	font-size: 26upx;
	display: flex;
	align-items: center;
}
.advantage-text{
  color: #22AC38;
  margin-right: 30upx;
}
.advantage-icon{
	width: 39upx;
	height: 39upx;
	margin-right: 10upx;
}
.detail{
	margin-top: 20upx;
}
.detail-title{
	text-align: center;
	height: 80upx;
	line-height: 80upx;
	color: #CCCCCC;
	background: #D6F2F9;
}
.tab-list{
	display: flex;
	height: 80upx;
	padding: 0upx 30upx;
	background: #F5F5FA;
	margin-top: 20upx;
	align-items: center;
}
.tab-item{
  flex: 1;
  font-size: 26upx;
  color: #222222;
}
.tab-icon{
	width: 30upx;
	height: 30upx;
	margin-right: 10upx;
	vertical-align: middle;
	transform: translateY(-2upx);
}
.detail-bottom{
	width: 100%;
	height: 100upx;
	position: fixed;
	left: 0px;
	bottom: 0px;
	background: #f5f5f5;
	box-sizing: border-box;
	display: flex;
}
.shop-btn{
	width: 230upx;
	height: 100%;
  color: #ffffff;
	line-height: 100upx;
	text-align: center;
	background: #59ADF3;
}
.pay-btn{
	width: 230upx;
	height: 100%;
	color: #ffffff;
	line-height: 100upx;
	text-align: center;
	background: #0070CF;
}
.detail-bottom-left{
	flex: 1;
	display: flex;
	align-items: center;
	justify-content: center;
	color: #666666;
}
.share-icon{
	width: 32upx;
	height: 32upx;
}
.detail-bottom-item{
	width: 130upx;
	text-align: center;
	font-size: 26upx;
  position: relative;
}
.share-btn{
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0px;
  top: 0px;
  opacity: 0;
}
.confirm-modal-content{
	width: 100%;
	background: #ffffff;
	box-sizing: border-box;
	position: fixed;
	left: 0px;
	bottom: 0px;
	padding: 30upx;
	border-radius: 20upx 20upx 0upx 0upx;
}
.modal-shop-message{
	display: flex;
	align-items: center;
}
.modal-shop-img{
	width: 160upx;
	height: 160upx;
	border-radius: 10upx;
	margin-right: 30upx;
}
.modal-shop-content{
	flex: 1;
}
.amount{
	font-size: 26upx;
	color: #999999;
	margin-top: 10upx;
}
.spec-content{
	margin-top: 20upx;
	padding: 30upx 0upx;
	border-top: 1px solid #F5F5F5;
	border-bottom: 1px solid #F5F5F5;
}
.spec-list{
	display: flex;
	flex-wrap: wrap;
}
.spec-item{
	display: inline-block;
	height: 50upx;
	line-height: 50upx;
	padding: 0upx 20upx;
	border-radius: 10upx;
	margin-right: 10upx;
	background-color: #EEEEEE;
	color: #CCCCCC;
	font-size: 26upx;
}
.spec-active{
	color: #F39800;
	background: #FFF6E4;
}
.shop-item-bottom{
	margin-top: 30upx;
	display: flex;
	align-items: center;
	justify-content: space-between;
}
.shop-num{
	height: 39upx;
	line-height: 39upx;
	border: 1px solid #cccccc;
	border-radius: 10upx;
	text-align: center;
}
.reduct-btn{
	display: inline-block;
	width: 42upx;
	border-right: 1px solid #cccccc;
}
.num{
	display: inline-block;
	width: 65upx;
}
.add-btn{
	display: inline-block;
	width: 42upx;
	border-left: 1px solid #cccccc;
}
.modal-bottom{
	margin-top: 200upx;
	height: 80upx;
	line-height: 80upx;
	text-align: center;
	display: flex;
  justify-content: center;
}
.modal-bottom-left{
  display: inline-block;
  flex: 1;
  background: #FFDE2A;
  border-radius: 0upx 30upx 30upx 0upx;
}
.modal-bottom-right{
  display: inline-block;
  flex: 1;
  background: #EB6100;
  color: #ffffff;
  border-radius: 30upx 0upx 0upx 30upx;
}
.rich-text{
  width: 100%;
  overflow: hidden;
}
.rich-text image{
  width: 100%;
  height: auto;
}
p{
  margin: 0px;
  padding: 0px;
}
.search-btn{
  width: 100%;
  height: 100%;
  position: fixed;
  left: 0px;
  bottom: 0px;
  opacity: 0;
  z-index: 999;
}
</style>
