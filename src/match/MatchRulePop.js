/**
 * Created by Administrator on 2016/6/27.
 */
var MatchRuleCell = ccui.Widget.extend({

    ctor:function(label){
        this._super();
        var text = UICtor.cLabel(label, 22, cc.size(900,0), cc.color("#8E6748"), 0, 0);
        text.anchorX=text.anchorY=0;
        this.addChild(text);
        this.setContentSize(text.width,text.height);
        this.x = 10;
    }

})

var MatchRulePop = BasePopup.extend({

    ctor: function () {
        this._super("res/matchRulePop.json");
    },

    selfRender: function () {
        var list = this.getWidget("ListView_6");
        list.pushBackCustomItem(new MatchRuleCell("钻石赛规则："));
        list.pushBackCustomItem(new MatchRuleCell(" "));
        list.pushBackCustomItem(new MatchRuleCell("比赛开始前20分钟状态变为即将开赛并且开始倒计时，当到比赛时间后即可分享报名进入比赛，报名满人后自动开赛；若本轮比赛一直未满人时下一场进入倒计时阶段，该轮比赛自动取消；"));
        list.pushBackCustomItem(new MatchRuleCell(" "));
        list.pushBackCustomItem(new MatchRuleCell("跑得快钻石赛默认采用16张，随机出头，超时自动托管，分为预赛和复赛两个阶段；"));
        list.pushBackCustomItem(new MatchRuleCell("1、预赛阶段玩家初始积分为15000分，倍率初始为1000,淘汰分初始为250，倍率和淘汰分根据时间的推移而增加；当玩家一局牌结束后低于淘汰分将直接被淘汰，否则继续下一局；"));
        list.pushBackCustomItem(new MatchRuleCell("2、当剩余人数达到18人时进入总分排名比较，排名前12的玩家晋级复赛； "));
        list.pushBackCustomItem(new MatchRuleCell("3、复赛阶段玩家初始积分为预赛最终积分的1%，倍率固定为100倍，总共3轮每轮3局；"));
        list.pushBackCustomItem(new MatchRuleCell("      第一轮3局结束后每个牌桌中积分最高的人直接晋级即有4人直接晋级，剩下2人由每个牌桌的总分第2的人进行排名取前2名，最终6人晋级第二轮比赛；"));
        list.pushBackCustomItem(new MatchRuleCell("      第二轮3局结束后每个场次中积分最高的人直接晋级即有2人直接晋级，剩下1人由每个场次的总分第2的人进行排名取第1名，最终3人晋级第三轮比赛；"));
        list.pushBackCustomItem(new MatchRuleCell("      第三轮3局结束后根据积分角逐出最终1,2,3名，并且发放奖励；"));
        list.pushBackCustomItem(new MatchRuleCell(" "));
        //list.pushBackCustomItem(new MatchRuleCell("钻石赛奖励："));
        //list.pushBackCustomItem(new MatchRuleCell("每场比赛的前三名获得丰富钻石奖励"));
        //list.pushBackCustomItem(new MatchRuleCell("      第1名：3000钻；"));
        //list.pushBackCustomItem(new MatchRuleCell("      第2名：2000钻；"));
        //list.pushBackCustomItem(new MatchRuleCell("      第3名：1000钻；"));
        //list.pushBackCustomItem(new MatchRuleCell("      第4-6名：200钻；"));
        //list.pushBackCustomItem(new MatchRuleCell("      第7-12名：100钻；"));
    }
});