<template>
    <div class="login">
        <goBackNav title="登陆/注册建造工"></goBackNav>
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
                <div class="get-block">
                    <p class="title">手机号码</p>
                    <input type="text" v-model="phone" placeholder="请输入您的手机号" autocomplete="off" />
                </div>

                <div class="get-block">
                    <p class="title">验证码</p>
                    <div class="get-code">
                        <input
                            type="text"
                            v-model="phone_code"
                            placeholder="请输入您的手机验证码"
                            autocomplete="off"
                        />
                        <p @click="GetCode" :class="{getCode:btn, getCodeDisabled:!btn}">{{btnTxt}}</p>
                    </div>
                </div>

                <div>
                    <button class="confirm" @click="login">提交</button>
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
import goBackNav from "@/components/goBackNav.vue";
import mpUploader from "mpvue-weui/src/uploader";
import fly from "@/services/WxApi";
export default {
    components: {
        goBackNav,
        mpUploader
    },

    data() {
        return {
            phone: "",
            phone_code: "",
            name: "",
            company: "",
            position: "",
            btnTxt: "点击获取验证码",
            disabled: false,
            time: 0, // 验证码时间初始化
            btn: true
        };
    },
    methods: {
        GetCode() {
            if (!this.phone) {
                wx.showToast({
                    title: "请输入手机号",
                    icon: "none",
                    duration: 2000
                })
            } else if (this.phone.length !== 11) {
                wx.showToast({
                    title: "请输入正确手机号格式",
                    icon: "none",
                    duration: 2000
                })
            } else {
                if (this.time == 0) {
                    this.time = 60;
                    this.Timer();
                    console.log("发送请求");
                    this.send()
                } else {
                    console.log("不能重复发送验证码");
                }
            }
        },
        send(){
            let This = this
            let data = {
                mobile:This.phone
            }
            fly.post('/contractor/getVerificationCode',data).then(function (res) {
                console.log(res)
            })
        },
        login(){
            let This = this
            let data = {
                mobile:This.phone,
                vaCode:This.phone_code
            }
            fly.post('/contractor/login',data).then(function (res) {
                console.log(res)
                // wx.showToast({
                //     title: "申请加入成功",
                //     icon: "none",
                //     duration: 2000
                // });
                wx.setStorageSync('token', res.response.authorization) 
                wx.setStorageSync('gender', res.response.gender) 
                wx.setStorageSync('mobile', res.response.mobile) 
                wx.setStorageSync('nickName', res.response.nickName) 
                wx.setStorageSync('username', res.response.username) 
                wx.navigateTo({
                    url:'/pages/index/main'
                });
            })
        },
        Timer() {
            if (this.time > 0) {
                this.time--;
                this.btnTxt = this.time + "s后重新发送";
                setTimeout(this.Timer, 1000);
                this.btn = false;
            } else {
                this.time = 0;
                this.btnTxt = "获取验证码";
                this.btn = true;
            }
        }
    }
}
</script>
<style lang="scss" scoped>
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
            font-weight: 550;
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
    color: #1890FF;
}
.getCodeDisabled {
    color: rgb(204, 204, 204);
}
</style>
