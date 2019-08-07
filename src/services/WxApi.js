const Fly = require("flyio/dist/npm/wx");
const fly = new Fly()

fly.config.baseURL = 'https://app.test.jianzaogong.com/rest/applets';
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
    return res.data
  }else{
    wx.showModal({
      title: '提示',
      content: res.data.message,
    })
  }
  return Promise.reject(res)
}, error => {
  const { response } = error;
  wx.showModal({
    title: '提示',
    content: error.response.data.message,
    success(res) {
      if (res.confirm) {
        console.log('用户点击确定')
      } else if (res.cancel) {
        console.log('用户点击取消')
      }
    }
  })
})

export default fly;