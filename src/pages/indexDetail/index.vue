<template>
    <div class="container">
        <section class="sec-nav">
            <goBackNav title="维保详情"></goBackNav>
        </section>
        <section class="img-contain" v-if="getData.terminal">
            <equipDetail :getData='getData'></equipDetail>
        </section>
        <section class="img-contain" v-if="getData.tower">
             <equipMessage :getData='getData'></equipMessage>
        </section>
        <section>
            <editMessage :getData='getData'></editMessage>
        </section>
        <section>
            <p class="atitle">历史维保信息</p>
            <historyCard></historyCard>
        </section>
    </div>
</template>

<script>
import editMessage from "@/components/editMessage.vue";
import navigationBar from "@/components/navigationBar.vue";
import equipDetail from "@/components/equipDetail.vue";
import equipMessage  from "@/components/equipMessage.vue";
import historyCard from "@/components/historyCard.vue";
import goBackNav from "@/components/goBackNav.vue";
import add from "@/components/add.vue";
import fly from "@/services/WxApi";
export default {
    components: {
        navigationBar,
        historyCard,
        add,
        goBackNav,
        equipMessage,
        equipDetail,
        editMessage
    },
    onLoad: function (options) {
        console.log(options)
        let This = this
        This.id = options.id
    },
    created() {
        let This = this
        let data1 = {
            id:5
        }
        fly.post('/maintain/getMaintainDetail',data1).then(function (res) {
            This.$nextTick(
                function(){
                    This.getData = res.response
                }
            )
            console.log(res)
        })
    },
    data() {
        return {
            imgUrls: [
                {
                    id: 0,
                    url: "https://images.unsplash.com/photo-1551334787-21e6bd3ab135?w=640"
                },
                {
                    id: 1,
                    url: "https://images.unsplash.com/photo-1551214012-84f95e060dee?w=640"
                },
                {
                    id: 2,
                    url: "https://images.unsplash.com/photo-1551446591-142875a901a1?w=640"
                }
            ],
            id:'',
            getData:''
        };
    }
};
</script>

<style scoped lang='scss'>
.container {
    width: 100%;
    height: 100%;
    background: rgb(249,249,249);
    .title {
        display: block;
        width: 100%;
        height: 128rpx;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .img-contain {
        display: block;
        width: 100%;
        height: 290rpx;
        margin: 0 auto;
        border-radius: 8rpx;
        margin-top: 40rpx;
        position: relative;
        display: block;
        background: #fff;
        padding: 48rpx 0rpx;
        image {
            width: 670rpx;
            height: 290rpx;
            border-radius: 8rpx;
        }
    }
    .atitle{
        font-size: 34rpx;
        color: black;
        font-family: 'PingFangSC-Medium';
        font-weight: 550;
        margin-left: 42rpx;
    }
}
</style>
