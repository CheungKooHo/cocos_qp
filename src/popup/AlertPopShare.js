/**
 * Created by zhoufan on 2016/8/10.
 */
var SharePop = BasePopup.extend({

    ctor: function (shareObject,isActivity) {
        this.shareObject = shareObject;
        this.isActivity = isActivity || false;
        this._super("res/alertPopShare.json");
    },

    selfRender: function () {
        this.btn_pyq = this.getWidget("btn_pyq");
        this.btn_wx = this.getWidget("btn_wx");
        UITools.addClickEvent(this.btn_pyq,this,this.onWx2);
        UITools.addClickEvent(this.btn_wx,this,this.onWx1);
    },

    onWx1:function(){//好友
        this.shareObject.session = 0;
        SdkUtil.sdkFeed(this.shareObject,this.isActivity);
        PopupManager.remove(this);
    },

    onWx2:function(){//朋友圈
        //ShareDailyModel.isFromShareDaily = true;
        this.shareObject.session = 1;
        if (this.isActivity){
            this.shareObject.title = this.shareObject.description;
        }
        SdkUtil.sdkFeed(this.shareObject,this.isActivity);
        PopupManager.remove(this);
    }
});

var ShareDTPop = BasePopup.extend({

    ctor: function (shareObject) {
        this.shareObject = shareObject;
        this._super("res/shareDTPop.json");
    },

    selfRender: function () {
        this.Button_10 = this.getWidget("Button_10");
        this.Button_11 = this.getWidget("Button_11");
        this.Button_12 = this.getWidget("Button_12");
        //this.Button_12.visible = false;
        UITools.addClickEvent(this.Button_10,this,this.onWx1);
        UITools.addClickEvent(this.Button_11,this,this.onWx2);
        UITools.addClickEvent(this.Button_12,this,this.onWx3);
    },

    onWx1:function(){//微信
        this.shareObject.session = 0;
        SdkUtil.sdkFeed(this.shareObject,this.isActivity);
        PopupManager.remove(this);
    },

    onWx2:function(){//钉钉
        this.shareObject.session = 5;
        SdkUtil.sdkFeed(this.shareObject,this.isActivity);
        PopupManager.remove(this);
    },

    onWx3:function(){//闲聊
        this.shareObject.session = 3;
        SdkUtil.sdkFeed(this.shareObject,this.isActivity);
        PopupManager.remove(this);
    }
});
ShareDTPop.show = function(obj){
    //if (SdkUtil.hasDTalk()) {
    //    PopupManager.addPopup(new ShareDTPop(obj))
    //} else {
        SdkUtil.sdkFeed(obj,true);
    //}
}

SharePop.show = function(obj,isActivity){
    if(LoginData.versionCode=="2.0.3"){
       // return FloatLabelUtil.comText("暂未开放");
    }
    //SdkUtil.sdkFeed(obj);
    var mc = new SharePop(obj,isActivity);
    PopupManager.addPopup(mc);
}

var RedPacketSharePop = BasePopup.extend({
    ctor: function (isActivity) {
        this.isActivity = isActivity || false;
        this._super("res/alertPopShare.json");
    },
    selfRender: function () {
        var title = this.getWidget("title");
        title.loadTexture("res/ui/ActivityPop/fenxiang.png")
        this.btn_pyq = this.getWidget("btn_pyq");
        this.btn_wx = this.getWidget("btn_wx");
        UITools.addClickEvent(this.btn_pyq,this,this.onWx2);
        UITools.addClickEvent(this.btn_wx,this,this.onWx1);
    },

    onWx1:function(){//好友

        var obj={};
        obj.tableId = 0;
        obj.userName=PlayerModel.username;
        obj.callURL=SdkUtil.SHARE_URL+'?userId='+encodeURIComponent(PlayerModel.userId);
        var content = ShareDailyModel.getFeedContent();
        obj.title=content;
        obj.pyq=content;
        obj.description=content;
        obj.shareType=1;
        obj.session = 0;
        SdkUtil.sdkFeed(obj,true);
        PopupManager.remove(this);
    },

    onWx2:function(){//朋友圈
        var obj={};
        obj.tableId = 0;
        obj.userName=PlayerModel.username;
        obj.callURL=SdkUtil.SHARE_URL+'?userId='+encodeURIComponent(PlayerModel.userId);
        var content = "";
        obj.title=content;
        obj.pyq=content;
        obj.description=content;
        obj.shareType=0;
        obj.png = "res/feed/feed.jpg";
        obj.session = 1;
        //ShareDailyModel.isFromShareDaily = true;
        //ShareDailyModel.isNewShareDaily = true;

        SdkUtil.sdkFeed(obj,true);


        PopupManager.remove(this);
    }
});

RedPacketSharePop.show = function(isActivity){
    if(LoginData.versionCode=="2.0.3"){
        // return FloatLabelUtil.comText("暂未开放");
    }
    // SdkUtil.sdkFeed(obj);
    var mc = new RedPacketSharePop(isActivity);
    PopupManager.addPopup(mc);
}


//暂时没用到 这部分移到活动里面
var ShareDailyPop = BasePopup.extend({

    ctor: function (shareObject) {
        this.shareObject = shareObject;
        this.shareKAni = null;
        this.AnimationK = null;
        this._super("res/shareDailyPop.json");
    },

    selfRender: function () {
        this.Button_share = this.getWidget("Button_share");

        this.closeBtn = this.getWidget("btn_Close");

        this.mainNoMask = this.getWidget("mainNoMask");

        UITools.addClickEvent(this.Button_share,this,this.onWx1);

        UITools.addClickEvent(this.closeBtn , this, this.onCloseBtn);


    },

    onWx1:function(){//朋友圈
        ShareDailyModel.isFromShareDaily = true;
        this.shareObject.session = 1;
        SdkUtil.sdkFeed(this.shareObject);
        PopupManager.remove(this);
    },

    onInvite:function(){
        var obj={};
        obj.tableId = 0;
        obj.userName=PlayerModel.username;
        obj.callURL=SdkUtil.SHARE_URL+'?userId='+encodeURIComponent(PlayerModel.userId);
        obj.title="快乐玩";
        obj.pyq="正宗邵阳打筒子，炸弹炸的嗨起来！";
        obj.description="正宗邵阳打筒子，炸弹炸的嗨起来！";
        obj.shareType=1;
        SharePop.show(obj);
    },

    showAnimation:function(pngNumber,armatureName,x,y,zOrder,rect) {
        var animate = new AnimateSprite(pngNumber , armatureName , 1/9 , 2 , rect);
        //var animate = new AnimateSprite(plist,armatureName,1/9);
        //var animate = new AnimateSprite("res/plist/"+armatureName+".plist",armatureName,1/num);
        animate.play();
        animate.anchorX=animate.anchorY=0;
        animate.x= x;
        animate.y = y;
        this.mainNoMask.addChild(animate,zOrder);
        return animate

    },

    //showAnimation:function(plist,armatureName,x,y,num,zOrder) {
    //    //this.waterAnimate = new AnimateSprite(10 , "res/plist/waterAnm" , 1/15 , 2 , cc.rect(0 , 0 , 763 , 330));
    //    var animate = new AnimateSprite()
    //    var animate = new AnimateSprite(plist,armatureName,1/9);
    //    //var animate = new AnimateSprite("res/plist/"+armatureName+".plist",armatureName,1/num);
    //    animate.play();
    //    animate.anchorX=animate.anchorY=0;
    //    animate.x= x;
    //    animate.y = y;
    //    this.mainNoMask.addChild(animate,zOrder);
    //    return animate
    //
    //},

    releasePngList:function(pngName , pngNumber){
        if(pngNumber >= 1){
            for(var index = 1 ; index <= pngNumber ; index++){
                this.releasePng(pngName+"_"+index+".png")
            }
        }
    },

    releasePng:function(png){
        var texture = cc.textureCache.getTextureForKey(png);//spriteFrameCache textureCache
        if(texture){
            texture.releaseGLTexture();
            cc.log("UITextureManager.releaseTexture:"+png);
        }
        cc.textureCache.removeTextureForKey(png);
    },

    onClose:function(){

    },


    onCloseBtn:function(){
        PopupManager.remove(this);
    },

});

/**
 * 玩家未分享领钻的情况 才弹出
 */
ShareDailyPop.show = function(){
    Network.loginReq("qipai","share",{action:1},function(data){
        cc.log("onShareDaily::"+JSON.stringify(data));
        ShareDailyModel.isShareToday = data.isShared;
        var obj = {};
        obj.tableId = 0;
        obj.userName = PlayerModel.username;
        obj.callURL = SdkUtil.SHARE_URL+'?userId=' + encodeURIComponent(PlayerModel.userId);
        var content = ShareDailyModel.getFeedContent();
        obj.title = content;
        obj.description = content;
        obj.shareType = 1;
        if (content=="" && SyConfig.hasOwnProperty("HAS_PNG_SHARE")) {//
            obj.shareType = 0;
            obj.png = "res/feed/feed.jpg";
        }
        //cc.log("data.pupup..." , data.popup);
        if(ShareDailyModel.isShareToday == false){//
            PopupManager.removeClassByPopup(ShareDailyPop);
            var mc = new ShareDailyPop(obj);
            PopupManager.addPopup(mc);
        }
    },function(){
        FloatLabelUtil.comText("获取分享数据失败,请重试");
    });

}

var MerryChristmasShare = BasePopup.extend({

    ctor: function (shareObject) {
        this.shareObject = shareObject;
        this._super("res/MerryChristmasShare.json");
    },

    selfRender: function () {
        this.Button_6 = this.getWidget("Button_6");
        this.closeBtn = this.getWidget("btn_Close");

        UITools.addClickEvent(this.Button_6,this,this.onWx1);
        UITools.addClickEvent(this.closeBtn , this, this.onClose);

    },

    onWx1:function(){//朋友圈
        ShareDailyModel.isFromShareDaily = true;
        this.shareObject.session = 1;
        SdkUtil.sdkFeed(this.shareObject);
        PopupManager.remove(this);
    },

    onInvite:function(){
        var obj={};
        obj.tableId = 0;
        obj.userName=PlayerModel.username;
        obj.callURL=SdkUtil.SHARE_URL+'?userId='+encodeURIComponent(PlayerModel.userId);
        obj.title="快乐玩";
        obj.pyq="正宗邵阳打筒子，炸弹炸的嗨起来！";
        obj.description="正宗邵阳打筒子，炸弹炸的嗨起来！";
        obj.shareType=1;
        SharePop.show(obj);
    },

    onClose:function(){
        PopupManager.remove(this);
    },


    changeInvite:function(){
        this.shareView.visible = false;
        this.inviteView.visible = true;
        this.titleBtnInvite.setBright(false);
        this.titleBtnShare.setBright(true);
    },
});

MerryChristmasShare.show = function(){
    Network.loginReq("qipai","share",{action:1},function(data){
        cc.log("MerryChristmasShare::"+JSON.stringify(data));
        ShareDailyModel.isShareToday = data.isShared;
        var obj={};
        obj.tableId = 0;
        obj.userName = PlayerModel.username;
        obj.callURL = SdkUtil.SHARE_URL+'?userId=' + encodeURIComponent(PlayerModel.userId);
        obj.title = "快乐打筒子-玩家数量遥遥领先，成为代理，惊喜等着你！";
        obj.description = "快乐打筒子-玩家数量遥遥领先，成为代理，惊喜等着你！";
        obj.shareType = 1;
        if (SyConfig.hasOwnProperty("HAS_PNG_SHARE")) {
            obj.shareType = 0;
            obj.png = "res/feed/feed.jpg";
        }
        cc.log("data.pupup..." , data.popup);
        if(data.popup && data.popup == 1){//后台告知在活动时间内 才显示
            //var mc = new MerryChristmasShare(obj);
            //PopupManager.addPopup(mc);
        }
    },function(){
        FloatLabelUtil.comText("获取分享数据失败,请重试");
    });

}