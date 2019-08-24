<template>
    <div class="my">
        <section class="sec-nav">
            <navigation-bar :title="videoTitle" :navBackgroundColor="'white'" :back-visible="true"></navigation-bar>
        </section>
        <section class="maintenance" @click="edit">
            <div class="left">
                <img @click="goMy" v-if="!appid" src="/static/images/user.png">
                <img v-if="appid" :src="img || user.avatarUrl">
                <p class="one" v-if="appid">{{name || user.username || ''}}</p>
                <p class="two" v-if="appid">{{mobile || ''}}</p>
            </div>
            <div class="right" @click="edit">
                <p v-if='myself && appid'>未完善</p>
                <img src="/static/images/right.png" alt="">
            </div>
        </section>
        <section>
            <ul>
                <li @click="goS"><span style="padding-left:32rpx;">企业归属</span><span><img style="padding-right:32rpx;" src="/static/images/right.png"></span></li>
                <li @click="goW"><span style="padding-left:32rpx;">关于筑达云</span><span><img style="padding-right:32rpx;" src="/static/images/right.png"></span></li>
                <!-- <li v-for="(item,index) in list" :key="index" @click="goUrl(item.url)"><span>{{item.name}}</span><span><img src="/static/images/right.png"></span></li> -->
            </ul>
        </section>
        <section class="add">
            <bottomNavigationBar :selectNavIndex="selectNavIndex"></bottomNavigationBar>
        </section>
    </div>
</template>

<script>
import navigationBar from "@/components/navigationBar.vue";
import bottomNavigationBar from "@/components/bottomNavigationBar.vue";
import fly from "@/services/WxApi";
export default {
    components: {
        bottomNavigationBar,
        navigationBar,
    },
    prop:['user'],
    data() {
        return {
            mobile:'',
            name:'',
            list: [
                {
                    id: 0,
                    name:'我推荐的班组',
                    url: "/pages/RecommendedTeams/main"
                },
                {
                    id: 1,
                    name:'共建共享计划',
                    url: "/pages/sharing/main"
                },
                {
                    id: 2,
                    name:'关于我们',
                    url: "/pages/aboutUs/main"
                }
            ],
            selectNavIndex:1,
            myself:false,
            appid:'',
            img:''
        };
    },
    onShow() {
        let This = this
        This.img = wx.getStorageSync('avatarUrl') 
        This.mobile = wx.getStorageSync('mobile')
        This.name = wx.getStorageSync('username')
        This.appid = wx.getStorageSync('appid')
        fly.post('/user/getUserDetail').then(function (res) {
            let resData = res.response
            let userNumber = resData.userNumber
            let fullName = resData.fullName
            let phoneNum = resData.phoneNum
            wx.setStorageSync('mobile', phoneNum) 
            if(!phoneNum || !fullName || !userNumber){
                This.myself = true
            }else{
                This.myself = false
            }
        })
    },
    mounted() {
        let This = this
        This.img = wx.getStorageSync('avatarUrl') 
        This.mobile = wx.getStorageSync('mobile')
        This.name = wx.getStorageSync('username')
        This.appid = wx.getStorageSync('appid')
        fly.post('/user/getUserDetail').then(function (res) {
            let resData = res.response
            let userNumber = resData.userNumber
            let fullName = resData.fullName
            let phoneNum = resData.phoneNum
            wx.setStorageSync('mobile', phoneNum) 
            if(!phoneNum || !fullName || !userNumber){
                This.myself = true
            }else{
                This.myself = false
            }
        })
    },
    methods:{
        goUrl(url){
            wx.navigateTo({
                url
            });
        },
        goMy(){
            wx.navigateTo({
                url:"/pages/editMy/main"
            });
        },
        goLogin(){
            wx.navigateTo({
                url:"/pages/login/main"
            });  
        },
        goC(){
            wx.navigateTo({
                url:"/pages/RecommendedTeams/main"
            }); 
        },
        goS(){
            wx.navigateTo({
                url:"/pages/EnterpriseAttribution/main"
            }); 
        },
        goW(){
            wx.navigateTo({
                url:"/pages/aboutUs/main"
            }); 
        },
        edit(){
            wx.navigateTo({
                url:"/pages/editMy/main"
            });
        },
        getUserInfo (e) {
            let userInfo = JSON.parse(e.mp.detail.rawData)
            let data = {
                nickName:userInfo.nickName,
                headImg:userInfo.avatarUrl,
                gender:userInfo.gender,
                areaName:[userInfo.country,userInfo.province,userInfo.city]
            }
            fly.post('/contractor/weChatAuth',data).then(function (res) {
                if(res.response.mobile){
                    wx.setStorageSync('token', res.response.authorization) 
                    wx.setStorageSync('gender', res.response.gender) 
                    wx.setStorageSync('mobile', res.response.mobile) 
                    wx.setStorageSync('nickName', res.response.nickName) 
                    wx.setStorageSync('username', res.response.username) 
                    wx.navigateTo({
                        url:'/pages/my/main'
                    })
                }else{
                    wx.navigateTo({
                        url:'/pages/point/main'
                    })
                }

            })
        }
    }
};
</script>

<style scoped lang='scss'>
.my {
    position: absolute;
    width: 100%;
    height: 100%;
    background: rgb(245,245,245);
    .title {
        display: block;
        width: 100%;
        height: 128rpx;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .maintenance{
        width: 100%;
        height: 180rpx;
        margin: 0 auto;
        display: flex;
        justify-content: space-between;
        flex-direction: row;
        background: #fff;
        margin-top: 49rpx;
        .left{
            position: relative;
            img{
                width: 120rpx;
                height: 120rpx;
                position: absolute;
                left: 32rpx;
                top: 30rpx;
            }
            .one{
                font-size: 34rpx;
                font-weight: bold;
                color: rgb(51, 51, 51);
                position: absolute;
                left: 184rpx;
                top: 40rpx;
                width: 200rpx;
            }
            .two{
                font-size: 28rpx;
                color: rgb(153, 153, 153);
                position: absolute;
                left: 184rpx;
                top: 92rpx;
                width: 200rpx;
            }
        }
        .right{
            position: relative;
            display: flex;
            justify-content: center;
            align-items: center;
            padding-right: 32rpx;
            color: rgb(245, 34, 45);
            img{
                height: 25.2rpx;
                width: 16rpx;
                padding-left: 16rpx;
                margin-top: 6rpx;
            }
        }
        // img{
        //     width: 120rpx;
        //     height: 120rpx;
        // }
        // p{
        //     margin-top: 28rpx;
        //     font-size: 34rpx;
        //     font-weight: bold;
        //     color: rgb(51, 51, 51);
        // }
    }
    ul{
        width: 100%;
        height: 100%;
        margin-top: 96rpx;
        li{
            width:100%;
            height: 104rpx;
            margin:0 auto;
            display:flex;
            justify-content:space-between;
            align-items: center;
            border-bottom: 1rpx solid #e5e5e5;
            font-family: 'PingFangSC-Regular';
            background: #fff;
            img{
                height: 25.2rpx;
                width: 16rpx;
            }
        }
    }
}
</style>
