<template>
<div>
    <goBackNav title="维保信息"></goBackNav>
    <div v-show="vanShow" style="position:fixed;bottom:0rpx;width:100%;background:#fff;z-index:999">
        <van-datetime-picker
        
            :value="currentDate" 
            type="date" 
    
            :filter="formatter"
            @cancel="cancel"
            @confirm="confirm"
        />
    </div> 
     <div class="register">
        <div v-if="isAlert">
            <!--弹窗的页面-->
            <div class="modalMask" v-show="isModel" @click="hidePanel"></div>
            <div class="modalDialog" v-show="changeModel">
                <div class="modalContent">
                    <p class="contentTip">确定删除该维保记录？</p>
                    <div class="modalBottom">
                        <span class="button" style="border-right: 1px solid #cecece;" @click="tapCancel">取消</span>
                        <span class="button" @click="confirmSend">确认</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="contain">
            <form>
                <!-- 第一个表单 -->
                <div class="get-block" style="border:none">
                    <p class="title">维保编号</p>
                    <div class="get-code">
                        <input
                            type="text"
                            v-model="maintainNumber"
                            autocomplete="off"
                            disabled
                            style="width:100%;font-size:34rpx;"
                        />
                    </div>
                </div>

                <div class="get-block" style="border:none">
                    <p class="title">塔机监控设备编号</p>
                    <div class="get-code">
                        <input
                            type="text"
                            v-model="equip_code"
                            autocomplete="off"
                            disabled
                            style="width:100%;font-size:34rpx;"
                        />
                    </div>
                </div>

                <div class="get-block" style="border:none">
                    <p class="title">设备备注名</p>
                    <div class="get-code">
                        <input
                            type="text"
                            v-model="terminalRemarkName"
                            autocomplete="off"
                            disabled
                            style="width:100%;font-size:34rpx;"
                        />
                    </div>
                </div>

                <div class="get-block">
                    <p class="title">维保类型</p>
                    <p @click="showType" style="color:#5f5f5f;height:70rpx;font-size:34rpx;">{{typeName}}</p>
                    <mp-picker ref="typePicker" themeColor="rgb(24,144,255)" :mode="TypeMode" :deepLength=deepLength :pickerValueDefault="pickerTypeValueDefault" @onChange="onTypeChange" @onConfirm="onTypeConfirm" @onCancel="onTypeCancel" :pickerValueArray="typePickerValueArray"></mp-picker>
                </div>

                <div class="get-block">
                    <p class="title">维保日期</p>
                    <input
                        type="text"
                        v-model="time"
                        placeholder="请输入时间"
                        autocomplete="off"
                        style="color:#5f5f5f;height:65rpx;padding-bottom:10rpx;font-size:34rpx;"
                        placeholder-style='color:#e5e5e5'
                        disabled
                        @click="showTime"
                    />
                </div>

                <div class="get-block">
                    <p class="title">状态</p>
                    <p @click="showStatus" style="color:#5f5f5f;height:70rpx;font-size:34rpx;">{{statusName}}</p>
                    <mp-picker ref="statusPicker" themeColor="rgb(24,144,255)" :mode="statusMode" :deepLength=deepLength :pickerValueDefault="pickerStatusValueDefault" @onChange="onStatusChange" @onConfirm="onStatusConfirm" @onCancel="onStatusCancel" :pickerValueArray="statusPickerValueArray"></mp-picker>
                </div>

                <div class="get-block">
                    <p class="title">维保记录标题</p>
                    <input type="text" :adjust-position="false" @focus="goTop" style="color:#5f5f5f;font-size:34rpx;" v-model="notes" placeholder="请输入维保记录标题" autocomplete="off" />
                </div>

                <div class="get-block">
                    <p class="title">说明</p>
                    <input type="text" :adjust-position="false" @focus="goTop" style="color:#5f5f5f;font-size:34rpx;" v-model="explain" placeholder="请输入维保记录详细说明(选填)" autocomplete="off" />
                </div>
                
                <div class="img-block" v-if='isImg'>
                    <div class="i-block">
                        <p
                            class="title"
                            style="margin-bottom:20rpx;"
                        >现场照片</p>

                        <div class="j-pic-upload">
                            <ul>
                                <li v-for="(src,index) in imgData" :key="src">
                                    <img @click="previewImg(index)" :src="src.imagePath + '&isCompress =1'" class="img" >
                                    <img class="delete-icon" @click="deleI(index)" src="/static/images/delete.png">
                                </li>
                            </ul>

                            <div class="j-upload-btn" @click="uploadImg()" :style="{'width':width || '143rpx','height':height || '143rpx'}">
                                <span class="j-upload-add">+</span>
                            </div>
                        </div>
                        <!-- <upload @choosed="chooseImg" @delete="deleteImg" :srcs="imgData"></upload> -->
                        <!-- <upload width="120rpx" height="120rpx" max="3" @choosed="chooseImg" @delete="deleteImg" :srcs="imgData"></upload> -->
                    </div>
                    <div class="button">
                        <button class="confirm01" @click="dele">删除</button>
                        <button class="confirm02" @click="submitEquip">保存</button>
                    </div>
                </div>
                <!-- <p class="title">
                    建筑业优秀班组数据库是建造工平台提供的服务，点击提交即表示同意
                    <span style="color:rgb(252 184 19)">《建造工用户协议》</span>
                </p> -->
            </form>
        </div>
    </div>
</div>
</template>

<script>
import mpPicker from 'mpvue-weui/src/picker';
import mpDatepicker from 'mpvue-weui/src/date-picker';
import goBackNav from "@/components/goBackNav.vue";
import upload from "@/components/upload.vue";
import mpUploader from "mpvue-weui/src/uploader";
import fly from "@/services/WxApi";
export default {
    components: {
        goBackNav,
        mpUploader,
        mpPicker,
        mpDatepicker,
        upload
    },
    data() {
        return {
            Timeout:'',
            vanShow:false,
            // minDate: new Date().getTime(),
            // maxDate: new Date(2099,1,1),
            currentDate: new Date().getTime(),
            isAlert:'',
            changeModel:'',
            isModel:'',
            explain:'',
            terminalRemarkName:'',
            maintainNumber:'',
            type: "",
            typeName:'请选择类型',
            equip_code: "",
            time: "请选择时间",
            time1:'',
            notes: "",
            status: "",
            statusName:'请选择状态',
            TypeMode: "selector",
            arrayBuffer :'',
            imgData:[],
            isImg:false,
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
    onLoad: function (options) {
        let This = this
        This.id = options.id
        let data0 = {
            id:This.id
        }
        fly.post('/maintain/getMaintainDetail',data0).then(function (res) {
            This.getData = res.response
            This.maintainNumber = This.getData.maintainRecord.maintainNumber
            This.terminalRemarkName = This.getData.maintainRecord.terminalRemarkName
            This.id = This.getData.maintainRecord.id
            This.imgData = This.getData.maintainRecord.images
            This.isImg = true
            This.equip_type =This.getData.maintainRecord.type
            This.typeName = This.getData.maintainRecord.typeName
            This.type = This.getData.maintainRecord.type
            This.equip_code = This.getData.maintainRecord.terminalNumber,
            This.time = This.getData.maintainRecord.maintainTime
            let da = new Date(This.time);
            let year = da.getFullYear()+'';
            let month = da.getMonth()+1+'';
            let date = da.getDate()+' ';
            //let h = da.getHours()+'';
            //let m = da.getMinutes()+'';
            //let s = da.getSeconds()+'';
            if(month<10){
                month = '0' + month
            }
            if(date<10){
                date = '0' + date
            }
            This.time = [year,month,date].join('-');
            This.time1 =  [year,month,date].join('-');
            This.notes = This.getData.maintainRecord.title,
            This.statusName = This.getData.maintainRecord.statusName
            This.status = This.getData.maintainRecord.status
            This.explain= This.getData.maintainRecord.explain
        })

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
    destroyed() {
        let This = this
        clearTimeout(This.Timeout)
    },
    methods: {
        confirm(e){
             let This = this
            This.vanShow = false
            let da = new Date(e.mp.detail);
            let year = da.getFullYear()+'';
            let month = da.getMonth()+1+'';
            let date = da.getDate()+' ';
            if(month<10){
                month = '0' + month
            }
            if(date<10){
                date = '0' + date
            }
            This.time = year + '-' + month + '-' + date
            This.time1 = year + '-' + month + '-' + date
        },
        cancel(){
            let This = this
            This.vanShow = false
        },
        formatter(type, value) {
            if (type === 'year') {
                return `${value}年`;
            } else if (type === 'month') {
                return `${value}月`;
            }
            return value;
        },
        goTop(){
            wx.pageScrollTo({
                scrollTop: 300,
                duration: 200
            })
        },
        uploadImg(){
          let This = this;
          let token = wx.getStorageSync('token') || '';
          wx.chooseImage({
            count: This.max || 3,
            sizeType: ['original', 'compressed'],
            sourceType: ['album', 'camera'],
            success: function (res) {
            //   res.tempFilePaths.forEach(v=>{
            //     This.imgData.push(v);
            //   });
                for(let i=0;i<res.tempFilePaths.length;i++){
                  // let size = res.tempFiles[i].size
                  wx.uploadFile({
                    //   url: 'https://wxtjapi.test.jianzaogong.com/common/uploadImg', //仅为示例，非真实的接口地址
                      url: 'https://wbzsapi.jianzaogong.com/common/uploadImg', //正式环境
                      filePath: res.tempFilePaths[i],
                      name: 'file',
                      header: {
                          'content-type': 'multipart/form-data',
                          'Authorization':token
                      },
                      formData:{
                          'isNeedHttp':1
                      },
                      success (resdata){
                          const data = JSON.parse(resdata.data)
                          let jdata = {createTime:null,fileSize:res.tempFiles[i].size,id:null,imagePath:data.response,mainId:null,module:null,type:1,user:null}
                          // This.imgData.push(jdata)
                          This.chooseImg({all:jdata,currentUpload:res.tempFilePaths[i]})
                          // This.$emit("choosed",{all:jdata,currentUpload:res.tempFilePaths[i]});
                      }
                  })
                }
            }
          })
        },
        deleI(index){
            let This = this;
            This.imgData.splice(index,1);
            This.deleteImg(This.imgData);
        },
        previewImg(index){
            let This = this;
            let arr = []
            arr.push(This.imgData[index].imagePath)
            wx.previewImage({
                current:This.imgData[index].imagePath,
                urls:arr
            });
        },
        chooseImg(res){
            let This = this
            This.imgData.push(res.all)
        },
        deleteImg(res){
            let This = this
            This.imgData = res
        },
        dele(){
            let This = this
            This.isAlert = true
            This.changeModel = true;
            This.isModel = true
        },
        showType(){
            this.$refs.typePicker.show();
        },
        showStatus(){
            this.$refs.statusPicker.show();
        },
        showTime(){
            // this.$refs.mpDatePicker.show();
            let This = this
            This.vanShow = true
        },
        GetQbCode() {
            wx.scanCode({
                success(res) {
 
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
            wx.uploadFile({
                // url: 'https://wxtjapi.test.jianzaogong.com/common/uploadImg', //仅为示例，非真实的接口地址
                url: 'https://wbzsapi.jianzaogong.com/common/uploadImg', //正式环境
                filePath: tempFilePaths[0],
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
            if(!This.typeName){
                wx.showToast({
                    title: "维保类型不能为空",
                    icon: "none",
                    duration: 2000
                });
                return;
            }
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
                    title: "维保时间不能为空",
                    icon: "none",
                    duration: 2000
                });
                return;
            }
            if(!This.statusName){
                wx.showToast({
                    title: "状态不能为空",
                    icon: "none",
                    duration: 2000
                });
                return;
            }
            if(!This.notes){
                wx.showToast({
                    title: "维保记录标题不能为空",
                    icon: "none",
                    duration: 2000
                });
                return;
            }
            if(!This.imgData){
                wx.showToast({
                    title: "请上传现场照片",
                    icon: "none",
                    duration: 2000
                });
                return;
            }
            let data = {
                id:This.id,
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
                        title: "保存成功",
                        icon: "none",
                        duration: 1000
                    });
                    This.Timeout = setTimeout(function(){
                        wx.reLaunch({
                            url:'/pages/indexList/main'
                        });
                    },1000)
                }
            })
        },
        onTypeConfirm(e) {
            let This = this
            This.type = e.value[0]
            This.typeName = e.label
        },
        onTypeChange(e) {

        },
        onTypeCancel(e) {

        },
        onTimeConfirm(e) {
            let This = this
            This.time = e.value.join("-")
            This.time1 = e.value.join("-")
        },
        bindDateChange(e){
            let This = this
            This.time = e.target.value
            This.time1 = e.target.value
        },
        onTimeChange(e) {
  
        },
        onTimeCancel(e) {
  
        },
        onStatusConfirm(e) {
            let This = this
            This.status = e.value[0]
            This.statusName = e.label
        },
        onStatusChange(e) {
        },
        onStatusCancel(e) {

        },
        confirmSend(){
            let This = this
            let data = {
                id:This.id
            }
            fly.post('/maintain/deleteMaintain',data).then(function (res) {
                if(res.status!=200){
                    wx.showToast({
                        title: res.message,
                        icon: "none",
                        duration: 2000
                    });
                    return;
                }else{
                    wx.showToast({
                        title: "删除成功",
                        icon: "none",
                        duration: 2000
                    });
                    wx.reLaunch({
                        url:'/pages/indexList/main'
                    });
                }
            })
        },
        tapCancel(){
            let This = this
            This.isAlert = false
            This.changeModel = false;
            This.isModel = false
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
    border-radius: 8rpx;
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
.register {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    .contain {
        width: 670rpx;
        margin: 0 auto;
        margin-top: 40rpx;
        flex: 1;
        .get-block {
            border-bottom: 1px solid rgb(204, 204, 204);
            margin-bottom: 48rpx;
            .title{
                font-size: 28rpx;
            }
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
            display:block;
            width: 100%;
            height: auto;
            .i-block{
                flex: 1;
            }
            .button{
                display: flex;
                justify-content: space-between;
                flex: 0;
                margin-top: 80rpx;
                .confirm01 {
                    background: #fff;
                    color: #f6303b;
                    border:1rpx solid #f5222d;
                    margin-bottom: 24rpx;
                    font-size: 34rpx;
                    font-family: "PingFangSC-Medium";
                    width: 312rpx;
                    height: 80rpx;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .confirm02 {
                    background: #1890FF;
                    color: #fff;
                    margin-bottom: 24rpx;
                    font-size: 34rpx;
                    font-family: "PingFangSC-Medium";
                    width: 312rpx;
                    height: 80rpx;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .confirm01::after {
                    border:none;
                }
                .confirm02::after {
                    border:none;
                }
            }
            button::after{
                border:none;
            }
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


    }
    .j-pic-upload{
        padding: 10rpx;
        display: flex;
        flex-direction: row;
        align-items: center;
        flex-wrap: wrap;
        position: relative;
        ul{
            height: auto;
            width: auto;
            li{
                width: 144rpx;
                height: 144rpx;
                float: left;
                position: relative;
                margin-right:20rpx;
                margin-bottom: 32rpx;
                overflow: hidden;
                border-radius: 12rpx;
                .img{
                    width:144rpx;
                    border-radius: 12rpx;
                }
                .delete-icon{
                    position: absolute;
                    right: 0rpx;
                    top: 0rpx;
                    z-index: 100;
                }
            }
        }

        .j-upload-btn{
            border: 1px solid #ddd;
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;
            border-radius: 12rpx;
            .j-upload-add{
                font-size: 80rpx;
                font-weight: 500;
                color:#C9C9C9;
            }
        }
    }

}
.getCode {
    color: black;
}

</style>
