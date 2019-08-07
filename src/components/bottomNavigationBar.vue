<template>
    <section class="tabBar-wrap">
        <article class="tabBar-box">
            <ul class="tabBar-nav" v-if="navList.length > 0">
                <li class="item"
                    v-for="(item, index) in navList"
                    @click="selectNavItem(index,item.pagePath)"
                    :key="index">
                    <button open-type="getUserInfo" @getuserinfo="getUserInfo" style="border:none;">
                        <p class="item-images">
                            <img :src="selectNavIndex === index ? item.selectedIconPath : item.iconPath" alt="iconPath"/>
                        </p>
                        <p :class="selectNavIndex === index ? 'item-text item-text-active' : 'item-text' ">
                            {{item.text}}
                        </p>
                    </button>
                </li>
            </ul>
        </article>
        <button open-type="getUserInfo" @getuserinfo="getUserInfo"> <img class="buttom-img" src="/static/images/button.png"></button>
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
            if (index === this.selectNavIndex) {
                return false;
            }
            // if (index == 0 && this.selectNavIndex == -1) {
            // this.$emit("fetchIndex",index);
            // }
            this.bindViewTap(pagePath);

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
        getUserInfo (e) {
            console.log(e)
            let userInfo = JSON.parse(e.mp.detail.rawData)
            console.log(userInfo)
            let data = {
                nickName:userInfo.nickName,
                headImg:userInfo.avatarUrl,
                gender:userInfo.gender,
                areaName:[userInfo.country,userInfo.province,userInfo.city]
            }
            fly.post('/contractor/weChatAuth',data).then(function (res) {
                console.log(res)
                wx.setStorageSync('token', res.response.authorization) 
                wx.setStorageSync('gender', res.response.gender) 
                wx.setStorageSync('mobile', res.response.mobile) 
                wx.setStorageSync('nickName', res.response.nickName) 
                wx.setStorageSync('username', res.response.username) 
            })
        }
    }
};
</script>
<style lang="scss" scoped>
.tabBar-box {
    position: fixed;
    bottom: 0;
    width: 100%;
    height: 50px;
    border-top: 1px solid #eee;
    background-color: #f8f8f8;
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
        color: rgb(252, 184, 19);
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