/**
 * Created by zhoufan on 2016/7/28.
 */
var YZWDMJBigResultPop = BasePopup.extend({
    user:null,
    ctor: function (data,isDaiKai) {
        this.data = data;
        this.isDaiKai = isDaiKai;
        this._super("res/yzwdmjBigResult.json");
    },

    refreshSingle:function(widget,user){
        widget.visible = true;
        this.user=user;
        ccui.helper.seekWidgetByName(widget,"name").setString(user.name);
        ccui.helper.seekWidgetByName(widget,"id").setString("ID:"+user.userId);

        var birdSeat = this.data.birdSeat || [];
        //var niaoNum = birdSeat[user.seat] || 0;

        var zmCount = 0;
        var jpCount = 0;
        var fpCount = 0;
        var niaoCount = 0;
        if (user.actionCount){
            zmCount = user.actionCount[0] || 0;
            jpCount = user.actionCount[1] || 0;
            fpCount = user.actionCount[2] || 0;
            niaoCount = user.actionCount[3] || 0;

        }

        ccui.helper.seekWidgetByName(widget,"Label_zm").setString(zmCount+"");
        ccui.helper.seekWidgetByName(widget,"Label_zm_0").setString(jpCount+"");
        ccui.helper.seekWidgetByName(widget,"Label_zm_1").setString(fpCount+"");
        ccui.helper.seekWidgetByName(widget,"Label_zm_2").setString(niaoCount+"");

        var pointPanel = ccui.helper.seekWidgetByName(widget,"Panel_point");
        var fontPath = "res/font/font_point_2.fnt";
        var totalPoint = user.totalPoint;
        var png = "res/ui/mj/mjSmallResult/mjSmallResult_6.png";
        if (totalPoint >= 0){
            totalPoint = "+" + totalPoint;
            fontPath = "res/font/font_point_1.fnt";
            png = "res/ui/mj/mjSmallResult/mjSmallResult_5.png";
        }
        widget.setBackGroundImage(png);

        this.Label_point = new cc.LabelBMFont("" + totalPoint,fontPath);
        this.Label_point.x = pointPanel.width/2;
        this.Label_point.y = pointPanel.height/2;
        pointPanel.addChild(this.Label_point);

        var icon = ccui.helper.seekWidgetByName(widget,"icon");
        var defaultimg = "res/ui/mj/mjBigResult/default_m.png";
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
        var Image_fh = ccui.helper.seekWidgetByName(widget,"Image_fh");
        var Image_dyj = ccui.helper.seekWidgetByName(widget,"Image_dyj");
        Image_fh.visible = false;
        Image_dyj.visible = false;
        if (user.zdyj == 1) {
            Image_dyj.visible = true;
        }
        if (user.dfh == 1) {
            Image_fh.visible = true;
        }

        ccui.helper.seekWidgetByName(widget,"Image_credit").visible = false;
        ccui.helper.seekWidgetByName(widget,"Label_credit").setString("");

        if (MJRoomModel.isCreditRoom()){
            var credit = user.winLoseCredit;
            credit = MathUtil.toDecimal(credit/100);
            //ccui.helper.seekWidgetByName(widget,"Label_credit").setString(""+credit);//比赛分
            //ccui.helper.seekWidgetByName(widget,"Label_credit").setString(""+user.ext[10]);//比赛分
            ccui.helper.seekWidgetByName(widget,"Image_credit").visible = true;

            var Label_credit = new cc.LabelBMFont("" + credit,fontPath);
            Label_credit.x = pointPanel.width/2;
            Label_credit.y = -pointPanel.height/2;
            pointPanel.addChild(Label_credit);
        }else{
            pointPanel.y = pointPanel.y - 20
            ccui.helper.seekWidgetByName(widget,"Label_78_2_0").y = ccui.helper.seekWidgetByName(widget,"Label_78_2_0").y-20
        }
    },

    selfRender: function () {
        this.addCustomEvent(SyEvent.SOCKET_OPENED,this,this.onSuc);
        this.addCustomEvent(SyEvent.GET_SERVER_SUC,this,this.onChooseCallBack);
        this.addCustomEvent(SyEvent.NOGET_SERVER_ERR,this,this.onChooseCallBack);


        //版本号
        if(this.getWidget("Label_version")){
            this.getWidget("Label_version").setString(SyVersion.v);
        }

        var btn_start_another = this.getWidget("btn_start_another");
        UITools.addClickEvent(btn_start_another,this,this.qyqStartAnother);

        if (MJRoomModel.roomName){
            var string = "";
            string = MJRoomModel.roomName + "   亲友圈ID：" + ClosingInfoModel.ext[0];
            this.getWidget("Label_roomname").setString(string);
        }else{
            this.getWidget("Label_roomname").visible = false;
            btn_start_another.setVisible(false);
        }
        var jushuStr = MJRoomModel.nowBurCount + "/" + MJRoomModel.totalBurCount;
        this.getWidget("jushu").setString(jushuStr);

        this.getWidget("wanfa_2").setString("永州王钓");

        this.getWidget("roomid").setString("" + MJRoomModel.tableId);

        this.closingPlayers = this.data.closingPlayers;
        var max = 0;
        var min = 0;
        for(var i=0;i<4;i++){
            var seq = i+1;
            this.getWidget("user"+seq).visible = false;
        }
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

        var timeStr = ClosingInfoModel.ext[3];
        this.getWidget("time_2").setString(timeStr);

        var Button_20 = this.getWidget("Button_20");
        UITools.addClickEvent(Button_20,this,this.onShare);
        var Button_21 = this.getWidget("Button_21");
        UITools.addClickEvent(Button_21,this,this.onToHome);

        var Button_fxCard = this.getWidget("Button_fxCard");
        UITools.addClickEvent(Button_fxCard,this,this.onShareCard);
        Button_fxCard.visible = false;
        if(MJRoomModel.tableType == 1 && ClosingInfoModel.groupLogId){//亲友圈房间才可见;
            Button_fxCard.visible = false;
            //var Button_fxCard = UICtor.cBtn("res/ui/mj/mjBigResult/mjBigResult_fxCard.png");
            //Button_20.getParent().addChild(Button_fxCard);
            //Button_fxCard.y =  Button_20.y;
            //UITools.addClickEvent(Button_fxCard,this,this.onShareCard);
            //Button_21.x += 50;
            //Button_20.x +=172 ;
            //Button_fxCard.x = Button_20.x-(Button_21.x-Button_20.x);
        }

        var wfStr = "";
        //if (MJRoomModel.isDouble() && MJRoomModel.renshu == 2){
        //    var dtimes = MJRoomModel.getDoubleNum();
        //    var dScore = MJRoomModel.getDScore();
        //    wfStr = wfStr + "小于"+ dScore +"分" + " 翻" + dtimes + "倍";
        //}
        this.getWidget("Label_double").setString(""+wfStr);


        this.getWidget("Label_score").setString("");
        if (MJRoomModel.isCreditRoom()){
            //赠送分
            //固定赠送 大赢家 10
            //比例赠送 所有赢家 2%
            var giveStr = "";
            var giveType = MJRoomModel.getCreditType();
            var giveWay = MJRoomModel.getCreditWay();
            var giveNum = MJRoomModel.getCreditGiveNum();
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
            this.getWidget("Label_score").setString("底分:"+MJRoomModel.getCreditScore() + "," + giveStr);
        }

        var wanfaStr = "";
        if (ClosingInfoModel.ext){
            if (ClosingInfoModel.ext[4] == MJWanfaType.YZWDMJ){
                wanfaStr = this.getSpecificWanfa(MJRoomModel.intParams);
            }
        }
        this.getWidget("Label_wf").setString("" + wanfaStr);

        if(MJRoomModel.getIsSwitchCoin()){
            var btn_coin_result = this.getWidget("btn_coin_result")
            btn_coin_result.visible = true;
            UITools.addClickEvent(btn_coin_result,this,this.clubCoinResult);
        }else{
            this.getWidget("btn_coin_result").visible = false;
        }
    },

    clubCoinResult:function(){
        cc.log("CLUB_RESULT_COIN3",JSON.stringify(ClosingInfoModel.clubResultCoinData))
        if(!ClosingInfoModel.clubResultCoinData){
            FloatLabelUtil.comText("正在获取游戏数据，请稍后重试");
            return
        }

        for(var i = 0;i < this.closingPlayers.length;i++){
            for(var j = 0;j < ClosingInfoModel.clubResultCoinData.length;j++){
                if(ClosingInfoModel.clubResultCoinData[j].userId == this.closingPlayers[i].userId){
                    ClosingInfoModel.clubResultCoinData[j].name = this.closingPlayers[i].name;
                    ClosingInfoModel.clubResultCoinData[j].icon = this.closingPlayers[i].icon;
                    break;
                }
            }
        }

        var mc = new ClubCoinResultPop(ClosingInfoModel.clubResultCoinData);
        this.addChild(mc,1000);
    },

    //显示具体玩法
    getSpecificWanfa:function(wanfaList) {

        var infoArr = [];
        infoArr.push("永州王钓");
        if(wanfaList[3] == 1)infoArr.push("两片");
        if(wanfaList[4] == 1)infoArr.push("抢杠胡");
        if(wanfaList[5] == 1)infoArr.push("七对可胡");
        if(wanfaList[6] == 1)infoArr.push("庄闲分");
        if(wanfaList[8] == 1)infoArr.push("碰碰胡");
        if(wanfaList[9] == 1)infoArr.push("底分2分");
        if(wanfaList[10]<10) {
            infoArr.push(wanfaList[10] + "码");
        }else{
            infoArr.push("数字码");
        }
        if (wanfaList[16]==0){
            infoArr.push("不飘分");
        }else if(wanfaList[16]<4){
            infoArr.push("飘"+wanfaList[16]+"分");
        }else if(wanfaList[16]==4){
            infoArr.push("自由下飘");
        }else{
            infoArr.push("首局定飘");
        }

        if (wanfaList[7] == 2 && wanfaList[13] == 1){
            infoArr.push("低于" + wanfaList[15] + "分翻" + wanfaList[14] +"倍");
        }

        return infoArr.join(" ");
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
            LayerManager.showLayer(LayerFactory.HOME);
            PopupManager.remove(this);
            PopupManager.removeAll();

            var isClubRoom =  (MJRoomModel.tableType ==1);
            if(isClubRoom ){
                PopupManager.removeClassByPopup(PyqHall);
                var mc = new PyqHall();//先不弹出吧
                PopupManager.addPopup(mc);
            }
        }
    },

    //再来一局
    qyqStartAnother:function(){
        var wanfa = MJRoomModel.wanfa;
        var groupId = ClosingInfoModel.ext[0];
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
