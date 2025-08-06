/**
 * Created by Administrator on 2016/6/27.
 */

var DTZInviteCell = ccui.Widget.extend({
    ctor:function(){
        this._super();

        this.userName = "玩家名字";

        this.setContentSize(cc.size(605,80));

        var Panel_16=this.Panel_16= UICtor.cPanel(cc.size(605,80),cc.color(0,0,0),0);
        Panel_16.setAnchorPoint(cc.p(0,0));
        Panel_16.setPosition(0,0);
        var Image_matchCell1=this.Image_matchCell1= UICtor.cImg("res/ui/dtz/invite/invite_1.png");
        Image_matchCell1.setPosition(302,0);
        Panel_16.addChild(Image_matchCell1);
        var Label_name=this.Label_name= UICtor.cLabel("100",24,cc.size(0,0),cc.color(130,48,3),0,0);
        Label_name.setPosition(cc.p(-205+Image_matchCell1.getAnchorPointInPoints().x, 38+Image_matchCell1.getAnchorPointInPoints().y));
        Image_matchCell1.addChild(Label_name);
        var Button_choose=this.Button_choose= UICtor.cBtn("res/ui/dtz/invite/invite_2.png");
        Button_choose.setPosition(cc.p(177+Image_matchCell1.getAnchorPointInPoints().x, 38+Image_matchCell1.getAnchorPointInPoints().y));
        Image_matchCell1.addChild(Button_choose);

        UITools.addClickEvent(Button_choose, this, this.onInvite);


        this.addChild(Panel_16);
    },

    setData:function(data){
        //if (data.userName){
        //    this.Label_name.setString(""+data.userName);
        //    this.userName = data.userName;
        //}
    },

    onInvite:function(){
        cc.log("给"+ this.userName +"发送邀请")
    }
});
var DTZInvitePop = BasePopup.extend({

    ctor: function (data) {
        //this.data = JSON.parse(data);
        this.data = [];
        this._super("res/dtzInvitePop.json");
    },
    selfRender: function () {

        var Button_choose = this.getWidget("chooseBtn");
        UITools.addClickEvent(Button_choose, this, this.onInvite);

        this.ListView_data = this.getWidget("ListView_data");

        this.showData(this.data);
    },

    showData:function(data){
        //for(var i = 0;i < data.length;i++){
            for(var i = 0;i < 10;i++){
            var item = new DTZInviteCell();
            item.setData(data[i]);
            this.ListView_data.pushBackCustomItem(item);
        }
    },

    onInvite:function(){
        cc.log("一键邀请所有人");
    }


});