/**
 * Created by zhoufan on 2016/6/30.
 */
var PDKBigResultPop = BasePopup.extend({
    user:null,
    ctor: function (data,isDaiKai) {
        this.data = data;
        this.isDaiKai = isDaiKai || false;
        this._super("res/pdkBigResult.json");
    },

    refreshSingle:function(widget,user){
        this.user=user;
        var namestr = UITools.truncateLabel(user.name,5);
        ccui.helper.seekWidgetByName(widget,"n").setString(namestr);
        ccui.helper.seekWidgetByName(widget,"u").setString(""+user.userId);

        //ccui.helper.seekWidgetByName(widget,"Image_credit").visible = false;
        ccui.helper.seekWidgetByName(widget,"Label_credit").setString("");//比赛分
        var pointTotal = ccui.helper.seekWidgetByName(widget,"pointTotal");

        //var pointMax = ccui.helper.seekWidgetByName(widget,"pointMax");
        //var label = new cc.LabelBMFont(user.maxPoint+"","res/font/font_res_huang.fnt");
        //label.x = pointMax.width/2;
        //label.y = pointMax.height/2+7;
        //pointMax.addChild(label);
        var bomb = ccui.helper.seekWidgetByName(widget,"bomb");
        var label = new cc.LabelBMFont(user.totalBoom+"","res/font/font_res_brown.fnt");
        label.x = bomb.width/2;
        label.y = bomb.height/2;
        bomb.addChild(label);
        var winlose = ccui.helper.seekWidgetByName(widget,"winlose");
        label = new cc.LabelBMFont(user.winCount+"胜"+user.lostCount+"负","res/font/font_res_brown.fnt");
        label.x = winlose.width/2;
        label.y = winlose.height/2;
        winlose.addChild(label);
        var fnt = "res/font/dn_bigResult_font_1.fnt";
        if(parseInt(user.totalPoint)<0)
            fnt = "res/font/dn_bigResult_font_2.fnt";
        label = new cc.LabelBMFont(user.totalPoint+"",fnt);
        label.x = pointTotal.width/2;
        label.y = pointTotal.height/2+1;
        pointTotal.addChild(label);

        if (PDKRoomModel.isCreditRoom()){
            widget.loadTexture("res/ui/pdk/pdkBigResult/pdkBigResult_credit_4.png")
            label.x = pointTotal.width/2;
            label.y = pointTotal.height/2+23;
            var credit = user.ext[10];
            credit = MathUtil.toDecimal(credit/100);
            //ccui.helper.seekWidgetByName(widget,"Label_credit").setString(""+credit);//比赛分
            //ccui.helper.seekWidgetByName(widget,"Image_credit").visible = true;

            var Label_credit = new cc.LabelBMFont("" + credit,fnt);
            Label_credit.x = pointTotal.width/2;
            Label_credit.y = pointTotal.height/2-22;
            pointTotal.addChild(Label_credit);
        }

        //ccui.helper.seekWidgetByName(widget,"dyj").visible = (user.dyj==1);
        var icon = ccui.helper.seekWidgetByName(widget,"icon");
        var defaultimg = "res/ui/dtz/dtzCom/default_m.png" ;
        if(icon.getChildByTag(345))
            icon.removeChildByTag(345);
        //var sprite = new cc.Sprite(defaultimg);
        //sprite.x = 41;
        //sprite.y = 42;
        //icon.addChild(sprite,5,345);
        //var sten = new cc.Sprite("res/ui/pdk/pdkHome/testIcon.png");
        var sprite = new cc.Sprite(defaultimg);
        sprite.x = 42;
        sprite.y = 42;
        sprite.setScale(0.95);

        icon.addChild(sprite,5,345);
        //user.icon = "http://wx.qlogo.cn/mmopen/25FRchib0VdkrX8DkibFVoO7jAQhMc9pbroy4P2iaROShWibjMFERmpzAKQFeEKCTdYKOQkV8kvqEW09mwaicohwiaxOKUGp3sKjc8/0";
        if(user.icon){
            cc.loader.loadImg(user.icon, {width: 252, height: 252}, function (error, img) {
                if (!error) {
                    sprite.setTexture(img);
                    //sprite.scale=0.8;
                }
            });
        }

        if(user.ext[12] > 0){
            var img = new cc.Sprite("res/ui/phz/phz_niao.png");
            img.setPosition(icon.width - 10,10);
            icon.addChild(img,20);
        }

        var sexIcon = ccui.helper.seekWidgetByName(widget,"sex");
        if(user.sex == 1){
            sexIcon.loadTexture("res/ui/pdk/pdkBigResult/pdkHome_14.png")
        }else{
            sexIcon.loadTexture("res/ui/pdk/pdkBigResult/pdkHome_15.png")
        }

        if(user.userId == ClosingInfoModel.ext[1]){
            var fangzhu = new cc.Sprite("res/ui/pdk/pdkSmallResult/fangzhu.png");
            fangzhu.anchorX=fangzhu.anchorY=0;
            fangzhu.x = -19;fangzhu.y=21;
            icon.addChild(fangzhu,10);
        }

        //增加最高分和最低分的显示
        var MaxOrMin = ccui.helper.seekWidgetByName(widget,"MaxOrMin");
        cc.log("user.totalPoin ， this.maxPoint , this.minPoint" , user.totalPoint , this.maxPoint , this.minPoint);
        if(user.totalPoint == this.maxPoint){ // && this.maxPoint != 0
            MaxOrMin.visible = true;
            MaxOrMin.loadTexture("res/ui/pdk/pdkBigResult/pdkBigResult_2.png");
        }else if(user.totalPoint == this.minPoint){
            MaxOrMin.visible = true;
            MaxOrMin.loadTexture("res/ui/pdk/pdkBigResult/pdkBigResult_1.png");
        }

    },

    selfRender: function () {

        this.addCustomEvent(SyEvent.SOCKET_OPENED,this,this.onSuc);
        this.addCustomEvent(SyEvent.GET_SERVER_SUC,this,this.onChooseCallBack);
        this.addCustomEvent(SyEvent.NOGET_SERVER_ERR,this,this.onChooseCallBack);

        // cc.log("pdk bigResult selfRender...");
        //if(this.data.match){
        //	sySocket.sendComReqMsg(15,[],"");
        //}else{
        // cc.log("pdk bigResult selfRender...2");
        // cc.log("this.data",JSON.stringify(this.data));
        var max = 0;
        var min = 65535;
        for(var i=0;i<this.data.length;i++){
            var d = this.data[i];
            if(d.totalPoint >= max)
                max = d.totalPoint;
            if(d.totalPoint <= min)
                min = d.totalPoint;
        }
        this.maxPoint = max;
        this.minPoint = min;
        for(var i=0;i<this.data.length;i++){
            var d = this.data[i];
            d.dyj = 0;
            if(d.totalPoint == max)
                d.dyj = 1;
            this.refreshSingle(this.getWidget("player"+(i+1)),this.data[i]);
        }
        for(;i<3;i++){
            this.getWidget("player"+(i+1)).visible = false;
            //var widget = this.getWidget("player"+(i+1));
            //ccui.helper.seekWidgetByName(widget,"n").visible = false;
            //ccui.helper.seekWidgetByName(widget,"u").visible = false;
            //ccui.helper.seekWidgetByName(widget,"dyj").visible = false;
        }
        var Button_20 = this.getWidget("btnfx");
        UITools.addClickEvent(Button_20,this,this.onShare);
        var Button_21 = this.getWidget("btnok");
        UITools.addClickEvent(Button_21,this,this.onToHome);

        var btn_start_another = this.getWidget("btn_start_another");
        UITools.addClickEvent(btn_start_another,this,this.qyqStartAnother);

        if (PDKRoomModel.roomName){
            this.getWidget("Label_roomname").setString(PDKRoomModel.roomName);
        }else{
            this.getWidget("Label_roomname").visible = false;
            btn_start_another.setVisible(false);
        }
        //显示部分房间信息
        var wanfaDesc = "";
        var zhifuDesc = "";
        var renshuDesc = "";
        var hongshiDesc = "";


        var tableDesc = "";
        var timeDesc = "";
        if (this.isDaiKai) {
            var createPara = dkResultModel.data.createPara.split(",");
            var nameList = ["","红10(5分)","红10(10分)","红10(翻倍)"];
            wanfaDesc = createPara[1]+"张";
            zhifuDesc = createPara[9] ? "AA支付" : "房主支付";
            renshuDesc = createPara[7] + "人";
            hongshiDesc = nameList[createPara[10]];
            tableDesc = dkResultModel.data.tableId;
            timeDesc = dkResultModel.data.time;
        }else{
            if(PDKRoomModel.isWanfa15()){
                wanfaDesc = "15张玩法";
            }else if(PDKRoomModel.isWanfa16()){
                wanfaDesc = "16张玩法";
            }
            zhifuDesc = "房主支付";
            if (PDKRoomModel.getCostFangShi() == 1){
                zhifuDesc = "AA支付";
            }else if (PDKRoomModel.getCostFangShi() == 3) {
                zhifuDesc = "群主支付";
            }
            renshuDesc = PDKRoomModel.renshu + "人";
            hongshiDesc = PDKRoomModel.getHongShiName();
            tableDesc = ClosingInfoModel.ext[0];
            timeDesc = ClosingInfoModel.ext[2];
            if (PDKRoomModel.intParams[29] == 0){
                this.getWidget("Label_zdbkc").setString("炸弹不可拆"); 
            }
        }
        this.getWidget("Label_wanfa").setString(wanfaDesc);
        this.getWidget("Label_renshu").setString(renshuDesc);
        // this.getWidget("Label_time").setString(timeDesc);
        this.getWidget("Label_pay").setString(zhifuDesc);
        this.getWidget("Label_version").setString(SyVersion.v);
        this.getWidget("Label_hongshi").setString(hongshiDesc);


        var elements = [];
        elements.push(RichLabelVo.createTextVo("房号:",cc.color("7D2E00"),24));
        elements.push(RichLabelVo.createTextVo(tableDesc+"  ",cc.color("ff6f18"),24));
        elements.push(RichLabelVo.createTextVo("时间:",cc.color("7D2E00"),24));
        elements.push(RichLabelVo.createTextVo(timeDesc+"  ",cc.color("ff6f18"),24));
        var richLabel = new RichLabel(cc.size(1118,0),3);
        richLabel.setLabelString(elements);
        richLabel.x = richLabel.y =10;
        this.getWidget("Panel_22").addChild(richLabel);


        //俱乐部房间图片标识
        var tableType = 0;
        tableType = ClosingInfoModel.ext[5];
        this.Image_jlbRoom = this.getWidget("Image_jlbRoom");
        this.Image_jlbRoom.visible = false;
        if (PDKRoomModel.isClubRoom(tableType)){
            this.Image_jlbRoom.visible = true;
        }

        //显示俱乐部ID
        var clubIdLabel = this.getWidget("Label_clubId");
        clubIdLabel.setString("");
        var clubId = ClosingInfoModel.ext[12] || 0;
        if (clubId){
            clubIdLabel.setString("亲友圈ID:"+clubId);
        }

        //}

        this.getWidget("Label_score").setString("");
        if (PDKRoomModel.isCreditRoom()){
            //赠送分
            //固定赠送 大赢家 10
            //比例赠送 所有赢家 2%
            var giveStr = "";
            var giveType = PDKRoomModel.getCreditType();
            var giveWay = PDKRoomModel.getCreditWay();
            var giveNum = PDKRoomModel.getCreditGiveNum();
            if (giveType == 1){
                giveStr = giveStr + "固定赠送,";
            }else{
                giveStr = giveStr + "比例赠送,";
            }
            if (giveWay == 1){
                giveStr = giveStr + "大赢家,";
            }else{
                giveStr = giveStr + "所有赢家,";
            }
            if (giveType == 1){
                giveStr = giveStr + giveNum;
            }else{
                giveStr = giveStr + giveNum + "%";
            }
            this.getWidget("Label_score").setString("底分:"+PDKRoomModel.getCreditScore() + "," + giveStr);
        }

        var wfStr = "";

        if(PDKRoomModel.intParams[28] > 0){
            wfStr = "打鸟" + PDKRoomModel.intParams[28] + "分 ";
        }

        if (PDKRoomModel.isDouble()){
            var dtimes = PDKRoomModel.getDoubleNum();
            var dScore = PDKRoomModel.getDScore();
            wfStr = wfStr + "小于"+ dScore +"分" + " 翻" + dtimes + "倍";
        }

        this.getWidget("Label_wanfa2").setString(""+wfStr);
        var Button_fxCard = this.getWidget("Button_fxCard");
        Button_fxCard.visible = false;
        UITools.addClickEvent(Button_fxCard,this,this.onShareCard);
        if( PDKRoomModel.tableType == 1&&ClosingInfoModel.groupLogId){//亲友圈房间才可见;
            Button_fxCard.visible = false;
            Button_fxCard.scaleX= 0.9;
            Button_21.scaleX= 0.9;
            Button_20.scaleX= 0.9;
        }else{
            //Button_21.x= 386+640;
            //Button_20.x= 0+640;
        }

        if(PDKRoomModel.getIsSwitchCoin()){
            var btn_coin_result = this.getWidget("btn_coin_result")
            btn_coin_result.visible = true;
            UITools.addClickEvent(btn_coin_result,this,this.clubCoinResult);
        }else{
            this.getWidget("btn_coin_result").visible = false;
        }
    },
    onShareCard:function() {
        this.shareCard(PDKRoomModel, this.data, ClosingInfoModel.groupLogId);
    },

    clubCoinResult:function(){
        cc.log("CLUB_RESULT_COIN3",JSON.stringify(ClosingInfoModel.clubResultCoinData))
        if(!ClosingInfoModel.clubResultCoinData){
            FloatLabelUtil.comText("正在获取游戏数据，请稍后重试");
            return
        }

        for(var i = 0;i < this.data.length;i++){
            for(var j = 0;j < ClosingInfoModel.clubResultCoinData.length;j++){
                if(ClosingInfoModel.clubResultCoinData[j].userId == this.data[i].userId){
                    ClosingInfoModel.clubResultCoinData[j].name = this.data[i].name;
                    ClosingInfoModel.clubResultCoinData[j].icon = this.data[i].icon;
                    break;
                }
            }
        }

        var mc = new ClubCoinResultPop(ClosingInfoModel.clubResultCoinData);
        this.addChild(mc,1000);
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
        obj.tableId=PDKRoomModel.tableId;
        obj.userName=PlayerModel.username;
        obj.callURL=SdkUtil.SHARE_URL+'?userName='+encodeURIComponent(PlayerModel.name);
        obj.title="跑得快   房号:"+PDKRoomModel.tableId;
        obj.description="我已开好房间,纯技术实力的对决,一起跑得快！";
        obj.shareType=0;
        sy.scene.showLoading("正在截取屏幕");
        setTimeout(function(){
            sy.scene.hideLoading();
            //SharePop.show(obj);
            ShareDTPop.show(obj);
        },500);
    },

    onToHome:function(){
        LayerManager.showLayer(LayerFactory.HOME);
        PopupManager.remove(this);
        PopupManager.removeAll();
        var isClubRoom =  (PDKRoomModel.tableType ==1);
        if(isClubRoom ){
            PopupManager.removeClassByPopup(PyqHall);
            var mc = new PyqHall();//先不弹出吧
            PopupManager.addPopup(mc);
        }
    },

    //再来一局
    qyqStartAnother:function(){
        var wanfa = PDKRoomModel.wanfa;
        var groupId = ClosingInfoModel.ext[12];
        var modeId = 0;

        var clubLocalList = UITools.getLocalJsonItem("Club_Local_Data");
        for(var j = 0 ; j < clubLocalList.length; j++){
            if (groupId == clubLocalList[j].clickId){
                modeId = clubLocalList[j].bagModeId;
            }
        }
        cc.log("============qyqStartAnother============",groupId,modeId);
        if(groupId > 0 && modeId > 0){
            this.clickStartAnother = true;
            this.groupId = groupId;
            this.modeId = modeId;
            sySocket.sendComReqMsg(29 , [parseInt(wanfa)] , ["0",modeId+"",groupId+""]);
        }else{
            FloatLabelUtil.comText("未找到对应包厢ID,请返回大厅");
        }
    },

    onChooseCallBack:function(event){
        var status = event.getUserData();
        if(status == ServerUtil.GET_SERVER_ERROR){
            sy.scene.hideLoading();
            FloatLabelUtil.comText("切服失败");
        }else if(status == ServerUtil.NO_NEED_CHANGE_SOCKET){
            this.onSuc();
        }
    },

    onSuc:function(){
        sy.scene.hideLoading();
        if(this.clickStartAnother){
            this.clickStartAnother = false;
            if (PlayerModel.clubTableId == 0){
                sySocket.sendComReqMsg(1, [],[this.groupId+"",1 + "","1",this.modeId+""]);
            }else{
                sySocket.sendComReqMsg(2,[parseInt(PlayerModel.clubTableId),1,1,0,Number(this.groupId)],[this.modeId+""]);
            }
        }
    },
});
