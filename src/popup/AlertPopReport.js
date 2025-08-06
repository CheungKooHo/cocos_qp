/**
 * Created by zyq on 2019/12/18.
 */

var ReportPop = BasePopup.extend({
    ctor:function(){
        this._super("res/alertPopReport.json");
    },

    selfRender:function(){
        UITools.addClickEvent(this.getWidget("btn_sure"), this, this.onClickSureBtn);
        UITools.addClickEvent(this.getWidget("btn_cancel"), this, this.onClickCancelBtn);

        var fontName = "res/font/font_res_at2.ttf";
        var input_bg = this.getWidget("heidi_dizhi");
        this.emailBox = new cc.EditBox(cc.size(input_bg.width, input_bg.height),new cc.Scale9Sprite(sy.imagepath + "common/common_input_tmbg.png"));
        this.emailBox.x = input_bg.width/2;
        this.emailBox.y = input_bg.height/2;
        this.emailBox.setPlaceholderFont(""+fontName,30);
        this.emailBox.setPlaceHolder("请输入您的邮箱地址");
        this.emailBox.setPlaceholderFontColor(cc.color("#B4B0A2"));
        this.emailBox.setFontColor(cc.color("#6A3C11"));
        input_bg.addChild(this.emailBox,1);
        this.emailBox.setFont("Arial",30);

        var input_bg = this.getWidget("heidi_neirong");
        this.contentBox = new cc.EditBox(cc.size(input_bg.width-10, input_bg.height-10),new cc.Scale9Sprite(sy.imagepath + "common/common_input_tmbg.png"));
        this.contentBox.x = input_bg.width/2;
        this.contentBox.y = input_bg.height/2;
        this.contentBox.setPlaceholderFont(""+fontName,30);
        this.contentBox.setPlaceholderFontColor(cc.color("#B4B0A2"));
        this.contentBox.setFontColor(cc.color("#6A3C11"));
        this.contentBox.setPlaceHolder("请输入举报内容");

        input_bg.addChild(this.contentBox,1);
        this.contentBox.setFont("Arial",30);
    },

    onClickSureBtn:function(){

        var _email = this.emailBox.getString();
        var _content = this.contentBox.getString();

        var self = this;
        Network.loginReq("qipai","userReport", {
            userId:PlayerModel.userId ,sessCode:PlayerModel.sessCode, email:_email,  content:_content}, function (data) {
            if (data) {
                //cc.log("userReport====",JSON.stringify(data))
                sy.scene.hideLoading();
                FloatLabelUtil.comText("举报成功");
                self.onCloseHandler()
            }
        },function (data) {
            sy.scene.hideLoading();
            FloatLabelUtil.comText("举报失败");
        });
    },

    onClickCancelBtn:function(){
        this.onCloseHandler()
    }
})
