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
                        />
                        <p @click="GetQbCode"><img src="/static/images/qb.png" alt=""></p>
                    </div>
                </div>


                <div class="get-block">
                    <p class="title">维保类型</p>
                    <input type="text" v-model="equip_type" placeholder="请选择类型" autocomplete="off" @focus="showType"/>
                    <mp-picker ref="typePicker" :mode="TypeMode" :deepLength=deepLength :pickerValueDefault="pickerTypeValueDefault" @onChange="onTypeChange" @onConfirm="onTypeConfirm" @onCancel="onTypeCancel" :pickerValueArray="typePickerValueArray"></mp-picker>
                </div>



                <div class="get-block">
                    <p class="title">维保日期</p>
                    <input type="text" v-model="time" placeholder="请选择日期" autocomplete="off" @focus="showTime"/>
                     <mp-datepicker ref="mpDatePicker" :defaultDate="defaultDate" @onChange="onTimeChange" @onConfirm="onTimeConfirm" @onCancel="onTimeCancel"></mp-datepicker>
                </div>

                <div class="get-block">
                    <p class="title">状态</p>
                    <input type="text" v-model="status" placeholder="请选择状态" autocomplete="off" @focus="showStatus"/>
                     <mp-picker ref="statusPicker" :mode="statusMode" :deepLength=deepLength :pickerValueDefault="pickerStatusValueDefault" @onChange="onStatusChange" @onConfirm="onStatusConfirm" @onCancel="onStatusCancel" :pickerValueArray="statusPickerValueArray"></mp-picker>
                </div>

                <div class="get-block">
                    <p class="title">维保记录标题</p>
                    <input type="text" v-model="notes" placeholder="请输入维保记录标题" autocomplete="off" />
                </div>

                <div class="get-block">
                    <p class="title">说明</p>
                    <input type="text" v-model="company" placeholder="请输入维保记录详细说明(选填)" autocomplete="off" />
                </div>



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
                        :maxLength=1
                        :isMaxHiddenChoose=true
                    ></mp-uploader>
                </div>
                <div>
                    <button class="confirm" @click="submitEquip">添加维保记录</button>
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
            equip_type: "",
            equip_code: "",
            time: "",
            notes: "",
            status: "",
            time: '',
            TypeMode: "selector",
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
        fly.post('/contractor/getMySharingPlan').then(function (res) {
            let data = res.response
            This.equip_type=data.mobile,
            This.name=data.username,
            This.company=data.companyName,
            This.status=data.statusName
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
            wx.scanCode({
            success(res) {
               console.log(res) 
            }
            })
        },
        upLoadSuccess(successRes){
            let This = this
            console.log(successRes)
            wx.getFileSystemManager().readFile({
                filePath: successRes.tempFilePaths[0], //选择图片返回的相对路径
                encoding: 'base64', //编码格式
                success:(res) =>{
                    // let img = 'data:image/png;base64,' + res.data
                    let img = res.data
                    let data = {
                        imgs:img
                    }
                    fly.post('/uploadImg',data).then(function (res) {
                        console.log(res)
                        This.imgMessage.push(res.response)
                        console.log(This.imgMessage)    
                    })
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
            if(!This.equip_type){
                wx.showToast({
                    title: "手机号不能为空",
                    icon: "none",
                    duration: 2000
                });
                return;
            }
            if(!This.equip_code){
                wx.showToast({
                    title: "验证码不能为空",
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
            if(!This.company){
                wx.showToast({
                    title: "公司名不能为空",
                    icon: "none",
                    duration: 2000
                });
                return;
            }
            if(!This.status){
                wx.showToast({
                    title: "职位不能为空",
                    icon: "none",
                    duration: 2000
                });
                return;
            }
            if(!This.imgMessage){
                wx.showToast({
                    title: "请上传在职证明",
                    icon: "none",
                    duration: 2000
                });
                return;
            }
            let data = {
                mobile:This.equip_type,
                vaCode:This.equip_code,
                time:This.time,
                companyName:This.company,
                statusName:This.status,
                imgs:This.imgMessage.join(",")
            }
            fly.post('/contractor/applyJoinSharingPlan',data).then(function (res) {
                console.log(res)
                wx.showToast({
                    title: "申请加入成功",
                    icon: "none",
                    duration: 2000
                });
                wx.navigateTo({
                    url:'/pages/index/main'
                });
            })
        },
        onTypeConfirm(e) {
            console.log(e);
        },
        onTypeChange(e) {
            console.log(e);
        },
        onTypeCancel(e) {
            console.log(e);
        },
        onTimeConfirm(e) {
            console.log(e);
        },
        onTimeChange(e) {
            console.log(e);
        },
        onTimeCancel(e) {
            console.log(e);
        },
        onStatusConfir(e) {
            console.log(e);
        },
        onStatusChange(e) {
            console.log(e);
        },
        onStatusCancel(e) {
            console.log(e);
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
        .confirm {
            background: #1890FF;
            color: #fff;
            margin-bottom: 24rpx;
            font-size: 34rpx;
            font-family: "PingFangSC-Medium";
        }
    }
}
.getCode {
    color: black;
}

</style>
