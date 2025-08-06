/**
 * Created by Administrator on 2016/6/27.
 */
var DailiPop = BasePopup.extend({

    ctor: function (content) {
        this.data = content;
        this._super("res/dailiPop.json");
    },

    selfRender: function () {
		UITools.addClickEvent(this.getWidget("Button_36"),this,this.onOk);
		var t1 = this.data.pop();
		this.getWidget("Label_wt1").setString(t1);
		var t2 = this.data.pop();
		this.getWidget("Label_wt2").setString(t2);
		var Button_wt1 = this.getWidget("Button_wt1");
		Button_wt1.temp = 16;
		UITools.addClickEvent(Button_wt1, this, this.onCopy);
		var Button_wt2 = this.getWidget("Button_wt2");
		Button_wt2.temp = 17;
		UITools.addClickEvent(Button_wt2, this, this.onCopy);
		for(var index = 0 ; index < this.data.length ; index++){
			this.getWidget("Label_weixin" + (index+1)).setString("客服:"+this.data[index]);
			var btn = this.getWidget("Button_copy"+(index+1));
			btn.temp = (index+1);
			UITools.addClickEvent(btn,this,this.onCopy);
		}
		index++;
		for (;index<15;index++) {
			this.getWidget("Label_weixin" + (index+1)).visible = false;
		}

    },

    onOk:function(){
        if(this.okcb)
            this.okcb();
        PopupManager.remove(this);
    },


	onCopy:function(obj){
		var temp = obj.temp;
		if(temp <= 17 && temp >= 1){
			var lable = null;
			if (temp == 16) {
				lable = this.getWidget("Label_wt1");
				str = lable.getString();
			} else if (temp == 17) {
				lable = this.getWidget("Label_wt2");
				str = lable.getString();
			} else {
				lable = this.getWidget("Label_weixin" + temp);
				var str = lable.getString();
				str = str.substr(3,str.length);
			}
			cc.log("当前复制的字符串为:",str);
			SdkUtil.sdkPaste(str);
			FloatLabelUtil.comText("复制成功");
		}

	},
});
