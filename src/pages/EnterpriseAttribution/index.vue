<template>
    <div class="company">
        <goBackNav title="企业归属"></goBackNav>

        <alertOk changeModel='true' isModel='true' val=''></alertOk>
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
                    <p class="title">企业编码</p>
                    <div class="get-code">
                        <input
                            type="text"
                            v-model="company_code"
                            placeholder="请输入编号"
                            autocomplete="off"
                        />
                        <p>解除绑定</p>
                    </div>
                </div>

                <p class="title-explain">
                    公司编码请联系该公司的超级管理员（对方可在管理平台-系统设置进行查看）
                </p>

                <div class="get-block" style="border:none">
                    <p class="title">企业名称</p>
                    <input type="text" disabled v-model="equip_type" placeholder="-" autocomplete="off" @focus="showType"/>
                </div>

                <div>
                    <button class="confirm" @click="submitEquip">保存</button>
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
            equip_type: "",
            company_code: "",
        };
    },
    mounted() {
        let This = this
        fly.post('/contractor/getMySharingPlan').then(function (res) {

        })
    },
    methods: {
       submitEquip(){
           this.$refs.mpModal.show();
       }
    }
};
</script>
<style lang="scss" scoped>
.company {
    width: 100%;
    height: 100%;
    .contain {
        width: 670rpx;
        margin: 0 auto;
        margin-top: 40rpx;
        .title-explain{
            font-size: 28rpx;
            color: rgb(204, 204, 204);
            font-family: "PingFangSC-Regular";
            margin-bottom: 48rpx;
        }
        .get-block {
            border-bottom: 1px solid rgb(204, 204, 204);
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
                color: rgb(24,144,255);
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
