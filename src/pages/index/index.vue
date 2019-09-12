<template>
    <div class="containe">
        <div v-if="isAlert">
            <!--弹窗的页面-->
            <div class="modalMask" v-if="isModel" @click="hidePanel"></div>
            <div class="modalDialog" v-if="changeModel">
                <div class="modalContent">
                    <img class="img3" src="/static/images/logo1.png" />
                    <p class="contentTip">筑达云维保助手</p>
                    <p class="detail">本程序将获取以下授权：</p>
                    <p class="detail1">获取您的公开信息（昵称、头像等）</p>
                    <div class="button">
                        <button class="no" @click="no">拒绝</button>
                        <button class="yes" open-type="getUserInfo" lang="zh_CN" @getuserinfo="getUserInfo">允许</button>
                    </div>

                </div>
            </div>
        </div>

        <section class="sec-nav">
            <navigation-bar title="维保助手" :navBackgroundColor="'white'" :back-visible="true"></navigation-bar>
        </section>
       <img  class="img1" src="/static/images/1.png" alt="">
       <div class="middle">
            <div class="text">
                <p><img class="img2" src="/static/images/gou.png" alt="">塔机巡检</p>
                <p><img class="img2" src="/static/images/gou.png" alt="">塔机安装</p>
            </div>
                <div class="text">
                <p><img class="img2" src="/static/images/gou.png" alt="">塔机维修</p>
                <p><img class="img2" src="/static/images/gou.png" alt="">录入维保记录</p>
            </div>
       </div>
       <button class="confirm" @click="login">登录/注册</button>
    </div>
</template>

<script>
import fly from "@/services/WxApi";
import navigationBar from "@/components/navigationBar.vue";
export default {
    data() {
        return {
            isAlert: false,
            isModel:'',
            changeModel:'',
        }
    },
    components: {
        navigationBar
    },
    onLoad() {
        let This = this
        if(wx.getStorageSync('appid')){
            wx.navigateTo({
                url:'/pages/indexList/main'
            });
        }else{
            This.loginInit()
        }
    },
    onShow(){
        let This = this
        if(wx.getStorageSync('appid')){
            wx.navigateTo({
                url:'/pages/indexList/main'
            });
        }else{
            This.loginInit()
        }
    },
    methods: {
        loginInit(){
            let This = this
            wx.login({
                success (res) {
                    if (res.code) {
                    //发起网络请求
                        let data = {
                            code:res.code,
                            // authorization:wx.getStorageSync('token') || ''
                        }
                        fly.post('/user/wxLogin',data).then(function (res) {
                            wx.setStorageSync('sessionKey', res.response.sessionKey) 
                            wx.setStorageSync('openid', res.response.openid)
                            wx.setStorageSync('token', res.response.token)
                        })
                    } else {

                    }
                }
            })
        },
        login(){
            let This = this
            This.isAlert = true
            This.isModel = true
            This.changeModel = true
        },
        no(){
            let This = this
            This.isAlert = false
            This.isModel = false
            This.changeModel = false
        },
        hidePanel(){
            let This = this
            This.isAlert = false
            This.isModel = false
            This.changeModel = false
        },
        getUserInfo (e) {
            let This = this
            This.isAlert = false
            This.isModel = false
            This.changeModel = false
            if(e.mp.detail.errMsg == 'getUserInfo:fail auth deny'){

            }else{
                let userInfo = e.mp.detail
                let data = {
                    sessionKey:wx.getStorageSync('sessionKey'),
                    encryptedData:userInfo.encryptedData,
                    iv:userInfo.iv
                }
                fly.post('/user/getWxUserInfo',data).then(function (res) {
                    wx.setStorageSync('appid', res.response.watermark.appid)
                    wx.setStorageSync('avatarUrl', res.response.avatarUrl)
                    wx.setStorageSync('username', res.response.nickName)
                    wx.reLaunch({
                        url:'/pages/indexList/main'
                    });
                })
            }
        },
    },
}
</script>

<style scoped lang='scss'>
.containe{
    width: 100%;
    height: 100%;
    .modalMask {
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    background: #000;
    opacity: 0.5;
    overflow: hidden;
    z-index: 900;
    color: #fff;
}
.modalDialog {
    box-sizing: border-box;
    width: 590rpx;
    height: 692rpx;
    overflow: hidden;
    position: fixed;
    top: 30%;
    left: 80rpx;
    z-index: 999;
    background: #fff;
    border-radius: 8rpx;
}
.modalContent {
    box-sizing: border-box;
    display: flex;
    font-size: 32rpx;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    .img3 {
        width: 92rpx;
        height: 92rpx;
        margin-bottom: 24rpx;
        margin-top: 100rpx;
    }
    .contentTip {
        font-size: 36rpx;
        color: black;
        font-weight: 650;
        font-family: "PingFangSC-Medium";
    }
    .detail {
        font-size: 34rpx;
        color: black;
        margin-top: 86rpx;
        font-family: "PingFangSC-Regular";
        display: flex;
        justify-content: flex-start;
        margin-left: -116rpx;
    }
    .detail1{
        font-size: 30rpx;
        color: #585858;
        margin-top: 10rpx;
        display: flex;
        justify-content: flex-start;
        font-family: "PingFangSC-Regular";
        margin-left: -20rpx;
    }
    .button {
        width: 590rpx;
        display: flex;
        justify-content: space-around;
        margin-top: 80rpx;
        .yes{
            width: 236rpx;
            height: 84rpx;
            margin-top: 20rpx;
            font-size: 34rpx;
            color: #fff;
            font-family: "PingFangSC-Medium";
            font-weight: 650;
            display: flex;
            justify-content: center;
            align-items: center;
            background: #1890FF;
            border: none;
            margin-bottom: 40rpx;
            margin-left: 15rpx;
        }
        .no{
            width: 236rpx;
            height: 84rpx;
            margin-top: 20rpx;
            font-size: 34rpx;
            color: black;
            font-family: "PingFangSC-Medium";
            font-weight: 650;
            display: flex;
            justify-content: center;
            align-items: center;
            background: #ededed;
            border: none;
            margin-bottom: 40rpx;
            margin-right: 15rpx;
        }
    }
    button::after {
        border: none;
    }
}
    .img1{
        width: 100%;
        height: 750rpx;
    }
    .middle{
        width:570rpx;
        height: auto;
        margin: 0 auto;
        margin-top: 46rpx;
        .text{
            display: flex;
            justify-content: space-between;
            p{
                width: 270rpx;
                font-size: 34rpx;
                color:black;
                margin-bottom: 24rpx;
            }
            .img2{
                width:44rpx;
                height: 44rpx;
                margin-right: 20rpx;
                position: relative;
                top: 10rpx;
            }
        }
    }
    .confirm {
        background: #1890FF;
        color: #fff;
        margin: 0 auto;
        margin-bottom: 64rpx;
        margin-top: 70rpx;
        font-size: 34rpx;
        font-weight: 650;
        font-family: "PingFangSC-Medium";
        width: 670rpx;
    }
    .confirm::after {
        border:none;
    }
}
</style>
