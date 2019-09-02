<template>
    <div class="card-contain">
        <p class="title">塔机信息</p>
        <ul>
            <!-- <div class="img-contain" v-if="!list">
                <img src="/static/images/none.png">
            </div> -->
            <li>
                <div class="one"> 
                    <span class="identifier">编号 {{getData.tower.towerNumber}}</span>
                </div>
                <div class="two">
                     <span class="repair">塔身高{{getData.tower.height}} | 臂长{{getData.tower.armLength}} | 尾臂长{{getData.tower.armTailLength}}</span>
                </div>
                <div class="three">
                    <span>{{getData.tower.towerTypeName || '-'}}</span>
                    <span>{{getData.tower.towerModel || '-'}}</span>
                </div>
            </li>
        </ul>
    </div>
</template>

<script>
export default {
    props: ["getData"]
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
        font-weight: 650;
        margin-left: 42rpx;
        margin-bottom: 24rpx;
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
                    color:#bfc2c4;
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
                    // background: red;
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
