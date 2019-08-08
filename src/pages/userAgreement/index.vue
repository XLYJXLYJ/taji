<template>
    <div class="agreement">
        <goBackNav title></goBackNav>
        <div class="contain">
            <p class="title">如何使用维保助手</p>
        </div>
    </div>
</template>

<script>
import goBackNav from "@/components/goBackNav.vue";
export default {
    components: {
        goBackNav
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
