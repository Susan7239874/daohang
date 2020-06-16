//app.js
App({
    onLaunch: function () {
        // 展示本地存储能力
        var logs = wx.getStorageSync('logs') || []
        logs.unshift(Date.now())
        wx.setStorageSync('logs', logs)

        // 登录
        wx.login({
            success: res => {
                // 发送 res.code 到后台换取 openId, sessionKey, unionId
            }
        })
        // 获取用户信息
        wx.getSetting({
            success: res => {
                if (res.authSetting['scope.userInfo']) {
                    // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
                    wx.getUserInfo({
                        success: res => {
                            // 可以将 res 发送给后台解码出 unionId
                            this.globalData.userInfo = res.userInfo

                            // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                            // 所以此处加入 callback 以防止这种情况
                            if (this.userInfoReadyCallback) {
                                this.userInfoReadyCallback(res)
                            }
                        }
                    })
                }
            }
        })

        // 导航栏 -s
        this.getSystemInfo()
        this.setTabBar()
        // 导航栏 -e
    },
    globalData: {
        userInfo: null,
        // 导航栏 -s
        headerBtnPosi: null,//获取胶囊的位置信息，宽、高、上下左右
        btnPosi: null,//修改过后的-胶囊的位置信息，宽、高、上下左右
        cusnavH: null,
        systeminfo: null,//获取系统信息  systeminfo.screenHeight=>完整屏幕高度
        navbarHeight: 0,//上面的导航栏高度
        wrapHeight: 0,//屏幕除导航栏外的高度
        // 导航栏 -e
        // 底部栏 -s
        tabBar: {//自定义底部栏的参数
            "borderStyle": "#ccc",
            "backgroundColor": "#ffffff",
            "selectedColor": "#D42A20",
            "color": "#000000",
            "tabHeight": 50,
            "homeWrapHeight":null,
            "paoYn":false,
            "mate30":false,
            "list": [
                {
                    "pagePath": "/pages/first/first",
                    "text": "首页",
                    "iconPath": "/images/icon-home.png",
                    "selectedIconPath": "/images/icon-homed.png",
                    "clas": "menu-item",
                    "selectedColor": "#D42A20",
                    active: true
                },
                {
                    "pagePath": "/pages/mine/mine",
                    "text": "用户中心",
                    "iconPath": "/images/icon-my.png",
                    "selectedIconPath": "/images/icon-myd.png",
                    "selectedColor": "#D42A20",
                    "clas": "menu-item",
                    active: false
                }
            ],
            "position": "bottom"
        },
        // 底部栏 -e
    },
    // 导航栏 -s
    getSystemInfo() {//获取右边胶囊的位置+获取系统信息
        let that = this;

        let headerPosi = wx.getMenuButtonBoundingClientRect()
        this.globalData.headerBtnPosi = headerPosi
        console.log('headerBtnPosi:' + JSON.stringify(this.globalData.headerBtnPosi))
        wx.getSystemInfo({ // iphonex底部适配
            success: res => {
                that.globalData.systeminfo = res
            }
        })
        console.log('systeminfo:' + JSON.stringify(this.globalData.systeminfo))
        // 胶囊位置信息
        let btnPosi = {
            height: headerPosi.height,
            top: headerPosi.top - this.globalData.systeminfo.statusBarHeight, // 胶囊top - 状态栏高度
            right: this.globalData.systeminfo.screenWidth - headerPosi.right, // 屏幕宽度 - 胶囊right
            bottom: headerPosi.bottom - headerPosi.height - this.globalData.systeminfo.statusBarHeight // 胶囊bottom - 胶囊height - 状态栏height （胶囊实际bottom 为距离导航栏底部的长度）
        }

        this.globalData.btnPosi = btnPosi
        var cusnavH = btnPosi.height + btnPosi.top + btnPosi.bottom // 导航高度
        this.globalData.cusnavH = cusnavH
        this.globalData.navbarHeight = 2 * this.globalData.headerBtnPosi.bottom - this.globalData.headerBtnPosi.height - this.globalData.systeminfo.statusBarHeight
        this.globalData.navbarHeight =this.globalData.navbarHeight+3;
        this.globalData.wrapHeight = this.globalData.systeminfo.screenHeight - this.globalData.navbarHeight
        console.log('this.globalData.navbarHeight:'+this.globalData.navbarHeight)
        console.log('this.globalData.wrapHeight:'+this.globalData.wrapHeight)
    },
    // 导航栏 -e
    // 底部栏 -s
    setTabBar(){
        var tabBar = this.globalData.tabBar;
        // 根据屏幕高度给适合的底部tabbar高度-s
        let sheight = Number(this.globalData.systeminfo.screenHeight)
        if (sheight>730&&sheight<740){
            tabBar.tabHeight = 53
        }else if (sheight>740&&sheight<900){
            tabBar.tabHeight =85
        }else {
            tabBar.tabHeight = 50
        }
        // mate 30 1080*2340   360*780、540*1170
        // mate 20 1080*2244   360*748、540*1122
        let screenHeight=this.globalData.systeminfo.screenHeight
        let screenWidth=this.globalData.systeminfo.screenWidth
        if((screenWidth==360&&screenHeight==780)||(screenWidth==540&&screenHeight==1170)||(screenWidth==540&&screenHeight==1122)||(screenWidth==360&&screenHeight==748)){
            tabBar.tabHeight =55
        }
        this.globalData.tabBar.tabHeight=tabBar.tabHeight
        this.globalData.tabBar.homeWrapHeight=this.globalData.wrapHeight-tabBar.tabHeight
        if(!wx.getStorageSync('paoYes')) {//没有这个值
            tabBar.paoYn=true
        }else{
            tabBar.paoYn=false
        }
        // 根据屏幕高度给适合的底部tabbar高度-e
    },
    goPageTabbar:function(e){
        this.globalData.tabBar.paoYn=false//显示或隐藏前最先渲染让它隐藏，因为onshow才会重新渲染，不这样会比较突兀
        // console.log('e:'+JSON.stringify(e))
        if(e.currentTarget.dataset.url=='/pages/mine/mine'&&!wx.getStorageSync('paoYes')){
            this.globalData.tabBar.paoYn=false
            wx.setStorageSync('paoYes',true)
        }

        // active切换 -s
        var tabBar = this.globalData.tabBar;
        for (var i = 0; i < tabBar.list.length; i++) {
            tabBar.list[i].active = false;
            if (tabBar.list[i].pagePath == e.currentTarget.dataset.url) {
                tabBar.list[i].active = true;//根据页面地址设置当前页面状态
            }
        }
        console.log('this.globalData.tabBar:'+JSON.stringify(this.globalData.tabBar))
        // active切换 -e
        wx.switchTab({
            url:e.currentTarget.dataset.url
        })
    },
    // 底部栏 -e
})