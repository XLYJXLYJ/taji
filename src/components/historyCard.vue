<template>
    <div class="card-contain" v-if='isShow'>
        <ul>
            <p class="atitle">历史维保信息</p>
            <!-- <div class="img-contain" v-if="!list">
                <img src="/static/images/none.png">
            </div> -->
            <div>
                <li v-for="(item,index) in list" :key="index" @click="goIntro(item.id)">
                    <div class="one">
                        <span class="identifier">编号 {{item.maintainNumber}}</span>
                        <span style="color:rgba(0,0,0,0.45)"> / </span>
                        <span class="name">{{item.terminalRemarkName || ''}}</span>
                    </div>
                    <div class="two">
                        <span class="repair">{{item.typeName || ''}} | {{item.title}}</span>
                        <img class="go-icon" src="/static/images/right.png" alt="">
                    </div>
                    <div class="three">
                        <span>{{item.maintainTime}}</span>
                        <span>{{item.fullAreaName || ''}}</span>
                    </div>
                </li>
            </div>
        </ul>
    </div>
</template>

<script>
import fly from "@/services/WxApi";
export default {
    props: ["text"],
    data(){
        return {
            id:'',
            list:'',
            page:1,
            isNull:'',
            isShow:''
        }
    },
    onLoad: function (options) {
        let This = this
        This.page = 1
        This.list = ''
        This.getData()
        This.id = options.id
    },
    onReachBottom () {
        let This = this
        This.page = This.page + 1
        console.log(This.page)
        This.getData()
    },
    methods: {
        goIntro(id){
            wx.navigateTo({
                url:'/pages/indexDetail/main?id=' + id
            });
        },
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
                id:This.id || 5,
                pageNo: This.page,
                pageSize:20
            }
            fly.post('/maintain/getHistoryMaintain',data).then(function (res) {
                wx.hideLoading();
                This.isNull = res.response
                if(This.page == 1){
                   This.isShow = res.response.length==0?false:true
                   This.list = res.response
                    This.list.map(
                        function(item,index){
                            let da = new Date(item.maintainTime);
                            let year = da.getFullYear()+'';
                            let month = da.getMonth()+1+'';
                            let date = da.getDate()+' ';
                        //     let h = da.getHours()+'';
                        //     let m = da.getMinutes()+'';
                        //     let s = da.getSeconds()+'';
                            item.maintainTime = [year,month,date].join('-');
                        }
                    )
                }else{
                    //    This.list.push(JSON.parse(JSON.stringify([res.list])))
                    //    This.list = This.list.concat(res.list)
                    This.list.push(...res.response)
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
        .atitle{
            font-size: 34rpx;
            color: black;
            font-family: 'PingFangSC-Medium';
            font-weight: 550;
        }
    }
}
</style>
