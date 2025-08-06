/**
 * Created by Administrator on 2016/6/27.
 */
var AlertPop = BasePopup.extend({

    ctor: function (content,okcb,cancelcb,btnType,tipStr) {
        this.data = content;
        this.okcb = okcb || null;
        this.cancelcb = cancelcb || null;
		this.btnType = btnType || 1;
		cc.log(tipStr)
		this.tipStr = tipStr || "";
        this._super("res/alertPop.json");
    },

    selfRender: function () {
        this.Button_36 = this.getWidget("Button_36");
        this.Button_37 = this.getWidget("Button_37");
        this.getWidget("Label_35").setString(this.data);
        this.getWidget("close_btn").visible = false;
        UITools.addClickEvent(this.Button_36,this,this.onOk);
        UITools.addClickEvent(this.Button_37,this,this.onCancel);
		cc.log("this.btnType ..." , this.btnType);
		if(this.btnType == 2){//解散界面要显示特殊的按钮
			this.Button_36.loadTextureNormal("res/ui/phz/phzRoom/btnJiesan.png");
			this.Button_37.loadTextureNormal("res/ui/phz/phzRoom/btnContinue.png");
		}

		this.getWidget("Label_36").setString(this.tipStr);
    },

    onOk:function(){
        if(this.okcb)
            this.okcb();
        PopupManager.remove(this);
    },

    onCancel:function(){
        if(this.cancelcb)
            this.cancelcb();
        PopupManager.remove(this);
    }
});

var AlertPopRichText = BasePopup.extend({

	_richElements:null,
	ctor:function(json,content,richElements,okcb,cancelcb,isApply,isDisplay,time){
		this._richElements = richElements;
		this.data = content;
		this.okcb = okcb || null;
		this.cancelcb = cancelcb || null;
		this.isApply = isApply;
		this.isDisplay = isDisplay;
		this.time = time || null;
		this._super(json);
	},

	selfRender: function () {
		this.Button_36 = this.getWidget("Button_36");
		this.Button_37 = this.getWidget("Button_37");
		this.getWidget("close_btn").visible = false;
		this.str = this.getWidget("Label_35");
		this.str.setString(this.data);
		this.str.setSize(480,35);
		this.str.setPosition(305,340);
		if(!this.isDisplay && this.isApply){
			this.isHide();
		}
		UITools.addClickEvent(this.Button_36,this,this.onOk);
		UITools.addClickEvent(this.Button_37,this,this.onCancel);
		var scrollView = new ccui.ScrollView();
		scrollView.setDirection(ccui.ScrollView.DIR_VERTICAL);
		scrollView.setTouchEnabled(true);
		scrollView.jumpToTop();
		scrollView.setBounceEnabled(true);
		scrollView.setContentSize(cc.size(480, 210));
		scrollView.setInnerContainerSize(cc.size(480, 480));
		scrollView.anchorX = scrollView.anchorY = 0;
		scrollView.setPosition(400, 295);//235
		this.addChild(scrollView);
		var richText = UICtor.cLabel("",30,cc.size(480,460),cc.color(129,71,49),0,0);
		richText.anchorX = richText.anchorY = 0;
		richText.setPosition(0,35);
		richText.setString(this._richElements);
		scrollView.addChild(richText);
		if(this.time && this.time>0){
			this.str.setPosition(305,145);
			scrollView.setContentSize(cc.size(480, 200));
			scrollView.setPosition(400,285);
			richText.setPosition(0,0);
			this.scheduleUpdate();
		}
	},

	onOk:function(){
		if(this.okcb)
			this.okcb();
		if(!this.isApply){
			PopupManager.remove(this);
		}else{
			this.isHide();
		}
	},

	onCancel:function(){
		if(this.cancelcb)
			this.cancelcb();
		if(!this.isApply){
			PopupManager.remove(this);
		}else{
			this.isHide();
		}
	},

	isHide:function(){
		this.Button_36.visible = false;
		this.Button_37.visible = false;
	},

	update:function(dt){
		this.time -= dt;
		if(this.time<=0){
			this.unscheduleUpdate();
			PopupManager.remove(this);
		}else{
			this.str.setString(ApplyExitRoomModel.changeTime(this.time));
		}
	}
});

AlertPopRichText.show = function(json,content,richElements,okcb,cancelcb,isDisplayOk,isDisplayCancel){
	var layer = new AlertPopRichText(json,content,richElements,okcb,cancelcb,isDisplayOk,isDisplayCancel);
	PopupManager.open(layer);
	return layer;
}

AlertPopRichText.showOnlyOk = function(json,content,richElements,okcb,cancelcb,isDisplayOk,isDisplayCancel){
	var mc = new AlertPopRichText(json,content,richElements,okcb,cancelcb,isDisplayOk,isDisplayCancel);
	mc.Button_37.visible = false;
	mc.Button_36.x -= 152;
	PopupManager.addPopup(mc);
}


var ServicePop = BasePopup.extend({

	ctor: function (json,content1,content2,okcb,cancelcb) {
		this.data1 = content1;
		this.data2 = content2;
		this.okcb = okcb || null;
		this.cancelcb = cancelcb || null;
		this._super(json);
		cc.log("ServicePop json" , json);
	},

	selfRender: function () {
		this.Button_36 = this.getWidget("Button_36");
		this.Button_37 = this.getWidget("Button_37");
		this.Button_9 = this.getWidget("Button_9");
		this.Button_9.temp=1;
		this.Button_10 = this.getWidget("Button_10");
		if(this.Button_10) {
			this.Button_10.temp = 2;
			UITools.addClickEvent(this.Button_10,this,this.onCopy);
		}
		this.Label_35 = this.getWidget("Label_35");
		this.Label_35.setString(this.data1);
		this.Label_36 = this.getWidget("Label_36");
		if(this.Label_36 ) {
			this.Label_36.setString(this.data2);
		}
		this.Button_copy = this.getWidget("Button_copy");
		if(this.Button_copy){
			this.Button_copy.temp = 1;
			UITools.addClickEvent(this.Button_copy,this,this.onCopy);
		}

		UITools.addClickEvent(this.Button_36,this,this.onOk);
		UITools.addClickEvent(this.Button_37,this,this.onCancel);
		UITools.addClickEvent(this.Button_9,this,this.onCopy);

	},

	onCopy:function(obj){
		var temp = obj.temp;
		if(temp==1){
			SdkUtil.sdkPaste(this.Label_35.getString());
		}else {
			SdkUtil.sdkPaste(this.Label_36.getString());
		}
		FloatLabelUtil.comText("复制成功");
	},

	onOk:function(){
		if(this.okcb)
			this.okcb();
		PopupManager.remove(this);
	},

	onCancel:function(){
		if(this.cancelcb)
			this.cancelcb();
		PopupManager.remove(this);
	}
});

ServicePop.showOnlyOk = function(json,content1,content2,okcb){
	var mc = new ServicePop(json,content1,content2,okcb);
	mc.Button_37.visible = false;
	mc.Button_36.x -= 155;
	PopupManager.addPopup(mc);
}

AlertPop.show = function(content,okcb,cancelcb,btnType,tipStr){
    var mc = new AlertPop(content,okcb,cancelcb,btnType,tipStr);
    PopupManager.addPopup(mc);
}

AlertPop.showOnlyOk = function(content,okcb){
    var mc = new AlertPop(content,okcb);
    mc.Button_37.visible = false;
    mc.Button_36.x -= 152;
    PopupManager.addPopup(mc);
}


AlertPop.showMacthTip = function(data,okcb,cancelcb){
	var mc = new MacthTipPop(data,okcb,cancelcb);
	PopupManager.addPopup(mc);
}

var OnlineUpdatePop = BasePopup.extend({

	ctor: function (content,okcb,cancelcb) {
		this.data = content;
		this.okcb = okcb || null;
		this.cancelcb = cancelcb || null;
		this._super("res/alertPop.json");
	},

	selfRender: function () {
		this.Button_36 = this.getWidget("Button_36");
		this.Button_37 = this.getWidget("Button_37");
		this.getWidget("close_btn").visible = false;
		this.getWidget("Label_35").setString(this.data);
		UITools.addClickEvent(this.Button_36,this,this.onOk);
		UITools.addClickEvent(this.Button_37,this,this.onCancel);
	},

	onOk:function(){
		if(this.okcb)
			this.okcb();
		PopupManager.remove(this);
	},

	onCancel:function(){
		if(this.cancelcb)
			this.cancelcb();
		PopupManager.remove(this);
	}
});

OnlineUpdatePop.showOnlyOk = function(content,okcb){
	var mc = new OnlineUpdatePop(content,okcb);
	mc.Button_37.visible = false;
	mc.Button_36.x -= 155;
	PopupManager.addPopup(mc,100);
}


var MacthTipPop = BasePopup.extend({

	ctor: function (data,okcb,cancelcb) {
		this.okcb = okcb || null;
		this.cancelcb = cancelcb || null;
		this.data = data || null;
		this.content = data.content || "";
		this._super("res/clubMatchTipPop.json");
	},

	selfRender: function () {

		this.addCustomEvent(SyEvent.REMOVE_MATCH_LOADING , this , this.onRemoveMySelf);


		this.mainPopup1 = this.getWidget("mainPopup1");

		this.Button_37 = this.getWidget("btnCancel");
		this.getWidget("close_btn").visible = false;
		UITools.addClickEvent(this.Button_37,this,this.onCancel);


		this.btnShare = this.getWidget("btnShare");
		UITools.addClickEvent(this.btnShare,this,this.onShare);

		this.Button_37.setBright(false);
		this.Button_37.setTouchEnabled(false);

		if (this.data){
			//this.getWidget("BitmapLabel_has").setString(this.data.nowCount);
			//this.getWidget("BitmapLabel_need").setString(this.data.needCount);
			if (this.data.matchTime <= 0){
				this.Button_37.setBright(true);
				this.Button_37.setTouchEnabled(true);
			}
		}

		//隐藏以前的控件
		this.getWidget("BitmapLabel_has").visible = false;
		this.getWidget("BitmapLabel_need").visible = false;
		this.getWidget("Label_35").visible = false;
		this.getWidget("Label_35_0").visible = false;
		this.getWidget("Label_35_0_1").visible = false;

		this.getWidget("Label_36").setString(""+this.content);

		this.playOrRemoveWaitingAnm();
	},

	onRemoveMySelf:function(){
		if(this.waitAnimation){
			this.waitAnimation.removeFromParent();
			this.waitAnimation = null;
		}
		PopupManager.remove(this);
	},

	/**
	 * 增加等待好友动画
	 */
	playOrRemoveWaitingAnm:function(){

		if(this.waitAnimation == null){
			var width  = this.mainPopup1.getContentSize().width;
			var height = this.mainPopup1.getContentSize().height;
			ccs.armatureDataManager.addArmatureFileInfo(
				"res/plist/dengren10.png",
				"res/plist/dengren10.plist",
				"res/plist/dengren1.ExportJson");
			this.waitAnimation = new ccs.Armature("dengren1");
			this.waitAnimation.x = width*0.5;
			this.waitAnimation.y = height*0.55;
			this.mainPopup1.addChild(this.waitAnimation,99);
			this.waitAnimation.getAnimation().play("dengren1",-1,1);

		}
	},

	onCancel:function(){
		if(this.cancelcb)
			this.cancelcb();
		//PopupManager.remove(this);
	},

	onShare:function(){
		if(this.okcb)
			this.okcb();
	}

});


var MatchAlertPop = BasePopup.extend({
	ctor: function (content,okcb,cancelcb,btnType) {
		this.data = content;
		this.okcb = okcb || null;
		this.cancelcb = cancelcb || null;
		this.btnType = btnType || 1;
		this._super("res/matchAlertPop.json");
	},

	selfRender: function () {
		//清空数据
		MatchResultModel.setData(null);
		this.Button_36 = this.getWidget("Button_36");
		this.Button_fh = this.getWidget("Button_fh");
		UITools.addClickEvent(this.Button_36,this,this.onOk);
		UITools.addClickEvent(this.Button_fh,this,this.onFH);

		this.Button_fh.visible = false;

		this.getWidget("close_btn").visible = false;

		var state = 1;

		var resultImage = this.getWidget("Image_result");
		var Panel_result = this.getWidget("Panel_result");
		var manTexture = "res/ui/dtz/match/shu.png";
		var str1 = "  很遗憾,你在本局比赛中获得";
		var str2 = "第"+this.data+"名";
		var str3 = "         报名下一场,再接再厉吧!";
		resultImage.loadTexture(manTexture);
		var elements1 = [];
		elements1.push(RichLabelVo.createTextVo(str1,cc.color("ffffff"),24));
		elements1.push(RichLabelVo.createTextVo(str2,cc.color("e0731b"),24));
		var elements2 = [];
		elements2.push(RichLabelVo.createTextVo(str3,cc.color("ffffff"),24));
		var richLabel1 = new RichLabel(cc.size(800,0),3);
		richLabel1.setLabelString(elements1);
		richLabel1.y = 65;
		richLabel1.x = 120;
		Panel_result.addChild(richLabel1,1,999);

		var richLabel2 = new RichLabel(cc.size(800,0),3);
		richLabel2.setLabelString(elements2);
		richLabel2.y = 30;
		richLabel2.x = 120;
		Panel_result.addChild(richLabel2,1,999);

	},

	onOk:function(){
		if(this.okcb)
			this.okcb();
		PopupManager.removeAll();
		LayerManager.showLayer(LayerFactory.HOME);
	},

	//复活赛
	onFH: function() {
		sySocket.sendComReqMsg(100 ,[4] ,[MatchApplyModel.matchType,MatchApplyModel.keyId]);
	}

});


var DTZGiftAlertPop = BasePopup.extend({

	ctor: function (content,okcb,cancelcb,url,tipStr) {
		this.data = content;
		this.okcb = okcb || null;
		this.cancelcb = cancelcb || null;
		this.url = url || null;
		this.tipStr = tipStr || "";
		this._super("res/DTZGiftAlertPop.json");
	},

	selfRender: function () {
		this.Button_36 = this.getWidget("Button_36");
		this.getWidget("Label_35").setString(this.data);
		this.getWidget("close_btn").visible = false;
		UITools.addClickEvent(this.Button_36,this,this.onOk);

		this.main2 = this.getWidget("main2");

		this.Image_10 = this.getWidget("Image_10");
		this.Image_10.visible = false;
		if (this.url){
			this.Image_101 = cc.Sprite("res/ui/dtz/giftExChangePop/img_9.png");
			this.Image_101.x = this.Image_10.x;
			this.Image_101.y = this.Image_10.y;
			this.main2.addChild(this.Image_101);
			this.showGiftImg(this.Image_101,this.url)
		}
		this.getWidget("Label_36").setString(this.tipStr);
	},

	//显示奖品图片
	showGiftImg:function(obj,url){
		cc.loader.loadImg(url, {width: 252, height: 252}, function (error, img) {
			if (!error) {
				obj.visible = true;
				obj.setTexture(img);
			}else{

			}
		});
	},

	onOk:function(){
		if(this.okcb)
			this.okcb();
		PopupManager.remove(this);
	},
});


MatchAlertPop.show = function(content,okcb,cancelcb,btnType){
	var mc = new MatchAlertPop(content,okcb,cancelcb,btnType);
	PopupManager.addPopup(mc);
}

MatchAlertPop.showOnlyOk = function(content,okcb){
	var mc = new MatchAlertPop(content,okcb);
	//mc.Button_fh.visible = false;
	//mc.Button_36.x += 152;
	PopupManager.addPopup(mc);
}