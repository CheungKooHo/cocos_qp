/**
 * Created by Administrator on 2016/6/27.
 */
var DTZGiftRuleCell = ccui.Widget.extend({

    ctor:function(label){
        this._super();
        var text = UICtor.cLabel(label, 22, cc.size(900,0), cc.color("#8E6748"), 0, 0);
        text.anchorX=text.anchorY=0;
        this.addChild(text);
        this.setContentSize(text.width,text.height);
        this.x = 10;
    }

})

var DTZGiftRulePop = BasePopup.extend({

    ctor: function () {
        this._super("res/matchRulePop.json");
    },

    selfRender: function () {
        var list = this.getWidget("ListView_6");
        list.pushBackCustomItem(new DTZGiftRuleCell("兑换商城及任务系统规则："));
        list.pushBackCustomItem(new DTZGiftRuleCell(" "));
        list.pushBackCustomItem(new DTZGiftRuleCell("奖券获得途径："));
        list.pushBackCustomItem(new DTZGiftRuleCell("1、完成每日任务可获得相应奖券（每日限完成一次）；"));
        list.pushBackCustomItem(new DTZGiftRuleCell("2、在中高级娱乐场对局每次赢得的金币对应获得一定比例的奖券（无上限）；"));
        list.pushBackCustomItem(new DTZGiftRuleCell("3、更多奖券可在后续开启的活动获得；"));
        list.pushBackCustomItem(new DTZGiftRuleCell(" "));
        list.pushBackCustomItem(new DTZGiftRuleCell("奖券兑换："));
        list.pushBackCustomItem(new DTZGiftRuleCell("1、可用已拥有的奖券在兑换商城中兑换奖品；"));
        list.pushBackCustomItem(new DTZGiftRuleCell("2、奖品会不定时更新；"));
        list.pushBackCustomItem(new DTZGiftRuleCell("3、玩家可查看最近10条兑奖记录；"));
        list.pushBackCustomItem(new DTZGiftRuleCell("4、玩家兑奖后可联系客服微信kuailewan666进行领奖；"));
        list.pushBackCustomItem(new DTZGiftRuleCell(" "));
        //list.pushBackCustomItem(new MatchRuleCell("钻石赛奖励："));
        //list.pushBackCustomItem(new MatchRuleCell("每场比赛的前三名获得丰富钻石奖励"));
        //list.pushBackCustomItem(new MatchRuleCell("      第1名：3000钻；"));
        //list.pushBackCustomItem(new MatchRuleCell("      第2名：2000钻；"));
        //list.pushBackCustomItem(new MatchRuleCell("      第3名：1000钻；"));
        //list.pushBackCustomItem(new MatchRuleCell("      第4-6名：200钻；"));
        //list.pushBackCustomItem(new MatchRuleCell("      第7-12名：100钻；"));
    }
});