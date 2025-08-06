/**
 * Created by Administrator on 2017/2/23.
 */
var InvitationCodePop = BasePopup.extend({
	ctor:function(){
		this._super("res/inviteCode.json");
	},

	selfRender:function(){
		cc.log("PlayerModel.payBindId..." , PlayerModel.payBindId);
		if(PlayerModel.payBindId != ""){
			this.getWidget("Label_code").setString(PlayerModel.payBindId+"");
			this.getWidget("Button_17").setBright(false);
		}else{
			this.getWidget("Image_15").visible = false;
			var img = this.getWidget("mainPopup");
			this.currentlyText = new cc.EditBox(cc.size(372, 71), new cc.Scale9Sprite("res/ui/dtz/dtzCom/scale9bg2.png"));
			this.currentlyText.setString("");
			this.currentlyText.x = 640;
			this.currentlyText.y = 200;
			this.currentlyText.setFontColor(cc.color("#7D2E00"));
			this.currentlyText.setDelegate(this);
			img.addChild(this.currentlyText);
			this.currentlyText.setFont("Arial",30);
			var btn = this.getWidget("Button_17");
			UITools.addClickEvent(btn, this, this.onOK)
		}
	},

	onOK:function(){
		var str=this.currentlyText.getString();
		if(str.length!=6){
			return FloatLabelUtil.comText("邀请码错误，请输入正确的邀请码！");
		}
		var num=parseInt(str);
		if(num<100000){
			return FloatLabelUtil.comText("邀请码错误，请输入正确的邀请码！");
		}
		this.checkMa(num);
	},
	
	checkMa:function(num){
		sy.scene.showLoading("正在检测");
		var self = this;
		var url = csvhelper.strFormat(SyConfig.REQ_URL,"qipai","bindPayAgencyId");
		Network.sypost(url,"bindPayAgencyId",{userId:PlayerModel.username,flatId:PlayerModel.username,payBindId:num,pf:PlayerModel.pf},
			function(data){
				sy.scene.hideLoading();
				PlayerModel.payBindId=num+"";
				self.onCloseHandler();
				PayPop.show();
				SyEventManager.dispatchEvent(SyEvent.BIND_INVITECODE_SUC);
		},function(data){
			sy.scene.hideLoading();
			if(data.code==-2){//已经绑定过
				return FloatLabelUtil.comText("已经绑定");
			}
			if(data.msg){
				FloatLabelUtil.comText(data.msg);
			}else{
				FloatLabelUtil.comText("检测失败");
			}
		}
		);
	}
});