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
                <div class="card-contain">
                    <ul>
                        <div class="img-contain" v-if="isNull==0">
                            <img src="/static/images/none.png">
                        </div>
                        <div v-if="isNull!=0">
                            <li v-for="(item,index) in list" :key="index" @click="goIntro(item.id)">
                                <div class="one">
                                    <span class="identifier">编号 {{item.maintainNumber || ''}}</span>
                                    <span style="color:rgba(0,0,0,0.45)"> / </span>
                                    <span class="name">{{item.terminalRemarkName || ''}}</span>
                                </div>
                                <div class="two">
                                    <span class="repair">{{item.typeName || ''}} | {{item.title}}</span>
                                    <img class="go-icon" src="/static/images/right.png" alt="">
                                </div>
                                <div class="three">
                                    <span>{{item.maintainTime}}</span>
                                    <span>{{item.fullAreaName || ''}}</span>
                                </div>
                            </li>
                        </div>
                    </ul>
                </div>
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
            user:'',
            list:'',
            page:1,
            isNull:''
        };
    },
    onShow(){
        let This = this
        This.login()
    },
    onLoad() {
        let This = this
        This.list = ''
        This.page = 1
        This.getData()
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
    onReachBottom () {
        let This = this
        This.page = This.page + 1
        This.getData()
    },
    methods: {
        login(){
            wx.login({
                success (res) {
                    if (res.code) {
                    //发起网络请求
                            let This = this
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
        goIntro(id){
            wx.navigateTo({
                url:'/pages/indexDetail/main?id=' + id
            });
        },
        getData(){
            let This = this
            if(This.isNull == null || This.isNull.length == 0){
                wx.showToast({
                    title: '数据已加载完',
                    icon: "none",
                    duration: 2000
                })
            }else{
                wx.showLoading({
                    title:'加载中'
                })
            }
            let data = {
                pageNo:This.page,
                pageSize:20
            }
            fly.post('/maintain/getUserMaintainList',data).then(function (res) {
                wx.hideLoading();
                if(This.page == 1){
                    This.list = res.response.list
                    This.list.map(
                        function(item,index){
                            let da = new Date(item.maintainTime);
                            let year = da.getFullYear()+'';
                            let month = da.getMonth()+1+'';
                            let date = da.getDate()+' ';
                        //     let h = da.getHours()+'';
                        //     let m = da.getMinutes()+'';
                        //     let s = da.getSeconds()+'';
                            item.maintainTime = [year,month,date].join('-');
                        }
                    )
                    This.$nextTick(
                        function(){
                            This.list = res.response.list
                            This.isNull = res.response.list.length
                        }
                    )
                }else{
                    //    This.list.push(JSON.parse(JSON.stringify([res.list])))
                    //    This.list = This.list.concat(res.list)
                    if(res.response.list){
                        wx.showToast({
                            title: '数据已加载完',
                            icon: "none",
                            duration: 2000
                        })
                    }else{
                        let listArr = res.response.list
                        listArr.map(
                            function(item,index){
                                let da = new Date(item.maintainTime);
                                let year = da.getFullYear()+'';
                                let month = da.getMonth()+1+'';
                                let date = da.getDate()+' ';
                            //     let h = da.getHours()+'';
                            //     let m = da.getMinutes()+'';
                            //     let s = da.getSeconds()+'';
                                item.maintainTime = [year,month,date].join('-');
                            }
                        )
                        This.list.push(...listArr)
                    }
                } 
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
        .card-contain {
            width: 100%;
            height: 100%;
            ul{
                .img-contain{
                    width: 100%;
                    height: 244rpx;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: rgba(16,142,233,0.04);
                    img{
                        width: 128rpx;
                        height: 134rpx;
                    }
                }
                width: 670rpx;
                height: auto;
                margin: 0 auto;
                display: flex;
                flex-direction: column;
                justify-content: flex-start;
                li{
                    padding: 36rpx 32rpx;
                    margin-bottom: 32rpx;
                    background: rgba(16,142,233,0.04);
                    .one{
                        margin-bottom: 32rpx;
                        .identifier{
                            font-size: 28rpx;
                            color: black;
                            font-family: 'PingFangSC-Regular';
                        }
                        .name{
                            font-size: 28rpx;
                            color:rgba(0,0,0,0.45);
                            font-family: 'PingFangSC-Regular';
                        }
                    }
                    .two{
                        margin-bottom: 12rpx;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        .repair{
                            font-size: 34rpx;
                            color: black;
                            font-family: 'PingFangSC-Medium';
                            font-weight: 550;
                        }
                        .go-icon{
                            // background: red;
                            height: 26rpx;
                            width: 16rpx;
                        }
                    }
                    .three{
                        font-size: 28rpx;
                        color:rgba(0,0,0,0.65);
                        font-family: 'PingFangSC-Regular';
                        display: flex;
                        justify-content: space-between;
                    }
                }
            }
        }
    }
}
</style>
