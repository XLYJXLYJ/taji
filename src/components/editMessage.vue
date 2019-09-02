<template>
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
            <p class="two" @click="edit">管理</p>
        </div>
        <div class="contain">
            <form>
                <!-- 第一个表单 -->
                <div class="get-block">
                    <p class="title">塔机监控设备编号</p>
                    <div class="get-code">
                        <input
                            type="text"
                            v-model="getData.maintainRecord.terminalNumber"
                            placeholder="请输入编号"
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
                    <input type="text" v-model="getData.maintainRecord.title" disabled placeholder="请输入维保记录标题" autocomplete="off" />
                </div>

                <div class="get-block">
                    <p class="title">说明</p>
                    <input type="text" v-model="getData.maintainRecord.explain" disabled placeholder="请输入维保记录详细说明(选填)" autocomplete="off" />
                </div>

                <div class="img-block">
                    <p
                        class="title"
                        style="margin-bottom:20rpx;"
                    >现场照片</p>
                    <ul class="two-ul">
                        <li class="two-li" v-for="(item,index) in getData.maintainRecord.images" :key="index">
                            <img :src="item.imagePath" />
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
</template>

<script>
import mpPicker from 'mpvue-weui/src/picker';
import mpDatepicker from 'mpvue-weui/src/date-picker';
import mpUploader from "mpvue-weui/src/uploader";
import fly from "@/services/WxApi";
export default {
    components: {
        mpUploader,
        mpPicker,
        mpDatepicker
    },
    props:["getData"],

    data() {
        return {
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
            notes:''
        };
    },
    onLoad() {
        let This = this
        This.equip_type =This.getData.maintainRecord.type
        This.typeName = This.getData.maintainRecord.typeName
        This.id = This.getData.maintainRecord.id
        This.imgs = This.getData.maintainRecord.images
        This.equip_code = This.getData.maintainRecord.terminalNumber,
        This.time = This.getData.maintainRecord.maintainTime
        let da = new Date(This.time);
        let year = da.getFullYear()+'';
        let month = da.getMonth()+1+'';
        let date = da.getDate()+' ';
        //let h = da.getHours()+'';
        //let m = da.getMinutes()+'';
        //let s = da.getSeconds()+'';
        This.time = [year,month,date].join('-');
        This.notes = This.getData.maintainRecord.title,
        This.statusName = This.getData.maintainRecord.statusName
        This.status = This.getData.maintainRecord.status
        This.explain = This.getData.maintainRecord.explain || '-'
    },
    methods: {
        edit(){
            let This = this
            wx.navigateTo({
                url:'/pages/MaintenanceInformationEdit/main?id='+This.id
            });
        }
    }
};
</script>
<style lang="scss" scoped>
.card-contain-01 {
    width: 100%;
    height: 100%;
    display: block;
    background: #fff;
    margin-bottom: 48rpx;
    .titleNav{
        padding: 0rpx 42rpx;
        padding-top:48rpx;
        display: flex;
        justify-content: space-between;
        .one{
            font-size: 34rpx;
            color: block;
            font-family: "PingFangSC-Regular";
            font-weight: 550;
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
                }
                button{
                    height: 39rpx;
                    width: 45rpx;
                }
                button::after{
                    border:none;
                }
            }
        }
        .img-block {
            width: 100%;
            height: 330rpx;
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

</style>
