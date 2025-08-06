/**
 * Created by Administrator on 2016/6/27.
 */

var MatchRankItem = ccui.Widget.extend({
    ctor:function(){
        this._super();

        this.setContentSize(cc.size(650,45));

        var Panel_16=this.Panel_16= UICtor.cPanel(cc.size(650,45),cc.color(0,0,0),0);
        Panel_16.setAnchorPoint(cc.p(0,0));
        Panel_16.setPosition(0,0);
        var Image_matchCell1=this.Image_matchCell1= UICtor.cImg("res/ui/dtz/match/record/record_15.png");
        Image_matchCell1.setPosition(325,0);
        Panel_16.addChild(Image_matchCell1);
        var Label_rank=this.Label_rank= UICtor.cLabel("100",24,cc.size(0,0),cc.color(130,48,3),0,0);
        Label_rank.setPosition(cc.p(-215+Image_matchCell1.getAnchorPointInPoints().x, 23+Image_matchCell1.getAnchorPointInPoints().y));
        Image_matchCell1.addChild(Label_rank);
        var Label_name=this.Label_name= UICtor.cLabel("100",24,cc.size(0,0),cc.color(130,48,3),0,0);
        Label_name.setPosition(cc.p(-10+Image_matchCell1.getAnchorPointInPoints().x, 23+Image_matchCell1.getAnchorPointInPoints().y));
        Image_matchCell1.addChild(Label_name);
        var Label_score=this.Label_score= UICtor.cLabel("100",24,cc.size(0,0),cc.color(130,48,3),0,0);
        Label_score.setPosition(cc.p(195+Image_matchCell1.getAnchorPointInPoints().x, 23+Image_matchCell1.getAnchorPointInPoints().y));
        Image_matchCell1.addChild(Label_score);



        this.addChild(Panel_16);
    },

    setData:function(data,dataType){
        if (dataType == 1){
            this.Label_score.setString(""+data.name);
            this.Label_rank.setString(""+data.rank);
            this.Label_name.setString("");
        }else{
            this.Label_name.setString(""+data.userName);
            this.Label_rank.setString(""+data.rank);
            var scoreStr = data.score;
            if (data.alive == 0){
                scoreStr = "淘汰";
            }
            this.Label_score.setString(""+scoreStr);
        }
    },
});
var MatchRankPop = BasePopup.extend({

    ctor: function (data) {
        this.data = JSON.parse(data);
        this.rewardData = [];
        this.rankData = [];
        this._super("res/matchRankPop.json");
    },
    //JS: ComResponder::{"code":107,"params":[2,1,2,9],"strParams":["金币*3000,积分*10"]
    selfRender: function () {
        this.rewardData = this.data.award;
        this.rankData = this.data.rank;

        this.Label_name = this.getWidget("Label_name");
        this.Label_score = this.getWidget("Label_score");

        this.ListView_rank = this.getWidget("ListView_rank");

        var rewardBtn = this.getWidget("rewardBtn");
        rewardBtn.temp = 1;
        UITools.addClickEvent(rewardBtn,this,this.onChange);

        var rankBtn = this.getWidget("rankBtn");
        rankBtn.temp = 2;
        UITools.addClickEvent(rankBtn,this,this.onChange);

        this.onChange(rankBtn);
    },
    onChange:function(obj){
        var temp = obj.temp;
        if (temp == 1){
            this.getWidget("rewardBtn").setTouchEnabled(false);
            this.getWidget("rewardBtn").setBright(false);
            this.getWidget("rankBtn").setTouchEnabled(true);
            this.getWidget("rankBtn").setBright(true);
            this.Label_name.setString("");
            this.Label_score.setString("奖励");
        }else{
            this.getWidget("rewardBtn").setTouchEnabled(true);
            this.getWidget("rewardBtn").setBright(true);
            this.getWidget("rankBtn").setTouchEnabled(false);
            this.getWidget("rankBtn").setBright(false);
            this.Label_name.setString("昵称");
            this.Label_score.setString("积分");
        }
        this.showData(temp)
    },

    showData:function(temp){
        this.ListView_rank.removeAllItems();
        if (temp == 1){
            for (var rank in this.rewardData) {
                var data = {};
                data.rank = rank;
                data.name = this.rewardData[rank];
                var item = new MatchRankItem();
                item.setData(data,temp);
                this.ListView_rank.pushBackCustomItem(item);
            }
        }else{
            for(var i = 0;i < this.rankData.length;i++){
                var data = this.rankData;
                var item = new MatchRankItem();
                item.setData(data[i],temp);
                this.ListView_rank.pushBackCustomItem(item);
            }
        }
    },


});