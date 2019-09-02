<template>
    <div class="login">
        <goBackNav title="个人信息"></goBackNav>
        <div v-if="isAlert">
            <!--弹窗的页面-->
            <div class="modalMask" v-show="isModel" @click="hidePanel"></div>
            <div class="modalDialog" v-show="changeModel">
                <div class="modalContent">
                    <p class="contentTip">微信手机号码获取失败</p>
                    <div class="modalBottom">
                        <span class="button" style="border-right: 1px solid #cecece;" @click="tapCancel">返回重试</span>
                        <span class="button" @click="confirmSend">手动输入</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="contain">
            <form>
                <div class="get-block" style="border:none">
                    <p class="title">维保人员编号</p>
                    <input type="text" v-model="userNumber" style="color:#5f5f5f" disabled autocomplete="off" />
                </div>

                <div class="get-block">
                    <p class="title">姓名</p>
                    <input type="text" v-model="name" style="color:#5f5f5f" placeholder="请输入您的姓名" autocomplete="off" />
                </div>

                 <div class="get-block">
                    <p class="title">手机号码</p>
                    <div class="get-code">
                        <input
                            style="color:#5f5f5f"
                            type="text"
                            v-model="phone_code"
                            placeholder="请输入您的手机号码"
                            autocomplete="off"
                            disabled
                        />
                        <button open-type="getPhoneNumber" @getphonenumber="getPhoneNumber" class="getCode">获取微信手机号码</button>
                    </div>
                </div>

                <div class="get-block">
                    <p class="title">性别</p>
                    <!-- <p @click="showg" style="color:#5f5f5f">{{gender}}</p> -->
                    <input
                        style="color:#5f5f5f"
                        type="text"
                        v-model="gender"
                        autocomplete="off"
                        disabled
                        @click="showg"
                    />
                    <mp-picker ref="mpPicker" :mode="mode" themeColor="rgb(24,144,255)" :deepLength=deepLength :pickerValueDefault="pickerValueDefault" @onChange="onChange" @onConfirm="onConfirm" @onCancel="onCancel" :pickerValueArray="pickerValueArray"></mp-picker>
                </div>

                <div class="get-block" style="border:none">
                    <p class="title">微信昵称</p>
                    <input type="text" v-model="wx" style="color:#5f5f5f" disabled autocomplete="off" />
                </div>



                <div>
                    <button class="confirm" @click="selfSave">保存</button>
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
import goBackNav from "@/components/goBackNav.vue";
import mpUploader from "mpvue-weui/src/uploader";
import fly from "@/services/WxApi";
export default {
    components: {
        goBackNav,
        mpUploader,
        mpPicker
    },

    data() {
        return {
            isAlert:'',
            changeModel:'',
            isModel:'',
            userNumber: "",
            phone_code: "",
            name: "",
            company: "",
            wx:'',
            gender:'',
            position: "",
            btnTxt: "点击获取验证码",
            disabled: false,
            time: 0, // 验证码时间初始化
            btn: true,
            pickerValueArray:[{
                label: '女',
                value: 1
                },
                {
                label: '男',
                value: 2
            }],
            pickerValueDefault: [],
        };
    },
    mounted() {
        let This = this   
        
        fly.post('/user/getUserDetail').then(function (res) {
            let resData = res.response
            This.userNumber = resData.userNumber
            This.name = resData.fullName
            This.phone_code = resData.phoneNum
            This.pickerValueDefault = [resData.gender]
            This.gender = resData.gender==1?'男':'女'
            
            This.wx = resData.wxNickName
        })
    },
    methods: {
        //  弹框取消
        tapCancel() {
            this.changeModel = !this.changeModel;
            this.isModel = !this.isModel;
        },
        //  确认
        confirmSend() {
            this.changeModel = !this.changeModel;
            this.isModel = !this.isModel;
            wx.navigateTo({
                url:'/pages/login/main'
            });
        },

        showg(){
            let This = this
            This.$refs.mpPicker.show();
        },
        onConfirm(e) {
            let This = this
            This.gender = e.label
        },
        onChange(e) {

        },
        onCancel(e) {

        },
        selfSave(){
            let This = this
            let who = ''
            if(This.gender=='男'){
                who = 1
            }else{
                who = 0
            }
            if (!This.phone_code) {
                wx.showToast({
                    title: "请输入手机号",
                    icon: "none",
                    duration: 2000
                })
                return;
            } else if (this.phone_code.length !== 11) {
                wx.showToast({
                    title: "请输入正确手机号格式",
                    icon: "none",
                    duration: 2000
                })
                return;
            }
            let data = {
                fullName:This.name,
                phoneNum:This.phone_code,
                gender:who
            }
            fly.post('/user/updateUserDetail',data).then(function (res) {
                if(res.status!=200){
                    wx.showToast({
                        title: res.message,
                        icon: "none",
                        duration: 2000
                    });
                    return;
                }else{
                    wx.showToast({
                        title: "修改信息成功",
                        icon: "none",
                        duration: 2000
                    });
                    wx.setStorageSync('username',This.name)
                    wx.setStorageSync('mobile',This.phone_code)
                    wx.reLaunch({
                        url:'/pages/index/main'
                    });
                }
            })
        },
        getPhoneNumber(e){
            if(e.mp.detail.errMsg == 'getPhoneNumber:fail:user deny'){

            }else{
                let This = this
                let data = {
                    sessionKey:wx.getStorageSync('sessionKey') ,
                    openId:wx.getStorageSync('openid'),
                    encryptedData:e.mp.detail.encryptedData,
                    iv:e.mp.detail.iv
                }
                fly.post('/user/getWxUserPhone',data).then(function (res) {
                    if(res.status!=200){
                        This.isAlert = true
                        This.changeModel = true;
                        This.isModel = true
                    }else{
                        This.phone_code = res.response.purePhoneNumber
                        wx.getStorageSync('mobile', This.phone_code) 
                    }
                })
            }
        }
    }
}
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
        .button {
            width: 310rpx;
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
            border-top: 1px solid #cecece;
            border-radius: none;
        }
        button::after{
            border:none;
        }
    }
}
.login {
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
                button{
                    position: relative;
                    top: -8rpx;
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
            padding-bottom:16rpx;
        }
        .confirm {
            background: #1890FF;
            color: #fff;
            margin-bottom: 24rpx;
            font-size: 34rpx;
            font-family: "PingFangSC-Medium";
            position: fixed;
            width: 670rpx;
            bottom: 40rpx;
            border:none;
        }
        .confirm::after {
            border:none;
        }
    }
}
.getCode {
    color: rgb(24, 144, 255);
    height: 60rpx;
    font-size: 32rpx;
    background: #fff;
    margin: 0;
    padding:0;
    margin-top: -10rpx;
}
.getCode::after{
    border: none;
}
</style>
