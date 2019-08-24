<template>
    <div class="container">
        <div v-if="bottomId">
            <section class="sec-nav">
                <navigation-bar :title="videoTitle" :navBackgroundColor="'white'" :back-visible="true"></navigation-bar>
            </section>
            <section class="img-contain">
                <swiper
                    :indicator-dots="true"
                    autoplay
                    :interval="3000"
                    :duration="1000"
                    circular
                    indicator-color="rgba(255,255,255,.5)"
                    indicator-active-color="#ffffff"
                >
                    <block v-for="item in imgUrls" :key="item.id">
                        <swiper-item>
                            <image :src="item.url" class="slide-image" />
                        </swiper-item>
                    </block>
                </swiper>
            </section>
            <section class="maintenance" v-if="appid" style="margin-bottom:130rpx;">
                <p class="record">维保记录</p>
                <card></card>
            </section>
            <section class="maintenance" v-if="!appid">
                <p class="record">请先授权获取您的微信昵称、头像等公开信息，以便开始使用维保助手</p>
                <button open-type="getUserInfo" @getuserinfo="getUserInfo">授权微信公开信息</button>
            </section>
        </div>

        <div class="my" v-if="!bottomId">
            <my :user='user'></my>
        </div>

        <section class="add" v-if="appid">
            <bottomNavigationBar :selectNavIndex="selectNavIndex" @indexId='indexFuc' @userMessage='userMessage'></bottomNavigationBar>
        </section>
    </div>
</template>

<script>
import fly from "@/services/WxApi";
import navigationBar from "@/components/navigationBar.vue";
import bottomNavigationBar from "@/components/bottomNavigationBar.vue";
import card from "@/components/card.vue";
import add from "@/components/add.vue";
import my from "@/pages/my";
export default {
    components: {
        bottomNavigationBar,
        navigationBar,
        card,
        add,
        my
    },
    onShareAppMessage: (res) => {

    },
    data() {
        return {
            imgUrls: [
                {
                    id: 0,
                    url: "https://images.unsplash.com/photo-1551334787-21e6bd3ab135?w=640"
                },
                {
                    id: 1,
                    url: "https://images.unsplash.com/photo-1551214012-84f95e060dee?w=640"
                },
                {
                    id: 2,
                    url: "https://images.unsplash.com/photo-1551446591-142875a901a1?w=640"
                }
            ],
            appid:'',
            bottomId:true,
            selectNavIndex:0,
            user:''
        };
    },
    onShow(){
        let This = this
        This.login()
    },
    mounted() {
        let This = this
        This.appid = wx.getStorageSync('appid')
        if(wx.getStorageSync('appid')){
            This.getData()
        }
    },
    onShareAppMessage: (res) => {

    },
    methods: {
        login(){
            wx.login({
                success (res) {
                    if (res.code) {
                    //发起网络请求
                            let This = this
                            let data = {
                                code:res.code
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
        indexFuc(data){
            let This = this
            This.selectNavIndex = data
            if(data==0){
                This.bottomId = true
            }else{
                This.bottomId = false
            }
        },
        userMessage(data){
            let This = this
            This.user = data
            This.appid = wx.getStorageSync('appid')
            // wx.navigateTo({
            //     url:'/pages/index/main'
            // });
        },
        getUserInfo (e) {
            let This = this
            
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
                    wx.navigateTo({
                        url:'/pages/index/main'
                    });
                    // This.getData()
                })
            }


        },
        getData(){
            let data ={
                pageNo:1,
                pageSize:20
            }
            fly.post('/maintain/getUserMaintainList',data).then(function (res) {
                // This.getData()
            })
        }
    },
};
</script>

<style scoped lang='scss'>
.container {
    width: 100%;
    height: 100%;
    .title {
        display: block;
        width: 100%;
        height: 128rpx;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .img-contain {
        display: block;
        width: 100%;
        height: 290rpx;
        margin: 0 auto;
        border-radius: 8rpx;
        margin-top: 40rpx;
        background: #fcfcfc;
        text-align: center;
        image {
            width: 670rpx;
            height: 290rpx;
            border-radius: 8rpx;
        }
    }
    .maintenance{
        .record{
            width: 650rpx;
            height: 88rpx;
            font-size: 34rpx;
            color: black;
            font-family: 'PingFangSC-Medium';
            font-weight: 550;
            padding: 64rpx 0 24rpx 40rpx;
        }
        button{
            background: #1890FF;
            color: #fff;
            width: 670rpx;
            font-size: 34rpx;
            font-family: "PingFangSC-Medium";
            margin-top: 100rpx;
        }
    }
}
</style>
