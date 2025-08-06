/**
 * Created by Administrator on 2016/6/24.
 */
var LoginLayer = BaseLayer.extend({

    ctor:function(){
        this._super(LayerFactory.LOGIN);
    },

    reviewPost:function(){
        var self = this;
        var url = csvhelper.strFormat(ServerUtil.defaultLoginUrl,"user","getLoginConfig");
        Network.sypost(url,"getLoginConfig",{},function(data){
            LoginData.onReview(data);
            //self.displayLoginBtn();
            GreenUtil.isGreen(self,self.onGreenS);
        },function(){
            sy.scene.hideLoading();
            AlertPop.showOnlyOk("获取登录信息失败，点击确定重试",function(){
                sy.scene.showLoading("正在登录");
                self.reviewPost();
            })
        });
    },

    //上传错误日志
    uploadUpdateErrorLog:function(){
        //var self = this;
        if (SyConfig.IS_UPDATE_LOG && AssetsUpdateModel && AssetsUpdateModel.isLog){
            var errorLog = AssetsUpdateModel.getTags();
            NetworkJT.loginReq("bjdAction", "clientLogMsg", {logMsg:errorLog}, function (data) {
            }, function (data) {
                if(data.message){
                    FloatLabelUtil.comText(data.message);
                }
            });
        }
    },

    onGreenS: function() {
        sy.scene.hideLoading();
        cc.log("开始登录逻辑展示...");
        if(SdkUtil.isIosReviewVersion()){//ios检测下ip
            this.reviewPost();
        }else{//不是审核阶段，直接按正常流程显示
            //this.displayLoginBtn();
        }
    },

    selfRender:function(){ 
		var ports = "8001-8028";
		var tmp_ports = ports.split("-");
		var ports_str = "";
		for (var i = parseInt(tmp_ports[0]); i <= parseInt(tmp_ports[1]); i++) {
			if (ports_str == "") {
			  ports_str += i;
			}
			else {
			  ports_str += "," + i;
			}
		}

		if (SyConfig.isSdk()&&0) {//如果要更新地址，打开配置
			SyConfig.TJD = false;
			SyConfig.WS_HOST = "newgamebjdqp.52bjd.com";
			SyConfig.WS_PORT = ports_str;
			SyConfig.REQ_URL = "http://newloginbjdqp.52bjd.com/pdklogin/{0}!{1}.action";
			SyConfig.LOGIN_URL = "http://newloginbjdqp.52bjd.com/pdklogin/{0}!{1}.guajilogin";
			ServerUtil.defaultLoginUrl = SyConfig.LOGIN_URL;
			ServerUtil.defaultReqUrl = SyConfig.REQ_URL;
		}
        
        //获取versioncode
        LoginData.versionCode = OnlineUpdateUtil.getVersionCode();
        //SdkUtil.sdkRootCheck("dev");
        sy.login = this;


        var winSize = cc.director.getWinSize();
        var btn_yk = this.getWidget("Button_1");
        var btn_wx = this.getWidget("Button_2");
        var image_Logo = this.getWidget("Image_49");
        image_Logo.setPosition(winSize.width*0.8888, winSize.height*0.8888);

        var btn_xl = this.getWidget("Button_21");
        var btn_phone = this.getWidget("btn_phone");
        btn_yk.visible=btn_wx.visible=btn_xl.visible =btn_phone.visible= false;
        UITools.addClickEvent(btn_wx,this,this.onWx);
        UITools.addClickEvent(btn_yk,this,this.onVisitor);
        UITools.addClickEvent(btn_xl,this,this.onXl);
        UITools.addClickEvent(btn_phone,this,this.onPhone);
        var checkbox = this.getWidget("CheckBox_20");
        checkbox.addEventListener(this.onCheckBox,this);
        checkbox.setSelected(true);
        var checkbox2 = this.getWidget("CheckBox_20_0");
        checkbox2.addEventListener(this.onCheckBox,this);
        checkbox2.setSelected(true);
        var Panel_21 = this.getWidget("Panel_21");
        UITools.addClickEvent(Panel_21,this,this.onXieyi);
        var Panel_22 = this.getWidget("Panel_22");
        UITools.addClickEvent(Panel_22,this,this.onXieyi);
        this.bg = this.getWidget("bg");
        this.bg.setAnchorPoint(0.5,0.5);

        UITools.addClickEvent(this.getWidget("Button_3"),this,this.onClickKf);

        var logStr = "";
        //if(SyConfig.IS_UPDATE_LOG){
        //    logStr = "新";
        //}

        //显示版本号;
        var Label_Version = this.getWidget("Label_version");
        if(Label_Version){
            Label_Version.setString(logStr + SyVersion.v + "_" + cc.sys.os);
            Label_Version.setAnchorPoint(1.0,0.5);
            Label_Version.setPositionX(winSize.width*0.8888+image_Logo.width*0.50-10.0);
        }

        this.uploadUpdateErrorLog();

        this.selected = true;
        this.addCustomEvent(SyEvent.SOCKET_LOGIN_SUCCESS, this, this.onLoginSuccess);
        this.addCustomEvent(SyEvent.LOGIN_MONI,this,this.loginMoni);

        this.isForceUpdate();

        ServerUtil.getServerFromTJD();

        PhoneLoginModel.init();

        if (SyConfig.DEBUG) {
            this.setSelectServer();
            cc.log("+++++++++++++++++++++++++++ kefu.");
            //var btn = new ccui.Button();
            //btn.loadTextureNormal("popup_login_btn_kefu.png", ccui.Widget.PLIST_TEXTURE);
            //btn.setPosition(150,450);
            //this.root.addChild(btn,100);
            //UITools.addClickEvent(btn,this,this.onLoginMoni);
        }
        //this.addPlistAni();
        //this.addBgAni();
        //显示登陆按钮
        this.displayLoginBtn();
        //请求游戏玩法开关
        Network.loginReq("qipai","getGameKFGames",{},function(data){
            sy.gameKf = data.data;
        },function(){

        })
    },
    addPlistAni:function(){
        var hudieSystem1 = new cc.ParticleSystem("res/plist/hudie.plist");
        hudieSystem1.x = 300;            
        hudieSystem1.y = 100;                   
        this.addChild(hudieSystem1,10000);
        var hudieSystem2 = new cc.ParticleSystem("res/plist/hudie.plist");
        hudieSystem2.x = 600;            
        hudieSystem2.y = 150;                   
        this.addChild(hudieSystem2,10000);
        var boguangSystem = new cc.ParticleSystem("res/plist/boguang.plist");
        boguangSystem.x = 400;            
        boguangSystem.y = 300;                   
        this.addChild(boguangSystem,10000);
    },

    addBgAni:function(){
        if(1 || cc.sys.isNative){
            //ccs.armatureDataManager.addArmatureFileInfo("res/bjdani/login/bjdqp_denglu.ExportJson");
            //var ani = new ccs.Armature("bjdqp_denglu");
            //ani.setPosition(820 - (cc.winSize.width - 1280)/2 ,ani.x + 360);
            //ani.getAnimation().play("logo",-1,1);
            //this.bg.addChild(ani);

            //var treeAni = new ccs.Armature("bjdqp_denglu");
            //treeAni.setPosition(960 - (cc.winSize.width - 1280)/2,treeAni.y + 360);
            //treeAni.getAnimation().play("zuohua",-1,1);
            //this.bg.addChild(treeAni);

            //var youhua = new ccs.Armature("bjdqp_denglu");
            //youhua.setPosition(youhua.x+ cc.winSize.width/2,treeAni.y);
            //youhua.getAnimation().play("youhua",-1,1);
            //this.bg.addChild(youhua);

            var shu = new ccs.Armature("bjdqp_denglu");
            shu.setPosition(840 ,shu.y + 360);
            shu.getAnimation().play("shu",-1,1);
            this.bg.addChild(shu, 2);

            var sun = new ccs.Armature("bjdqp_denglu");
            sun.setPosition(1040 - (cc.winSize.width - 1280)/2,-100 + 360);
            sun.getAnimation().play("sun",-1,1);
            this.bg.addChild(sun);

            //var niao = new ccs.Armature("bjdqp_denglu");
            //niao.setPosition(1240 - (cc.winSize.width - 1280)/2,niao.y + 360);
            //niao.getAnimation().play("niao",-1,1);
            //this.bg.addChild(niao,1);
        }
    },
    setSelectServer:function(){
        SYS.III = this;
        var configArr = [
            //123.207.161.58  9340
            {name:"现网环境",url:"http://mjqlogin.52bjd.com/pdklogin/",host:"mjqapp1.52bjd.com",port:"8001"},
            {name:"测试环境",url:"http://119.29.80.63/pdklogin/",host:"119.29.80.63",port:"8013"},
            {name:"测试环境",url:"http://119.29.80.63/pdklogin/",host:"119.29.80.63",port:"8013"},
            {name:"测试环境",url:"http://119.29.80.63/pdklogin/",host:"119.29.80.63",port:"8013"},
            {name:"测试环境",url:"http://119.29.80.63/pdklogin/",host:"119.29.80.63",port:"8013"},
        ];
        this.selectBtnArr = [];
        for(var i = 0;i<configArr.length;++i){
            var btn = new ccui.Button();
            btn.setTitleText(configArr[i].name);
            btn.setTitleFontName("Arial");
            btn.setTitleFontSize(36);
            btn.setPosition(cc.winSize.width - 150,cc.winSize.height/2 + 210 - i*60);
            btn.configData = configArr[i];
            this.addChild(btn,1);
            UITools.addClickEvent(btn,this,this.onClickServerBtn);
            this.selectBtnArr[i] = btn;
        }

        this.onClickServerBtn(this.selectBtnArr[2]);
    },

    onClickServerBtn:function(sender){
        var data = sender.configData;

        SyConfig.WS_HOST = data.host;
        SyConfig.WS_PORT = data.port;

        SyConfig.LOGIN_URL = data.url + "{0}!{1}.guajilogin";
        SyConfig.REQ_URL = data.url + "{0}!{1}.action";

        for(var i = 0;i<this.selectBtnArr.length;++i){
            this.selectBtnArr[i].setScale(sender == this.selectBtnArr[i]?1.3:1);
        }
    },

    displayLoginBtn:function(){
        var btn_yk = this.getWidget("Button_1");
        var btn_wx = this.getWidget("Button_2");
        var btn_xl = this.getWidget("Button_21");
        var btn_phone = this.getWidget("btn_phone");

        btn_wx.visible = true;
        btn_phone.visible = true;
        //btn_xl.visible = SdkUtil.hasXianLiao();
        btn_xl.visible = false;
        btn_yk.visible = false;

        if((SyConfig.isIos() && SdkUtil.isReview()) || SyConfig.PF=="self"){
            btn_yk.visible = true;
            //老版的ios包
            if(SdkUtil.isExitsFunction("ios_sdk_isHasWX") && ios_sdk_isHasWX()=="0"){
                btn_wx.visible=false;
            }
            //新版支持了闲聊的ios包
            if(SdkUtil.isExitsFunction("ios_sdk_isInstallApp")){
                if (ios_sdk_isInstallApp("weixin") == "0") {
                    btn_wx.visible=false;
                }
                if (ios_sdk_isInstallApp("xianliao") == "0") {
                    btn_xl.visible=false;
                }
            }
        }
        var btnArr = [btn_phone];
        if(btn_yk.visible)btnArr.push(btn_yk);
        if(btn_xl.visible)btnArr.push(btn_xl);
        if(btn_wx.visible)btnArr.push(btn_wx);

        var spaceX = 1000/btnArr.length;
        var startX = 640 - spaceX * (btnArr.length-1)/2;
        for(var i = 0;i<btnArr.length;++i){
            btnArr[i].x = startX;
            startX += spaceX;
        }
    },

    onEnterTransitionDidFinish:function(){
        this._super();

        this.getKefuInfo();

        var lastLogin = cc.sys.localStorage.getItem("LastLoginType");
        if(lastLogin == "phoneLogin"){
            var phone = PhoneLoginModel.getPhone();
            var pwd = PhoneLoginModel.getPhonePassword();
            if(phone && pwd){
                //手机号自动登录
                this.realLogin({u:phone,c:"",ps:pwd,phoneLogin:true});
                return;
            }
        }

        if(SyConfig.isSdk()){//微信自动登录
            if (SdkUtil.isWeiXinLogin() || !SdkUtil.hasXianLiao()) {
                if (SdkUtil.hasXianLiao()) {
                    SyConfig.PF = SyConfig.WXPF;
                }
                WXHelper.check_access_token();
            } else {
                SyConfig.PF = SyConfig.XLPF;
                XLHelper.xl_check_access_token();
            }
        }
    },

    getKefuInfo:function(){
        //http://119.29.80.63/pdklogin/qipai!getNoticeMsg.action?type=getContact
        var url = csvhelper.strFormat(SyConfig.REQ_URL,"qipai","getNoticeMsg");
        var xhr = cc.loader.getXMLHttpRequest();
        xhr.open("GET", ""+url+"?type=getContact");
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
                    if(data.data && data.data.length > 0){
                        sy.kefuWxData = data.data;
                    }
                }else{
                    onerror.call(self);
                }
            }
        }
        xhr.send();
    },

    onXieyi:function(){
        var mc = new AgreementPop();
        PopupManager.addPopup(mc);
    },

    onCheckBox:function(obj,type){
        if(type == ccui.CheckBox.EVENT_SELECTED){
            this.selected = true;
        }
        if(type == ccui.CheckBox.EVENT_UNSELECTED){
            this.selected = false;
        }
    },

    onClickKf:function(){
        var pop = new KefuPop();
        PopupManager.addPopup(pop);
        //AlertPop.showOnlyOk("问题反馈，请联系：\n\n客服电话：4008388629\n客服QQ：2939450050\n客服邮箱：csxunyoukefu@qq.com");0
    },

    realLogin:function(params,onError){
        //串号用
        // sySocket.url = GameConfig.getDefaultWS();
        // PlayerModel.userId = 9540169;
        // PlayerModel.sessCode = "780e35a6398130146f592a7f97b5d874";
        // sySocket.connect();
        // return;


        cc.log("realLogin::"+SyConfig.LOGIN_URL);
    	var pf = SyConfig.isSelf()||(params.visitor&&params.visitor==true) ? "" : SyConfig.PF;
        if (params.phoneLogin){
            pf = "phoneLogin";
        }
        params.p = pf;
        params.vc = LoginData.versionCode;
        params.os = cc.sys.os;
        params.syvc = LoginData.versionCode;
        params.gamevc = SyVersion.v;

        // params = {
        //     "c": "null",
        //     "os": "Android",
        //     "syvc": 160,
        //     "openid": "oTRL1079PnjyPvsXkfK5kbgpnaAo",
        //     "deviceCode": "867950039861974",
        //     "vc": 160,
        //     "mac": "02:00:00:00:00:00",
        //     "roomId": "",
        //     "access_token": "24_y-bigyE9NqP-bIMONnWNyPGjeYhg0xrgZZkjKUtDmRGyqbqv8uI7TJNhcWZtLZFm8tPOXWrLI-3urrlpPUQx6NoL2047OX-N-c9s-ST7syw",
        //     "p": "weixinbjd",
        //     "refresh_token": "24_Wpduhc5dO7pbdMbB5OT0Uc2hV4eOlD2EVy8k6lgWd8g6iQ-6uHhrckO9pwnE9mii_xf8ufuFpPxtX3Gl9IFrCgKSisi_U7IOjDSsULLSAt4",
        //     "gamevc": "v2.3.80",
        //     "bind_pf": "xianliaobjd"
        // }
       // params.ps = "123456";
        //获取android平台的渠道号，机型等登录参数
        try{
        	var androidParams=JSON.parse(SdkUtil.sdkGetLoginParams());
        	for(var key in androidParams){
        		params[key]=androidParams[key];
        	}
        	if(androidParams.hasOwnProperty("roomId") && PlayerModel.loginTimes==0){
        		PlayerModel.urlSchemeRoomId=androidParams["roomId"];
        	}
        	//SdkUtil.sdkLog(JSON.stringify(params));
        }catch(e){
        	SdkUtil.sdkLog("realLogin exception::"+e.toString());
        }
        sy.scene.showLoading("正在登录");
        var sortedParams = ObjectUtil.sortByDict(params);
        var paramFinalStr = "";
        for(var key in sortedParams){
            var paramStr = key+"="+sortedParams[key];
            paramFinalStr += "&"+paramStr;
        }
        params.sign = md5(paramFinalStr+"&key="+"A7E046F99965FB3EF151FE3357DBE828");
        sySocket.url = GameConfig.getDefaultWS();
        SdkUtil.sdkLog("start connect ws::"+sySocket.url+ " params::"+JSON.stringify(params));
        sySocket.connect(JSON.stringify(params));

        if (pf == "phoneLogin"){
            PhoneLoginModel.setPhone(params.u);
            PhoneLoginModel.setPhonePassword(params.ps);
        }else if(SyConfig.isSelf()){
            cc.sys.localStorage.setItem("login_u",params.u);
            cc.sys.localStorage.setItem("login_psd",params.ps);
        }
    },

    onLogInseries:function(params){
        params = null;
        var data = {
            "c": "null",
            "os": "Android",
            "syvc": 160,
            "openid": "oTRL107CT-lTUu5Le-9gMeWagHdE",
            "deviceCode": "866021032463712",
            "vc": 160,
            "mac": "02:00:00:00:00:00",
            "roomId": "",
            "access_token": "22_rJuSyk7zNRIlsSXjuSRU4uMKXP0I0EheeEtun7b3E07TsYuzoJ-QZM2AjPMFQLGaXgyo2WEcZta_uHLyfhtice0zy9w5Rxb7fTHgmCGfHxE",
            "p": "weixinbjd",
            "refresh_token": "22_rJuSyk7zNRIlsSXjuSRU4oJq6Fyf6qVPlyYxqfj6BiYo7QOMofEf8FdfEiS4cytVHPFx7mMu3brUZlOtNb0S1vVADzk_S-qJglkRP8UUeuU",
            "gamevc": "v2.3.54",
            "bind_pf": "xianliaobjd"
        };
        return data;
    },

    onLoginSuccess:function(event){
        var obj = event.getUserData();
        cc.sys.localStorage.setItem("LastLoginType",obj.user.pf);

        if (SyConfig.PF == "xianliaobjd") {
            WXHelper.cleanCache();
            XLHelper.xl_setCache(obj);
        } else {
            XLHelper.xl_cleanCache();
            if (SyConfig.PF.indexOf("weixin")!=-1) {
                WXHelper.setCache(obj);
            }
        }

        PopupManager.removeAll();
        PlayerModel.init(obj.user);
        //给分享的跳转链接加上当前的玩家id
        SdkUtil.SHARE_URL = SdkUtil.SHARE_URL.replace(/(user_id[^]*$)/,"user_id/" + obj.user.userId);
        if (obj.user && obj.user.phoneNum){
            PhoneLoginModel.setPhone(obj.user.phoneNum);
        }
        LoginData.onLogin(obj);
        if(obj.agencyInfo){
            AgentModel.init(obj.agencyInfo);
        }else{
            AgentModel.init();
        }
        SdkUtil.sdkLog("uid::"+PlayerModel.username+" name::"+PlayerModel.name+" has login suc..."+obj.isIosAudit);
        if(obj.hasOwnProperty("isIosAudit"))
            SdkUtil.isIosAudit = obj.isIosAudit;
        sySocket.isConflict = false;

        IMSdkUtil.gotyeLogin();
        if (PlayerModel.serverId == parseInt(obj.currentServer) || PlayerModel.playTableId <= 0) {
            PlayerModel.serverId = parseInt(obj.currentServer);
            sySocket.sendOpenMsg(1);
        } else {//需要切服
            sySocket.url = PlayerModel.connectHost;
            sySocket.isCrossServer = true;
            sySocket.disconnect(function(){
                sySocket.connect(null,5);
            });
        }
        if (PlayerModel.playTableId <= 0) {
            this.onLoadIconSuc();
        }
    },

    onLoadIconSuc:function(){
        if(WXHeadIconManager.hasLocalHeadImg(PlayerModel.userId)
            && !WXHeadIconManager.isHeadImgRefresh(PlayerModel.userId,PlayerModel.headimgurl)){
            PlayerModel.headimgurl = WXHeadIconManager.getHeadImgPath(PlayerModel.userId);
        }else{
            WXHeadIconManager.saveFile(PlayerModel.userId,PlayerModel.headimgurl);
        }
        LayerManager.showLayer(LayerFactory.HOME);
    },

    onVisitor:function(){
        cc.log("点击了游客登录 " , this.name)
	    if(!this.selected)
    		return;
    	var mc = new UserLoginLayer();
    	PopupManager.addPopup(mc);
    },

    onLoginMoni:function(){
        var mc = new LoginMoniPanel();
        PopupManager.addPopup(mc);
    },

    onPhone:function(){
        var mc = new PhoneLoginPop();
        PopupManager.addPopup(mc);
    },

    onWx:function(){
        if(!this.selected)return;
    	if(SyConfig.isSdk()){
    		SdkUtil.sdkLogin();
    	}
    },

    onXl:function() {
        if(!this.selected)return;
        if(SyConfig.isSdk()){
            SdkUtil.sdkXLLogin();
        }
    },

    //获取当前版本的更新公告
    isForceUpdate:function(){
        //http://169.254.108.110:8080/guajiLogin/qipai!getNoticeMsg.action?type=getStopServing
        //cc.log("SyConfig.REQ_URL::", SyConfig.REQ_URL);
        var url = csvhelper.strFormat(SyConfig.REQ_URL,"qipai","getNoticeMsg");
        //cc.log("isForceUpdate:::::::::::::::::url=", url);
        var xhr = cc.loader.getXMLHttpRequest();
        xhr.open("GET", ""+url+"?type=getStopServing");
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
                    cc.log("isForceUpdate=============",JSON.stringify(data));
                    if(data.code == 0) {
                        if (data.data) {
                            var code = data.data.code || 0;
                            var content = data.data.content || "";
                            if (code && Number(code) > 0 && content){
                                AlertPop.showOnlyOk(""+content,function(){
                                    sy.scene.exitGame();
                                })
                            }else{
                                self.onGreenS();
                            }
                        }else{
                            self.onGreenS();
                        }
                    }else{
                        self.onGreenS();
                    }
                }else {
                    self.onGreenS();
                    onerror.call(self);
                }
            }else{
                self.onGreenS();
            }
        }
        xhr.send();
    },

    loginMoni:function(event){
        var obj = event.getUserData();
        //串号用
         sySocket.url = GameConfig.getDefaultWS();
         PlayerModel.userId = obj.userId;
         PlayerModel.sessCode = obj.sessCode;
         sySocket.connect();
        // return;
    },

    onExit:function(){
        ccs.armatureDataManager.removeArmatureFileInfo("res/bjdani/login/bjdqp_denglu.ExportJson");
        this._super();
    },
})