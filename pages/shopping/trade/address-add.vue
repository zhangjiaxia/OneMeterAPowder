<template>
	<view class="container">
		<view class="bar-sticky">
			<navigationBar :navigationBarStyle="navigationBarStyle"></navigationBar>
		</view>
		<view class="form-item">
			<view>收货人</view>
			<input class="form-input" placeholder="请输入收货人姓名" placeholder-style="color:#BFBFBF;" v-model="saveParams.receiver" />
		</view>
		<view class="form-item">
			<view>手机号码</view>
			<input class="form-input" placeholder="请输入收货人手机号码" placeholder-style="color:#BFBFBF;" v-model="saveParams.receiverPhone" />
		</view>
		<view class="form-item">
			<view>选择地区</view>
			<view class="form-input content" @click="showMulLinkageThreePicker" style="position: relative;">
				<text style="position: absolute;right: 0;">{{saveParams.receiverAreaName || '请选择地区'}}</text>
			</view>
		</view>
		<view class="form-textarea">
			<text>详细地址:</text>
			<textarea auto-height placeholder-style="color:#BFBFBF" placeholder="请填写详细地址" class="textarea" v-model="saveParams.receiverAddr"
			 style="margin-top: 16rpx;" />
			</view>
		<view class="default-address" v-if="!forceDefault">
			<view>设为默认地址</view>
			<switch :checked="saveParams.isDefault == 1 ? true : false" @change="switchChange" color="#ff0033" style="transform:scale(0.8)"/>
		</view>
		<view class="btn-container">
			<view class="common-btn" @click="saveAddress">保存</view>
		</view>
		<mpvue-picker :themeColor="themeColor" ref="mpvuePicker" :mode="mode" :deepLength="deepLength" :pickerValueDefault="pickerValueDefault"
		 @onConfirm="onConfirm" @onCancel="onCancel" :pickerValueArray="pickerValueArray"></mpvue-picker>
		<mpvue-city-picker :themeColor="themeColor" ref="mpvueCityPicker" :pickerValueDefault="cityPickerValueDefault"
		 @onCancel="onCancel" @onConfirm="onConfirm"></mpvue-city-picker>
	</view>
</template>

<script>
	import interfaceurl from '@/utils/interface.js'
	import mpvuePicker from '@/components/mpvue-picker/mpvuePicker.vue';
	import mpvueCityPicker from '@/components/mpvue-citypicker/mpvueCityPicker.vue'
	import cityData from '@/common/city.data.js';
	import navigationBar from '@/components/navigation-bar.vue' //引入自定义导航栏
	//引入SDK核心类
	var QQMapWX = require('@/utils/qqmap-wx-jssdk.min.js');//腾讯地图的js文件放到utils文件下面
	// 实例化腾讯地图API核心类
	var qqmapsdk = new QQMapWX({
	    key: 'YJ7BZ-4MLCU-P7UVG-2LPHP-XLQQQ-CMFRJ' // 必填
	});
	export default {
		components: {
			mpvuePicker,
			mpvueCityPicker,
			navigationBar
		},
		data() {
			return {
				//设置导航栏样式
				navigationBarStyle: {
					iconText: '添加收货地址' //导航栏文字
				},
				//动态参数
				themeColor: '#007AFF',
				cityPickerValueDefault: [0, 0, 1],
				mode: '',
				deepLength: 1,
				pickerValueDefault: [0],
				pickerValueArray:[],
				info: {}, //用户地址信息，深拷贝
				position: '' ,//选择的地址
				saveParams: {
					regionId: 0,
					receiver: '',
					receiverAddr: '',
					receiverPhone: '',
					isDefault: 0, //0非默认，1默认
					addressId: ''
				},
				forceDefault: false //判断是否需要强制默认
			}
		},
		onLoad(options) {
			if(options.isDefault == 'false') {
				this.forceDefault = true
				this.saveParams.isDefault = 1
			} else {
				this.forceDefault = false
			}
			if(options.item) {
				this.saveParams = JSON.parse(options.item)
			} else {
				this.getUserLocation()
			}
		},
		onShow() {
			
		},
		methods: {
			// 三级联动选择
			showMulLinkageThreePicker() {
				this.$refs.mpvueCityPicker.show()
			},
			onConfirm(e) {
				//console.log(e)
				this.saveParams.regionId = e.cityCode;
				this.saveParams.receiverAreaName = e.label.replace('-', '').replace('-', '');
			},
			onCancel(e) {
				//console.log('取消地址选择')
			},
			switchChange (val) {
				this.saveParams.isDefault = val.detail.value ? 1 : 0
			},
			updateAddress() {
				let that = this;
				interfaceurl.checkAuth(interfaceurl.addressUpdate, that.saveParams, false).then((res) => {
					//保存成功后关闭本页面跳到上一页
					that.$turnPage('1', 'navigateBack')
				});
			},
			saveAddress() {
				if(!this.saveParams.receiver){
				  uni.showToast({
					 title: '请填写收货人',
					 icon: 'none',
					 duration: 2000
				  });
				  return
				}
				if(!this.saveParams.receiverPhone){
				  uni.showToast({
					 title: '请填写收货人手机号码',
					 icon: 'none',
					 duration: 2000
				  });
				  return
				}
				if(!this.saveParams.receiverAddr){
				  uni.showToast({
					 title: '请填写详细地址',
					 icon: 'none',
					 duration: 2000
				  });
				  return
				}
				if(this.saveParams.addressId){
				  this.updateAddress()
				  return;
				}
				let that = this;
				interfaceurl.checkAuth(interfaceurl.addressCreate, that.saveParams, false).then((res) => {
					//保存成功后关闭本页面跳到上一页
					that.$turnPage('1', 'navigateBack')
				});
			},
			// 判断用户是否拒绝地理位置信息授权，拒绝的话重新请求授权
			getUserLocation: function () {
			    let that = this;
			    wx.getSetting({
			      success: (res) => {
			        //console.log(JSON.stringify(res))
			        // res.authSetting['scope.userLocation'] == undefined    表示 初始化进入该页面
			        // res.authSetting['scope.userLocation'] == false    表示 非初始化进入该页面,且未授权
			        // res.authSetting['scope.userLocation'] == true    表示 地理位置授权
			        if (res.authSetting['scope.userLocation'] != undefined && res.authSetting['scope.userLocation'] != true) {
			          wx.showModal({
			            title: '请求授权当前位置',
			            content: '需要获取您的地理位置，请确认授权',
			            success: function (res) {
			              if (res.cancel) {
			                wx.showToast({
			                  title: '拒绝授权',
			                  icon: 'none',
			                  duration: 1000
			                })
			              } else if (res.confirm) {
			                wx.openSetting({
			                  success: function (dataAu) {
			                    if (dataAu.authSetting["scope.userLocation"] == true) {
			                      wx.showToast({
			                        title: '授权成功',
			                        icon: 'success',
			                        duration: 1000
			                      })
			                      //再次授权，调用wx.getLocation的API
			                      that.getLocation();
			                    } else {
			                      wx.showToast({
			                        title: '授权失败',
			                        icon: 'none',
			                        duration: 1000
			                      })
			                    }
			                  }
			                })
			              }
			            }
			          })
			        } else if (res.authSetting['scope.userLocation'] == undefined) {
			          //调用wx.getLocation的API
			          that.getLocation();
			        }
			        else {
			          //调用wx.getLocation的API
			          that.getLocation();
			        }
			      }
			    })
			},
			// 获取定位当前位置的经纬度
			getLocation: function () {
			    let that = this;
			    wx.getLocation({
			      type: 'wgs84',
			      success: function (res) {
					//console.log('getLocation', res)
			        let latitude = res.latitude
			        let longitude = res.longitude
			        that.getLocal(latitude, longitude)
			      },
			      fail: function (res) {
			        console.log('fail' + JSON.stringify(res))
			      }
			    })
			},
			// 获取当前地理位置
			getLocal: function (latitude, longitude) {
			    let that = this;
			    qqmapsdk.reverseGeocoder({
			      location: {
			        latitude: latitude,
			        longitude: longitude
			      },
			      success: function (res) {
			        let province = res.result.ad_info.province
			        let city = res.result.ad_info.city
			        let district = res.result.ad_info.district;
			        // 保存一下当前定位的位置留着后面重新定位的时候搜索附近地址用
					that.saveParams.receiverAreaName = province + city + district
					that.saveParams.receiverAddr = res.result.address_component.street_number
					that.saveParams.regionId = res.result.ad_info.adcode
					//console.log('getLocal', res)
			      },
			      fail: function (res) {
			        console.log(res);
			      },
			      complete: function (res) {
			        // console.log(res);
			      }
			    });
			}
		}
	}
</script>

<style>
	/*正中*/
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}
.form-item{
	height: 100upx;
	display: flex;
	justify-content: space-between;
	align-items: center;
	background-color: #ffffff;
	padding: 0upx 30upx;
	border-bottom: 1px solid #E0E0E0;
}
.form-input{
	text-align: right;
	height: 100%;
	flex: 1;
	padding-left: 20upx;
}
.form-label{
	text-align: right;
	height: 100%;
	display: inline-block;
	line-height: 100upx;
	flex: 1;
	padding-left: 20upx;
}
.arrow-icon{
	width: 16upx;
	height: 30upx;
	margin-left: 10upx;
}
.form-textarea{
  display: flex;
  padding: 30upx;
  background-color: #ffffff;
}
.textarea{
	min-height: 200upx;
	padding-top: 6upx;
	padding-left: 10upx;
  flex: 1;
  transform: translateY(-20upx);
}
.default-address{
	margin-top: 20upx;
	background-color: #ffffff;
	height: 100upx;
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding:0upx 30upx;
}
.common-btn{
	background: #ff0033;
	color: #ffffff;
	font-size: 34upx;
	height: 90upx;
	line-height: 90upx;
	text-align: center;
	border-radius: 10upx;
	border: none;
	margin: 0px auto;
}
.btn-container{
	margin-top: 60upx;
	padding: 0upx 30upx;
}
</style>
