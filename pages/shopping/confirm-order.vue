<template>
	<view class="container">

		<view class="content">

			<view class="address" @click="addressPage">
				<image src="/static/location.png" class="location-icon"></image>

				<view class="address-text" v-if="addressItem.address_id">
					<view>
						<text class="user-name">{{addressItem.contact_name}}</text>
						<text>{{addressItem.contact_mobile}}</text>
					</view>
					<view>{{addressItem.address}}</view>
				</view>
        <view v-else class="address-text">请选择收货地址</view>
				<image src="/static/arrow.png" class="edit-icon" mode="widthFix"></image>
			</view>

			<view class="shop-message">

				<view class="shop-item" v-for="(item,index) in  shopList" :key="index">
					<image :src="item.goods_cover_img" class="shop-img"></image>
					<view class="shop-item-content">
						<view class="shop-item-title">{{item.goods_name}}</view>
						<!-- <view class="shop-item-spec">
							<view>50ml</view>
						</view> -->
						<view class="shop-item-bottom">
							<text>x{{item.shopNum}}</text>
							<text class="color-price">￥{{item.goods_price || ''}}</text>
						</view>
					</view>
				</view>

				<view class="order-message">
					<text>快递</text>
					<text class="color-active">￥{{delivery_fee || '0.00'}}</text>
				</view>

				<view class="order-message">
					<text style="font-size: 32upx;">小计:</text>
					<text class="color-price">￥{{total}}</text>
				</view>
			</view>

			<view class="order-remark">
				<view>订单备注</view>
        <textarea placeholder-style="color:#999999" placeholder="请填写相关备注" v-model="remark"/>
			</view>

		</view>

		<view class="order-bottom">
			<view>
				<text>总价:</text>
				<text class="color-price">￥{{total}}</text>
			</view>
			<view class="pay-btn" @click="onSubmit">付款</view>
		</view>

	</view>
</template>

<script>
  // import { apiOrderDetail, apiOrderSubmit, apiOrderFee, apiUserInfo, apiCouponList } from '@/service/index'
	export default {
		data() {
			return {
				tabIndex: 0,
				id: '',
				status: 1,
				shopNum: 1,
				shopList: [],
				addressItem: {},
				remark: '',
				mobile: '',
				cardId: [],
				total: '0.00',
				orderAmout: 0,
				delivery_fee: '',
				detail: {},
				couponId: '',
				couponText: '',
				couponItem: {},
				isCoupon: false
			}
		},
		onLoad(options) {
      this.shopList = uni.getStorageSync('shopList');
      // this.shopList.forEach((item) => {
      // 	if(item.cart_id){
      //     this.cardId.push(item.cart_id)
      // 	}else {
      //     this.getDetail(item)
      // 	}
      // })
      // this.getOrderFee()
      // this.getUserInfo()
      // uni.removeStorageSync('addressItem');
		},
		onShow() {
      const value = uni.getStorageSync('addressItem');
      if(value){
      	this.addressItem = uni.getStorageSync('addressItem');
      }
		},
		methods: {
      selectTab(index) {
        this.tabIndex = index
        this.getTotalFee()
      },
      getUserInfo() {
        apiUserInfo()
        .then((res) => {
          if(res.code == 0) {
            this.detail = res.data
          }
        })
      },
      getOrderFee() {
        apiOrderFee()
        .then((res) => {
          if(res.code == 0) {
            this.delivery_fee = res.data.delivery_fee
            this.getTotalFee()
          }
        })
      },
			getTotalFee() {
        let total = 0
        this.shopList.forEach((item) => {
        	total = total + item.shopNum * parseFloat(item.goods_price)
        })
        if(this.tabIndex == 1) {
          total = total + parseFloat(this.delivery_fee)
        }
        this.total = total.toFixed(2)
        this.orderAmout = this.total
			},
			getDetail(item) {
        apiOrderDetail({
        	goods_id: item.goods_id,
        	buy_number: item.shopNum
        })
        .then((res) => {
        	if(res.code == 0) {
            this.cardId.push(res.data.cart_id)
        	}
        })
			},
			addressPage() {
        uni.navigateTo({
          url: '/pages/address/address?origin=2'
        });
			},
			onSubmit() {
        if(this.tabIndex == 0 && !this.mobile) {
          uni.showToast({
            title: '自提请填写手机号码',
            icon: 'none',
            duration: 2000
          });
          return
        }
				if(this.tabIndex == 1 && !this.addressItem.address_id) {
          uni.showToast({
            title: '请选择收货地址',
            icon: 'none',
            duration: 2000
          });
          return
				}
        let params = {
          cart_id: this.cardId.join(','),
          remark: this.remark,
          take_fashion: parseInt(this.tabIndex) + 1
        }
        if(this.tabIndex == 0) {
          params.take_mobile = this.mobile
        }
        if(this.tabIndex == 1) {
          params.address_id = this.addressItem.address_id
        }
				apiOrderSubmit(params)
				.then((res) => {
					if(res.code == 0) {
						const self = this
            if(!res.data) {
              self.successPage()
              return
            }
            uni.requestPayment({
                provider: 'wxpay',
                timeStamp: res.data.timeStamp,
                nonceStr: res.data.nonceStr,
                package: res.data.package,
                signType: 'MD5',
                paySign: res.data.paySign,
                success: function (res) {
                  self.successPage()
                },
                fail: function (err) {
                  uni.showToast({
                    title: '支付失败',
                    icon: 'none',
                    duration: 2000
                  });
                }
            });
					}
				})
			},
			successPage() {
				uni.navigateTo({
				  url: '/pages/success/success'
				});
			}
		}
	}
</script>

<style>
.container{
	padding-bottom: 130upx;
}
.content{
	padding: 20upx 30upx;
}
.tab-list{
  padding: 30upx;
  background: #ffffff;
  display: flex;
  justify-content: space-between;
  margin-bottom: 20upx;
}
.tab-item{
  width: 335upx;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10upx;
  box-shadow:0px 1px 10px 0px rgba(0, 0, 0, 0.2);
  color: #333333;
  box-sizing: border-box;
}
.tab-item-active{
  border: 3upx solid rgba(0,41,92,1);
  color: #00295C;
}
.tab-item image{
  width: 50upx;
  height: 50upx;
  margin-right: 30upx;
}
.address{
	padding: 20upx 30upx;
	background: #ffffff;
	display: flex;
	align-items: center;
	border-radius: 10upx;
}
.address-text{
	flex: 1;
	font-size: 26upx;
}
.user-name{
	margin-right: 30upx;
}
.location-icon{
	width: 36upx;
	height: 36upx;
	margin-right: 30upx;
}
.edit-icon{
	width: 13upx;
}
.type{
	margin-top: 20upx;
	height: 100upx;
	background-color: #ffffff;
	display: flex;
	align-items: center;
	font-size: 26upx;
	color: #666666;
	padding: 0upx 30upx;
	border-radius: 10upx;
}
.type-title{
	font-size: 30upx;
	font-weight: bold;
	flex: 1;
}
.radio-icon{
	width: 36upx;
	height: 36upx;
	margin-left: 20upx;
}
.shop-message{
	margin-top: 20upx;
	border-radius: 20upx;
	padding: 20upx 30upx;
	background-color: #ffffff;
}
.shop-item{
	display: flex;
	align-items: center;
	margin-bottom: 20upx;
	border-bottom: 1px solid #f5f5f5;
}
.shop-img{
	width: 160upx;
	height: 160upx;
	margin-right: 30upx;
}
.shop-item-content{
	flex: 1;
	font-size: 26upx;
}
.shop-item-title{
	font-size: 22upx;
	margin-bottom: 10upx;
}
.shop-item-spec{
	border-radius: 6upx;
	background: #EEEEEE;
	padding: 6upx;
	font-size: 23upx;
	color: #999999;
}
.shop-item-bottom{
	margin-top: 10upx;
	display: flex;
	align-items: center;
	justify-content: space-between;
}
.order-message{
	margin-top: 20upx;
	font-size: 23upx;
	text-align: right;
}
.color-active{
	color: #FF0000;
	margin-left: 10upx;
}
.order-remark{
	margin-top: 30upx;
	font-size: 26upx;
	background-color: #ffffff;
	padding: 30upx;
	padding-bottom: 20upx;
	border-radius: 20upx;
}
.order-remark textarea{
	width: 100%;
	height: 130upx;
	margin-top: 10upx;
	background: #F5F5F5;
	padding: 20upx;
	box-sizing: border-box;
}
.order-bottom{
	width: 100%;
	height: 100upx;
	background-color: #ffffff;
	padding: 0upx 20upx;
	position: fixed;
	left: 0px;
	bottom: 0px;
	display: flex;
	justify-content: space-between;
	align-items: center;
	box-sizing: border-box;
}
.color-price{
	color: #FF4444;
	margin-left: 10upx;
	font-size: 32upx;
}
.pay-btn{
	width: 260upx;
	text-align: center;
	color: #ffffff;
	border-radius: 30upx;
	height: 39px;
	line-height: 39px;
	background: #016ECD;
}
</style>
