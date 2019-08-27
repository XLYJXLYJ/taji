<template>
    <div class="register">
        <goBackNav title="维保信息"></goBackNav>
        <div v-if="isAlert">
            <selfAlert
                v-bind:changeModel="ischangeModel"
                v-bind:isModel="ifMode"
                v-bind:val="0"
                @func="controlAlert"
            ></selfAlert>
        </div>
        <div class="contain">
            <form>
                <!-- 第一个表单 -->
                <div class="get-block">
                    <p class="title">塔机监控设备编号</p>
                    <div class="get-code">
                        <input
                            type="text"
                            v-model="equip_code"
                            placeholder="请输入编号"
                            autocomplete="off"
                            placeholder-style='color:#e5e5e5'
                        />
                        <p @click="GetQbCode"><img src="/static/images/qb.png" alt=""></p>
                    </div>
                </div>

                <div class="get-block">
                    <p class="title">维保类型</p>
                    <!-- <p @click="showType" style="color:#5f5f5f;height:60rpx">{{type1}}</p> -->
                        <input
                            type="text"
                            v-model="type1"
                            placeholder="请输入类型"
                            autocomplete="off"
                            style="color:#5f5f5f;height:60rpx"
                            placeholder-style='color:#e5e5e5'
                            disabled
                            @click="showType"
                        />
                    <mp-picker ref="typePicker" themeColor="rgb(24,144,255)" :mode="TypeMode" :deepLength=deepLength :pickerValueDefault="pickerTypeValueDefault" @onChange="onTypeChange" @onConfirm="onTypeConfirm" @onCancel="onTypeCancel" :pickerValueArray="typePickerValueArray"></mp-picker>
                </div>

                <div class="get-block">
                    <p class="title">维保日期</p>
                    <p @click="showTime" style="color:#5f5f5f;height:60rpx">{{time1}}</p> 
                    <mp-datepicker ref="mpDatePicker" themeColor="rgb(24,144,255)" :defaultDate="defaultDate" @onChange="onTimeChange" @onConfirm="onTimeConfirm" @onCancel="onTimeCancel"></mp-datepicker>
                </div>

                <div class="get-block">
                    <p class="title">状态</p>
                    <!-- <p @click="showStatus" style="color:#5f5f5f;height:60rpx">{{status1}}</p> -->
                    <input
                        type="text"
                        v-model="status1"
                        placeholder="请输入状态"
                        autocomplete="off"
                        style="color:#5f5f5f;height:60rpx"
                        placeholder-style='color:#e5e5e5'
                        disabled
                        @click="showStatus"
                    />
                    <mp-picker ref="statusPicker" themeColor="rgb(24,144,255)" :mode="statusMode" :deepLength=deepLength :pickerValueDefault="pickerStatusValueDefault" @onChange="onStatusChange" @onConfirm="onStatusConfirm" @onCancel="onStatusCancel" :pickerValueArray="statusPickerValueArray"></mp-picker>
                </div>

                <div class="get-block">
                    <p class="title">维保记录标题</p>
                    <input type="text" style="color:#5f5f5f;height:60rpx"  placeholder-style='color:#e5e5e5' v-model="notes" placeholder="请输入维保记录标题" autocomplete="off" />
                </div>

                <div class="get-block">
                    <p class="title">说明</p>
                    <input type="text" v-model="explain" style="color:#5f5f5f;height:60rpx"  placeholder-style='color:#e5e5e5' placeholder="请输入维保记录详细说明(选填)" autocomplete="off" />
                </div>

                <div class="img-control">
                    <div class="img-block">
                        <p
                            class="title"
                            style="margin-bottom:20rpx;"
                        >现场照片</p>
                        <mp-uploader
                            @upLoadSuccess="upLoadSuccess"
                            @upLoadFail="upLoadFail"
                            @uploadDelete="uploadDelete"
                            ref="uploader"
                            :showTip=false
                            :maxLength=9
                            :count=9
                            :isMaxHiddenChoose=true
                        ></mp-uploader>
                    </div>
                    <div>
                        <button class="confirm" @click="submitEquip">添加维保记录</button>
                    </div>
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
import mpUploader from "mpvue-weui/src/uploader";
import fly from "@/services/WxApi";
export default {
    components: {
        goBackNav,
        mpUploader,
        mpPicker,
        mpDatepicker
    },

    data() {
        return {
            type: 1,
            type1:'',
            equip_code: "",
            time: "请选择时间",
            time1:'请选择时间',
            notes: "",
            status: 1,
            status1:'',
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
    mounted() {
        
        let This = this
        This.equip_code = ''
        This.type1 = ''
        This.status1 = ''
        This.notes = ''
        This.explain = ''
        This.imgData = []
        this.$refs.uploader.clearFiles()

        let now = new Date();
        let year = now.getFullYear()
        let mon = now.getMonth() + 1
        let day = now.getDate()
        let year1 = year + '-' + mon + '-'  + day
        This.notes = '维保记录 ' + year1 
        This.time1 = year1 
        let data1 = {
            code:'maintain_type',
            isShowAll:2
        }
        fly.post('/common/getSelectDiction',data1).then(function (res) {
            let data = res.response
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
            let arr = []
            res.response.map((value,index,arry)=>{
                arr.push({ 'label': value.name, 'value': value.code})
            })
            This.statusPickerValueArray = arr
        })
    },
    methods: {
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
            let This = this
            wx.scanCode({
                success(res) {
                    This.equip_code = res.result
                }
            })
        },
        upLoadSuccess(successRes){
            let This = this
            let size = successRes.tempFiles[0].size
            const tempFilePaths = successRes.tempFilePaths
            let token = wx.getStorageSync('token') || '';
            wx.showToast({
                title: '上传图片中',
                icon: "none",
                duration: 3000
            })
            for(let i=0;i<=tempFilePaths.length;i++){
                wx.uploadFile({
                    url: 'https://wxtjapi.test.jianzaogong.com/common/uploadImg', //仅为示例，非真实的接口地址
                    // url: 'https://wbzsapi.jianzaogong.com/common/uploadImg', //正式环境
                    filePath: tempFilePaths[i],
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
                        let jdata = {"createTime":null,"fileSize":size,"id":null,"imagePath":data.response,"mainId":null,"module":null,"type":1,"user":null} 
                        This.imgData.push(jdata)
                        //do something
                    }
                })
            }
            wx.hideLoading();
        },
        upLoadFail(errMsg){

        },
        uploadDelete(DeleteRes){
            let This = this
            let index = DeleteRes.index
            This.imgMessage.splice(index,1)       
        },
        submitEquip(){
            let This = this
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
                    title: "姓名不能为空",
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
                id:'',
                terminalNumber:This.equip_code,
                type:This.type,
                maintainTime:This.time1,
                status:This.status,
                title:This.notes,
                explain:This.explain,
                images:JSON.stringify(This.imgData)
            }
            fly.post('/maintain/saveMaintain',data).then(function (res) {
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
                    wx.navigateTo({
                        url:'/pages/index/main'
                    });
                }

            })
        },
        onTypeConfirm(e) {
            let This = this
            This.type = e.value[0]
            This.type1 = e.label
        },
        onTypeChange(e) {

        },
        onTypeCancel(e) {

        },
        onTimeConfirm(e) {
            let This = this
            This.time = e.label
            This.time1 = e.value.join("-")
        },
        onTimeChange(e) {

        },
        onTimeCancel(e) {
        },
        onStatusConfirm(e) {
            let This = this
            This.status = e.value[0]
            This.status1 = e.label
        },
        onStatusChange(e) {
        },
        onStatusCancel(e) {
        }
    }
};
</script>
<style lang="scss" scoped>
.register {
    width: 100%;
    height: 100%;
    .contain {
        width: 670rpx;
        height: auto;
        margin: 0 auto;
        margin-top: 40rpx;
        flex: 1;
        .get-block {
            border-bottom: 1px solid #e5e5e5;
            margin-bottom: 48rpx;
            .get-code {
                display: flex;
                justify-content: space-between;
                input{
                    width:100%;
                }
                img{
                    height: 39rpx;
                    width: 45rpx;
                }
            }
        }
        .img-control{
            display: flex;
            flex-direction: column;
            min-height: 20vh;
            .img-block {
                width: 100%;
                flex: 1;
                display: block;
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
                flex: 0;
                width: 670rpx;
                margin-top: 80rpx;
            }
        }
    }

}

.getCode {
    color: black;
}

</style>
