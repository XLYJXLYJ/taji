<template>
    <div class="container">
        <section class="sec-nav">
            <goBackNav title="维保详情"></goBackNav>
        </section>
        <div v-if="isShow" class="all-contain">
            <section class="img-contain" v-if="getData.terminal" style="padding-bottom:72rpx">
                <equipDetail :getData='getData'></equipDetail>
            </section>
            <section class="img-contain" v-if="getData.tower" style="padding-bottom:72rpx">
                <equipMessage :getData='getData'></equipMessage>
            </section>
            <section class="img-contain" v-if="getData.maintainRecord">
                <div class="card-contain-01">
                    <div v-if="isAlert">
                        <selfAlert
                            v-bind:changeModel="ischangeModel"
                            v-bind:isModel="ifMode"
                            v-bind:val="0"
                            @func="controlAlert"
                        ></selfAlert>
                    </div>
                    <div class="titleNav">
                        <p class="one">维保信息</p>
                        <p class="two" @click="edit" v-if="!getOpenid">管理</p>
                    </div>
                    <div class="contain">
                        <form>
                            <!-- 第一个表单 -->
                            <div class="get-block" style="border:none">
                                <p class="title">维保编号</p>
                                <div class="get-code">
                                    <input
                                        type="text"
                                        v-model="getData.maintainRecord.maintainNumber"
                                        autocomplete="off"
                                        disabled
                                    />
                                </div>
                            </div>

                            <div class="get-block">
                                <p class="title">塔机监控设备编号</p>
                                <div class="get-code">
                                    <input
                                        type="text"
                                        v-model="getData.maintainRecord.terminalNumber"
                                        autocomplete="off"
                                        disabled
                                    />
                                </div>
                            </div>

                            <div class="get-block" style="border:none">
                                <p class="title">设备备注名</p>
                                <div class="get-code">
                                    <input
                                        type="text"
                                        v-model="getData.maintainRecord.terminalRemarkName"
                                        autocomplete="off"
                                        disabled
                                    />
                                </div>
                            </div>

                            <div class="get-block">
                                <p class="title">维保类型</p>
                                <input type="text" v-model="getData.maintainRecord.typeName" disabled placeholder="请选择类型" autocomplete="off" @focus="showType"/>
                            </div>

                            <div class="get-block">
                                <p class="title">维保日期</p>
                                <input type="text" v-model="getData.maintainRecord.maintainTime" disabled placeholder="请选择日期" autocomplete="off" @focus="showTime"/>
                            </div>

                            <div class="get-block">
                                <p class="title">状态</p>
                                <input type="text" v-model="getData.maintainRecord.statusName" disabled placeholder="请选择状态" autocomplete="off" @focus="showStatus"/>
                            </div>

                            <div class="get-block">
                                <p class="title">维保记录标题</p>
                                <p class="ptext">{{getData.maintainRecord.title}}</p>
                                <!-- <input type="text" v-model="getData.maintainRecord.title" disabled placeholder="请输入维保记录标题" autocomplete="off" /> -->
                            </div>

                            <div class="get-block">
                                <p class="title">说明</p>
                                <p class="ptext">{{getData.maintainRecord.explain}}</p>
                                <!-- <input type="text" v-model="getData.maintainRecord.explain" disabled placeholder="-" autocomplete="off" /> -->
                            </div>

                            <div class="img-block" v-if="getData.maintainRecord.images">
                                <p
                                    class="title"
                                    style="margin-bottom:20rpx;"
                                >现场照片</p>
                                <ul class="two-ul">
                                    <li class="two-li" v-for="(item,index) in getData.maintainRecord.images" :key="index" @click="headPreviewImage(item.imagePath,getData.maintainRecord.images)">
                                        <img :src="item.imagePath + '&isCompress=1'" />
                                    </li>
                                </ul>
                            </div>
                            <!-- <div>
                                <button class="confirm" @click="submitEquip">添加维保记录</button>
                            </div> -->
                            <!-- <p class="title">
                                建筑业优秀班组数据库是建造工平台提供的服务，点击提交即表示同意
                                <span style="color:rgb(252 184 19)">《建造工用户协议》</span>
                            </p> -->
                        </form>
                    </div>
                </div>

                <div class="card-contain" style="margin-top:48rpx;padding-bottom:48rpx" v-if='isHistoryShow'>
                    <ul>
                        <p class="atitle">历史维保信息</p>
                        <!-- <div class="img-contain" v-if="!historyList">
                            <img src="/static/images/none.png">
                        </div> -->
                        <li v-for="(item,index) in historyList" :key="index" @click="goIntro(item.id)">
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
                        <div style="height:61rpx;width:100%;background:rgb(249,249,249);"></div>
                    </ul>
                </div>
            </section>
            <section>

            </section>
        </div>

    </div>
</template>

<script>
import editMessage from "@/components/editMessage.vue";
import navigationBar from "@/components/navigationBar.vue";
import equipDetail from "@/components/equipDetail.vue";
import equipMessage  from "@/components/equipMessage.vue";
import goBackNav from "@/components/goIndex.vue";
import fly from "@/services/WxApi";
export default {
    components: {
        navigationBar,
        goBackNav,
        equipMessage,
        equipDetail,
        editMessage
    },
    onLoad: function (options) {
        let This = this
        This.id = options.id
        wx.setStorageSync('id',This.id)
        if(options.share == 'undefined'){
            This.getOpenid = false
        }else{
            This.getOpenid = options.share
        }

        let data1 = {
            id:This.id
        }
        fly.post('/maintain/getMaintainDetail',data1).then(function (res) {
            This.getData = res.response

            let da = new Date(This.getData.maintainRecord.maintainTime);
            let year = da.getFullYear()+'';
            let month = da.getMonth()+1+'';
            let date = da.getDate()+' ';
            //let h = da.getHours()+'';
            //let m = da.getMinutes()+'';
            //let s = da.getSeconds()+'';
            let ym = [year,month].join(' 年 ')
            let md = [ym,date].join(' 月 ');
            This.getData.maintainRecord.maintainTime = [md,''].join('日');
            This.isShow = true
        })
        This.historyPage = 1
        // This.historyList = ''
        if(This.ishistoryNull == null || This.ishistoryNull.length == 0){
            // wx.showToast({
            //     title: '数据已加载完',
            //     icon: "none",
            //     duration: 2000
            // })
        }else{
            // wx.showLoading({
            //     title:'加载中'
            // })
        }
        if(!This.getOpenid){
            This.getOpenid = ''
        }
        let data = {
            id:This.id || 5,
            pageNo: This.historyPage,
            pageSize:20,
            share:This.getOpenid
        }
        fly.post('/maintain/getHistoryMaintain',data).then(function (res) {
            wx.hideLoading();
            This.ishistoryNull = res.response
            if(This.historyPage == 1){   
                if(res.response.length == 0){
                    This.isHistoryShow = false
                }else{
                    This.isHistoryShow = true
                    This.historyList = res.response
                    This.historyList.map(
                        function(item,index){
                            let da = new Date(item.createTime);
                            let year = da.getFullYear()+'';
                            let month = da.getMonth()+1+'';
                            let date = da.getDate()+' ';
                            let h = da.getHours()+'';
                            let m = da.getMinutes()+'';
                            if(m<10){
                                m = '0' + m
                            }else{
                                m = m
                            }
                            let s = da.getSeconds()+'';
                            let hm = [h,m].join(':');
                            item.maintainTime = [year,month,date].join('-') + ' ' + hm;
                        }
                    )
                    This.historyList.map(
                        function(item,index){
                            item.title = item.title.length>13?item.title.substring(0,13)+'...':item.title
                        }
                    )
                }
            }else{
                //This.historyList.push(JSON.parse(JSON.stringify([res.historyList])))
                //This.historyList = This.historyList.concat(res.historyList)
                This.historyList.push(...res.response)
            } 
        })
    },
    onReachBottom () {
        let This = this
        This.historyPage = This.historyPage + 1
        if(This.ishistoryNull == null || This.ishistoryNull.length == 0){
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
        if(!This.getOpenid){
            This.getOpenid = ''
        }
        let data = {
            id:This.id || 5,
            pageNo: This.historyPage,
            pageSize:20,
            share:This.getOpenid
        }
        fly.post('/maintain/getHistoryMaintain',data).then(function (res) {
            wx.hideLoading();
            This.ishistoryNull = res.response
            if(This.historyPage == 1){
                // This.isHistoryShow = res.response.length==0?false:true
                This.historyList = res.response
                This.historyList.map(
                    function(item,index){
                        let da = new Date(item.maintainTime);
                        let year = da.getFullYear()+'';
                        let month = da.getMonth()+1+'';
                        let date = da.getDate()+' ';
                        //let h = da.getHours()+'';
                        //let m = da.getMinutes()+'';
                        //let s = da.getSeconds()+'';
                        item.maintainTime = [year,month,date].join('-');
                    }
                )
            }else{
                //This.historyList.push(JSON.parse(JSON.stringify([res.historyList])))
                //This.historyList = This.historyList.concat(res.historyList)
                This.historyList.push(...res.response)
            } 
        })
    },
    onShareAppMessage: (res) => {
        let This = this
        let data = '/pages/indexDetail/main?share=' + wx.getStorageSync('openid') +'&id=' + wx.getStorageSync('id') +'&pageNo=1&pageSize=20'
        return{
            title:'筑达云维保助手',
            path:data
        }
    },
    data() {
        return {
            imgUrls: [
                {
                    id: 0,
                    url: "https://images.unsplash.com/photo-1551334787-21e6bd3ab135?w=640"
                },
                {
                    id: 1,
                    url: "https://images.unsplash.com/photo-1551214012-84f95e060dee?w=640"
                },
                {
                    id: 2,
                    url: "https://images.unsplash.com/photo-1551446591-142875a901a1?w=640"
                }
            ],
            id:'',
            getData:'',
            isShow:false,
            equip_type: '',
            equip_code: '',
            time:'',
            notes: '',
            status: '',
            explain:'',
            TypeMode: "selector",
            imgs:[],
            typeName:'',
            statusName:'',
            notes:'',
            historyList:'',
            isHistoryShow:false,
            getOpenid:''
        };
    },
    methods: {
        headPreviewImage(url,arr) {
            let This = this
            let imgArr = []
            arr.map(
                function(item,index){
                    imgArr.push(item.imagePath)
                }
            )
            wx.previewImage({
                current:url,
                urls: imgArr
            });
        },
        goIntro(id){
            let This = this
            wx.navigateTo({
                url:'/pages/indexDetail/main?id=' + id +'&share=' + This.getOpenid
            });
        },
        getData(){
            let This = this

        },
        edit(){
            let This = this
            wx.navigateTo({
                url:'/pages/MaintenanceInformationEdit/main?id='+This.id 
            });
        }
    },
};
</script>

<style scoped lang='scss'>
.container {
    width: 100%;
    height: 100%;
    background: rgb(249,249,249);
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    .all-contain{
        flex:1;
        .img-contain {
        display: block;
        width: 100%;
        height: 296rpx;
        margin: 0 auto;
        border-radius: 12rpx;
        margin-top: 48rpx;
        position: relative;
        background: #fff;
        padding: 48rpx 0rpx;
        image {
            width: 670rpx;
            height: 290rpx;
            border-radius: 12rpx;
        }
        .card-contain-01 {
            width: 100%;
            height:auto;
            display: block;
            background: #fff;
            margin-bottom: 48rpx;
            .titleNav{
                padding: 0rpx 42rpx;
                display: flex;
                justify-content: space-between;
                .one{
                    font-size: 34rpx;
                    color: black;
                    font-family: "PingFangSC-Regular";
                    font-weight: 650;
                }
                .two{
                    font-size: 28rpx;
                    color: #1890FF;
                    font-family: "PingFangSC-Regular";
                }
            }
            .contain {
                width: 670rpx;
                margin: 0 auto;
                margin-top: 40rpx;
                .get-block {
                    margin-bottom: 48rpx;
                    .get-code {
                        display: flex;
                        justify-content: space-between;
                        input{
                            width:100%;
                            font-size: 34rpx;
                            color:#5f5f5f;
                        }
                        button{
                            height: 39rpx;
                            width: 45rpx;
                        }
                        button::after{
                            border:none;
                        }
                    }
                    input{
                        width:100%;
                        font-size: 34rpx;
                        color:#5f5f5f;
                    }
                    .ptext{
                        width:100%;
                        height: auto;
                        font-size: 34rpx;
                        color:#5f5f5f;
                    }
                }
                .img-block {
                display: flex;
                flex-direction: column;
                min-height: 10vh;
                    .two-ul {
                        flex:1;
                        .two-li {
                            float: left;
                            margin-right: 22rpx;
                            margin-bottom: 22rpx;
                            width: 144rpx;
                            height: 144rpx;
                            overflow: hidden;
                            border-radius: 12rpx;
                            img {
                                // width:auto;
                                // height: 144rpx;
                            }
                        }
                    }
                }
                .title {
                    font-size: 28rpx;
                    color: block;
                    font-family: "PingFangSC-Regular";
                    margin-bottom: 16rpx;
                }
                input {
                    padding-bottom: 16rpx;
                }
                .confirm {
                    background: #1890FF;
                    color: #fff;
                    margin-bottom: 24rpx;
                    font-size: 34rpx;
                    font-family: "PingFangSC-Medium";
                }
                .confirm::after {
                    border:none;
                }
            }
        }
        .getCode {
            color: black;
        }
        .card-contain {
            position: relative;
            width: 750rpx;
            height: auto;
            display: block;
            background: rgb(249,249,249);
            padding-bottom: 48rpx;
            ul{
                position: relative;
                top: 48rpx;
                width: 100%;
                background: #fff;
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
                height: auto;
                margin: 0 auto;
                display: flex;
                flex-direction: column;
                justify-content: flex-start;
                li{
                    width: 606rpx;
                    padding: 36rpx 32rpx;
                    margin: 0 auto;
                    margin-bottom: 48rpx;
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
                .atitle{
                    font-size: 34rpx;
                    color: black;
                    font-family: 'PingFangSC-Medium';
                    font-weight: 650;
                    margin-bottom: 24rpx;
                    margin-top: 48rpx;
                    margin-left: 40rpx;
                }
            }
        }
    }
    }
}
</style>
