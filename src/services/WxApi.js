const Fly = require("flyio/dist/npm/wx");
const fly = new Fly()

fly.config.baseURL = 'https://wxtjapi.test.jianzaogong.com';
fly.config.timeout = 10000
fly.interceptors.request.use((request) => {
  //给所有请求添加自定义header
  request.headers["Content-Type"] = "application/x-www-form-urlencoded";
  let token = wx.getStorageSync('token') || '';
	if (token) {
    request.headers['Authorization'] = token;
    console.log(token)
	}
  return request;
})

fly.interceptors.response.use(res => {
  if (res.status == 200) {
    console.log(res)
    if(res.data.status!=200){
        wx.showToast({
          title: res.data.message,
          icon: "none",
          duration: 2000
      });
    }
    return res.data
  }else{
    wx.showToast({
        title: res.data.message,
        icon: "none",
        duration: 2000
    });
  }
  return Promise.reject(res)
}, error => {
  const { response } = error;
  wx.showToast({
      title: error.response.data.message,
      icon: "none",
      duration: 2000
  });
})

export default fly;