/**
 * Created by hjc on 2017/1/10.
 */
var DaiKaiRoomPop = BasePopup.extend({
    localTime:0,
    TAG_DAIKAINUM:99,
    ctor:function(){
        this.localTime = 0;
        this._super("res/daiKaiRoom.json");
    },

    selfRender:function(){
        this.label_no = this.getWidget("Label_noData");
        this.Panel_9 = this.getWidget("Panel_9");
        this.Image_7 = this.getWidget("Image_7");
        this.btn_1 = this.getWidget("btn_1");
        this.btn_1.temp = 1;
        UITools.addClickEvent(this.btn_1,this,this.onClick);
        this.btn_2 = this.getWidget("btn_2");
        this.btn_2.temp = 2;
        UITools.addClickEvent(this.btn_2,this,this.onClick);
        this.btn_refresh = this.getWidget("Button_refresh");
        this.btn_refresh.temp = 1;
        this.btn_refresh.setTag(100);
        UITools.addClickEvent(this.btn_refresh,this,this.onClick);
        this.panel1 = this.getWidget("Panel_1");

        this.panel2 = this.getWidget("Panel_2");
        this.setRoomBtn(1);
        this.addCustomEvent(SyEvent.DAIKAI_REFRESH,this,this.onDelRoom);
    },

    setRoomBtn:function(temp){
        for(var i=1;i<=2;i++){
            if(i==temp){
                this["btn_"+i].setBright(true);
                this["panel"+i].visible = true;
            }else{
                this["btn_"+i].setBright(false);
                this["panel"+i].visible = false;
            }
        }
        var info = (temp==1) ? dkRecordModel.data.daikaiList : dkRecordModel.data.playLogMap.playLog;

        var list = ccui.helper.seekWidgetByName(this["panel"+temp],"ListView_55");
        this.Panel_9.visible = this.Image_7.visible = (temp==1) ? true : false;
        this.btn_refresh.visible = (temp==1) ? true : false;
        //this.Panel_9.setString("已代开："+info.length);

        if(this.Panel_9.getChildByTag(this.TAG_DAIKAINUM))
            this.Panel_9.removeChildByTag(this.TAG_DAIKAINUM);
        var label = new cc.LabelBMFont(info.length+"/10","res/font/daikai_font_1.fnt");
        label.x = this.Panel_9.width/2;
        label.y = 18;
        this.Panel_9.addChild(label,1,this.TAG_DAIKAINUM);

        this.label_no.visible = (info.length>0) ? false : true;
        list.removeAllItems();
        for(var i=0;i<info.length;i++){
            var cell = new DaiKaiRoomCell();
            cell.setData(info[i],temp);
            list.pushBackCustomItem(cell);
        }
    },

    onClick:function(obj){
        var temp = parseInt(obj.temp);
        this.btn_refresh.visible = (temp==1) ? true : false;
        this.onRequestInfo(temp,obj.getTag());
    },

    onDelRoom:function(){
        this.onRequestInfo(1,100);
    },

    onRequestInfo:function(temp,tag){
        var self = this;
        var str = (temp==1) ? {actionType:6,funcType:1} : {actionType:6,funcType:2,logType:0,logId:0,wanfaType:0};
        Network.loginReq("qipai","exec",str, function(data){
            if(tag==100){
                FloatLabelUtil.comText("数据更新成功！");
            }
            if(data.daikaiList){
                dkRecordModel.setList(data.daikaiList);
                self.setRoomBtn(temp);
            }else if(data.playLogMap){
                dkRecordModel.setLog(data.playLogMap);
                self.setRoomBtn(temp);
            }else{
                self.setRoomBtn(temp);
            }
        });
    },
});

var DaiKaiRoomCell = ccui.Widget.extend({
    data:null,
    id:null,
    ctor:function(){
        this._super();
        this.setContentSize(1106,90);
        var Panel_56=this.Panel_56= UICtor.cPanel(cc.size(1168,99),cc.color(150,200,255),0);
        Panel_56.setAnchorPoint(cc.p(0,0));
        //Panel_56.setBackGroundImage("res/ui/images/com_d_004.png");
        Panel_56.setPosition(0,0);
        var Label_roomId=this.Label_roomId= UICtor.cLabel("100000",30,cc.size(0,0),cc.color("ff6f18"),1,1);
        Label_roomId.setPosition(68,50);
        Panel_56.addChild(Label_roomId);
        var Label_wanfa_0=this.Label_wanfa_0= UICtor.cLabel("",24,cc.size(230,80),cc.color("ff6f18"),1,1);
        Label_wanfa_0.setPosition(330,77);
        Panel_56.addChild(Label_wanfa_0);
        var Label_wanfa_1=this.Label_wanfa_1= UICtor.cLabel("",24,cc.size(230,80),cc.color("ff6f18"),1,1);
        Label_wanfa_1.setPosition(330,50);
        Panel_56.addChild(Label_wanfa_1);
        var Label_wanfa_2=this.Label_wanfa_2= UICtor.cLabel("",24,cc.size(230,80),cc.color("ff6f18"),1,1);
        Label_wanfa_2.setPosition(330,23);
        Panel_56.addChild(Label_wanfa_2);
        var Label_renshu=this.Label_renshu= UICtor.cLabel("0/6",30,cc.size(230,80),cc.color("ff6f18"),1,1);
        Label_renshu.setPosition(600,40);
        Panel_56.addChild(Label_renshu);

        for(var i=1;i<=6;i++) {
            this["Panel_"+i]= UICtor.cPanel(cc.size(120,120),cc.color(150,200,255),100);
            this["Panel_"+i].setAnchorPoint(cc.p(0,0));
            this["Panel_"+i].setPosition(397+95*(i-1),0);
            this["Panel_"+i].setScale(0.9);
            this["Panel_"+i].setBackGroundColorType(0);
            this["Panel_"+i].visible = false;
            Panel_56.addChild(this["Panel_"+i]);
            this["Image_10_"+i]= UICtor.cImg("res/ui/dtz/images/default_m.png");
            this["Image_10_"+i].setPosition(60,65);
            this["Panel_"+i].addChild(this["Image_10_"+i]);
            this["Label_name_"+i]= UICtor.cLabel("Text Label",20,cc.size(0,0),cc.color("ff6f18"),0,0);
            this["Label_name_"+i].setPosition(60,14);
            this["Panel_"+i].addChild(this["Label_name_"+i]);
            this["Image_55_"+i] = UICtor.cImg("res/ui/daiKaiRoom/img_78.png");
            this["Image_55_"+i].setPosition(cc.p(6+this["Image_10_"+i].getAnchorPointInPoints().x, 0+this["Image_10_"+i].getAnchorPointInPoints().y));
            this["Image_55_"+i].visible = false;
            this["Image_10_"+i].addChild(this["Image_55_"+i]);

        }

        var imag_1=this.imag_1= UICtor.cImg("res/ui/daiKaiRoom/imag_1.png");
        imag_1.setPosition(Panel_56.width/2,0);
        imag_1.setScale9Enabled(true);
        imag_1.setCapInsets(cc.rect(0,0,482,1));
        imag_1.setContentSize(1190,2)
        Panel_56.addChild(imag_1);
        var btn_point=this.btn_point= UICtor.cBtn("res/ui/daiKaiRoom/btn_6.png");//积分
        btn_point.setPosition(820,45);
        btn_point.setTouchEnabled(true);
        Panel_56.addChild(btn_point);
        var btn_record=this.btn_record= UICtor.cBtn("res/ui/daiKaiRoom/btn_5.png");//回放
        btn_record.setPosition(1030,45);
        btn_record.setTouchEnabled(true);
        Panel_56.addChild(btn_record);
        var btn_invite=this.btn_invite= UICtor.cBtn("res/ui/daiKaiRoom/btn_invite.png");//邀请好友
        btn_invite.setPosition(820,45);
        btn_invite.setTouchEnabled(true);
        Panel_56.addChild(btn_invite);
        this.addChild(Panel_56);
        var btn_del=this.btn_del= UICtor.cBtn("res/ui/daiKaiRoom/btn_del.png");//解散
        btn_del.setPosition(1030,45);
        btn_del.setTouchEnabled(true);
        Panel_56.addChild(btn_del);
        UITools.addClickEvent(this.btn_invite,this,this.onInvite);
        UITools.addClickEvent(this.btn_del,this,this.onDel);
        UITools.addClickEvent(this.btn_point,this,this.onPoint);
        UITools.addClickEvent(this.btn_record,this,this.onRecord);
    },

    setData:function(data,id){
        this.data = data;
        this.id = id;
        this.Label_roomId.setString(data.tableId);
        this.getWanfaInfo();
        var createPara = this.data.createPara.split(",");
        cc.log("createPara::::::::::"+createPara);
        this.Label_renshu.setString("0/"+createPara[7]);
        if(id==1){
            this.btn_invite.visible = true;
            this.btn_del.visible = true;
            this.btn_record.visible = false;
            this.btn_point.visible = false;
        }else{
            this.Label_roomId.setColor(cc.color("8b8b8b"));
            this.Label_wanfa_0.setColor(cc.color("8b8b8b"));
            this.Label_wanfa_1.setColor(cc.color("8b8b8b"));
            this.Label_wanfa_2.setColor(cc.color("8b8b8b"));
            this.Label_renshu.setColor(cc.color("8b8b8b"));
            this.btn_record.visible = true;
            this.btn_point.visible = true;
            this.btn_invite.visible = false;
            this.btn_del.visible= false;
        }
        if(data.playerMsg.length>0){
            this.showPlayerInfo(data.playerMsg);
        }
    },

    showPlayerInfo:function(user){
        var maxPoint = 0;
        var win = 0;
        var wanfa = this.data.playType;
        var renshu = this.data.createPara.split(",")[7];
        if(renshu==user.length)
            this.btn_invite.visible = false;
        for(var i=0;i<user.length;i++){
            if(user[i].totalPoint>maxPoint){
                maxPoint = user[i].totalPoint;
                win = i;
            }
        }
        this.Label_renshu.setString(user.length+"/"+renshu);
    },

    onInvite:function(){
        var wanfa = this.data.playType;
        var tableId = this.data.tableId;
        var createPara = this.data.createPara.split(",");
        var obj={};
        obj.tableId=tableId;
        obj.userId=PlayerModel.userId;
        obj.userName=PlayerModel.username;
        obj.callURL=SdkUtil.SHARE_URL+'?num='+tableId+'&userId='+encodeURIComponent(PlayerModel.userId);
        obj.title=this.getWanfaName(wanfa)+'   房号:'+tableId;
        if(this.isBelongToDTZWanfa(wanfa)){
            var wanfaStr = "";
            if(wanfa == 15 || wanfa == 16){
                wanfaStr = this.getPDKWanfa(createPara);
            }else if(this.isDTZWanfa(wanfa)){
                wanfaStr = this.getDTZWanfa(createPara);
            }else if(wanfa == PHZGameTypeModel.SYZP || wanfa == PHZGameTypeModel.SYBP){
                wanfaStr = this.getPHZWanfa(createPara);
            }else if(wanfa == 131){
                wanfaStr = this.getBBTWanfa(createPara);
            }
            obj.description = wanfaStr;
            //cc.log("obj.description::"+obj.description);
        }
        obj.shareType=1;
        SdkUtil.sdkFeed(obj);
    },

    getDTZWanfa:function(wanfaList){
        cc.log("wanfaList"+wanfaList);
        var gameStr = "打筒子 ";
        var costStr = "";
        if(wanfaList[2] == 1){
            costStr = "AA支付 ";
        }else if(wanfaList[2] == 2){
            costStr = "房主支付 ";
        }else if(wanfaList[2] == 3){
            costStr = "群主支付 ";
        }
        var maxScoreStr = wanfaList[3] + "分 ";

        var renshuNum = 0;
        if (wanfaList[1] == 117 || wanfaList[1] == 118){
            renshuNum = 2;
        }else if(wanfaList[1] == 115 || wanfaList[1] == 116) {
            renshuNum = 3;
        }else if(wanfaList[1] == 113 || wanfaList[1] == 114) {
            renshuNum = 4;
        }
        var renshuStr = renshuNum + "人 ";

        var fuPaiStr = "四副牌 ";
        if (wanfaList[1] == 113 || wanfaList[1] == 115 || wanfaList[1] == 117){
            fuPaiStr = "三副牌 ";
        }
        var rewardStr = "";
        if (wanfaList[4] > 0){
            rewardStr = "奖励分" + wanfaList[4] + " ";
        }

        var darkNUmStr = "";
        if(wanfaList[5] == 1){
            if(wanfaList[1] == 113 || wanfaList[1] == 115 || wanfaList[1] == 117){
                if(renshuNum == 4){
                    darkNUmStr = "暗8张底牌 "
                }else if(renshuNum == 3){
                    darkNUmStr = "暗9张底牌 "
                }else if(renshuNum == 2){
                    darkNUmStr = "暗66张底牌 "
                }
            }else{
                //四副牌
                if(renshuNum == 4){
                    darkNUmStr = "暗8张底牌 "
                }else if(renshuNum == 3){
                    darkNUmStr = "暗52张底牌 "
                }else if(renshuNum == 2){
                    darkNUmStr = "暗96张底牌 "
                }
            }
        }
        var showCardStr = "";
        if(wanfaList[8] == 1){
            if(renshuNum == 4){
                showCardStr = "记牌器 "
            }else {
                showCardStr = "显示剩余牌 "
            }
        }

        var darkStr = "";
        if(wanfaList[9] == 1){
            darkStr = "随机出头 ";
        }

        var ypbdStr = "";
        if(wanfaList[10] == 1 && renshuNum == 2){
            ypbdStr = "有牌必打 ";
        }
        var wtzStr = "";
        if(wanfaList[11] == 1 && !DTZRoomModel.is4FuPai(wanfaList[1]) ){
            wtzStr = "王筒子 ";
        }

        var wanfaStr =  csvhelper.strFormat("{0}{1}{2}{3}{4}{5}{6}{7}{8}{9}{10}",gameStr,costStr,renshuStr,maxScoreStr,fuPaiStr,rewardStr,darkNUmStr,showCardStr,darkStr,ypbdStr,wtzStr);
        return wanfaStr;
    },

    getPHZWanfa:function(wanfaList){
        var gameStr = "邵阳字牌 ";
        var limitScoreStr = "";
        var jushuStr = wanfaList[0] + "局 ";
        var lzStr = "";
        var hhhStr = "";
        var hxwfStr = "";
        if (wanfaList[1] == PHZGameTypeModel.SYBP){
            gameStr = "邵阳剥皮 ";
            jushuStr = "局数不限 ";
            if (wanfaList[12] == 1){
                if(wanfaList[10] == 0){
                    limitScoreStr = "不封顶 ";
                }else{
                    limitScoreStr = wanfaList[10] + "息 ";
                }
                lzStr = "连庄 ";
            }else{
                lzStr = "不可连庄 ";
            }

            if (wanfaList[11] == 1){
                hhhStr = "红黑胡 ";
            }
        }else if (wanfaList[1] == PHZGameTypeModel.SYZP){
            hxwfStr = wanfaList[13] + "息1囤"
        }
        var costStr = "";
        if(wanfaList[9] == 1){
            costStr = "AA支付 ";
        }else if(wanfaList[9] == 2){
            costStr = "房主支付 ";
        }else if(wanfaList[9] == 3){
            costStr = "群主支付 ";
        }
        var renshuStr = wanfaList[7] + "人 ";

        var wanfaStr =  csvhelper.strFormat("{0}{1}{2}{3}{4}{5}{6}{7}",gameStr,costStr,renshuStr,jushuStr,hxwfStr,hhhStr,lzStr,limitScoreStr);
        return wanfaStr;
    },

    getBBTWanfa:function(wanfaList){
        cc.log("wanfaList::getBBTWanfa"+wanfaList);
        var gameStr = "半边天炸 ";
        var wskStr ="正510K不分花色 ";
        if(wanfaList[4] == 1){
            wskStr = "正510K分花色 ";
        }
        var kcStr ="";
        if(wanfaList[3] == 1){
            kcStr = "可锤 ";
        }

        var zdStr ="";
        if(wanfaList[5] == 1){
            zdStr = "助徒 ";
        }

        var paishuStr ="";
        if(wanfaList[6] == 1){
            paishuStr = "显示剩余牌数 ";
        }

        var daisanStr ="";
        if(wanfaList[8] == 1){
            daisanStr = "可四带三 ";
        }


        var costStr = "";
        if(wanfaList[2] == 1){
            costStr = "AA支付 ";
        }else if(wanfaList[2] == 2){
            costStr = "房主支付 ";
        }else if(wanfaList[2] == 3){
            costStr = "群主支付 ";
        }

        var jushuStr = wanfaList[0] + "局 ";
        var renshuStr = wanfaList[7] + "人 ";

        var wanfaStr =  csvhelper.strFormat("{0}{1}{2}{3}{4}{5}{6}{7}{8}",gameStr,costStr,jushuStr,renshuStr,wskStr,kcStr,zdStr,paishuStr,daisanStr);
        return wanfaStr;
    },


    getPDKWanfa:function(wanfaList){
        var gameStr = "跑得快 ";
        var costStr = "";
        if(wanfaList[9] == 1){
            costStr = "AA支付 ";
        }else if(wanfaList[9] == 2){
            costStr = "房主支付 ";
        }else if(wanfaList[9] == 3){
            costStr = "群主支付 ";
        }

        var renshuStr = wanfaList[7] + "人 ";

        var jushuStr = wanfaList[0] + "局 ";

        var zhangDesc = wanfaList[1] + "张 ";

        var nameList = [" ","红10(5分) ","红10(10分) ","红10(翻倍) "];
        var hongshiStr = nameList[wanfaList[10]];

        var cardNumStr = "";
        if(wanfaList[8] == 1){
            cardNumStr = "显示剩余牌数 ";
        }

        var heiStr = "";
        if(wanfaList[6] == 1){
            heiStr = "首局必出黑桃三 ";
        }

        var wanfaStr =  csvhelper.strFormat("{0}{1}{2}{3}{4}{5}{6}{7}",gameStr,costStr,renshuStr,jushuStr,zhangDesc,hongshiStr,cardNumStr,heiStr);
        return wanfaStr;
    },

    onDel:function(){
        var tId = this.data.tableId+"";
        sySocket.sendComReqMsg(201,[],[tId]);
    },

    getWanfaName:function(wanfa){
        var name = "未知的玩法";
        if(wanfa==PHZGameTypeModel.SYZP)
            name = "邵阳字牌";
        if(wanfa==PHZGameTypeModel.SYBP)
            name = "邵阳剥皮";
        if(this.isDTZWanfa(wanfa))
            name = "打筒子";
        if(wanfa == 15)
            name = "跑得快";
        if(wanfa == 16)
            name = "跑得快";
        if(wanfa == 31)
            name = "跑胡子";
        if(wanfa == 131)
            name = "半边天炸";
        return name;
    },

    onPoint:function(){
        var wanfa = this.data.playType;
        dkResultModel.init(this.data);
        var reslut = [];
        for(var i=0;i<this.data.resList.length;i++){
            reslut.push(JSON.parse(this.data.resList[i]));
        }
        if(this.data.closingMsg){
            var closingMsg = JSON.parse(this.data.closingMsg);
            ClosingInfoModel.ext = closingMsg.ext;
        }
        if(wanfa == 15 || wanfa == 16){
            var mc = new PDKBigResultPop(reslut,true);
            PopupManager.addPopup(mc,true);
        }else if(this.isDTZWanfa(wanfa)){
            var mc = new DTZBigResultPop(reslut,true);
            PopupManager.addPopup(mc,true);
        }else if(wanfa == PHZGameTypeModel.SYZP || wanfa == PHZGameTypeModel.SYBP){
            var mc = new PHZBigResultPop(reslut,true);
            PopupManager.addPopup(mc,true);
        }else if(wanfa == 131){
            var mc = new BBTBigResultPop(reslut,true);
            PopupManager.addPopup(mc,true);
        }
    },

    onRecord:function(){

        var wanfa = this.data.playType;
        cc.log("this.data" , JSON.stringify(this.data));
        if(wanfa == 1 || wanfa == 2 || wanfa == 3 || wanfa == 4){
            sySocket.sendComReqMsg(14,[2]);
        }else if(wanfa == PHZGameTypeModel.SYZP ||wanfa == PHZGameTypeModel.SYBP){//跑胡子
            PlayerModel.checkRecordType = 4;
            Network.loginReq("qipai","exec",{actionType:6,funcType:2,logType:4,logId:this.data.id,userId:PlayerModel.userId,wanfaType:0}, function(data){
                var mc = new DTZTotalRecordPop(data.playLogMap,true);
                TotalRecordModel.init(data.playLogMap,true);
                PopupManager.open(mc,true);
            });
            //sySocket.sendComReqMsg(14,[4]);
        }else if(wanfa == 15 || wanfa == 16){//跑得快
            PlayerModel.checkRecordType = 1;
            Network.loginReq("qipai","exec",{actionType:6,funcType:2,logType:1,logId:this.data.id,userId:PlayerModel.userId,wanfaType:0}, function(data){
                var mc = new DTZTotalRecordPop(data.playLogMap,true);
                TotalRecordModel.init(data.playLogMap,true);
                PopupManager.open(mc,true);
            });
            //sySocket.sendComReqMsg(14,[1]);
        }else if(wanfa >=20 && wanfa <= 23) {//斗牛
            sySocket.sendComReqMsg(14, [3]);
        }else if(this.isDTZWanfa(wanfa)) {//打筒子
            PlayerModel.checkRecordType = 8;
            Network.loginReq("qipai","exec",{actionType:6,funcType:2,logType:8,logId:this.data.id,userId:PlayerModel.userId,wanfaType:8}, function(data){
                var mc = new DTZTotalRecordPop(data.playLogMap,true);
                TotalRecordModel.init(data.playLogMap,true);
                PopupManager.open(mc,true);
            });
            //sySocket.sendComReqMsg(127, [8]);
            //sySocket.sendComReqMsg(127, [0], this.data.id+"");

        }else if(wanfa == 131){
            PlayerModel.checkRecordType = 10;
            Network.loginReq("qipai","exec",{actionType:6,funcType:2,logType:10,logId:this.data.id,userId:PlayerModel.userId,wanfaType:0}, function(data){
                var mc = new DTZTotalRecordPop(data.playLogMap,true);
                TotalRecordModel.init(data.playLogMap,true);
                PopupManager.open(mc,true);
            });
        }


        //if(this.wanfa == 33 || this.wanfa == 34){
        //    sySocket.sendComReqMsg(14 , [0] , this.data.id + "");
        //}else if(this.wanfa == 15 || this.wanfa == 16){
        //    sySocket.sendComReqMsg(14 , [0] , this.data.id + "");
        //}

    },


    getWanfaInfo:function(){
        var createPara = this.data.createPara.split(",");
        this.wanfa = this.data.playType;
        if( this.isBelongToDTZWanfa(this.wanfa) ){
            var wanfaDesc = this.getWanfaName(this.wanfa);
            var jushuDesc = this.getJushuDesc(createPara);
            var moshiDesc = this.getModeName(createPara);
            var ExDesc = this.getExDesc(createPara);

            this.Label_wanfa_0.setString(wanfaDesc+" " + jushuDesc);
            this.Label_wanfa_1.setString(this.getModeName(createPara)+" ");
            this.Label_wanfa_2.setString(ExDesc);
        }
    },

    getJushuDesc:function(createPara){
        var jushuValue = createPara[0];
        var jushuDesc = ""
        if(this.wanfa == PHZGameTypeModel.SYBP || this.isDTZWanfa(this.wanfa)){
            jushuDesc = "局数不限";
        }else{
            jushuDesc = jushuValue + "局";
        }
        return jushuDesc;
    },

    getExDesc:function(createPara){
        var exValue = 0;
        var exDesc = "";
        if(this.wanfa == PHZGameTypeModel.SYBP ){
            exValue = createPara[10];
            if(exValue > 0){
                exDesc = "连庄上限" + exValue + "分";
            }else{
                exDesc = "连庄上限不封顶";
            }
        }else if(this.wanfa == 15 || this.wanfa == 16){
            var str = "";
            if (createPara[10] == 1){
                str = str + "红10(5分) ";
            }else if (createPara[10] == 2){
                str = str + "红10(10分) ";
            }else if (createPara[10] == 3){
                str = str + "红10(翻倍) ";
            }
            //if (createPara[8] == 1){
            //    str = str + "显示剩余牌数 ";
            //}
            exDesc = exDesc + str;
        }else if(this.isDTZWanfa(this.wanfa)){
            //cc.log("createPara:::"+createPara);
            var str = "";
            str = str + createPara[4] +"奖励分 ";
            exDesc = exDesc + str;
        }else if(this.wanfa = 131){
            var str = "";
            if (createPara[5] == 1){
                str = str + "助陡";
            }
            if (createPara[6] == 1){
                str = str + "显剩牌";
            }
            if (createPara[8] == 1){
                str = str + "可四带三";
            }
            exDesc = exDesc + str;
        }

        return exDesc;
    },

    getModeName:function(createPara){
        var modeValue = 0;
        var modeDesc = "";
        if(this.wanfa == PHZGameTypeModel.SYZP || this.wanfa == PHZGameTypeModel.SYBP){

        }else if(this.isDTZWanfa(this.wanfa)){
            var str = "";
            str = str + createPara[3] + "分 ";
            if (this.wanfa==113||this.wanfa==115||this.wanfa==117)
                str = str + "三副牌 ";
            if (this.wanfa==114||this.wanfa==116||this.wanfa==118)
                str = str + "四副牌 ";
            modeDesc = modeDesc + str;
        }else if(this.wanfa == 15 || this.wanfa == 16){
            var str = "";
            str = str + this.wanfa + "张 ";
            if (createPara[6] == 1)
                str = str + "首局必出黑桃3 ";
            modeDesc = modeDesc + str;
        }else if(this.wanfa == 131){
            var str = "";
            if (createPara[3] == 1)
                str = str + "可锤 ";
            if (createPara[4] == 1){
                str = str + "510K分花色 ";
            }else{
                str = str + "510K不分花色 ";
            }
            modeDesc = modeDesc + str;
        }

        return modeDesc;
    },

    /**
     * 是否是打筒子玩法
     */
    isDTZWanfa:function(wanfa){
        var isDtz = false ;
        if (wanfa >= 113 && wanfa <= 118)
            isDtz = true;
        return isDtz;
    },
    /**
     * 是否是属于打筒子合集的玩法之一
     */
    isBelongToDTZWanfa:function(wanfa){
        if(wanfa == PHZGameTypeModel.SYZP || wanfa == PHZGameTypeModel.SYBP || wanfa == 15 || wanfa == 16 || wanfa == 131 || this.isDTZWanfa(wanfa)){
            return true
        }
        return false;
    },

});