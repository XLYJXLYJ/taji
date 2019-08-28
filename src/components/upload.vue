<template>
  <div class="j-pic-upload">
    <img @click="previewImg(index)" v-for="(src,index) in urls" :key="src" :src="src.imagePath" :style="{'width':width || '120rpx','height':height || '120rpx'}" class="img" >
    <div class="j-upload-btn" @click="uploadImg()" :style="{'width':width || '120rpx','height':height || '120rpx'}">
      <span class="j-upload-add">+</span>
    </div>
  </div>
</template>

<script>
    export default {
      props:["width","height","max","srcs"],
      data(){
        return {
          urls:[],
        }
      },
      mounted(){
        this.urls = this.srcs || [];
      },
      methods:{
        uploadImg(){
          let This = this;
          let token = wx.getStorageSync('token') || '';
          wx.chooseImage({
            count: This.max || 3,
            sizeType: ['original', 'compressed'],
            sourceType: ['album', 'camera'],
            success: function (res) {
            //   res.tempFilePaths.forEach(v=>{
            //     This.urls.push(v);
            //   });
                for(let i=0;i<=res.tempFilePaths.length;i++){
                  // let size = res.tempFiles[i].size
                  wx.uploadFile({
                      url: 'https://wxtjapi.test.jianzaogong.com/common/uploadImg', //仅为示例，非真实的接口地址
                      // url: 'https://wbzsapi.jianzaogong.com/common/uploadImg', //正式环境
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
                          // This.urls.push(jdata)
                          This.$emit("choosed",{all:jdata,currentUpload:res.tempFilePaths[i]});
                          //do something
                      }
                  })
                }

            //   This.$emit("choosed",{all:This.urls,currentUpload:res.tempFilePaths});
            }
          })
        },
        previewImg(index){
          let This = this;
          wx.showActionSheet({
            itemList:["预览","删除"],
            success: function(res) {
             
              if(res.tapIndex === 0){
                wx.previewImage({
                  current:This.urls[index],
                  urls:This.urls
                });
              } else {
                This.urls.splice(index,1);
                This.$emit("delete",This.urls);
              }
            },
          });
        },
      }
    }
</script>
 
<style scoped>
  .j-pic-upload{
    padding: 10rpx;
    display: flex;
    flex-direction: row;
    align-items: center;
    flex-wrap: wrap;
  }
.j-upload-btn{
  border: 1px dashed #ddd;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-right: 20rpx;
}
  .j-upload-add{
    font-size: 80rpx;
    font-weight: 500;
    color:#C9C9C9;
  }
  .img{
    margin:10rpx 20rpx 10rpx 0;
  }
</style>