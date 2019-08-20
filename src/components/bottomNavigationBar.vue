<template>
    <section class="tabBar-wrap">
        <article class="tabBar-box">
            <ul class="tabBar-nav" v-if="navList.length > 0">
                <li class="item" v-for="(item, index) in navList" @click="selectNavItem(index,item.pagePath)" :key="index">
                    <p class="item-images">
                        <img :src="selectNavIndex === index ? item.selectedIconPath : item.iconPath" alt="iconPath"/>
                    </p>
                    <p :class="selectNavIndex === index ? 'item-text item-text-active' : 'item-text' ">
                        {{item.text}}
                    </p>
                </li>
            </ul>
        </article>
        <button @click="add"><img class="buttom-img" src="/static/images/button.png"></button>
    </section>
</template>
<script>
import fly from "@/services/WxApi";
export default {
    props: ["selectNavIndex", "needButton", "handButton", "btnText"],
    data() {
        return {
            navList: [
                {
                    selectedIconPath: "/static/tabs/home-active.png",
                    iconPath: "/static/tabs/home.png",
                    pagePath: "/pages/index/main",
                    text: "维保"
                },
                {
                    selectedIconPath: "/static/tabs/orders-active.png",
                    iconPath: "/static/tabs/orders.png",
                    pagePath: "/pages/my/main",
                    text: "我"
                }
            ]
        };
    },
    methods: {
        selectNavItem(index, pagePath) {
            let This = this
            if (index === this.selectNavIndex) {
                return false;
            }
            // if (index == 0 && this.selectNavIndex == -1) {
            //     this.$emit("fetchIndex",index);
            // }
            This.$emit('indexId',index)
            // this.bindViewTap(pagePath);
        },
        bindNavigateTo(url) {
            wx.navigateTo({
                url
            });
        },
        bindViewTap(url) {
            let page = getCurrentPages();
            wx.reLaunch({
                url
            });
        },
        add(){
            let appid = wx.getStorageSync('appid')
            if(!appid){
                wx.showToast({
                    title: '请先发起授权',
                    icon: "none",
                    duration: 2000
                })
            }else{
                wx.navigateTo({
                    url:'/pages/MaintenanceInformation/main'
                });
            }
        }
        // getUserInfo (e) {
        //     console.log(e)
        //     let userInfo = JSON.parse(e.mp.detail.rawData)
        //     console.log(userInfo)
        //     let data = {
        //         nickName:userInfo.nickName,
        //         headImg:userInfo.avatarUrl,
        //         gender:userInfo.gender,
        //         areaName:[userInfo.country,userInfo.province,userInfo.city]
        //     }
        //     fly.post('/contractor/weChatAuth',data).then(function (res) {
        //         console.log(res)
        //         wx.setStorageSync('token', res.response.authorization) 
        //         wx.setStorageSync('gender', res.response.gender) 
        //         wx.setStorageSync('mobile', res.response.mobile) 
        //         wx.setStorageSync('nickName', res.response.nickName) 
        //         wx.setStorageSync('username', res.response.username) 
        //     })
        // }
    }
};
</script>
<style lang="scss" scoped>
.tabBar-box {
    position: fixed;
    bottom: 0;
    width: 100%;
    height: 50px;
    border-top: 1px solid #e5e5e5;
    background-color: #fff;
}

.tabBar-nav {
    width: 100%;
    display: flex;

    .item {
        flex: 1;
        text-align: center;
    }
    .item-text {
        color: #666;
        font-size: 20rpx;
        transition: 0.24s linear;
        margin-top: -8rpx;
    }
    .item-text-active {
        color: #1e84d3;
        margin-top: -8rpx;
    }
    .item-images {
        width: 40rpx;
        height: 40rpx;
        margin: 20rpx auto;
        margin-bottom: 5rpx;
        text-align: center;
        transition: 0.24s linear;
        & img {
            display: inline;
        }
    }
}
button::after{
    outline: none;
    border: none;
}
.buttom-img{
    position: fixed;
    bottom: 32rpx;
    left: 327rpx;
    width: 126rpx;
    height: 126rpx;
    display: flex;
    justify-content: center;
    margin: 0 auto;
    text-align: center;
    border-radius: 48rpx;
}
</style>