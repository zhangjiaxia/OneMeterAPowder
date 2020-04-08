<template>
	<view class="container">
		<view class="form-item">
			<view>收货人</view>
			<input class="form-input" placeholder="请输入收货人姓名" placeholder-style="color:#BFBFBF;" v-model="saveParams.receiver"/>
		</view>
		<view class="form-item">
			<view>手机号码</view>
			<input class="form-input" placeholder="请输入收货人手机号码" placeholder-style="color:#BFBFBF;" v-model="saveParams.receiverPhone"/>
		</view>
		<view class="form-item">
			<view>选择地区</view>
			<view class="form-input content" @click="showMulLinkageThreePicker">{{position || '请选择地区'}}</view>
		</view>
		<view class="form-textarea">
			<text>详细地址:</text>
			<textarea auto-height placeholder-style="color:#BFBFBF" placeholder="请填写详细地址" class="textarea" v-model="saveParams.receiverAddr" style="margin-top: 16rpx;"/>
		</view>
		<view class="default-address">
			<view>设为默认地址</view>
			<switch :checked="saveParams.isDefault == 1 ? true : false" @change="switchChange" color="#0070D1" style="transform:scale(0.8)"/>
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
	export default {
		components: {
			mpvuePicker,
			mpvueCityPicker
		},
		data() {
			return {
				true_name: '',
				cellphone: '',
				detail_address: '',
				address_id: '',
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
				}
			}
		},
		onLoad(options) {
		  if(options.item) {
			this.saveParams = JSON.parse(options.item)
			// this.address_id = item.addressId
			// this.true_name = item.receiver
			// this.cellphone = item.receiverPhone
			// this.detail_address = item.receiverAddr
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
				console.log(e)
				this.saveParams.regionId = e.cityCode;
				this.position = e.label.replace('-', '').replace('-', '');
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
					uni.showToast({
						title: '修改成功',
						icon: 'success',
						duration: 2000
					});
					setTimeout(function(){
					  uni.navigateBack({
						delta: 1
					  })
					},2000)
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
					uni.showToast({
						title: '添加成功',
						icon: 'success',
						duration: 2000
					});
					setTimeout(function(){
					  uni.navigateBack({
						delta: 1
					  })
					},2000)
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
	background: #0070D1;
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
