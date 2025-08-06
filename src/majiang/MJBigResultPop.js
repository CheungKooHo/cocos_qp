/**
 * Created by zhoufan on 2016/7/28.
 */
var MJBigResultPop = BasePopup.extend({
    user:null,
    ctor: function (data,isDaiKai) {
        this.data = data;
        this.isDaiKai = isDaiKai;
      /*  this.data = [
                     {"userId":"-100","zdyj":1,"name":"test-100",icon:"http://wx.qlogo.cn/mmopen/25FRchib0VdkrX8DkibFVoO7jAQhMc9pbroy4P2iaROShWibjMFERmpzAKQFeEKCTdYKOQkV8kvqEW09mwaicohwiaxOKUGp3sKjc8/0","leftCardNum":6,"point":-6,"totalPoint":9,"boom":null,"winCount":2,"lostCount":1,"maxPoint":10,"totalBoom":1,"cards":[211,310,110,406,306,206],"seat":2},
             {"userId":"0","name":"test0","leftCardNum":0,"point":12,"totalPoint":8,"boom":null,"winCount":3,"lostCount":1,"maxPoint":9,"totalBoom":2,"cards":[],"seat":1},
             {"userId":"-101","name":"test-101","leftCardNum":6,"point":-6,"totalPoint":10,"boom":null,"winCount":5,"lostCount":1,"maxPoint":8,"totalBoom":0,"cards":[209,408,108,407,207,107],"seat":3}
        ]
        ClosingInfoModel.ext=[1,1,1,1,1,1,1,1];
        */
        
        this._super("res/mjBigResult.json");
    },

    refreshSingle:function(widget,user){
        this.user=user;
        ccui.helper.seekWidgetByName(widget,"name").setString(user.name);
        ccui.helper.seekWidgetByName(widget,"id").setString("ID:"+user.userId);
        ccui.helper.seekWidgetByName(widget,"df").setString("底分:"+ClosingInfoModel.ext[19]);
        //var pointMax = ccui.helper.seekWidgetByName(widget,"point");//p1胡牌次数
        //var fnt = user.totalPoint>0 ? "res/font/font_mj2.fnt" : "res/font/font_mj1.fnt";
        //var label = new cc.LabelBMFont(user.totalPoint+"",fnt);
        //label.x = pointMax.width/2;
        //label.y = pointMax.height/2;
        //pointMax.addChild(label);

        ccui.helper.seekWidgetByName(widget,"Label_zm").setString(user.zmCount+"");
        ccui.helper.seekWidgetByName(widget,"Label_zm_0").setString(user.jpCount+"");
        ccui.helper.seekWidgetByName(widget,"Label_zm_1").setString(user.fpCount+"");
        ccui.helper.seekWidgetByName(widget,"Label_zm_2").setString(user.totalFan+"");
        ccui.helper.seekWidgetByName(widget,"Label_zm_2_3").setString(user.totalPoint+"");
        ccui.helper.seekWidgetByName(widget,"Label_df").setString(user.totalPoint*ClosingInfoModel.ext[19]);
        //if(user.sex == 1) {
        //    ccui.helper.seekWidgetByName(widget,"Image_32").loadTexture("res/ui/gansu_mj/mjBigResult/mjBigResult_11.png");
        //}
        var icon = ccui.helper.seekWidgetByName(widget,"icon");
        var defaultimg = "res/ui/gansu_mj/common/default_m.png";
        if(icon.getChildByTag(345))
            icon.removeChildByTag(345);
        var sprite = new cc.Sprite(defaultimg);
        sprite.x = 40;
        sprite.y = 40;
        icon.addChild(sprite,5,345);
        if(user.icon){
            cc.loader.loadImg(user.icon, {width: 78, height: 78}, function (error, img) {
                if (!error) {
                    sprite.setTexture(img);
                    sprite.x = 40;
                    sprite.y = 40;
                }
            });
        }
        if (user.zdyj == 1) {
            var zdyj = new cc.Sprite("res/ui/gansu_mj/mjBigResult/mjBigResult_19.png");
            zdyj.anchorX=zdyj.anchorY=0;
            zdyj.x = 265;
            zdyj.y = 4;
            icon.addChild(zdyj,10);
            widget.setBackGroundImage("res/ui/gansu_mj/mjBigResult/mjBigResult_16.png");
        }
        if (user.dfh == 1) {
            var zdyj = new cc.Sprite("res/ui/gansu_mj/mjBigResult/mjBigResult_18.png");
            zdyj.anchorX=zdyj.anchorY=0;
            zdyj.x = 265;
            zdyj.y = 4;
            icon.addChild(zdyj,10);
        }
    },

    selfRender: function () {
        this.getWidget("Label_v").setString(SyVersion.v);
        this.closingPlayers = this.data.closingPlayers;
        var max = 0;
        var min = 0;
        for(var i=0;i<this.closingPlayers.length;i++){
            var user = this.closingPlayers[i];
            if(user.totalPoint >= max)
                max = user.totalPoint;
            if(user.totalPoint <= min)
                min = user.totalPoint;
        }
        for(var i=0;i<this.closingPlayers.length;i++){
            var seq = i+1;
            var user = this.closingPlayers[i];
            if (user.totalPoint == max) {
                user.zdyj = 1;
            }
            if (user.totalPoint == min) {
                user.dfh = 1;
            }
            this.refreshSingle(this.getWidget("user"+seq),user);
        }
        //var elements = [];
        //elements.push(RichLabelVo.createTextVo("局数:",cc.color("6D462F"),24));
        //elements.push(RichLabelVo.createTextVo(ClosingInfoModel.ext[9]+"",cc.color(236,92,29),24));
        //var richLabel = new RichLabel(cc.size(100,0),3);
        //richLabel.setLabelString(elements);
        //richLabel.x = richLabel.y =0;
        //this.getWidget("Panel_js").addChild(richLabel);
        //elements.length=0;
        //elements.push(RichLabelVo.createTextVo("房号:",cc.color("6D462F"),24));
        //elements.push(RichLabelVo.createTextVo(ClosingInfoModel.ext[0]+"",cc.color(236,92,29),24));
        //richLabel = new RichLabel(cc.size(180,0),3);
        //richLabel.setLabelString(elements);
        //richLabel.x = richLabel.y =0;
        //this.getWidget("Panel_fh").addChild(richLabel);
        this.getWidget("Label_fh").setString("房号:"+ClosingInfoModel.ext[0]);
        //elements.length=0;
        //elements.push(RichLabelVo.createTextVo("时间:",cc.color("6D462F"),24));
        var timeStr = ClosingInfoModel.ext[2];
        //elements.push(RichLabelVo.createTextVo(timeStr.substring(0,timeStr.length-3)+"",cc.color(236,92,29),24));
        //richLabel = new RichLabel(cc.size(300,0),3);
        //richLabel.setLabelString(elements);
        //richLabel.x = richLabel.y =0;
        //this.getWidget("Panel_sj").addChild(richLabel);
        this.getWidget("Label_sj").setString(timeStr.substring(0,timeStr.length-3));
        ////var ext4 = ClosingInfoModel.ext[4];
        //if(this.isDaiKai){
        //    this.getWidget("ext1").setString("房号 "+dkResultModel.data.tableId);
        //    this.getWidget("ext2").setString(csvhelper.strFormat("跑得快 {0}张",dkResultModel.data.playType));
        //    this.getWidget("ext3").setString(dkResultModel.data.time);
        //}else{
        //    this.getWidget("ext1").setString("房号 "+ClosingInfoModel.ext[0]);
        //    this.getWidget("ext2").setString(csvhelper.strFormat("点炮包三家 小鸟飞蛋 {0} ",MJRoomModel.getFengName(ClosingInfoModel.ext[10])));
        //    this.getWidget("ext3").setString(ClosingInfoModel.ext[2]);
        //}
        //var max = 0;
        //var omax = 0;
        //for(var i=0;i<this.data.length;i++){
        //    var d = this.data[i];
        //    if(d.lostCount >= max)
        //        max = d.lostCount;
        //    if(d.totalPoint >= omax)
        //        omax = d.totalPoint;
        //}
        //for(var i=0;i<this.data.length;i++){
        //    var d = this.data[i];
        //    d.dyj = 0;
        //    d.zdyj = 0;
        //    if(max>0&&d.lostCount == max)
        //        d.dyj = 1;
        //    if(d.totalPoint == omax)
        //        d.zdyj = 1;
        //    this.refreshSingle(this.getWidget("user"+(i+1)),this.data[i]);
        //}
        var Button_20 = this.getWidget("Button_20");
        UITools.addClickEvent(Button_20,this,this.onShare);
        var Button_21 = this.getWidget("Button_21");
        UITools.addClickEvent(Button_21,this,this.onToHome);
        if(MJRoomModel.tableType == 1){//亲友圈房间才可见;
            var Button_fxCard = UICtor.cBtn("res/ui/gansu_mj/mjBigResult/mjBigResult_fxCard.png");
            Button_20.getParent().addChild(Button_fxCard);
            Button_fxCard.y =  Button_20.y;
            UITools.addClickEvent(Button_fxCard,this,this.onShareCard);
            Button_21.x += 50;
            Button_20.x +=172 ;
            Button_fxCard.x = Button_20.x-(Button_21.x-Button_20.x);
        }
    },

    onShareCard:function() {
        this.shareCard(MJRoomModel, PlayerModel, ClosingInfoModel.groupLogId);
    },

    /**
     * 分享战报
     */
    onShare:function(){
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
        var tableId = (this.isDaiKai) ? dkResultModel.data.tableId : MJRoomModel.tableId;
        obj.tableId=MJRoomModel.tableId;
        obj.userName=PlayerModel.username;
        obj.callURL=SdkUtil.SHARE_URL+'?num='+MJRoomModel.tableId+'userName='+encodeURIComponent(PlayerModel.name);
        obj.title='麻将   房号:'+MJRoomModel.tableId;
        obj.description="我已开好房间，【麻将】三缺一，就等你了！";
        obj.shareType=0;
        sy.scene.showLoading("正在截取屏幕");
        setTimeout(function(){
        	sy.scene.hideLoading();
            ShareDTPop.show(obj);
        },500);
    },

    onToHome:function(){
        if(this.isDaiKai){
            dkRecordModel.isShowRecord = false;
            PopupManager.remove(this);
        }else{
            LayerManager.showLayer(LayerFactory.MJ_HOME);
            PopupManager.remove(this);
            PopupManager.removeAll();
        }
    }
});
