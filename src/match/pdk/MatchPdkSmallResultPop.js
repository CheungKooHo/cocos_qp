
/**
 * Created by zhoufan on 2016/6/30.
 */
var MatchPdkSmallResultPop = BasePopup.extend({

	ctor: function (data) {
		this.data = data;
		this._super("res/matchPdkSmallResult.json");
	},

	selfRender: function () {
		this.issent = false;
		this.dt = 0;
		this.start = 0;
		for(var i = 0 ; i < this.data.length ; i ++){
			this.showPlayerMsg(this.data[i],(i+1));
		}
		var btnok = this.getWidget("btnok");
		var close_btn = this.getWidget("close_btn");
		UITools.addClickEvent(close_btn,this,this.onOk);
		close_btn.visible = true;

		var countDown = this.countDown = this.getWidget("countDown");
		countDown.setString("");


		this.scheduleUpdate();
		this.updateRank();
	},


	updateRank:function(){
		//1：当前轮数 2：自己的排名 3：剩下的人数
		var message = MatchModel.getResultRank();
		var curRank = message[2];
		var totalRenshu = message[3];
		//var panel = this.getWidget("Panel_pm");
		//if(panel.getChildByTag(123)){
		//	panel.removeChildByTag(123);
		//}
		//var rank = new cc.LabelBMFont("排名"+curRank+"/"+totalRenshu,"res/font/dn_bigResult_font_1.fnt");
		//rank.x = panel.width/2;
		//rank.y = panel.height/2-1;
		//panel.addChild(rank,1,123);
		var pmLabel = this.getWidget("Label_pm");
		pmLabel.setString("排名"+curRank+"/"+totalRenshu);
	},


	showPlayerMsg:function(userData , showSeqp){
		var seq = showSeqp;
		var user = userData;
		this.getWidget("name"+seq).setString(user.name);
		this.getWidget("ps"+seq).setString(user.leftCardNum);
		this.getWidget("zd"+seq).setString("x "+user.boom);
		this.getWidget("jb"+seq).setString(user.point);

		var title = this.getWidget("Image_16");
		var bg = this.getWidget("mainPopup");
		var soundPath  = "res/audio/common/audio_win.mp3";
		if(user.point <= 0 && user.userId == PlayerModel.userId){
			soundPath = "res/audio/common/audio_lose.mp3";
			title.loadTexture("res/ui/dtz/match/result/matchResult_3.png");
			bg.loadTexture("res/ui/dtz/match/result/lose_bg.png");
		}
		AudioManager.play(soundPath);

		if(user.userId == PlayerModel.userId) {
			//连胜
			var liansheng = this.getWidget("liansheng");
			var num = user.ext[6];
			if(num>=1) {
				var rank = new cc.LabelBMFont(num + "连胜", "res/font/font_matchResult_1.fnt");
				rank.x = liansheng.width / 2;
				rank.y = liansheng.height / 2 - 5;
				liansheng.addChild(rank);
			}else{
				liansheng.visible = false;
			}

			var myName = this.getWidget("myName");
			myName.setString(user.name);
			var myId = this.getWidget("myId");
			myId.setString("ID:"+user.userId);
			var icon = this.myIcon = this.getWidget("icon");
			var defaultimg = "res/ui/dtz/match/result/icon.png";
			if (icon.getChildByTag(345))
				icon.removeChildByTag(345);
			var sprite = new cc.Sprite(defaultimg);
			sprite.x = 34;
			sprite.y = 30;
			var sten = new cc.Sprite("res/ui/dtz/match/result/icon.png");
			var clipnode = new cc.ClippingNode();
			clipnode.attr({stencil: sten, anchorX: 0.5, anchorY: 0.5, x: this.myIcon.width/2, y: this.myIcon.height/2,alphaThreshold: 0.8});
			clipnode.addChild(sprite);
			icon.addChild(clipnode,5,345);
			if (user.icon) {
				cc.loader.loadImg(user.icon, {width: 252, height: 252}, function (error, img) {
					if (!error) {
						sprite.setTexture(img);
						sprite.x = 0;
						sprite.y = 0;
					}
				});
			}
		}
	},


	update:function(dt){
		this.dt += dt;
		if(this.dt >= 1){
			this.dt = 0;
			this.start++;
			if(this.start < 5){
				//this.start = this.start < 10 ? "0"+this.start : this.start;
				//this.countDown.setString("00:"+this.start);
				this.countDown.setString(this.start + "s");
				if (parseInt(this.start) >= 4){
					this.onOk();
				}
			//}else{
			//	var minutes = Math.floor(this.start/60);
			//	var seconds = this.start%60;
			//	minutes = minutes<10 ? "0"+minutes : minutes;
			//	seconds = seconds<10 ? "0"+seconds : seconds;
			//	this.countDown.setString(minutes+":"+seconds);
			}
		}
	},

	onCloseHandler:function(){
		this.unscheduleUpdate();
		PopupManager.remove(this);
	},

	onOk:function(){
		this.unscheduleUpdate();
		PopupManager.remove(this);
		if (MatchAwardModel.getData() && !PopupManager.hasClassByPopup(MatchAwardPop)){
			var message = MatchAwardModel.getData();
			PopupManager.addPopup(new MatchAwardPop(message));
		}else if (MatchResultModel.getData() && !PopupManager.hasClassByPopup(MatchAlertPop)){
			var message = MatchResultModel.getData();
			var params = message.params;
			var strParams  = message.strParams;
			var childCode = params[0];
			if(childCode == 0){//淘汰消息
				//PopupManager.removeAll();
				if(strParams.length > 0 &&strParams[0]!= ""){

				}else{
					MatchAlertPop.showOnlyOk(params[2]);
				}
			}else if(childCode == 7) {//被淘汰了，且可以复活的状态
				MatchAlertPop.show(params[1]);
			}
		}else{
			SyEventManager.dispatchEvent(SyEvent.MATCH_SHOW_TIP);
		}
	},

});
