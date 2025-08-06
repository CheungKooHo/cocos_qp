/**
 * Created by Administrator on 2016/6/27.
 */
var MoneyRuleCell = ccui.Widget.extend({

    ctor:function(label){
        this._super();
        var text = UICtor.cLabel(label, 22, cc.size(900,0), cc.color("#8E6748"), 0, 0);
        text.anchorX=text.anchorY=0;
        this.addChild(text);
        this.setContentSize(text.width,text.height);
        this.x = 10;
    }

})

var DTZMoneyRulePop = BasePopup.extend({

    ctor: function () {
        this._super("res/dtzMoneyRulePop.json");
    },

    selfRender: function () {
        var list = this.getWidget("ListView_6");
        list.pushBackCustomItem(new MoneyRuleCell("打筒子娱乐场默认采用3人3副牌，暗9张，随机出头，无奖励分，超时自动托管。"));
        list.pushBackCustomItem(new MoneyRuleCell(" "));
        list.pushBackCustomItem(new MoneyRuleCell("输赢积分=（牌面分+筒子分+地炸分+上下游分）*房间倍率。"));
        list.pushBackCustomItem(new MoneyRuleCell(" "));
        list.pushBackCustomItem(new MoneyRuleCell("每人每局系统根据场次自动收取数量不等的房间服务费。"));
        list.pushBackCustomItem(new MoneyRuleCell(" "));
        list.pushBackCustomItem(new MoneyRuleCell("个人积分不足以全额赔付时，先扣除房间服务费，再将剩余的积分赔付给赢家。"));
        list.pushBackCustomItem(new MoneyRuleCell(" "));
        list.pushBackCustomItem(new MoneyRuleCell("个人积分不足以全额赔付且有多个赢家的情况下，先扣除房间服务费再将剩余的积分按赢分比例赔付给多个赢家。"));

        list.pushBackCustomItem(new MoneyRuleCell(" "));
        list.pushBackCustomItem(new MoneyRuleCell(" "));
        list.pushBackCustomItem(new MoneyRuleCell("跑得快娱乐场默认采用16张，随机出头，超时自动托管。"));
        list.pushBackCustomItem(new MoneyRuleCell(" "));
        list.pushBackCustomItem(new MoneyRuleCell("输赢积分=（剩余牌数+炸弹分）*房间倍率。"));
        list.pushBackCustomItem(new MoneyRuleCell(" "));
        list.pushBackCustomItem(new MoneyRuleCell("积分结算上限：胜利时赢取积分数量≤自己积分数量，例如：自己只有5000积分，在胜利结算时，最高只能赢取5000积分。"));
        list.pushBackCustomItem(new MoneyRuleCell(" "));
        list.pushBackCustomItem(new MoneyRuleCell("其他规则同上。"));

    }
});