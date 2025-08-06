/**
 * Created by Administrator on 2016/6/27.
 */
var MatchAwardPop = BasePopup.extend({

    ctor: function (message) {
        this.message = message;
        this._super("res/matchAwardPop.json");
    },
    //JS: ComResponder::{"code":107,"params":[2,1,2,9],"strParams":["金币*3000,积分*10"]

    selfRender: function () {
        //清空数据
        MatchAwardModel.setData(null);
        var params = this.message.params;
        var strParams  = this.message.strParams;
        //排名
        var myRank = params[2];
        var Panel_19 = this.getWidget("Panel_19");
        var rank = new cc.LabelBMFont(myRank+"","res/font/font_award_1.fnt");
        rank.x = Panel_19.width/2;
        rank.y = Panel_19.height/2+20;
        Panel_19.addChild(rank);
        //JS: ComResponder::{"code":107,"params":[2,1,2,9],"strParams":["金币*3000,积分*10"]
        //奖励
        var Image_15 = this.getWidget("Image_15");
        var Label_16 = this.getWidget("Label_16");
        var p = strParams[0].split(",");
        //for(var i=0;i<p.length;i++) {
        var v = p[0].split("*");
        var name = v[0];
        var num = v[1] || "";
        if(name == "现金"){
            Image_15.loadTexture("res/ui/dtz/match/award/award_4.png");
        }else if(name == "钻石"){
            Image_15.loadTexture("res/ui/dtz/match/award/award_5.png");
        }else if(name == "金币"){
            Image_15.loadTexture("res/ui/dtz/match/award/award_3.png");
        }else if(name == "话费"){
            Image_15.loadTexture("res/ui/dtz/match/award/award_13.png");
        }else if(name == "红包"){
            Image_15.loadTexture("res/ui/dtz/match/award/award_14.png");
        }
        Label_16.setString("x"+num);

        // }

        var armatureName = "hallAM15";
        var armatureJson = "res/plist/match/"+armatureName+".ExportJson";
        ccs.armatureDataManager.addArmatureFileInfo(armatureJson);
        var armature = new ccs.Armature(armatureName);
        armature.x = 640;
        armature.y = 488;
        armature.anchorX = armature.anchorY = 0.5;
        this.root.addChild(armature,0);
        armature.getAnimation().play(armatureName, -1, 1);


        this.Image_ewm = this.getWidget("Image_ewm");
        this.Image_word = this.getWidget("Image_word");
        this.Image_logo = this.getWidget("Image_logo");
        this.showDownUrl(false);



        var Button_17 = this.getWidget("Button_17");
        var Button_18 = this.getWidget("Button_18");
        UITools.addClickEvent(Button_17,this,this.onConfirm);
        UITools.addClickEvent(Button_18,this,this.onShare);

    },


    showDownUrl:function(_bool){
        this.Image_ewm.visible = _bool;
        this.Image_word.visible = _bool;
        this.Image_logo.visible = _bool;
    },


    onConfirm:function(){
        PopupManager.removeAll();
        LayerManager.showLayer(LayerFactory.HOME);
    },


    onShare:function(){
        this.showDownUrl(true);
        var self = this;
        var winSize = cc.director.getWinSize();
        var texture = new cc.RenderTexture(winSize.width, winSize.height);
        if (!texture)
            return;
        texture.anchorX = 0;
        texture.anchorY = 0;
        texture.begin();
        this.visit();
        texture.end();
        texture.saveToFile("share_pdk.jpg", cc.IMAGE_FORMAT_JPEG, false);

        var obj={};
        obj.tableId=0;
        obj.userName=PlayerModel.username;
        obj.callURL=SdkUtil.SHARE_URL+'?userName='+encodeURIComponent(PlayerModel.name);
        obj.title="";
        obj.description="";
        obj.shareType=0;
        sy.scene.showLoading("正在截取屏幕");
        setTimeout(function(){
            self.showDownUrl(false);
            sy.scene.hideLoading();
            SharePop.show(obj);
        },500);
    }


});