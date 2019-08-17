<template>
    <div class="card-contain">
        <ul>
            <div class="img-contain" v-if="!list">
                <img src="/static/images/none.png">
            </div>

             <li v-for="(item,index) in list" :key="index">
                <div class="one">
                    <span class="identifier">编号 {{item.maintainNumber}}</span>
                    <span style="color:rgba(0,0,0,0.45)"> / </span>
                    <span class="name">{{item.terminalNumber}}</span>
                </div>
                <div class="two">
                    <span class="repair">{{item.type}} | 维保记录 {{item.maintainTime}}</span>
                    <img class="go-icon" src="/static/images/right.png" alt="">
                </div>
                <div class="three">
                    <span>{{item.updateTime}}</span>
                    <span>深圳市</span>
                </div>
            </li>

            <!-- <li>
                <div class="one">
                    <span class="identifier">编号 W2124256</span>
                    <span style="color:rgba(0,0,0,0.45)"> / </span>
                    <span class="name">2号塔机监控系统</span>
                </div>
                <div class="two">
                    <span class="repair">保养 | 维保记录 2018-08-02</span>
                    <img class="go-icon" src="/static/images/right.png" alt="">
                </div>
                <div class="three">
                    <span>2019-06-10 16:43</span>
                    <span>深圳市</span>
                </div>
            </li>
            <li>
                <div class="one">
                    <span class="identifier">编号 W2124256</span>
                    <span style="color:rgba(0,0,0,0.45)"> / </span>
                    <span class="name">2号塔机监控系统</span>
                </div>
                <div class="two">
                    <span class="repair">保养 | 维保记录 2018-08-02</span>
                    <img class="go-icon" src="/static/images/right.png" alt="">
                </div>
                <div class="three">
                    <span>2019-06-10 16:43</span>
                    <span>深圳市</span>
                </div>
            </li>
            <li>
                <div class="one">
                    <span class="identifier">编号 W2124256</span>
                    <span style="color:rgba(0,0,0,0.45)"> / </span>
                    <span class="name">2号塔机监控系统</span>
                </div>
                <div class="two">
                    <span class="repair">保养 | 维保记录 2018-08-02</span>
                    <img class="go-icon" src="/static/images/right.png" alt="">
                </div>
                <div class="three">
                    <span>2019-06-10 16:43</span>
                    <span>深圳市</span>
                </div>
            </li> -->
        </ul>
    </div>
</template>

<script>
import fly from "@/services/WxApi";
export default {
    props: ["text"],
    mounted() {
        let This = this
        This.getData()
    },
    data(){
        return {
            list:'',
            page:1,
            isNull:''
        }
    },
    onReachBottom () {
        let This = this
        This.page = This.page + 1
        This.getData()
    },
    methods: {
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
                pageSize:5
            }
            fly.post('/maintain/getUserMaintainList',data).then(function (res) {
                console.log(res)
                This.list = res
                This.isNull = res.list
                
                if(This.page == 1){
                   This.list = res.list
                }else{
                //    This.list.push(JSON.parse(JSON.stringify([res.list])))

                //    This.list = This.list.concat(res.list)
                  This.list.push(...res.list)
                } 


            })
        }
    },
};
</script>

<style lang="scss" scoped>
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
</style>
