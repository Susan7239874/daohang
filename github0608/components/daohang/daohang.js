var app = getApp()
Component({
  properties: {
    title:{
      type:String,
      value:''
    }
    // lists: {
    //   type: Object,
    //   value: [],
    // }
  },
  lifetimes: {
    ready() {
      this.attached()
    }},
  data: {
    // 自定义导航栏
    navbarHeight: 0, // 顶部导航栏高度
    navbarBtn: { // 胶囊位置信息
      height: 0,
      width: 0,
      top: 0,
      bottom: 0,
      right: 0
    },
    cusnavH: 0
  },
  methods: {
    attached: function () {

      this.setData({
        statusBarHeight:app.globalData.systeminfo.statusBarHeight, // 状态栏高度,
        navbarHeight:app.globalData.navbarHeight, // 胶囊bottom + 胶囊实际bottom
        navbarBtn: app.globalData.btnPosi,
        cusnavH: app.globalData.cusnavH,
      })


    },
  }
})