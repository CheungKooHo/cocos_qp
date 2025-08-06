/**
 * Created by cyp on 2019/4/24.
 */
var BjdShareGiftPop = BasePopup.extend({
    ctor:function(){
        this._super("res/alertPopShareGift.json");
    },

    selfRender:function(){
        this.root.setLocalZOrder(1);
        var grayLayer = new cc.LayerColor(cc.color(0,0,0,100));
        this.addChild(grayLayer);

        var shareBtn = this.getWidget("btn_share");
        UITools.addClickEvent(shareBtn,this,this.onClickShareBtn);
    },

    onClickShareBtn:function(){
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
        ShareDailyModel.isFromShareDaily = true;
        ShareDailyModel.isNewShareDaily = true;
        SdkUtil.sdkFeed(obj,true);
        //Network.loginReq("qipai","share",{action:2},function(data){
        //    FloatLabelUtil.comText("分享成功！恭喜您获得：钻石x"+data.diamond+"!");
        //})
    }
});
