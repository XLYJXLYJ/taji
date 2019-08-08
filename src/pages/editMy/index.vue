<template>
    <div class="login">
        <goBackNav title="个人信息"></goBackNav>
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
                <div class="get-block" style="border:none">
                    <p class="title">维保人员编号</p>
                    <input type="text" v-model="phone" disabled autocomplete="off" />
                </div>

                <div class="get-block">
                    <p class="title">姓名</p>
                    <input type="text" v-model="name" placeholder="请输入您的姓名" autocomplete="off" />
                </div>

                 <div class="get-block">
                    <p class="title">手机号码</p>
                    <div class="get-code">
                        <input
                            type="text"
                            v-model="phone_code"
                            placeholder="请输入您的手机号码"
                            autocomplete="off"
                        />
                        <p @click="GetClassCode" class="getCode">获取微信手机号码</p>
                    </div>
                </div>

                <div class="get-block">
                    <p class="title">性别</p>
                    <input type="text" v-model="gender" placeholder="请输入您的性别" autocomplete="off" />
                </div>

                <div class="get-block" style="border:none">
                    <p class="title">微信昵称</p>
                    <input type="text" v-model="wx" disabled autocomplete="off" />
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
            wx:'',
            gender:'',
            position: "",
            btnTxt: "点击获取验证码",
            disabled: false,
            time: 0, // 验证码时间初始化
            btn: true
        };
    },
    mounted() {
        let This = this   
        This.gender = wx.getStorageSync('gender') 
        This.phone = wx.getStorageSync('mobile') 
        This.wx = wx.getStorageSync('nickName') 
        This.name = wx.getStorageSync('username') 
    },
    methods: {
        selfSave(){
            let This = this
            let data = {
                username:This.name,
                gender:This.gender='男'?1:0
            }
            fly.post('/contractor/saveMyInfo',data).then(function (res) {
                wx.setStorageSync('gender', This.name)
                wx.setStorageSync('username', This.gender)
            })
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
            color: block;
            font-family: "PingFangSC-Regular";
            margin-bottom: 16rpx;
        }
        input {
            padding-bottom: 0rpx;
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
        }
    }
}
.getCode {
    color: rgb(24, 144, 255);
    font-size: 32rpx;
}
</style>
