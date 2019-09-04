<template>
    <section class="tabBar-wrap">
        <article class="tabBar-box">
            <ul class="tabBar-nav" v-if="navList.length > 0">
                <li class="item" v-for="(item, index) in navList" @click="selectNavItem(index,item.pagePath)" :key="index">
                    <button>
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
        <button @click="add"><img class="buttom-img" src="/static/images/button.png"></button>
    </section>
</template>
<script>
import fly from "@/services/WxApi";
export default {
    props: ["selectNavIndex", "needButton", "handButton", "btnText"],
    data() {
        return {
            changeModel:false,
            isModel:false,
            path:'',
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
            if(index==1){
                if(!wx.getStorageSync('token')){
                    This.changeModel = true
                    This.isModel = true
                    This.path = pagePath
                }else{
                    // This.bindViewTap(pagePath);
                }
            }else{
                This.changeModel = false
                This.isModel = false
            }
            This.$emit('indexId',index)
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
        },
        isOk(){
            let This = this
            if(!wx.getStorageSync('token')){
                This.changeModel = true
                This.isModel = true
                This.path = '/pages/login/main'
            }else{
                wx.redirectTo({
                    url:'/pages/registerClass/main'
                })
            }
        }
    }
};
</script>
<style lang="scss" scoped>
.modalMask {
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    background: #000;
    opacity: 0.5;
    overflow: hidden;
    z-index: 9000;
    color: #fff;
}
.modalDialog {
    box-sizing: border-box;
    width: 590rpx;
    height: 332rpx;
    overflow: hidden;
    position: fixed;
    top: 50%;
    left: 0;
    z-index: 9999;
    background: #fff;
    margin: -180rpx 95rpx;
    border-radius: 8rpx;
}
.modalContent {
    box-sizing: border-box;
    display: flex;
    font-size: 32rpx;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    img {
        width: 590rpx;
        height: 340rpx;
        margin-bottom: 40rpx;
    }
    .contentTip {
        font-size: 34rpx;
        color: black;
        font-family: "PingFangSC-Regular";
        display: flex;
        justify-content: center;
        width: 514rpx;
        padding-top: 42rpx;
    }
    .alert{
        width:100%;
        height: 96rpx;
    }
    button {
        width: 100%;
        height: 96rpx;
        margin-top: 40rpx;
        font-size: 34rpx;
        color: rgb(252, 184, 19);
        font-family: "PingFangSC-Medium";
        font-weight: 550;
        display: flex;
        justify-content: center;
        align-items: center;
        background: #fff;
        border-bottom: none;
        border-top: 1px solid #e5e5e5;
    }
}

.tabBar-box {
    position: fixed;
    bottom: 0;
    width: 100%;
    height: 50px;
    box-shadow:3rpx 3rpx 6rpx #999;
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
    border-radius: 65rpx;
}
</style>