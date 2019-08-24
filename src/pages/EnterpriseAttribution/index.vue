<template>
    <div class="company">
        <goBackNav title="企业归属"></goBackNav>
        <div v-if="isAlert">
            <!--弹窗的页面-->
            <div class="modalMask" v-show="isModel" @click="hidePanel"></div>
            <div class="modalDialog" v-show="changeModel">
                <div class="modalContent">
                    <p class="contentTip">确认解除绑定？</p>
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
                <div class="get-block">
                    <p class="title">企业编码</p>
                    <div class="get-code">
                        <input
                            @input="search"
                            type="text"
                            v-model="companyNumber"
                            placeholder="请输入编号"
                            autocomplete="off"
                            placeholder-style="color:#dadada;"
                            style="color:black"
                        />
                        <p @click="cancel" v-if="iscompanyNumber">解除绑定</p>
                    </div>
                </div>
                <p class="title-explain">
                    公司编码请联系该公司的超级管理员（对方可在管理平台-系统设置进行查看）
                </p>
                <div class="get-block" style="border:none">
                    <p class="title">企业名称</p>
                    <input type="text" disabled v-model="companyName" placeholder="-" autocomplete="off" @focus="showType"/>
                </div>
                <div>
                    <button class="confirm" @click="save">保存</button>
                </div>
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
import alertOk from "@/components/alertOk.vue";

export default {
    components: {
        alertOk,
        goBackNav,
        mpUploader,
        mpPicker,
        mpDatepicker
    },

    data() {
        return {
            isAlert:'',
            changeModel:'',
            isModel:'',
            companyName: "",
            companyNumber: "",
            unCompanyNumber:'',
            iscompanyNumber: "",
            timer:null
        };
    },
    mounted() {
        let This = this
        fly.post('/user/getBelongCompany').then(function (res) {
            let resData = res.response
            This.companyNumber = resData.companyNumber || ''
            This.unCompanyNumber = resData.companyNumber
            This.iscompanyNumber = resData.companyNumber
            This.companyName = resData.companyName || '-'
        })
    },
    methods: {
         //  弹框取消
        tapCancel() {
            this.isAlert = this.isAlert
            this.changeModel = !this.changeModel;
            this.isModel = !this.isModel;
        },

        search () {
            let This = this
            if(This.timer){
                clearTimeout(This.timer)
            }
            let data = {
                companyNumber:This.companyNumber
            }
            This.timer = setTimeout(function () {
                fly.post('/user/searchCompByCode',data).then(function (res) {
                    This.companyName = res.response[0].companyName
                }) 
                This.timer = undefined;
            },2000)
        },
        //  确认
        confirmSend() {
            let This = this
            this.isAlert = !this.isAlert
            this.changeModel = !this.changeModel;
            this.isModel = !this.isModel;
            if (!This.companyNumber) {
                wx.showToast({
                    title: "企业编号不能为空",
                    icon: "none",
                    duration: 2000
                })
                return;
            }
            let data = {
                companyNumber:This.unCompanyNumber
            }
            fly.post('/user/unBindCompany',data).then(function (res) {
                if(res.status!=200){
                    wx.showToast({
                        title: res.message,
                        icon: "none",
                        duration: 2000
                    });
                    return;
                }else{
                    wx.showToast({
                        title: "解绑成功",
                        icon: "none",
                        duration: 2000
                    });
                    wx.reLaunch({
                        url:'/pages/index/main'
                    });
                }
            }) 
        },
        cancel(){
            this.isAlert = true
            this.changeModel = true;
            this.isModel = true;
        },
        save(){
            let This = this
            if (!This.companyNumber) {
                wx.showToast({
                    title: "企业编号不能为空",
                    icon: "none",
                    duration: 2000
                })
                return;
            }
            if (!This.companyName) {
                wx.showToast({
                    title: "企业名称不能为空",
                    icon: "none",
                    duration: 2000
                })
                return;
            }
            let data = {
                companyNumber:This.companyNumber
            }
            fly.post('/user/bindCompany',data).then(function (res) {
                let resData = res.response
                if(res.status!=200){
                    wx.showToast({
                        title: res.message,
                        icon: "none",
                        duration: 2000
                    });
                    return;
                }else{
                    wx.showToast({
                        title: "绑定成功",
                        icon: "none",
                        duration: 2000
                    });
                    wx.reLaunch({
                        url:'/pages/index/main'
                    });
                }
            }) 
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
.company {
    width: 100%;
    height: 100%;
    .contain {
        width: 670rpx;
        margin: 0 auto;
        margin-top: 40rpx;
        .title-explain{
            font-size: 28rpx;
            color: #969696;
            font-family: "PingFangSC-Regular";
            margin-bottom: 48rpx;
        }
        .get-block {
            border-bottom: 1px solid #e5e5e5;
            margin-bottom: 16rpx;
            .get-code {
                display: flex;
                justify-content: space-between;
                button{
                    height: 39rpx;
                    width: 45rpx;
                }
            }
            p{
                color: black;
                font-size: 28rpx;
                font-family: "PingFangSC-Regular";
            }
        }
        .img-block {
            width: 100%;
            height: 330rpx;
        }
        .title {
            font-size: 28rpx;
            color: black;
            font-family: "PingFangSC-Regular";
            margin-bottom: 16rpx;
        }
        input {
            padding-bottom: 16rpx;
        }
        .confirm {
            background: #1890FF;
            color: #fff;
            width: 670rpx;
            position: fixed;
            bottom: 24rpx;
            font-size: 34rpx;
            font-family: "PingFangSC-Medium";
        }
    }
}
.getCode {
    color: black;
}
.weui-modal-content{
    border-radius: 20rpx;
}
</style>
