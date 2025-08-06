/**
 * Created by hujingcheng on 2016/8/22.
 */
var RedeemCodePop = BasePopup.extend({
	currentlyText:null,
	ctor:function(){
    	this._super("res/redeemCode.json");
    },

    selfRender:function(){
		var img = this.getWidget("mainPopup");
		this.currentlyText = new cc.EditBox(cc.size(400, 70), new cc.Scale9Sprite("res/ui/dtz/dtzCom/scale9bg2.png"));
		this.currentlyText.setString("");
		this.currentlyText.x = 505;
		this.currentlyText.y = 260;
		this.currentlyText.setFontColor(cc.color("#7D2E00"));
		this.currentlyText.setDelegate(this);
		img.addChild(this.currentlyText);
		this.currentlyText.setFont("Arial",30);
		var btn = this.getWidget("Button_17");
		UITools.addClickEvent(btn, this, this.onGet);
    },
    
    onGet:function(){
    	var value = this.currentlyText.getString();
    	if(value.length != 6){
    		this.currentlyText.setString("");
    		return FloatLabelUtil.comText("请输入6位兑换码");
    	}
    	var url = csvhelper.strFormat(SyConfig.REQ_URL,"qipai","verifyCdk");
    	Network.sypost(url,"",{cdkid:value,userId:PlayerModel.userId,flatId:PlayerModel.username,},function(obj){
    		if(obj.code == 0){
    			if(obj.cardNumber>0){
    				AlertPop.showOnlyOk("恭喜您，获得房卡x"+obj.cardNumber+"！",function(){
 
    				});
    			}
    		}
    		},
    	function(obj){
    		FloatLabelUtil.comText(obj.msg);
    	}
    	);
    },
});