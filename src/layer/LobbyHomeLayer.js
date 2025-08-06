/**
 * Created by cyp on 2019/3/2.
 */
var LobbyHomeLayer = BaseLayer.extend({
    ctor:function(){
        this._super(LayerFactory.HOME);
    },

    selfRender:function() {
        cc.log("========LobbyHomeLayer=========selfRender==========");
        SignInModel.isClickCheck = false;

        this.webViewNode = new cc.Node();
        this.addChild(this.webViewNode);
        this.mMainMask = this.getWidget("mainMask");

        this.addCustomEvent(SyEvent.PLAYER_PRO_UPDATE, this, this.onPlayerUpdate);
        this.addCustomEvent(SyEvent.UPDATE_BE_INVITE_RED, this, this.updateMsgRed);
        this.addCustomEvent(SyEvent.SWITCH_CLUB, this, this.switchClub);
        this.addCustomEvent(SyEvent.NEW_YEAR_ACTIVITY_NOTICE, this, this.onActivityNotice);
        this.addCustomEvent(SyEvent.NEW_YEAR_ACTIVITY_HBLX, this, this.onClickHblxBtn);
        this.addCustomEvent(SyEvent.REMOVE_POP_ALL,this,this.onRemoveAllPop);

        //绑定按钮点击事件
        UITools.addClickEvent(this.getWidget("btn_create"), this, this.onClickCreateBtn);
        UITools.addClickEvent(this.getWidget("btn_join"), this, this.onClickJoinBtn);
        UITools.addClickEvent(this.getWidget("btn_shop"), this, this.onClickShopBtn);
        UITools.addClickEvent(this.getWidget("btn_invite"), this, this.onClickInviteBtn);
        UITools.addClickEvent(this.getWidget("btn_kf"), this, this.onClickKfBtn);
        UITools.addClickEvent(this.getWidget("btn_wanfa"), this, this.onClickWanfaBtn);
        UITools.addClickEvent(this.getWidget("btn_zhanji"), this, this.onClickZhanjiBtn);
        //UITools.addClickEvent(this.getWidget("btn_more") , this , this.onClickMoreBtn);
        UITools.addClickEvent(this.getWidget("btn_gg"), this, this.onClickGgBtn);
        UITools.addClickEvent(this.getWidget("btn_set"), this, this.onClickSetBtn);
        //UITools.addClickEvent(this.getWidget("btn_gg") , this , this.sendLegend);
        UITools.addClickEvent(this.getWidget("btn_pyq"), this, this.onClickPyqBtn);
        UITools.addClickEvent(this.getWidget("btn_fxyj"), this, this.onClickFxyjBtn);
        this.btn_cwdl = this.getWidget("btn_cwdl");
        this.btn_cwdl.tempData = 1;
        UITools.addClickEvent(this.btn_cwdl, this, this.onClickCwdlBtn);
        UITools.addClickEvent(this.getWidget("btn_head"), this, this.onClickHeadBtn);
        UITools.addClickEvent(this.getWidget("btn_add"), this, this.onClickAddBtn);

        this.btn_bind_phone = this.getWidget("btn_bind_phone");
        UITools.addClickEvent(this.btn_bind_phone, this, this.onClickBindPhone);

        this.btn_msg = this.getWidget("btn_msg");
        UITools.addClickEvent(this.getWidget("btn_msg"), this, this.onClickMsgBtn);

        this.btn_real_name = this.getWidget("btn_real_name");
        UITools.addClickEvent(this.btn_real_name, this, this.onClickRealName);

        this.btn_dhsc = this.getWidget("btn_dhsc");
        UITools.addClickEvent(this.btn_dhsc, this, this.sendTaskReq);

        this.btn_pastime = this.getWidget("btn_pastime");
        //this.btn_pastime.visible = false;
        //if (LoginData.versionCode == 201 && SyConfig.isAndroid()){
        //    this.btn_pastime.visible = true;
        //};
        //UITools.addClickEvent(this.btn_pastime, this, this.onPastime);

        this.getWidget("label_version").setString(SyVersion.v);

        this.setUserInfo();

        //this.addBtnAni();

        this.paomadeng = new PaoMaDeng();
        this.addChild(this.paomadeng, 10);
        this.paomadeng.anchorX = this.paomadeng.anchorY = 0;
        this.paomadeng.updatePosition(10, 595);

        if (parseInt(PlayerModel.urlSchemeRoomId) > 0) {
            sy.scene.showLoading("正在进入房间");
        } else {
            sy.scene.hideLoading();
        }

        this.onLoadIconSuc();
        //WXHeadIconManager.saveFile(PlayerModel.userId,PlayerModel.headimgurl,this.onLoadIconSuc,this);

        if (LoginData.apkurl) {//安卓整包更新
            AlertPop.showOnlyOk("发现最新版本，请更新后进入游戏", function () {
                OnlineUpdateUtil.downloadApk();
            });
        }

        this.setGgRed(!cc.sys.localStorage.getItem("sy_is_show_gg_layer"));
        //this.getWidget("btn_real_name").x = this.getWidget("btn_gg").x = this.getWidget("btn_cwdl").x = this.getWidget("btn_bind_phone").x = (1280 - cc.winSize.width) / 2 + 70;

        this.getNoticeData();
        this.getPlayerDailiState();
        this.getAllShareUrl();
        this.getNoticeContent();
        this.scheduleUpdate();
        this.onActivityNotice()
    },

    onActivityNotice:function(){
        this.btn_hblx = this.getWidget("btn_hblx");
        this.btn_xnzp = this.getWidget("btn_xnzp");
        this.btn_yqyl = this.getWidget("btn_yqyl");
        this.btn_hblx.visible = this.btn_xnzp.visible = /*this.btn_yqyl.visible = */false;

        //this.getActivityStatus()
        //this.activityDate = [[1,21],[1,22],[1,23],[1,29],[1,30],[1,31],[2,1]];
        //this.activityHour = 22;
        //this.activityMin = 60;
        //this.checkShowActivityPop(1)
        //UITools.addClickEvent(this.btn_hblx, this, this.onClickHblxBtn);
        //UITools.addClickEvent(this.btn_xnzp, this, this.onClickXnzpBtn);
        UITools.addClickEvent(this.btn_yqyl, this, this.onClickYqylBtn);
        //this.getWidget("btn_hblx").x = this.getWidget("btn_xnzp").x = this.getWidget("btn_yqyl").x = (1280 - cc.winSize.width) / 2 + 180;
        //this.schedule(this.updateTime,1,cc.REPEAT_FOREVER,0);
    },

    getActivityStatus:function(){
        var char_id = "char_id=" + PlayerModel.userId;
        var t = "&t=" + Math.round(new Date().getTime()/1000).toString();
        var rand = "&rand=" + ('000000' + Math.floor(Math.random() * 999999)).slice(-6);

        var sign = char_id + rand + t + "dfc2c2d62dde2c104203cf71c6e15580";
        sign = "&sign="+md5(sign).toUpperCase();

        var url = "http://bjdqp.firstmjq.club/agent/invite/getActivityStatus?";
        url = url + char_id + rand + t + sign
        Network.sypost(url,"",{type:"GET"},function(data){
            this.btn_hblx.getChildByName("red_icon").visible = data.data.redPackageIsGet == 1 ? true:false;
            this.btn_xnzp.getChildByName("red_icon").visible = data.data.turntableIsGet == 1 ? true:false;
            this.btn_yqyl.getChildByName("red_icon").visible = data.data.inviteIsGet == 1 ? true:false;
        }.bind(this), function(data){
        })
    },

    updateTime:function(){
        //新年活动
        this.checkShowActivityPop(2)
    },

    checkShowActivityPop:function(check){
        var serverDate = sy.scene.getCurServerTime()
        var date = new Date(serverDate)
        //var date = new Date()
        var month = date.getMonth() + 1;
        var day = date.getDate();
        var hour = date.getHours();
        var type = 1;//1、活动时间界面，2、倒计时界面
        if(check == 1){
            this.showActivityPop(1)
            return;
        }
        if(check == 2){
            var showDay = false
            for(var i = 0;i<this.activityDate.length;i++) {
                if (month == this.activityDate[i][0] && day == this.activityDate[i][1]) {
                    showDay = true
                    break;
                }
            }
            if(!showDay)return
            RedPacket.showDay = showDay;
            var min = date.getMinutes();
            var sec = date.getSeconds();
            cc.log(hour,min,sec)
            var isShow = false;//是否自动弹出
            var bOpen = false;
            if(hour == this.activityHour-1){
                if((this.activityMin-min == 5 || this.activityMin-min == 10) && sec == 0){//活动前5分钟和前10分钟
                    isShow = true;
                }else if(min == 0&& sec == 0){
                    isShow = true;//活动前一个小时
                }
            }else if(this.activityHour == hour && min == 0&& sec == 0){// && sec == 0
                isShow = true;
                bOpen = true
            }
            if(isShow)this.showActivityPop(2,bOpen)
        }
    },

    showActivityPop:function(type,bOpen){
        if(type == 1){
            var pop = new ActivityNoticePop();
            PopupManager.addPopup(pop);
        }else if(type == 2){
            if(LayerManager.getCurrentLayer() == LayerFactory.HOME || LayerManager.getCurrentLayer() == LayerFactory.PYQ_HALL){
                var activityPop = PopupManager.getClassByPopup(ActivityPop)
                if(!activityPop){
                    var pop = new ActivityPop(bOpen);
                    PopupManager.addPopup(pop);
                }else{
                    activityPop.setData(bOpen)
                }
            }
        }
    },

    onClickHblxBtn:function(){
        var char_id = "char_id=" + PlayerModel.userId;
        var t = "&t=" + Math.round(new Date().getTime()/1000).toString();
        var rand = "&rand=" + ('000000' + Math.floor(Math.random() * 999999)).slice(-6);

        var sign = char_id + rand + t + "dfc2c2d62dde2c104203cf71c6e15580";
        sign = "&sign="+md5(sign).toUpperCase();

        var url = "http://bjdqp.firstmjq.club/agent/redpackage/index?";
        url = url + char_id + rand + t + sign;
        var url = Network.getWebUrl(url);
        if (SdkUtil.is316Engine() && (SyConfig.isIos() || SyConfig.isAndroid())){
            if (ccui.WebView){
                var viewport = cc.visibleRect;
                var webView = this.webView = new ccui.WebView();
                webView.x = viewport.center.x;
                webView.y = viewport.center.y;
                webView.setScalesPageToFit(true);
                webView.setContentSize(viewport);
                webView.loadURL(url);
                webView.setJavascriptInterfaceScheme("bjdqp");
                this.webViewNode.addChild(webView);
                this.webView.reload();

                webView.setOnJSCallback(function(sender, url) {
                    if (url.indexOf("bjdqp://close") >= 0) {
                        this.webView.removeFromParent();
                        this.webView = null;
                    }else if(url.indexOf("bjdqp://redpacketshare") >= 0) {
                        this.webView.removeFromParent();
                        this.webView = null;
                        this.showRedPacketSharePop()
                    }
                    this.getActivityStatus()
                }.bind(this));
            }
        }else{
            SdkUtil.sdkOpenUrl(url);
        }
    },

    onRemoveAllPop:function(){
        if (this.webView) {
            SdkUtil.setOrientation(1);
            this.webView.removeFromParent();
            this.webView = null;
        }
        PopupManager.removeAll();
    },

    showRedPacketSharePop:function(){
        RedPacketSharePop.show(true);
    },

    onClickXnzpBtn:function(){
        var char_id = "char_id=" + PlayerModel.userId;
        var t = "&t=" + Math.round(new Date().getTime()/1000).toString();
        var rand = "&rand=" + ('000000' + Math.floor(Math.random() * 999999)).slice(-6);

        var sign = char_id + rand + t + "dfc2c2d62dde2c104203cf71c6e15580";
        sign = "&sign="+md5(sign).toUpperCase();

        var url = "http://bjdqp.firstmjq.club/agent/turntable/index?";
        url = url + char_id + rand + t + sign;
        var url = Network.getWebUrl(url);
        if (SdkUtil.is316Engine() && (SyConfig.isIos() || SyConfig.isAndroid())){
            if (ccui.WebView){
                var viewport = cc.visibleRect;
                var webView = this.webView = new ccui.WebView();
                webView.x = viewport.center.x;
                webView.y = viewport.center.y;
                webView.setScalesPageToFit(true);
                webView.setContentSize(viewport);
                webView.loadURL(url);
                webView.setJavascriptInterfaceScheme("bjdqp");
                this.webViewNode.addChild(webView);
                this.webView.reload();

                webView.setOnJSCallback(function(sender, url) {
                    if (url.indexOf("bjdqp://close") >= 0) {
                        this.webView.removeFromParent();
                        this.webView = null;
                        this.getActivityStatus()
                    }
                }.bind(this));
            }
        }else{
            SdkUtil.sdkOpenUrl(url);
        }
    },

    onClickYqylBtn:function(){
        //cc.log("=============onClickFxyjBtn==============");
        //var pop = new BjdShareGiftPop();
        //PopupManager.addPopup(pop);
        FloatLabelUtil.comText("暂未开放！");

        return;
        var char_id = "char_id=" + PlayerModel.userId;
        var t = "&t=" + Math.round(new Date().getTime()/1000).toString();
        var rand = "&rand=" + ('000000' + Math.floor(Math.random() * 999999)).slice(-6);

        var sign = char_id + rand + t + "dfc2c2d62dde2c104203cf71c6e15580";
        sign = "&sign="+md5(sign).toUpperCase();

        var url = "http://bjdqp.firstmjq.club/agent/invite/index?";
        url = url + char_id + rand + t + sign;

        var url = Network.getWebUrl(url);
        if (SdkUtil.is316Engine() && (SyConfig.isIos() || SyConfig.isAndroid())){
            if (ccui.WebView){
                var viewport = cc.visibleRect;
                var webView = this.webView = new ccui.WebView();
                webView.x = viewport.center.x;
                webView.y = viewport.center.y;
                webView.setScalesPageToFit(true);
                webView.setContentSize(viewport);
                webView.loadURL(url);
                webView.setJavascriptInterfaceScheme("bjdqp");
                this.webViewNode.addChild(webView);
                this.webView.reload();

                webView.setOnJSCallback(function(sender, url) {
                    if (url.indexOf("bjdqp://close") >= 0) {
                        this.webView.removeFromParent();
                        this.webView = null;
                    }else if(url.indexOf("bjdqp://invite") >= 0){
                        //关闭网页
                        this.webView.removeFromParent();
                        this.webView = null;
                        //分享
                        this.onClickInviteBtn()
                    }
                    this.getActivityStatus()
                }.bind(this));
            }
        }else{
            SdkUtil.sdkOpenUrl(url);
        }
    },

    onPastime:function(){
        cc.log("====onPastime====");
        return;
        var newVersionCode = 1;
        var downUrl = "https://testcdncfgh5.52bjd.com/pack/apk/bjdqipaiyule_200110.apk";
        if (!SdkUtil.isAppInstalled("cn.limsam.ddzyx")) {
            // 下载
            SdkUtil.startDownApp(downUrl, newVersionCode)
        } else {
            // 运行
            SdkUtil.startOtherApp("cn.limsam.ddzyx")
        }
    },

    showShopTip:function(){
        var string = "豪礼上线点击查看";
        var bg = UICtor.cS9Img("res/ui/mj/zzmjRoom/xiala.png",cc.rect(5,17,117,5),cc.size(100,50));
        bg.setAnchorPoint(0.5,0);
        bg.height = string.length/4*40;
        bg.setPosition(this.btn_dhsc.width/2,-60);
        this.btn_dhsc.addChild(bg);

        var wanfa_label = new cc.LabelTTF(string,"Arial",22,cc.size(100, bg.height));
        wanfa_label.setAnchorPoint(0.5,0);
        wanfa_label.setPosition(bg.width/2+5,-20);
        bg.addChild(wanfa_label, 10);

        var moveBy = cc.moveBy(0.3,0,10);
        var sequence_move = cc.sequence(cc.delayTime(1),moveBy,moveBy.reverse(),moveBy,moveBy.reverse()).repeatForever();
        bg.runAction(sequence_move);
    },
    //兑换任务
    sendTaskReq: function(){
        FloatLabelUtil.comText("暂未开放！");

        return;
        var time = Math.floor(new Date().getTime()/1000);
        var sign = md5("0"+PlayerModel.userId+PlayerModel.username+time+"a4701f60719810263347242e3a992569");
        var oldUrl = "http://bjdqp.firstmjq.club/agent/player/exchangeAndTaskIndex/wx_plat/mjqz?";
        var url = Network.getWebUrl(oldUrl);
        //if (resultUrl){
        //    SdkUtil.sdkOpenUrl(resultUrl);
        //}
        if (SdkUtil.is316Engine() && (SyConfig.isIos() || SyConfig.isAndroid())){
            //var result = SdkUtil.setOrientation(2);
            //if (result == false) {
            //    SdkUtil.sdkOpenUrl(url);
            //    return;
            //}
            if (ccui.WebView){
                var viewport = cc.visibleRect;
                var webView = this.webView = new ccui.WebView();
                webView.x = viewport.center.x;
                webView.y = viewport.center.y;
                webView.setScalesPageToFit(true);
                webView.setContentSize(viewport);
                webView.loadURL(url);
                webView.setJavascriptInterfaceScheme("bjdqp");
                this.webViewNode.addChild(webView);
                this.webView.reload();

                webView.setOnJSCallback(function(sender, url) {
                    //SdkUtil.setOrientation(2);
                    //cc.log("OnJSCallback:" + url);
                    if (url.indexOf("bjdqp://close") >= 0) {
                        this.webView.removeFromParent();
                        this.webView = null;
                    }
                }.bind(this));
            }
        }else{
            SdkUtil.sdkOpenUrl(url);
        }
        //
        //var url = "http://bjdqp.firstmjq.club/agent/player/exchangeAndTaskIndex/wx_plat/mjqz?";
        //Network.sendWebReq(url);
    },

    //传奇入口
    sendLegend: function(){
        var time = Math.floor(new Date().getTime()/1000);
        var sign = md5("0"+PlayerModel.userId+PlayerModel.username+time+"a4701f60719810263347242e3a992569");
        var url ="https://game.jiulingwan.com/kuailewancq/login?"+"user_id="+PlayerModel.userId+"&game_id="+0 +"&username="+encodeURIComponent(PlayerModel.username)+"&sign="+sign+"&time="+time;
        if (SdkUtil.is316Engine() && (SyConfig.isIos() || SyConfig.isAndroid())){
            var result = SdkUtil.setOrientation(2);
            if (result == false) {
                SdkUtil.sdkOpenUrl(url);
                return;
            }
            if (ccui.WebView){
                var viewport = cc.visibleRect;
                var webView = this.webView = new ccui.WebView();
                webView.x = viewport.center.x;
                webView.y = viewport.center.y;
                webView.setScalesPageToFit(true);
                webView.setContentSize(viewport);
                webView.loadURL(url);
                webView.setJavascriptInterfaceScheme("dtzqp");
                this.webViewNode.addChild(webView);
                this.webView.reload();

                webView.setOnJSCallback(function(sender, url) {
                    SdkUtil.setOrientation(1);
                    cc.log("OnJSCallback:" + url);
                    if (url.indexOf("dtzqp://close") >= 0) {
                        this.webView.removeFromParent();
                        this.webView = null;
                    }
                }.bind(this));
            }
        }else{
            SdkUtil.sdkOpenUrl(url);
        }
    },
    //签名不一样，不用通用的网络接口了
    getPlayerDailiState:function(){
        var char_id = PlayerModel.userId;
        var time = new Date().getTime();
        var sign = "" + char_id + time;
        sign = md5(sign);

        var url = "https://wx.52bjd.com/agent/player/isAgent/wx_plat/mjqz";
        url += ("?char_id=" + char_id);
        url += ("&time=" + time);
        url += ("&sign=" + sign);
        var xhr = cc.loader.getXMLHttpRequest();
        xhr.open("GET", url);
        xhr.timeout = 12000;
        xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded;charset=utf-8");

        var self = this;
        var onerror = function(){
            xhr.abort();
            cc.log("==========getPlayerDailiState========error=========");
        };

        xhr.onerror = onerror;
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                if(xhr.status == 200){
                    cc.log("===========getPlayerDailiState============" + xhr.responseText);
                    var data = JSON.parse(xhr.responseText);

                    if(data.code == 1){//是代理
                        self.btn_cwdl.tempData = 2;
                        //self.btn_cwdl.loadTextureNormal("res/ui/bjdmj/dailihoutai.png");
                        var time = new Date();
                        var year = time.getFullYear();
                        var month = time.getMonth() + 1;
                        var date = time.getDate();
                        if(year == 2019 &&  month == 9 && date >= 9 && date <= 13){//中秋活动宣传
                            var pop = new HuodongPop();
                            PopupManager.addPopup(pop,5);
                        }
                    }
                }else{
                    onerror.call(self);
                }
            }
        };
        xhr.send();
    },

    onLoadIconSuc:function(){
        //头像;
        var imgHead = this.getWidget("img_head");
        var sten=new cc.Sprite(sy.imagepath + "common/common_touxiangkuang1.png");
        var clipNode = new cc.ClippingNode();
        clipNode.attr({stencil:sten,anchorX:0.5,anchorY:0.5,x:imgHead.width/2,y:imgHead.height/2,alphaThreshold:0.8});
        var sprite = new cc.Sprite(sy.imagepath + "common/common_test_icon.png");
        sprite.setScale(imgHead.width/sprite.width);
        clipNode.addChild(sprite);
        imgHead.addChild(clipNode,1);
        cc.loader.loadImg(PlayerModel.headimgurl, {width: 252, height: 252}, function (error, texture) {
            if (error == null) {
                sprite.setTexture(texture);
            }
            //连接socket
            if (PlayerModel.isDirect2Room()) {
                if (PlayerModel.playTableId == 0) {
                    SyEventManager.dispatchEvent(SyEvent.DIRECT_JOIN_ROOM);
                } else {//身上有房号
                    FloatLabelUtil.comText("您已有房间，无法加入好友房间");
                }
            } else {
                if (!sySocket.isOpen()) {
                    sySocket.connect(null,11);
                } else {
                    sy.scene.hideLoading();
                }
            }
        });
    },

    //从其他网页获取的跑马灯内容返回的就是个字符串，就不走通用接口了
    getNoticeData:function(){
        //http://119.29.80.63/pdklogin/qipai!getNoticeMsg.action?type=getMarqueeNotice
        var url = csvhelper.strFormat(SyConfig.REQ_URL,"qipai","getNoticeMsg");
        var xhr = cc.loader.getXMLHttpRequest();
        xhr.open("GET", ""+url+"?type=getMarqueeNotice");
        xhr.timeout = 12000;
        xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded;charset=utf-8");

        var self = this;
        var onerror = function(){
            xhr.abort();
            cc.log("==========getNoticeData========error=========");
        }
        xhr.onerror = onerror;
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                if(xhr.status == 200){
                    cc.log("===========getNoticeData============" + xhr.responseText);
                    self.bjdmjNotice = xhr.responseText;
                }else{
                    onerror.call(self);
                }
            }
        }
        xhr.send();
    },

    //获取大厅分享和房间的分享链接
    getAllShareUrl:function(){
        //http://119.29.80.63/pdklogin/qipai!getNoticeMsg.action?type=getShareUrl
        var url = csvhelper.strFormat(SyConfig.REQ_URL,"qipai","getNoticeMsg");
        var xhr = cc.loader.getXMLHttpRequest();
        xhr.open("GET", ""+url+"?type=getShareUrl");
        xhr.timeout = 12000;
        xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded;charset=utf-8");

        var self = this;
        var onerror = function(){
            xhr.abort();
        };
        xhr.onerror = onerror;
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                if(xhr.status == 200){
                    var data = JSON.parse(xhr.responseText);
                    if(data.code == 0) {
                        if (data.data) {
                            if (data.data.hall && data.data.hall.length > 5){
                                SdkUtil.SHARE_URL = data.data.hall;
                                SdkUtil.SHARE_URL = SdkUtil.SHARE_URL.replace(/(user_id[^]*$)/,"user_id/" + PlayerModel.userId);
                            }
                            if (data.data.table && data.data.table.length > 5){
                                SdkUtil.SHARE_ROOM_URL = data.data.table;
                                SdkUtil.SHARE_ROOM_URL = SdkUtil.SHARE_ROOM_URL.replace(/(user_id[^]*$)/,"user_id/" + PlayerModel.userId);
                            }
                            cc.log("getAllShareUrl===",SdkUtil.SHARE_URL,SdkUtil.SHARE_ROOM_URL)
                        }
                    }
                }else{
                    onerror.call(self);
                }
            }
        };
        xhr.send();
    },

    //获取当前版本的更新公告
    getNoticeContent:function(){
        //http://119.29.80.63/pdklogin/qipai!getNoticeMsg.action?type=getGameNotice
        var url = csvhelper.strFormat(SyConfig.REQ_URL,"qipai","getNoticeMsg");
        var xhr = cc.loader.getXMLHttpRequest();
        xhr.open("GET", ""+url+"?type=getGameNotice");
        xhr.timeout = 12000;
        xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded;charset=utf-8");

        var self = this;
        var onerror = function(){
            xhr.abort();
        };
        xhr.onerror = onerror;
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                if(xhr.status == 200){
                    var data = JSON.parse(xhr.responseText);
                    if(data.code == 0) {
                        if (data.data) {
                            var noticeV = data.data.version || 0;
                            self.isUpdate = UpdateNoticeModel.isPopOut(noticeV);
                            cc.log("this.isUpdate 2 =",self.isUpdate);
                            UpdateNoticeModel.init(data.data);
                            // if (isUpdate){
                            //     var pop = new NoticePop(3);
                            //     PopupManager.addPopup(pop);
                            // }
                            //cc.log("getNoticeContent===",data.data.content,data.data.version)
                        }
                    }
                }else{
                    onerror.call(self);
                }
            }
            //self.showDaiLiActivityPop();
        }
        xhr.send();
    },

    update:function(dt){
        //cc.log("************sy.scene.msgPlaying",sy.scene.msgPlaying);
        if(!this.paomadeng.playing && !sy.scene.msgPlaying){
            if(this.bjdmjNotice){
                this.paomadeng.play({content:this.bjdmjNotice});
            }
        }else if(sy.scene.msgPlaying && this.paomadeng && this.paomadeng.isVisible() && sy.scene.IsPlayByServerId()){
            this.paomadeng.visible = false;
        }
    },

    onClickBindPhone:function(){
        if(!PlayerModel.phoneNum){
            var mc = new PhoneLoginPop(2);
            PopupManager.addPopup(mc);
        }else{
            FloatLabelUtil.comText("该账号已绑定手机号");
        }
    },

    addBtnAni:function(){
        return;

        ccs.armatureDataManager.addArmatureFileInfo("res/bjdani/chuangjianjiaru/chuangjianjiaru.ExportJson");

        var btn_join = this.getWidget("btn_join");
        var jiaruAni = new ccs.Armature("chuangjianjiaru");
        btn_join.setOpacity(0);
        jiaruAni.setPosition(btn_join.x,btn_join.y);
        jiaruAni.getAnimation().play("jiaru",-1,1);
        this.mMainMask.addChild(jiaruAni);

        var btn_create = this.getWidget("btn_create");
        var jiaruAni1 = new ccs.Armature("chuangjianjiaru");
        btn_create.setOpacity(0);
        jiaruAni1.setPosition(btn_create.x,btn_create.y );
        jiaruAni1.getAnimation().play("chaungjian",-1,1);
        this.mMainMask.addChild(jiaruAni1,1);

        ccs.armatureDataManager.addArmatureFileInfo("res/bjdani/qinyouquan/qinyouquan.ExportJson");
        var btn_pyq = this.getWidget("btn_pyq");
        var pyqAni = new ccs.Armature("qinyouquan");
        btn_pyq.setOpacity(0);
        pyqAni.setPosition(btn_pyq.x,btn_pyq.y);
        pyqAni.getAnimation().play("qinyouquan",-1,1);
        this.mMainMask.addChild(pyqAni);

        ccs.armatureDataManager.addArmatureFileInfo("res/bjdani/dyjzcr/dyjzcr.ExportJson");
        var Img_girl = this.getWidget("Img_girl");
        var girlAni = new ccs.Armature("dyjzcr");
        girlAni.setAnchorPoint(0.5,0);
        girlAni.setScale(1.3);
        Img_girl.setOpacity(0);
        girlAni.setPosition(Img_girl.x,Img_girl.y);
        girlAni.getAnimation().play("Animation1",-1,1);
        this.mMainMask.addChild(girlAni);

        //ccs.armatureDataManager.addArmatureFileInfo("res/bjdani/dt_logo/dt_logo.ExportJson");
        //var img_logo = this.getWidget("img_log");
        //var logo_ani = new ccs.Armature("dt_logo");
        //logo_ani.setAnchorPoint(0.5,1);
        //img_logo.setOpacity(0);
        //img_logo.getChildByName("Image_76").setOpacity(0);
        //logo_ani.setPosition(img_logo.x,img_logo.y);
        //logo_ani.getAnimation().play("dt_logo",-1,1);
        //this.mMainMask.addChild(logo_ani);
    },

    onExit:function(){
        ccs.armatureDataManager.removeArmatureFileInfo("res/bjdani/chuangjianjiaru/chuangjianjiaru.ExportJson");
        ccs.armatureDataManager.removeArmatureFileInfo("res/bjdani/qinyouquan/qinyouquan.ExportJson");
        ccs.armatureDataManager.removeArmatureFileInfo("res/bjdani/dyjzcr/dyjzcr.ExportJson");
        ccs.armatureDataManager.removeArmatureFileInfo("res/bjdani/dt_logo/dt_logo.ExportJson");


        this._super();
    },

    onEnterTransitionDidFinish:function(){
        this._super();
        this.updateMsgRed();
        this.checkShowBindPop();
        this.getAddressByIp();
        // this.showDaiLiActivityPop();
    },

    getAddressByIp:function(){
        var self = this;
        Network.loginReq("qipai","getAddressFromIp", {
            userId:PlayerModel.userId ,sessCode:PlayerModel.sessCode}, function (data) {
            if (data && data.address) {
                // cc.log("getAddressByIp data =",JSON.stringify(data));
                var address = JSON.parse(data.address);
                var city = address.city;
                // cc.log("getAddressByIp city =",JSON.stringify(city));
                if (city == "娄底市"){

                }else{
                    // self.showDaiLiActivityPop();
                }
            }
        },function (data) {
                FloatLabelUtil.comText(data.message);
        });
    },
    showDaiLiActivityPop:function(){
        var callback = null;
        cc.log("this.isUpdate =",this.isUpdate);
        if (this.isUpdate){
            callback = function (){
                var pop = new NoticePop(3);
                PopupManager.addPopup(pop);
            }
        }
        var pop = new DaiLiActivityPop(callback);
        PopupManager.addPopup(pop,99);
    },

    checkShowBindPop:function(){
        var temp = cc.sys.localStorage.getItem("sy_is_show_bind_pop_" + PlayerModel.userId);
        cc.log("bind id:", PlayerModel.payBindId);
        if((temp == "1") && (!PlayerModel.payBindId)){
            var pop = new BindInvitePop(PlayerModel.inviterPayBindId || "");
            PopupManager.addPopup(pop);
            // this.showDaiLiActivityPop();
            cc.sys.localStorage.setItem("sy_is_show_bind_pop_" + PlayerModel.userId, "1");
        }else{
            // this.showDaiLiActivityPop();
            cc.sys.localStorage.setItem("sy_is_show_bind_pop_" + PlayerModel.userId, "0");
        }
    },

    onClickMsgBtn:function(){
        var pop = new PlayerMsgPop(this);
        PopupManager.addPopup(pop);
    },

    onClickRealName:function(){
        var pop = new CheckIdCardPop();
        PopupManager.addPopup(pop);
    },

    updateMsgRed:function(){
        var self = this;
        this.btn_msg.getChildByName("red_icon").visible = false;
        NetworkJT.loginReq("groupAction", "groudReadPiont", {oUserId:PlayerModel.userId}, function (data) {
            if (data) {
                if (data.message && data.message.inviteReadPoint){
                    self.btn_msg.getChildByName("red_icon").visible = true;
                    if(!self.isShowMsgPop){
                        self.isShowMsgPop = true;
                        var pop = new PlayerMsgPop(self);
                        PopupManager.addPopup(pop);
                    }
                }
            }
        }, function (data) {
            if(data.message){
                FloatLabelUtil.comText(data.message);
            }
        });
    },

    setUserInfo:function(){
        this.getWidget("user_name").setString(PlayerModel.name);
        this.getWidget("user_id").setString("ID:"+PlayerModel.userId);
        this.getWidget("zs_num").setString(PlayerModel.cards);
    },

    onPlayerUpdate:function(){
        this.getWidget("zs_num").setString(PlayerModel.cards);
    },

    onShow:function(){
        AudioManager.reloadFromData(PlayerModel.isMusic,PlayerModel.isEffect,1);
    },

    setGgRed:function(isShow){
        var btn = this.getWidget("btn_gg");
        btn.getChildByName("red_icon").setVisible(isShow);
    },

    onClickCreateBtn:function(){
        cc.log("=============onClickCreateBtn==============");
        var mc = new MjCreateRoom();
        PopupManager.addPopup(mc);
    },

    onClickJoinBtn:function(){
        cc.log("=============onClickJoinBtn==============");

        var mc = new JoinRoomPop();
        PopupManager.addPopup(mc);
    },

    onClickShopBtn:function(){
        cc.log("=============onClickShopBtn==============");

        this.showShop();
    },

    showShop:function(){
        if(PlayerModel.payBindId){
            var popLayer = new ShopPop();
            PopupManager.addPopup(popLayer);
        }else{
            var pop = new BindInvitePop(PlayerModel.inviterPayBindId || "");
            PopupManager.addPopup(pop);
        }
    },

    onClickInviteBtn:function(){
        cc.log("=============onClickInviteBtn==============");

        var obj={};
        obj.tableId = 0;
        obj.userName=PlayerModel.username;
        obj.callURL=SdkUtil.SHARE_URL+'?userId='+encodeURIComponent(PlayerModel.userId);
        var content = ShareDailyModel.getFeedContent();
        obj.title=content;
        obj.pyq=content;
        obj.description=content;
        obj.shareType=1;
        cc.log("obj.callURL",obj.callURL)
        if (content=="" && SyConfig.hasOwnProperty("HAS_PNG_SHARE")) {
            obj.shareType=0;
            obj.png = "res/feed/feed.jpg";
        }
        SharePop.show(obj,true);
    },

    onClickKfBtn:function(){
        cc.log("=============onClickKfBtn==============");
        var pop = new KefuPop();
        PopupManager.addPopup(pop);
        //AlertPop.showOnlyOk("问题反馈，请联系：\n\n客服电话：4008388629\n客服QQ：2939450050\n客服邮箱：csxunyoukefu@qq.com");
    },

    onClickWanfaBtn:function(){
        cc.log("=============onClickWanfaBtn==============");
        PopupManager.addPopup(new BjdWanfaPop());
    },

    onClickZhanjiBtn:function(){
        cc.log("=============onClickZhanjiBtn==============");
        var mc = new DTZTotalRecordPop(1);
        PopupManager.addPopup(mc);

        // var data = [];
        // var mc = new PHZBigResultPop(data);
        // PopupManager.addPopup(mc);
    },

    onClickMoreBtn:function(){
        cc.log("=============onClickMoreBtn==============");
        var moreBg = this.getWidget("more_bg");
        moreBg.visible = !moreBg.visible;

    },

    onClickPyqBtn:function(sender){
        cc.log("=============onClickPyqBtn==============");

        sender.setTouchEnabled(false);
        this.runAction(cc.sequence(cc.delayTime(1),cc.callFunc(function(){
            sender.setTouchEnabled(true);
        })));

        this.updateMsgRed();
        this.getAllClubsData();
    },

    switchClub:function(){
        this.getAllClubsData();
    },

    onClickFxyjBtn:function(){
        cc.log("=============onClickFxyjBtn==============");
        var pop = new BjdShareGiftPop();
        PopupManager.addPopup(pop);
    },

    onClickCwdlBtn:function(sender){
        cc.log("=============onClickCwdlBtn==============");
        FloatLabelUtil.comText("暂未开放！");
        return;
        if(sender.tempData == 1){
            var pop = new BjdDailiPop();
            PopupManager.addPopup(pop);
        }else{
            SdkUtil.sdkOpenUrl("https://wx.52bjd.com/agent/user/indexNoLogin/wx_plat/mjqz");
        }
    },

    onClickGgBtn:function(){
        cc.log("=============onClickGgBtn==============");

        var pop = new NoticePop();
        PopupManager.addPopup(pop);

        cc.sys.localStorage.setItem("sy_is_show_gg_layer",1);
        this.setGgRed(false);
    },

    onClickSetBtn:function(){
        cc.log("=============onClickSetBtn==============");

        var mc = new SetPop(true);
        PopupManager.addPopup(mc);
        // this.getAddressByIp();
    },

    onClickDiquBtn:function(){
        cc.log("=============onClickDiquBtn==============");
    },

    onClickHeadBtn:function(){
        cc.log("=============onClickHeadBtn==============");

        var popLayer = new UserInfoPop();
        PopupManager.addPopup(popLayer);
    },

    onClickAddBtn:function(){
        cc.log("=============onClickAddBtn==============");

        this.showShop();
    },

    getAllClubsData:function(){
        sy.scene.showLoading("查询亲友圈数据");
        NetworkJT.loginReq("groupActionNew", "loadGroupList", {userId:PlayerModel.userId,sessCode:PlayerModel.sessCode}, function (data) {
            if (data) {
                sy.scene.hideLoading();
                cc.log("loadGroupList",JSON.stringify(data))
                if(data.message.list && data.message.list.length > 0){
                    ClubListModel.init(data.message.list);
                    var popLayer = new PyqHall(data.message.list);
                    PopupManager.addPopup(popLayer);
                }else{
                    var popLayer = new YqhPop();
                    PopupManager.addPopup(popLayer);
                }
            }
        }, function (data) {
            sy.scene.hideLoading();
            FloatLabelUtil.comText(data.message || "亲友圈数据查询失败");
        });
    },

});