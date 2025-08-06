/**
 * Created by Administrator on 2016/6/27.
 */

var MatchRecordItem = ccui.Widget.extend({
    ctor:function(){
        this._super();

        this.setContentSize(cc.size(813,65));

        var Panel_16=this.Panel_16= UICtor.cPanel(cc.size(813,65),cc.color(0,0,0),0);
        Panel_16.setAnchorPoint(cc.p(0,0));
        Panel_16.setPosition(0,0);
        var Image_matchCell1=this.Image_matchCell1= UICtor.cImg("res/ui/dtz/match/record/record_2.png");
        Image_matchCell1.setPosition(406,0);
        Panel_16.addChild(Image_matchCell1);
        var Label_time=this.Label_time= UICtor.cLabel("千钻挑战赛哈",24,cc.size(0,0),cc.color(130,48,3),0,0);
        Label_time.setPosition(cc.p(-318+Image_matchCell1.getAnchorPointInPoints().x, 32+Image_matchCell1.getAnchorPointInPoints().y));
        Image_matchCell1.addChild(Label_time);
        var Label_name=this.Label_name= UICtor.cLabel("跑得快",24,cc.size(0,0),cc.color(130,48,3),0,0);
        Label_name.setPosition(cc.p(-124+Image_matchCell1.getAnchorPointInPoints().x, 32+Image_matchCell1.getAnchorPointInPoints().y));
        Image_matchCell1.addChild(Label_name);
        var Label_rank=this.Label_rank= UICtor.cLabel("100钻",24,cc.size(0,0),cc.color(130,48,3),0,0);
        Label_rank.setPosition(cc.p(46+Image_matchCell1.getAnchorPointInPoints().x, 32+Image_matchCell1.getAnchorPointInPoints().y));
        Image_matchCell1.addChild(Label_rank);
        var Label_reward=this.Label_reward= UICtor.cLabel("钻",24,cc.size(0,0),cc.color(130,48,3),0,0);
        Label_reward.setPosition(cc.p(190+Image_matchCell1.getAnchorPointInPoints().x, 32+Image_matchCell1.getAnchorPointInPoints().y));
        Image_matchCell1.addChild(Label_reward);
        var Label_state=this.Label_state= UICtor.cLabel("已领",24,cc.size(0,0),cc.color(130,48,3),0,0);
        Label_state.setPosition(cc.p(331+Image_matchCell1.getAnchorPointInPoints().x, 32+Image_matchCell1.getAnchorPointInPoints().y));
        Image_matchCell1.addChild(Label_state);


        this.addChild(Panel_16);
    },

    setData:function(data){
        var time = this.getLocalTime(data.createdTime);
        this.Label_time.setString(""+time);
        this.Label_name.setString(""+data.matchName);
        this.Label_rank.setString(""+data.userRank);
        this.Label_reward.setString("无");
        if (data.userAward){
            this.Label_reward.setString(""+data.userAward);
        }

        var state = "";
        //1可领2已领取0没有奖励
        if (data.awardState == 0){
            state = "无";
        }else if(data.awardState == 1){
            state = "未领取";
            this.Label_state.setColor(cc.color(65,166,0));
        }else if(data.awardState == 2){
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
var MatchRecordPop = BasePopup.extend({

    ctor: function (data) {
        this.data = JSON.parse(data);
        this._super("res/matchRecordPop.json");
    },
    //JS: ComResponder::{"code":107,"params":[2,1,2,9],"strParams":["金币*3000,积分*10"]
    selfRender: function () {

        this.ListView_record = this.getWidget("ListView_record");
        this.showData(this.data);
    },

    showData:function(data){
        for(var i = 0;i < data.length;i++){
            var item = new MatchRecordItem();
            item.setData(data[i]);
            this.ListView_record.pushBackCustomItem(item);
        }
    },


});