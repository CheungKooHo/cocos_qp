var RecordListPop = BasePopup.extend({
	ctor: function () {
		this._super("res/recordListPop.json");
	},

	selfRender: function () {
		var Button_PDK = this.getWidget("BtnRecodePDK");
		UITools.addClickEvent(Button_PDK,this,this.onRecordPDK); // onRecordPDK

		var Button_DTZ = this.getWidget("BtnRecodeDTZ");
		UITools.addClickEvent(Button_DTZ,this,this.onRecordDTZ);

		var Button_PHZ = this.getWidget("BtnRecodePHZ");
		UITools.addClickEvent(Button_PHZ,this,this.onRecordPHZ);

		var Button_BBT = this.getWidget("BtnRecodeBBT");
		UITools.addClickEvent(Button_BBT,this,this.onRecordBBT);
	},

	onRecordPDK:function(){
		var gameId = 1;
		sy.scene.hideLoading();
		if(gameId == 1){
			PlayerModel.checkRecordType = gameId;
			Network.loginReq("qipai","getUserPlayLog",{logType:1},function(data){
				if(data){
					var mc = new DTZTotalRecordPop(data);
					TotalRecordModel.init(data);
					PopupManager.addPopup(mc);
				}
			},function(data){
				FloatLabelUtil.comText("获取数据失败");
			});

			//sySocket.sendComReqMsg(14,[gameId]);
		}
		this.onCloseHandler();
	},

	onRecordBBT:function(){
		var gameId = 10;
		PlayerModel.checkRecordType = gameId;
		sy.scene.hideLoading();
//        sySocket.sendComReqMsg(14,[4]);
		Network.loginReq("qipai","getUserPlayLog",{logType:10},function(data){
			if(data){
				var mc = new DTZTotalRecordPop(data);
				TotalRecordModel.init(data);
				PopupManager.addPopup(mc);
			}
		},function(data){
			FloatLabelUtil.comText("获取数据失败");
		});
		this.onCloseHandler();
		//var gameId = 10;
		//sy.scene.hideLoading();
		//if(gameId == 10){
		//	PlayerModel.checkRecordType = gameId;
		//	sySocket.sendComReqMsg(127,[gameId]);
		//}
		//this.onCloseHandler();
	},

	onRecordDTZ:function(){
		var gameId = 8;
		PlayerModel.checkRecordType = gameId;
		sy.scene.hideLoading();

		Network.loginReq("qipai","getUserPlayLog",{logType:8},function(data){
			if(data){
				var mc = new DTZTotalRecordPop(data);
				TotalRecordModel.init(data);
				PopupManager.addPopup(mc);
			}
		},function(data){
			FloatLabelUtil.comText("获取数据失败");
		});
		this.onCloseHandler();
	},

	onRecordPHZ:function(){
		var gameId = 4;
		PlayerModel.checkRecordType = gameId;
		sy.scene.hideLoading();

		Network.loginReq("qipai","getUserPlayLog",{logType:4},function(data){
			if(data){
				var mc = new DTZTotalRecordPop(data);
				TotalRecordModel.init(data);
				PopupManager.addPopup(mc);
			}
		},function(data){
			FloatLabelUtil.comText("获取数据失败");
		});
		this.onCloseHandler();
	}

});