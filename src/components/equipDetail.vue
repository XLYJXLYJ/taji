<template>
    <div class="card-contain">
        <p class="title">塔机监控设备信息</p>
        <ul>
            <!-- <div class="img-contain" v-if="!list">
                <img src="/static/images/none.png">
            </div> -->
            <li>
                <div class="one">
                    <span class="identifier">编号 0000000001TC2017010085</span>
                </div>
                <div class="two">
                    <span class="repair">2 号塔机监控设备</span>
                </div>
                <div class="three">
                    <span>平臂塔式起重机</span>
                    <span>TXL-6</span>
                </div>
            </li>
        </ul>
    </div>
</template>

<script>
export default {
    props: ["text"]
};
</script>

<style lang="scss" scoped>
.card-contain {
    width: 100%;
    height: 100%;
    .title{
        font-size: 34rpx;
        color: black;
        font-family: 'PingFangSC-Medium';
        font-weight: 550;
        margin-left: 42rpx;
    }
    ul{
        .img-contain{
            width: 100%;
            height: 660rpx;
            display: flex;
            align-items: center;
            justify-content: center;
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
</style>
