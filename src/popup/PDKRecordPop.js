/**
 * Created by Administrator on 2016/6/27.
 */

var BBTRecordPop = BasePopup.extend({
	ctor: function (data,isDaiKai) {
		this.data = data;
		this.isDaiKai = isDaiKai || false;
		this._super("res/bbtrecordDetail.json");
	},

	selfRender: function () {
		//显示选中的那一栏信息

		this.getWidget("Label_14").setString(PDKClickRecordModel.roomId);
		this.getWidget("Label_15").setString(PDKClickRecordModel.times);

		//显示index
		cc.log("PDKClickRecordModel.tIndex..." , PDKClickRecordModel.index);
		this.ImageWin = this.getWidget("ImageWin");
		this.totalMsg = this.getWidget("totalMsg");
		var labelIndex = new cc.LabelBMFont( PDKClickRecordModel.index + "", "res/font/font_res_dn1.fnt");
		labelIndex.x = this.ImageWin.x;
		labelIndex.y = this.ImageWin.y;
		this.totalMsg.addChild(labelIndex);

		for (var index = 1; index <= PDKClickRecordModel.playData.length; index++) {
			var curPlayer = PDKClickRecordModel.playData[index - 1];
			this.getWidget("name_" + index).setString(curPlayer.name);
			this.getWidget("id_" + index).setString("ID:"+curPlayer.userId);
			this.getWidget("Label_Score" + index).setString("总分:" + curPlayer.totalPoint);
		}

		if(PDKClickRecordModel.playData.length == 2){
			this.getWidget("name_" + 3).visible = false;
			this.getWidget("id_" + 3).visible = false;
			this.getWidget("Label_Score" + 3).visible = false;
		}

		this.list = this.getWidget("ListView_6");
		var playLog = this.data.playLog;
		for(var i=0;i<playLog.length;i++){
			var item = new PDKRecordCell(playLog[i].playerMsg.length,this.isDaiKai);
			item.setData(playLog[i]);
			this.list.pushBackCustomItem(item);
		}

		//this.shareBtn = this.getWidget("Button_Share");
		this.returnBtn = this.getWidget("Button_Back");
		UITools.addClickEvent(this.returnBtn, this, this.onToHome);
	},

	onToHome: function () {
		LayerManager.showLayer(LayerFactory.HOME);
		PopupManager.remove(this);
		PopupManager.removeAll();
	},

});

var PDKRecordPop = BasePopup.extend({
	ctor: function (data,isDaiKai) {
		this.data = data;
		this.isDaiKai = isDaiKai || false;
		this._super("res/PDKrecordDetail.json");
	},

	selfRender: function () {
		//显示选中的那一栏信息

		this.getWidget("Label_14").setString(PDKClickRecordModel.roomId);
		this.getWidget("Label_15").setString(PDKClickRecordModel.times);

		//显示index
		cc.log("PDKClickRecordModel.tIndex..." , PDKClickRecordModel.index);
		this.ImageWin = this.getWidget("ImageWin");
		this.totalMsg = this.getWidget("totalMsg");
		var labelIndex = new cc.LabelBMFont( PDKClickRecordModel.index + "", "res/font/font_res_dn1.fnt");
		labelIndex.x = this.ImageWin.x;
		labelIndex.y = this.ImageWin.y;
		this.totalMsg.addChild(labelIndex);

		for (var index = 1; index <= PDKClickRecordModel.playData.length; index++) {
			var curPlayer = PDKClickRecordModel.playData[index - 1];
			this.getWidget("name_" + index).setString(curPlayer.name);
			this.getWidget("id_" + index).setString("ID:"+curPlayer.userId);
			this.getWidget("Label_Score" + index).setString("总分:" + curPlayer.totalPoint);
		}

		if(PDKClickRecordModel.playData.length == 2){
			this.getWidget("name_" + 3).visible = false;
			this.getWidget("id_" + 3).visible = false;
			this.getWidget("Label_Score" + 3).visible = false;
		}

		this.list = this.getWidget("ListView_6");
		var playLog = this.data.playLog;
		for(var i=0;i<playLog.length;i++){
			var item = new PDKRecordCell(playLog[i].playerMsg.length,this.isDaiKai);
			item.setData(playLog[i]);
			this.list.pushBackCustomItem(item);
		}

		//this.shareBtn = this.getWidget("Button_Share");
		this.returnBtn = this.getWidget("Button_Back");
		UITools.addClickEvent(this.returnBtn, this, this.onToHome);
	},

	onToHome: function () {
		LayerManager.showLayer(LayerFactory.HOME);
		PopupManager.remove(this);
		PopupManager.removeAll();
	},

});

var PDKRecordCell = ccui.Widget.extend({
	data:null,
    ctor:function(renLength,isDaiKai){
    	this._super();
		this.isDaiKai = isDaiKai || false;
		this.renLength = renLength;
    	this.setContentSize(1138,90);

		var Panel_7=this.Panel_7= UICtor.cPanel(cc.size(1159,141),cc.color(225,205,176),0);
		Panel_7.setAnchorPoint(cc.p(0,0));
		Panel_7.setPosition(0,0);
		var Label_Round=this.Label_Round= UICtor.cLabel("第一局",28,cc.size(0,0),cc.color(129,49,0),1,1);
		Label_Round.setPosition(82,48);
		Label_Round.setLocalZOrder(1);
		Panel_7.addChild(Label_Round);
		var Label_Time=this.Label_Time= UICtor.cLabel("2016-05-15 12:00",25,cc.size(0,0),cc.color(129,49,0),1,1);
		Label_Time.setPosition(288,50);
		Label_Time.setLocalZOrder(1);
		Panel_7.addChild(Label_Time);
		var PanelWin=this.PanelWin= UICtor.cPanel(cc.size(1138,90),cc.color(225,205,176),255);
		PanelWin.setAnchorPoint(cc.p(0,0));
		PanelWin.setPosition(1,1);
		Panel_7.addChild(PanelWin);
		var PanelLoss=this.PanelLoss= UICtor.cPanel(cc.size(1138,90),cc.color(240,224,200),255);
		PanelLoss.setAnchorPoint(cc.p(0,0));
		PanelLoss.setPosition(1,1);
		Panel_7.addChild(PanelLoss);
		var Button_9=this.Button_9= UICtor.cBtn("res/ui/pdk/PDKrecordSmall/seeBack.png");
		Button_9.setPosition(1037,44);
		PanelLoss.addChild(Button_9);
		var Label_Score=this.Label_Score= UICtor.cLabel("积分",30,cc.size(0,0),cc.color(255,111,24),1,1);
		Label_Score.setPosition(741,47);
		Label_Score.setLocalZOrder(1);
		Panel_7.addChild(Label_Score);
		var Label_ScoreValue=this.Label_ScoreValue= UICtor.cLabel("",20,cc.size(0,0),cc.color(255,255,255),0,0);
		Label_ScoreValue.setPosition(847,49);
		Panel_7.addChild(Label_ScoreValue);

		this.Button_9.setTouchEnabled(true);
    	this.addChild(Panel_7);
    },

    setData:function(data){
    	this.data = data;
/*		this.Label_8.setString("房号："+data.tableId);*/
		this.Label_Round.setString("第"+data.playCount+"局");
		this.Label_Time.setString(data.time.substr(0,16));
		for(var i=1;i<=this.renLength;i++){
			var pdata = data.playerMsg[i-1];
/*			this["p"+i+"_l1"].setString(pdata.name);
			this["p"+i+"_l2"].setString("本局："+pdata.point);
			this["p"+i+"_l3"].setString("累计："+pdata.totalPoint);*/
			cc.log("point totalpoint :" , pdata.point , pdata.totalPoint);
		}

		var score = data.playerMsg[0].point;
		var sign = score >= 0? "+" : "";
		var lableFnt = score >= 0 ? "res/font/dn_bigResult_font_1.fnt" : "res/font/greeNum_0.fnt";
		var label = new cc.LabelBMFont(sign + score + "", lableFnt);
		label.x = this.Label_ScoreValue.width / 2;
		label.y = this.Label_ScoreValue.height / 2;
		label.scale = 0.8;
		this.Label_ScoreValue.addChild(label);

		UITools.addClickEvent(this.Button_9,this,this.onHuiFang);
    },

    onHuiFang:function(){
		sy.scene.hideLoading();
		for(var i=0;i<PopupManager.popupList.length;i++){
			if(PopupManager.popupList[i]["constructor"] == DTZTotalRecordPop){
				TotalRecordModel.isShowRecord = true;
			}else if(PopupManager.popupList[i]["constructor"] == PDKRecordPop){
				RecordModel.isShowRecord = true;
			}
		}
		PopupManager.removeAll();
    	if(this.data.playType == 15 || this.data.playType == 16){
    		PlayBackModel.init(this.data);
    		LayerManager.showLayer(LayerFactory.SEEPLAYBACK);
    		var layer = LayerManager.getLayer(LayerFactory.SEEPLAYBACK);
    		layer.initData();
    	}else if(this.data.playType == 31){
    		//cc.log("this.data::"+JSON.stringify(this.data));
			PHZRePlayModel.init(this.data);
			LayerManager.showLayer(LayerFactory.PHZ_REPLAY);
			var layer = LayerManager.getLayer(LayerFactory.PHZ_REPLAY);
			layer.initData();
    	}else if(this.data.playType==20 || this.data.playType == 21 ||this.data.playType==22 || this.data.playType == 23 ){
			DNReplayModel.init(this.data);
			var layerName = LayerFactory.DN_REPLAY;
			if(DNReplayModel.players.length>5)
				layerName = LayerFactory.DN_REPLAY_MORE;
			LayerManager.showLayer(layerName);
			var layer = LayerManager.getLayer(layerName);
			layer.initData();
		}else if(this.data.playType==131){
			cc.log("131this.data::"+JSON.stringify(this.data));
			BBTPlayBackModel.init(this.data);
			LayerManager.showLayer(LayerFactory.BBTSEEPLAYBACK);
			var layer = LayerManager.getLayer(LayerFactory.BBTSEEPLAYBACK);
			layer.initData();
		}
		else{
    		//return FloatLabelUtil.comText("暂未开放");
            MJReplayModel.init(this.data);
            LayerManager.showLayer(LayerFactory.MJ_REPLAY);
			var layer = LayerManager.getLayer(LayerFactory.MJ_REPLAY);
            layer.initData();
    	}
    }
});

var PDKTotalRecordCell = ccui.Widget.extend({
	id:null,
	wanfa:null,
	renLength:null,
	ctor:function(renLength,isDaiKai,tableLogs){
		this.renLength = renLength;
		this.isDaiKai = isDaiKai || false;
		this.tableLogs = tableLogs || false;
		this._super();
		this.setContentSize(1149,183);

		var Panel_22=this.Panel_22= UICtor.cPanel(cc.size(1149,183),cc.color(150,200,255),0);
		Panel_22.setAnchorPoint(cc.p(0,0));
		Panel_22.setPosition(0,0);
		var Panel_7=this.Panel_7= UICtor.cPanel(cc.size(1149,183),cc.color(150,200,255),0);
		Panel_7.setAnchorPoint(cc.p(0,0));
		Panel_7.setPosition(0,0);
		Panel_7.setBackGroundImage("res/ui/pdk/PDKrecordDetail/recordIcon.png");
		Panel_22.addChild(Panel_7);
		var ImageWin=this.ImageWin= UICtor.cImg("res/ui/dtz/dtztotalRecordCell/win.png");
		ImageWin.setPosition(44,93);
		Panel_7.addChild(ImageWin);
		var Label_8=this.Label_8= UICtor.cLabel("999999",28,cc.size(0,0),cc.color(129,49,0),1,1);
		Label_8.setPosition(158,90);
		Panel_7.addChild(Label_8);
		var Label_5=this.Label_5= UICtor.cLabel("2016-05-15 12:00",25,cc.size(140,80),cc.color(129,49,0),1,1);
		Label_5.setPosition(304,88);
		Panel_7.addChild(Label_5);
		var name_1=this.name_1= UICtor.cLabel("金三胖",30,cc.size(120,35),cc.color(255,111,24),1,1);
		name_1.setPosition(465,135);
		Panel_7.addChild(name_1);
		var name_2=this.name_2= UICtor.cLabel("金四胖",30,cc.size(120,35),cc.color(255,111,24),1,1);
		name_2.setPosition(670,135);
		Panel_7.addChild(name_2);
		var name_3=this.name_3= UICtor.cLabel("金五胖",30,cc.size(120,35),cc.color(255,111,24),1,1);
		name_3.setPosition(883,135);
		Panel_7.addChild(name_3);
		var id_1=this.id_1= UICtor.cLabel("id:",20,cc.size(180,35),cc.color(255,111,24),1,1);
		id_1.setPosition(465,95);
		Panel_7.addChild(id_1);
		var id_2=this.id_2= UICtor.cLabel("id:",20,cc.size(180,35),cc.color(255,111,24),1,1);
		id_2.setPosition(670,95);
		Panel_7.addChild(id_2);
		var id_3=this.id_3= UICtor.cLabel("id:",20,cc.size(180,35),cc.color(255,111,24),1,1);
		id_3.setPosition(883,95);
		Panel_7.addChild(id_3);
		var ImageLoss=this.ImageLoss= UICtor.cImg("res/ui/dtz/dtztotalRecordCell/loss.png");
		ImageLoss.setPosition(48,93);
		Panel_7.addChild(ImageLoss);
		var Button_Share=this.Button_Share= UICtor.cBtn("res/ui/dtz/dtztotalRecordCell/detail.png");
		Button_Share.setPosition(1059,134);
		Panel_7.addChild(Button_Share);
		var Button_Detail=this.Button_Detail= UICtor.cBtn("res/ui/dtz/dtztotalRecordCell/share.png");
		Button_Detail.setPosition(1062,45);
		Panel_7.addChild(Button_Detail);
		var Label_Score1=this.Label_Score1= UICtor.cLabel("Text Label",20,cc.size(0,0),cc.color(129,49,0),0,0);
		Label_Score1.setPosition(467,58);
		Panel_7.addChild(Label_Score1);
		var Label_Score2=this.Label_Score2= UICtor.cLabel("Text Label",20,cc.size(0,0),cc.color(129,49,0),0,0);
		Label_Score2.setPosition(671,58);
		Panel_7.addChild(Label_Score2);
		var Label_Score3=this.Label_Score3= UICtor.cLabel("Text Label",20,cc.size(0,0),cc.color(129,49,0),0,0);
		Label_Score3.setPosition(882,58);
		Panel_7.addChild(Label_Score3);

		//俱乐部房间标识
		var Image_jlbRoom=this.Image_jlbRoom= UICtor.cImg("res/ui/dtz/images/jlbroom.png");
		Image_jlbRoom.setPosition(158,140);
		Panel_7.addChild(Image_jlbRoom);
		Image_jlbRoom.visible = false;


		this.Panel_7.setTouchEnabled(true);
		this.addChild(Panel_22);
	},

	setData:function(des , index , id , i){
		this.shareObject = {des: des, index: index, id: id, renLength: this.renLength , i : i};
		this.wanfa = des.playType;
		this.playerData = des.playerMsg;
		this.id = id;

		//显示index
		this.tIndex = i + 1;
		var labelIndex = new cc.LabelBMFont( this.tIndex + "", "res/font/font_res_dn1.fnt");
		labelIndex.x = this.ImageWin.x;
		labelIndex.y = this.ImageWin.y;
		this.Panel_7.addChild(labelIndex);


		//俱乐部房间标识
		var closingMsg = JSON.parse(des.closingMsg);
		//cc.log("closingMsg:::::::"+JSON.stringify(closingMsg));
		var tableType = 0;
		tableType = closingMsg.ext[5];
		if (PDKRoomModel.isClubRoom(tableType)){
			this.Image_jlbRoom.visible = true;
		}


		//胜负的显示策略后期再顶
		this.ImageWin.visible = false;
		this.ImageLoss.visible = false;

		for(var i = 1 ; i <= 3 ; i ++){
			if(i > this.renLength ){
				this["name_"+i].visible = false;
				this["id_"+i].visible = false;
				this["Label_Score"+i].visible = false;
				continue;
			}

			this["name_"+i].setString(des.playerMsg[i-1].name);
			this["id_"+i].setString("ID:" + des.playerMsg[i-1].userId);
			if(des.playType == PHZGameTypeModel.SYBP){
				if(des.playerMsg[i-1].bopiPoint)
					this["Label_Score"+i].setString(des.playerMsg[i-1].bopiPoint);
				else
					this["Label_Score"+i].setString(0);
			}else{
				this["Label_Score"+i].setString("总分:" + des.playerMsg[i-1].totalPoint);
			}
		}
		this.Label_8.setString(""+des.tableId);
		this.Label_5.setString(""+des.time.substr(0,16));

		UITools.addClickEvent(this.Panel_7, this, this.onDetailRecord);
		UITools.addClickEvent(this.Button_Share,this,this.onDetailRecord);
		UITools.addClickEvent(this.Button_Detail,this,this.onShare);
	},

	//战绩分享按钮点击事件
	onShare: function () {
		cc.log("点击触发截图消息...");
		SyEventManager.dispatchEvent(SyEvent.RECORD_SHARE, this.shareObject);
	},

	onDetailRecord:function(){

		var curData = {
			roomId: 0,
			tims: 0,
			playData: [],
			winorLoss: 0,
		}
		curData.roomId = this.Label_8.getString();
		curData.times = this.Label_5.getString();
		curData.winorLoss = this.winOrLoss;
		curData.playData = this.playerData;
		curData.index = this.tIndex;
		PDKClickRecordModel.init(curData);

		sy.scene.hideLoading();
		cc.log("this.isDaiKai"+this.isDaiKai);
		cc.log("this.id"+this.id);
		if (this.isDaiKai){
			//wanfaType，服务端要求加的
			Network.loginReq("qipai","exec",{actionType:6,funcType:2,logType:0,logId:this.id,userId:PlayerModel.userId,wanfaType:0}, function(data){
				//cc.log("PDKRecordPop"+JSON.stringify(data));
				var mc = new PDKRecordPop(data.playLogMap,true);
				RecordModel.init(data.playLogMap);
				PopupManager.open(mc,true);
			});
		}else{
			if (this.tableLogs){
				var tableNo = 0;
				for (var index = 0; index < this.tableLogs.length; index++) {
					if (this.id == this.tableLogs[index].logId){
						tableNo = this.tableLogs[index].tableNo;
					}
				}
				cc.log("tableNo::::::::"+tableNo);
				NetworkJT.loginReq("groupAction", "loadTableRecord", {
					tableNo:tableNo,
					oUserId:PlayerModel.userId ,
					isClub:1,
					recordTag:7
				}, function (data) {
					if (data) {
						cc.log("loadTableRecord"+JSON.stringify(data));
						var mc = new PDKRecordPop(data);
						RecordModel.init(data);
						PopupManager.open(mc);
					}
				}, function (data) {
					cc.log("getUserPlayLog::"+JSON.stringify(data));
					FloatLabelUtil.comText(data.message);
				});
			}else {
				if (this.wanfa == 131){
					Network.loginReq("qipai","getUserPlayLog",{logType:10, logId:this.id , userId:PlayerModel.userId}, function(data){
						if(data){
							var mc = new BBTRecordPop(data);
							RecordModel.init(data);
							PopupManager.addPopup(mc);
						}
					},function(data){
						FloatLabelUtil.comText("获取数据失败");
					});
				}else{
					Network.loginReq("qipai","getUserPlayLog",{logType:1, logId:this.id , userId:PlayerModel.userId}, function(data){
						if(data){
							var mc = new PDKRecordPop(data);
							RecordModel.init(data);
							PopupManager.addPopup(mc);
						}
					},function(data){
						FloatLabelUtil.comText("获取数据失败");
					});
				}

				//sySocket.sendComReqMsg(14, [0], this.id + "");
			}
		}

	}
});

