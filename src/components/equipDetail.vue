<template>
    <div class="card-contain" v-if="getData.terminal">
        <p class="title">塔机监控设备信息</p>
        <ul>
            <!-- <div class="img-contain" v-if="!list">
                <img src="/static/images/none.png">
            </div> -->
            <li>
                <div class="one">
                    <span class="identifier">编号 {{getData.terminal.terminalNumber}}</span>
                </div>
                <div class="two">
                    <span class="repair">{{getData.terminal.terminalRemarkName}}</span>
                </div>
                <div class="three">
                    <span>{{getData.terminal.typeName || '-'}}</span>
                    <span>{{getData.terminal.terminalModelNumber || '-'}}</span> 
                </div>
            </li>
        </ul>
    </div>
</template>

<script>
export default {
    props: ["getData"],
    mounted() {

    },
};
</script>

<style lang="scss" scoped>
.card-contain {
    width: 100%;
    height: auto;
    .title{
        font-size: 34rpx;
        color: black;
        font-family: 'PingFangSC-Medium';
        font-weight: 650;
        margin-left: 42rpx;
        margin-bottom: 24rpx;
    }
    ul{
        .img-contain{
            width: 100%;
            height: 244rpx;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #f8fbfe;
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
            height: 172rpx;
            margin-bottom: 32rpx;
            background: #f8fbfe;
            border-radius: 8rpx;
            .one{
                margin-bottom: 22rpx;
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
                    font-weight: 650;
                }
                .go-icon{
                    height: 26rpx;
                    width: 16rpx;
                }
            }
            .three{
                font-size: 28rpx;
                color:#bfc2c4;
                font-family: 'PingFangSC-Regular';
                display: flex;
                justify-content: space-between;
            }
        }
    }
}
</style>
