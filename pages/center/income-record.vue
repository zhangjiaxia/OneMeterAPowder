<template>
	<view class="container">

		<view class="record-item">
			<view>
				<view class="record-item-top">
					<image src="/static/record-icon.png" class="record-icon"></image>
					<text>佣金收入</text>
				</view>
				<view class="time">3月21日  12:15</view>
			</view>
			<view class="num">+500</view>
		</view>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		methods: {
			
		}
	}
</script>

<style>
.record-item{
	background: #ffffff;
	padding: 20upx 30upx;
	display: flex;
	justify-content: space-between;
	align-items: center;
}
.record-item-top{
	display: flex;
	align-items: center;
}
.time{
	margin-top: 10upx;
	color: #999999;
	font-size: 26upx;
}
.record-icon{
	width: 60upx;
	height: 60upx;
	border-radius: 100%;
	margin-right: 20upx;
}
.num{
	font-size: 36upx;
	color: #0071CF;
}
</style>
