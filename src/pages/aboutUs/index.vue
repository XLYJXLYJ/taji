<template>
    <div class="aboutUs">
        <goBackNav></goBackNav>
        <img class="logo" src="/static/images/logo.png" alt />
        <p class="about">   江西飛达科技有限公司是一家从事建筑起重机械一体化监管服务的科技企业，解决建筑行业在施工过程中的起重机械如塔吊、施工升降机等设备的管理问题。“筑达云”为本公司倾力打造的建筑起重机械管理平台，面向设备制造企业、租赁企业、施工企业、安全监管部门、设备操作人员等提供物联网大数据平台服务，有效提高企业管理效率，降低管理成本；同时减低安全风险，保障财产和生命安全，避免建筑工地重大安全事故发生。</p>
        <div class="share">
            <ul class="one-ul">
                <li class="one-li">
                    <p class="one">客服电话</p>
                    <p class="two">0791-82329199</p>
                </li>
                <!-- <li class="one-li">
                    <p class="one">微信公众号</p>
                    <p class="two">公众号搜索：建造工信息平台</p>
                </li> -->
                <div class="about-bottom">
                    <p>www.zhudayun.cn</p>
                    <p>Copyright © 2018 江西飛达科技有限公司</p>
                </div>
            </ul>
        </div>
    </div>
</template>

<script>
import goBackNav from "@/components/goIndex01.vue";
export default {
    components: {
        goBackNav
    }
};
</script>
<style lang="scss" scoped>
.aboutUs {
    width: 100%;
    height: 100%;
    .logo {
        width: 330rpx;
        height: 80rpx;
        display: flex;
        justify-content: center;
        margin: 0 auto;
        padding: 96rpx 0 96rpx 0;
    }
    .about {
        width: 670rpx;
        margin: 0 auto;
        font-size: 28rpx;
        color: #6c6962;
        font-family: "PingFangSC-Regular";
    }
    .one-ul {
        width: 100%;
        height: 100%;
        margin-top: 70rpx;
        .one-li {
            width: 670rpx;
            margin: 24rpx auto;
            height: 120rpx;
            .one {
                font-size: 28rpx;
                color: black;
                font-family: "PingFangSC-Regular";
            }
            .two {
                font-size: 34rpx;
                color: #6c6962;
                font-family: "PingFangSC-Regular";
            }
            .two-ul {
                .two-li {
                    float: left;
                    margin-right: 32rpx;
                    img {
                        width: 144rpx;
                        height: 144rpx;
                        margin-top: 16rpx;
                    }
                }
            }
        }
    }
    .about-bottom {
        position: fixed;
        bottom: 40rpx;
        width: 100%;
        p {
            display: flex;
            justify-content: center;
            font-size: 20rpx;
            color: rgb(204, 204, 204);
            font-family: "PingFangSC-Regular";
        }
    }
}
</style>
