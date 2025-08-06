/**
 * Created by Administrator on 2016/6/27.
 */

var DTZGiftRecordItem = ccui.Widget.extend({
    ctor:function(){
        this._super();

        this.setContentSize(cc.size(650,65));

        var Panel_16=this.Panel_16= UICtor.cPanel(cc.size(650,65),cc.color(0,0,0),0);
        Panel_16.setAnchorPoint(cc.p(0,0));
        Panel_16.setPosition(0,0);
        var Image_matchCell1=this.Image_matchCell1= UICtor.cImg("res/ui/dtz/match/record/record_15.png");
        Image_matchCell1.setPosition(325,0);
        Panel_16.addChild(Image_matchCell1);
        var Label_time=this.Label_time= UICtor.cLabel("100",24,cc.size(0,0),cc.color(130,48,3),0,0);
        Label_time.setPosition(cc.p(-215+Image_matchCell1.getAnchorPointInPoints().x, 32+Image_matchCell1.getAnchorPointInPoints().y));
        Image_matchCell1.addChild(Label_time);
        var Label_name=this.Label_name= UICtor.cLabel("100",24,cc.size(0,0),cc.color(130,48,3),0,0);
        Label_name.setPosition(cc.p(-5+Image_matchCell1.getAnchorPointInPoints().x, 32+Image_matchCell1.getAnchorPointInPoints().y));
        Image_matchCell1.addChild(Label_name);
        var Label_state=this.Label_state= UICtor.cLabel("100",24,cc.size(0,0),cc.color(130,48,3),0,0);
        Label_state.setPosition(cc.p(200+Image_matchCell1.getAnchorPointInPoints().x, 32+Image_matchCell1.getAnchorPointInPoints().y));
        Image_matchCell1.addChild(Label_state);


        this.addChild(Panel_16);
    },

    setData:function(data){
        var time = this.getLocalTime(data.createdTime);
        this.Label_time.setString(""+time);

        this.Label_name.setString(""+data.itemName);
        this.Label_state.setString("无");

        var state = "";
        //1可领2已领取0没有奖励
       if(data.itemMsg == 0){
            state = "未领取";
            this.Label_state.setColor(cc.color(65,166,0));
        }else if(data.itemMsg > 0){
            state = "已领";
        }
        this.Label_state.setString(""+state);

    },

    getLocalTime:function(inputTime) {

        var date = new Date(inputTime);
        var y = date.getFullYear();
        var m = date.getMonth() + 1;
        m = m < 10 ? ('0' + m) : m;
        var d = date.getDate();
        d = d < 10 ? ('0' + d) : d;
        var h = date.getHours();
        h = h < 10 ? ('0' + h) : h;
        var minute = date.getMinutes();
        var second = date.getSeconds();
        minute = minute < 10 ? ('0' + minute) : minute;
        second = second < 10 ? ('0' + second) : second;
        return y + '-' + m + '-' + d+'\n '+h+':'+minute+':'+second;

        //var now = new Date(time);
        //var year=now.getYear();
        //var month=now.getMonth()+1;
        //var date=now.getDate();
        //var hour=now.getHours();
        //var minute=now.getMinutes();
        //var second=now.getSeconds();
        //return "20"+year+"-"+month+"-"+date+"\n"+hour+":"+minute+":"+second;
    }
});
var DTZGiftRecordPop = BasePopup.extend({

    ctor: function (data) {
        this.data = JSON.parse(data);
        this._super("res/DTZGiftRecordPop.json");
    },
    selfRender: function () {

        this.ListView_record = this.getWidget("ListView_rank");
        this.showData(this.data);
    },

    showData:function(data){
        for(var i = 0;i < data.length;i++){
            var item = new DTZGiftRecordItem();
            item.setData(data[i]);
            this.ListView_record.pushBackCustomItem(item);
        }
    },


});