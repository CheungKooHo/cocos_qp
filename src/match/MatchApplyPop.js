
var MatchApplyItem = ccui.Widget.extend({
	ctor:function(){
		this._super();

		this.setContentSize(cc.size(530,90));

		var Panel_16=this.Panel_16= UICtor.cPanel(cc.size(530,90),cc.color(0,0,0),0);
		Panel_16.setAnchorPoint(cc.p(0,0));
		Panel_16.setPosition(0,0);
		var Panel_matchCell=this.Panel_matchCell= UICtor.cPanel(cc.size(530,90),cc.color(150,200,255),0);
		Panel_matchCell.setAnchorPoint(cc.p(0,0));
		Panel_matchCell.setPosition(0,0);
		Panel_16.addChild(Panel_matchCell);
		var Image_rank=this.Image_rank= UICtor.cImg("res/ui/dtz/match/1..png");
		Image_rank.setPosition(55,45);
		Panel_matchCell.addChild(Image_rank);
		var Image_xian=this.Image_xian= UICtor.cImg("res/ui/dtz/match/img_27.png");
		Image_xian.setPosition(265,1);
		Panel_matchCell.addChild(Image_xian);
		var Label_rank=this.Label_rank= UICtor.cLabel("第一名",30,cc.size(0,0),cc.color(125,46,0),0,0);
		Label_rank.setAnchorPoint(cc.p(0,0.5));
		Label_rank.setPosition(117,45);
		Panel_matchCell.addChild(Label_rank);
		var Label_reward=this.Label_reward= UICtor.cLabel("3000钻",30,cc.size(0,0),cc.color(125,46,0),0,0);
		Label_reward.setAnchorPoint(cc.p(1,0.5));
		Label_reward.setPosition(509,45);
		Panel_matchCell.addChild(Label_reward);

		this.addChild(Panel_16);
	},

	setData:function(rank,award){
		this.Label_rank.setString("第" + rank + "名");
		this.Label_reward.setString(award);
		if(parseInt(rank) == 1){
			this.Image_rank.loadTexture("res/ui/dtz/match/1..png");
		}else if(parseInt(rank) == 2){
			this.Image_rank.loadTexture("res/ui/dtz/match/2..png");
		}else if(parseInt(rank) == 3){
			this.Image_rank.loadTexture("res/ui/dtz/match/3..png");
		}else {
			this.Image_rank.visible = false;
		}
	},
});
var MatchApplyPop = BasePopup.extend({
	isJoin:false,
	isShared:false,
	resp:false,
	needShare:false,
	ctor: function () {
		this.needShare = false;
		this._super("res/matchApplyLayer.json");
	},

	selfRender: function () {
		this.applyBtn = this.getWidget("applyBtn");
		UITools.addClickEvent(this.applyBtn,this,this.onApply);

		var returnBtn = this.getWidget("returnBtn");
		UITools.addClickEvent(returnBtn,this,this.onBackHome);

		if (MatchApplyModel.matchPay && MatchApplyModel.matchPay == "share"){
			this.isNeedShare = true;
		}

		//默认没有报名（）
		var applyType = 0;
		//是否已经报名
		if (MatchApplyModel.status){
			applyType = 1;
			this.isJoin = true;//是否报名了比赛
			this.isShared = true;//是否分享了
			this.isNeedShare = false;
		}
		this.onRefreshBtn(applyType);

		//是否分享了
		if (MatchApplyModel.shared && parseInt(MatchApplyModel.shared) > 0){
			this.isShared = true;//是否分享了
			this.isNeedShare = false;
		}




		//已经报名和未报名的人数
		this.countLabelList = [];

		for(var i = 0 ; i < 3 ; i++) {
			var index = i + 1;
			if (i < 2){
				this.countLabelList[i] = this.getWidget("Label_count"+index);
			}
		}

		//当前人数
		var curRenshu = MatchApplyModel.curRenshu;
		this.countLabelList[0].setString(""+curRenshu);
		//剩余人数
		var needRenshu = MatchApplyModel.maxRenshu - MatchApplyModel.curRenshu;
		this.countLabelList[1].setString(""+needRenshu);

		this.ListView_reward = this.getWidget("ListView_reward");

		//this.setData();

		this.showAward();

		this.addCustomEvent(SyEvent.MATCH_REFRESH_RENSHU,this,this.updateRenshu);

		this.addCustomEvent(SyEvent.MATCH_REFRESH_APPLY, this , this.onSendApplyMsg);


		this.addCustomEvent(SyEvent.SOCKET_OPENED,this,this.onSuc);
		this.addCustomEvent(SyEvent.GET_SERVER_SUC,this,this.onChooseCallBack);
		this.addCustomEvent(SyEvent.NOGET_SERVER_ERR,this,this.onChooseCallBack);

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

	onSuc:function() {
		cc.log("MatchApplyLayer onSuc...");
		if(MatchClickModel.ischangeSever) {
			MatchClickModel.ischangeSever = false;
			this.isShared = true;
			FloatLabelUtil.comText("报名成功");
			ComReq.comReqMatchConfig([1,16],[""+MatchApplyModel.matchType,""+MatchApplyModel.keyId]);
		}
	},

	showAward:function(){
		var reward = MatchApplyModel.award;
		for (var rank in reward) {
			//var data = reward[rank-1].split(",");
			var item = new MatchApplyItem();
			item.setData(rank,reward[rank]);
			this.ListView_reward.pushBackCustomItem(item);
		}
	},


	//分享成功 ，发送报名请求
	onSendApplyMsg:function(){
		FloatLabelUtil.comText("分享成功");
		this.isShared = true;
		//MatchClickModel.ischangeSever = false;
		//已经分享了发了 matchType 和 keyId 还要发送报名请求 ,（我觉得很扯，李周说就这么做）
		//而且两个请求时间太短，会被屏蔽。做个恶心的延时 （去掉发消息的间隔，这里试着去掉延时）
		//setTimeout(function(){
			ComReq.comReqMatchConfig([1,16],[""+MatchApplyModel.matchType,""+MatchApplyModel.keyId]);
		//},1000);

	},

	updateRenshu:function(event){
		var message  = event.getUserData();
		var data = message[0];

		//当前人数
		var curRenshu = data.curRenshu;
		this.countLabelList[0].setString(""+curRenshu);
		//剩余人数
		var needRenshu = data.maxRenshu - data.curRenshu;
		this.countLabelList[1].setString(""+needRenshu);

		if(data.status){
			this.onRefreshBtn(data.status);
		}
	},

	onRefreshBtn:function(type){
		if(type==1) {
			this.isShared = true;
			this.isJoin = true;
			this.applyBtn.loadTextureNormal("res/ui/dtz/match/btn_match_3.png");
			UITools.addClickEvent(this.applyBtn,this,this.onCancelApply);
		}else{
			this.isJoin = false;
			if (MatchApplyModel.getPayCount() != null){
				this.applyBtn.loadTextureNormal("res/ui/dtz/match/img_2.png");
			}else{
				this.applyBtn.loadTextureNormal("res/ui/dtz/match/img_13.png");
			}
			UITools.addClickEvent(this.applyBtn,this,this.onApply);
		}
	},

	onApply:function(){
		//var data = {};
		//data.matchType = MatchApplyModel.matchType;
		//data.keyId = MatchApplyModel.keyId;
		//MatchClickModel.init(data);
		//是否分享了
		//cc.log("MatchApplyModel==",MatchApplyModel.matchType,MatchApplyModel.keyId,this.isShared,this.isNeedShare,MatchApplyModel.matchPay);
		if (this.isNeedShare){
			if (this.isShared){
				MatchClickModel.ischangeSever = true;
				//测试代码 测试代码 测试代码 这里不需要发分享成功的请求
				ComReq.comReqMatchConfig([1,16],[""+MatchApplyModel.matchType,""+MatchApplyModel.keyId]);
			}else{
				var data = {};
				data.matchType = MatchApplyModel.matchType;
				data.keyId = MatchApplyModel.keyId;
				data.isShare = true;
				MatchClickModel.init(data);
				var obj={};
				obj.tableId = 0;
				obj.userName=PlayerModel.username;
				obj.callURL=SdkUtil.SHARE_URL+'?userId='+encodeURIComponent(PlayerModel.userId);
				var content = "";
				obj.title=content;
				obj.pyq=content;
				obj.description=content;
				obj.shareType=1;
				if (content== "" && SyConfig.hasOwnProperty("HAS_PNG_SHARE")) {
					obj.shareType=0;
					obj.png = "res/feed/feed.jpg";
				}
				obj.session = 1;
				SdkUtil.sdkFeed(obj,false);
				//
				//cc.log("发送报名请求MatchApplyModel.keyId=="+MatchApplyModel.keyId);
			}
		}else{
			if (MatchApplyModel.getPayCount()){
				var tipStr = "报名需消耗"+ MatchApplyModel.getPayCount() +"钻，确认报名吗？";
				AlertPop.show(tipStr, function () {
					MatchClickModel.ischangeSever = true;
					ComReq.comReqMatchConfig([1,16],[""+MatchApplyModel.matchType,""+MatchApplyModel.keyId]);
				});
			}else{
				//测试代码 测试代码 测试代码 这里不需要发分享成功的请求
				MatchClickModel.ischangeSever = true;
				ComReq.comReqMatchConfig([1,16],[""+MatchApplyModel.matchType,""+MatchApplyModel.keyId]);
			}


		}


	},

	onCancelApply:function(){
		//cc.log("取消报名请求MatchApplyModel.keyId=="+MatchApplyModel.keyId);
		//cc.log("MatchApplyModel.matchType===",MatchApplyModel.matchType)
		ComReq.comReqMatchConfig([2,16],[""+MatchApplyModel.matchType,""+MatchApplyModel.keyId]);
	},

	onBackHome:function(){
		if(this.isJoin) {
			var tipStr = "返回大厅将视为退赛,确定返回吗?";
			var self = this;
			AlertPop.show(tipStr, function () {
				self.onCancelApply();
				PopupManager.remove(self);
				LayerManager.showLayer(LayerFactory.HOME);
			});
		}else{
			PopupManager.remove(this);
			LayerManager.showLayer(LayerFactory.HOME);
		}

	},

});