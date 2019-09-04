<template>
    <div class="agreement">
        <div class="contain">
            <web-view :src="url"></web-view>
        </div>
    </div>
</template>

<script>
import goBackNav from "@/components/goBackNav.vue";
export default {
    components: {
        goBackNav
    },
    data() {
        return {
            url:''
        }
    },
    onLoad(options){
        let This = this
        This.url = 'https://oaapi2.jianzaogong.com/news/html?newFrom=' + options.url
    }
};
</script>
<style lang="scss" scoped>
.agreement {
    position: absolute;
    width: 100%;
    height: 100%;
    .contain {
        width: 670rpx;
        height: auto;
        margin: 0 auto;
    }
    .title {
        font-size: 48rpx;
        color: rgb(51, 51, 51);
        font-family: "PingFangSC-Regular";
        font-weight: 550;
    }
}
</style>
