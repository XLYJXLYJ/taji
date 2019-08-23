<template>
    <div class="register">
        <goBackNav title="维保信息"></goBackNav>
        <div v-if="isAlert">
            <!--弹窗的页面-->
            <div class="modalMask" v-show="isModel" @click="hidePanel"></div>
            <div class="modalDialog" v-show="changeModel">
                <div class="modalContent">
                    <p class="contentTip">确定删除该维保记录？</p>
                    <div class="modalBottom">
                        <button @click="tapCancel">取消</button>
                        <button @click="confirmSend">确认</button>
                    </div>
                </div>
            </div>
        </div>
        <div class="contain">
            <form>
                <!-- 第一个表单 -->
                <div class="get-block" style="border:none">
                    <p class="title">维保编号</p>
                    <div class="get-code">
                        <input
                            type="text"
                            v-model="maintainNumber"
                            autocomplete="off"
                            disable
                        />
                    </div>
                </div>

                <div class="get-block" style="border:none">
                    <p class="title">塔机监控设备编号</p>
                    <div class="get-code">
                        <input
                            type="text"
                            v-model="equip_code"
                            autocomplete="off"
                            disable
                        />
                    </div>
                </div>

                <div class="get-block" style="border:none">
                    <p class="title">设备备注名</p>
                    <div class="get-code">
                        <input
                            type="text"
                            v-model="terminalRemarkName"
                            autocomplete="off"
                            disable
                        />
                    </div>
                </div>

                <div class="get-block">
                    <p class="title">维保类型</p>
                    <p @click="showType" style="color:#5f5f5f;height:70rpx">{{typeName}}</p>
                    <mp-picker ref="typePicker" themeColor="rgb(24,144,255)" :mode="TypeMode" :deepLength=deepLength :pickerValueDefault="pickerTypeValueDefault" @onChange="onTypeChange" @onConfirm="onTypeConfirm" @onCancel="onTypeCancel" :pickerValueArray="typePickerValueArray"></mp-picker>
                </div>


                <div class="get-block">
                    <p class="title">维保日期</p>
                   <p @click="showTime" style="color:#5f5f5f;height:70rpx">{{time}}</p> 
                    <mp-datepicker ref="mpDatePicker" themeColor="rgb(24,144,255)" :defaultDate="defaultDate" @onChange="onTimeChange" @onConfirm="onTimeConfirm" @onCancel="onTimeCancel"></mp-datepicker>
                </div>

                <div class="get-block">
                    <p class="title">状态</p>
                    <p @click="showStatus" style="color:#5f5f5f;height:70rpx">{{statusName}}</p>
                    <mp-picker ref="statusPicker" themeColor="rgb(24,144,255)" :mode="statusMode" :deepLength=deepLength :pickerValueDefault="pickerStatusValueDefault" @onChange="onStatusChange" @onConfirm="onStatusConfirm" @onCancel="onStatusCancel" :pickerValueArray="statusPickerValueArray"></mp-picker>
                </div>

                <div class="get-block">
                    <p class="title">维保记录标题</p>
                    <input type="text" v-model="notes" placeholder="请输入维保记录标题" autocomplete="off" />
                </div>

                <div class="get-block">
                    <p class="title">说明</p>
                    <input type="text" v-model="explain" placeholder="请输入维保记录详细说明(选填)" autocomplete="off" />
                </div>


              
                
                
                <div class="img-block">
                    <p
                        class="title"
                        style="margin-bottom:20rpx;"
                    >现场照片</p>
                    <upload width="120rpx" height="120rpx" max="3" @choosed="chooseImg" @delete="deleteImg" :srcs="imgData"></upload>
                </div>
                <div class="button">
                    <button class="confirm01" @click="dele">删除</button>
                    <button class="confirm02" @click="submitEquip">保存</button>
                </div>
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
import goBackNav from "@/components/goBackNav.vue";
import upload from "@/components/upload.vue";
import mpUploader from "mpvue-weui/src/uploader";
import fly from "@/services/WxApi";
export default {
    components: {
        goBackNav,
        mpUploader,
        mpPicker,
        mpDatepicker,
        upload
    },

    data() {
        return {
            isAlert:'',
            changeModel:'',
            isModel:'',
            explain:'',
            terminalRemarkName:'',
            maintainNumber:'',
            type: "",
            typeName:'请选择类型',
            equip_code: "",
            time: "请选择时间",
            time1:'',
            notes: "",
            status: "",
            statusName:'请选择状态',
            TypeMode: "selector",
            arrayBuffer :'',
            imgData:[],
            typePickerValueArray:[
                {
                    label: '类型一',
                    value: 1
                },
                {
                    label: '类型二',
                    value: 2
                },
                {
                    label: '类型三',
                    value: 3
                },
                {
                    label: '类型四',
                    value: 4
                }
            ],
            statusMode: "selector",
            statusPickerValueArray:[
                {
                    label: '状态一',
                    value: 1
                },
                {
                    label: '状态二',
                    value: 2
                },
                {
                    label: '状态三',
                    value: 3
                },
                {
                    label: '状态四',
                    value: 4
                }
            ]
        };
    },
    onLoad: function (options) {
        console.log(options)
        let This = this
        This.id = options.id
        let data0 = {
            id:This.id
        }
        fly.post('/maintain/getMaintainDetail',data0).then(function (res) {
            This.getData = res.response
            console.log(res)
            This.maintainNumber = This.getData.maintainRecord.maintainNumber
            This.terminalRemarkName = This.getData.maintainRecord.terminalRemarkName
            This.id = This.getData.maintainRecord.id
            This.imgData = This.getData.maintainRecord.images
            This.equip_type =This.getData.maintainRecord.type
            This.typeName = This.getData.maintainRecord.typeName
            This.type = This.getData.maintainRecord.type
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
            This.time1 =  [year,month,date].join('-');
            This.notes = This.getData.maintainRecord.title,
            This.statusName = This.getData.maintainRecord.statusName
            This.status = This.getData.maintainRecord.status
            This.explain= This.getData.maintainRecord.explain
        })

        let data1 = {
            code:'maintain_type',
            isShowAll:2
        }
        fly.post('/common/getSelectDiction',data1).then(function (res) {
            let data = res.response
            console.log(res)
            let arr = []
            res.response.map((value,index,arry)=>{
                arr.push({ 'label': value.name, 'value': value.code})
            })
            This.typePickerValueArray = arr
        })
        let data2 = {
            code:'maintain_status',
            isShowAll:2
        }
        fly.post('/common/getSelectDiction',data2).then(function (res) {
            let data = res.response
            console.log(res)
            let arr = []
            res.response.map((value,index,arry)=>{
                arr.push({ 'label': value.name, 'value': value.code})
            })
            This.statusPickerValueArray = arr
        })

    },
    methods: {
        chooseImg(res){
            console.log(res)
            let This = this
            res.all.map(
                function(item,index){
                    console.log(item)
                    item = JSON.stringify(item)
                    console.log(item)
                    This.imgData.push(item)
                }
            )
            console.log(res.all)
            // This.imgData = res.all
        },
        deleteImg(res){
            console.log(res)
            let This = this
            res.map(
                function(item,index){
                    item = JSON.stringify(item)
                    This.imgData.push(item)
                }
            )
        },
        dele(){
            let This = this
            This.isAlert = true
            This.changeModel = true;
            This.isModel = true
        },
        showType(){
            this.$refs.typePicker.show();
        },
        showStatus(){
            this.$refs.statusPicker.show();
        },
        showTime(){
            this.$refs.mpDatePicker.show();
        },
        GetQbCode() {
            wx.scanCode({
                success(res) {
                    console.log(res)
                }
            })
        },
        upLoadSuccess(successRes){
            let This = this
            let size = successRes.tempFiles[0].size
            console.log(successRes)
            console.log(size)
            const tempFilePaths = successRes.tempFilePaths
            let token = wx.getStorageSync('token') || '';
            wx.uploadFile({
                url: 'https://wxtjapi.test.jianzaogong.com/common/uploadImg', //仅为示例，非真实的接口地址
                filePath: tempFilePaths[0],
                name: 'file',
                header: {
                    'content-type': 'multipart/form-data',
                    'Authorization':token
                },
                formData:{
                    'isNeedHttp':1
                },
                success (res){
                    const data = JSON.parse(res.data)
                    console.log(data)
                    let jdata = {"createTime":null,"fileSize":size,"id":null,"imagePath":data.response,"mainId":null,"module":null,"type":1,"user":null}
                    This.imgData.push(jdata)
                    //do something
                }
            })
        },
        upLoadFail(errMsg){
            console.log(errMsg)
        },
        uploadDelete(DeleteRes){
            console.log(DeleteRes)
            let This = this
            let index = DeleteRes.index
            This.imgMessage.splice(index,1)
            console.log(This.imgMessage)          

        },
        submitEquip(){
            let This = this
            if(!This.typeName){
                wx.showToast({
                    title: "维保类型不能为空",
                    icon: "none",
                    duration: 2000
                });
                return;
            }
            if(!This.equip_code){
                wx.showToast({
                    title: "设备编号不能为空",
                    icon: "none",
                    duration: 2000
                });
                return;
            }
            if(!This.time){
                wx.showToast({
                    title: "维保时间不能为空",
                    icon: "none",
                    duration: 2000
                });
                return;
            }
            if(!This.explain){
                wx.showToast({
                    title: "说明不能为空",
                    icon: "none",
                    duration: 2000
                });
                return;
            }
            if(!This.statusName){
                wx.showToast({
                    title: "状态不能为空",
                    icon: "none",
                    duration: 2000
                });
                return;
            }
            if(!This.notes){
                wx.showToast({
                    title: "维保记录标题不能为空",
                    icon: "none",
                    duration: 2000
                });
                return;
            }
            if(!This.imgData){
                wx.showToast({
                    title: "请上传在职证明",
                    icon: "none",
                    duration: 2000
                });
                return;
            }
            let data = {
                id:This.id,
                type:This.type,
                maintainTime:This.time1,
                status:This.status,
                title:This.notes,
                explain:This.explain,
                images:JSON.stringify(This.imgData)
            }
            fly.post('/maintain/saveMaintain',data).then(function (res) {
                console.log(res)
                if(res.status!=200){
                    wx.showToast({
                        title: res.message,
                        icon: "none",
                        duration: 2000
                    });
                    return;
                }else{
                    wx.showToast({
                        title: "申请加入成功",
                        icon: "none",
                        duration: 2000
                    });
                    wx.reLaunch({
                        url:'/pages/index/main'
                    });
                }
            })
        },
        onTypeConfirm(e) {
            console.log(e);
            let This = this
            This.type = e.index[0]
            This.typeName = e.label
        },
        onTypeChange(e) {
            console.log(e);
        },
        onTypeCancel(e) {
            console.log(e);
        },
        onTimeConfirm(e) {
            console.log(e);
            let This = this
            This.time = e.label
            This.time1 = e.value.join("-")
            console.log(This.time1)
        },
        onTimeChange(e) {
            console.log(e);
        },
        onTimeCancel(e) {
            console.log(e);
        },
        onStatusConfirm(e) {
            console.log(e);
            let This = this
            This.status = e.index[0]
            This.statusName = e.label
        },
        onStatusChange(e) {
            console.log(e);
        },
        onStatusCancel(e) {
            console.log(e);
        },
        confirmSend(){
            let This = this
            let data = {
                id:This.id
            }
            fly.post('/maintain/deleteMaintain',data).then(function (res) {
                console.log(res)
                if(res.status!=200){
                    wx.showToast({
                        title: res.message,
                        icon: "none",
                        duration: 2000
                    });
                    return;
                }else{
                    wx.showToast({
                        title: "删除成功",
                        icon: "none",
                        duration: 2000
                    });
                    wx.reLaunch({
                        url:'/pages/index/main'
                    });
                }
            })
        },
        tapCancel(){
            let This = this
            This.isAlert = false
            This.changeModel = false;
            This.isModel = false
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
    height: auto;
    overflow: hidden;
    position: fixed;
    top: 50%;
    left: 0;
    z-index: 9999;
    background: #fff;
    margin: -180rpx 95rpx;
    border-radius: 8rpx;
    border-radius: 30rpx;
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

    .modalBottom{
        display: flex;
        justify-content: space-around;
        button {
            width: 295rpx;
            height: 96rpx;
            margin-top: 40rpx;
            font-size: 34rpx;
            color: black;
            font-family: "PingFangSC-Medium";
            display: flex;
            justify-content: center;
            align-items: center;
            background: #fff;
            border-bottom: none;
        }
    }
}
.register {
    width: 100%;
    height: 100%;
    .contain {
        width: 670rpx;
        margin: 0 auto;
        margin-top: 40rpx;
        .get-block {
            border-bottom: 1px solid rgb(204, 204, 204);
            margin-bottom: 48rpx;
            .get-code {
                display: flex;
                justify-content: space-between;
                img{
                    height: 39rpx;
                    width: 45rpx;
                }
            }
        }
        .img-block {
            width: 100%;
            height: 330rpx;
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

        .button{
            display: flex;
            justify-content: space-around;
            .confirm01 {
                background: #fff;
                color: #f6303b;
                border:1rpx solid #f5222d;
                margin-bottom: 24rpx;
                font-size: 34rpx;
                font-family: "PingFangSC-Medium";
                width: 322rpx;
                height: 80rpx;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .confirm02 {
                background: #1890FF;
                color: #fff;
                margin-bottom: 24rpx;
                font-size: 34rpx;
                font-family: "PingFangSC-Medium";
                width: 322rpx;
                height: 80rpx;
                display: flex;
                align-items: center;
                justify-content: center;
            }
        }
    }
}
.getCode {
    color: black;
}

</style>
