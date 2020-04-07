<template>
	<view class="container">

		<view class="recommand-content">

      <view class="recommand-item" v-for="(item,index) in teamList" :key="index">
        <view style="margin-bottom: 10upx;">
          <text class="recommand-title">{{item.nickname || '新用户'}}</text>
        </view>
        <view style="margin-bottom: 10upx;">
          <text>邀请人:  {{detail.nickname}}</text>
        </view>
        <view style="margin-bottom: 10upx;">
          <text>{{item.update_time}}</text>
        </view>
      </view>
    </view>

    <view class="empty-text" v-if="teamList.length == 0">暂无团队数据</view>

	</view>
</template>

<script>
  // import { apiTeamList, apiUserInfo } from '@/service/index'
	export default {
		data() {
			return {
				teamList: [],
        detail: {}
			}
		},
    onShow() {
      // this.getUserInfo()
      // this.getTeamList()
    },
		methods: {
      getUserInfo() {
        apiUserInfo()
        .then((res) => {
          if(res.code == 0) {
            this.detail = res.data
          }
        })
      },
			getTeamList() {
        apiTeamList()
        .then((res) => {
          if(res.code == 0){
            this.teamList = res.data
          }
        })
      }
		}
	}
</script>

<style>
.container{
  background: #F5F5F5;
  padding: 30upx;
}
.recommand-content{
  border-radius: 10upx;
}
.recommand-item{
  margin-top: 20upx;
  background: #ffffff;
  font-size: 26upx;
  color: #999999;
  padding: 10upx 30upx;
}
.recommand-title{
  font-size: 32upx !important;
  color: #333333;
}
.recommand-item image{
  width: 60upx;
  height: 60upx;
  border-radius: 100%;
  margin-right: 10upx;
}
.amount{
  color: #EB6100;
}
</style>
