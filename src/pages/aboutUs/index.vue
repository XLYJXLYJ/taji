<template>
    <div class="aboutUs">
        <goBackNav title url='/pages/index/main'></goBackNav>
        <img class="logo" src="/static/images/logo.png" alt />
        <p class="about">   江西飛达科技有限公司是一家专注建筑起重机械安全监管物联网平台服务的科技公司。“筑达云”为本公司倾力打造研发运营的建筑起重安全监管平台，致力于用互联网结合建筑行业需求，解决行业痛点，提供专业优质的一体化服务。建造工由顶级的互联网研发团队以及资深的建筑工程团队组成，现已获得专业投资公司已多家实力建筑工程公司的巨额投资及强力支持，助力传统建筑行业，打造建筑劳务领域专业的互联网入口。</p>
        <div class="share">
            <ul class="one-ul">
                <li class="one-li">
                    <p class="one">客服电话</p>
                    <p class="two">0795-3245168</p>
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
import goBackNav from "@/components/goBackNav.vue";
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
