/**
 * Created by cyp on 2019/7/12.
 */
var RuleSelect_XTSDH = RuleSelectBase.extend({
    ctor:function(gametype,createlayer){
        this._super(gametype,createlayer);
        cc.log("RuleSelect_XTSDH::::::::::::::::::::::::::::::::::::::::", "湘潭三打哈!!!");
        this.updateItemShow();
    },

    setConfigData:function(){
        this.ruleConfig = [
            {title:"局数选择",type:1,content:["8局","12局","16局","4局"],col:4},//0
            {title:"房费",type:1,content:["AA支付","房主支付"],col:3},//1
            {title:"人数选择",type:1,content:["4人","3人"],col:3},//2
            {title:"玩法",type:2,content:["双进单出","允许查牌","报副留守","抽6","投降需询问","大倒提前结束", "叫分加拍","叫分进档","大倒封顶","长沙叫分","投降进档"],col:3},//3
            {title:"起叫",type:1,content:["100分","90分","80分","70分","60分"],col:3},//4
            {title:"小光",type:1,content:["30分小光","25分小光"],col:3},//5
            {title:"托管",type:1,content:["不托管","1分钟","2分钟","3分钟","5分钟"],col:3},//6
            {title:"托管",type:1,content:["单局托管","整局托管","三局托管"],col:3},//7
        ];
        this.defaultConfig = [[0],[1],[0],[],[2],[0],[0],[0]];
        if(this.createRoomLayer.clubData){
            if(ClickClubModel.getClubIsOpenLeaderPay()){
                this.ruleConfig[1].content = ["群主支付"];
                this.defaultConfig[1][0] = 0;
            }
            var params = this.createRoomLayer.clubData.wanfaList;
            if(params[1] == SDHGameType.XTSDH){
                this.readSelectData(params);
            }
        }
        return true;
    },

    onShow:function(){
        this.updateZsNum();
    },

    changeHandle:function(item){
        var tag = item.getTag();
        if(tag < 300){
            this.updateZsNum();
        }

        if(tag == 307 && item.isSelected()){
            this.getItemByIdx(3,10).setSelected(false);
        }

        if(tag == 310 && item.isSelected()){
            this.getItemByIdx(3,7).setSelected(false);
        }

        this.updateItemShow();
    },

    updateItemShow:function(){
        var istg = !this.getItemByIdx(6,0).isSelected();
        this.layoutArr[7].setVisible(istg);

        var jfjp = this.getItemByIdx(3,6).isSelected();
        this.getItemByIdx(3,9).setItemState(jfjp);
    },

    updateZsNum:function(){
        cc.log("updateZsNum in RuleSelect_SDH");
        var zsNum = 5;
        var zsNumArr = [5,8,10,5];
        var temp = 0;
        var renshu = 4;
        for(var i = 0;i<2;++i){
            if(this.getItemByIdx(2,i).isSelected()){
                renshu = 4-i;
                break;
            }
        }

        for(var i = 0;i<4;++i){
            var item = this.getItemByIdx(0,i);
            if(item.isSelected()){
                temp = i;
                break;
            }
        }

        if(this.createRoomLayer.clubData && ClickClubModel.getClubIsOpenLeaderPay()){
            zsNum = zsNumArr[temp];
        }else{
            if(this.getItemByIdx(1,0).isSelected()){
                zsNum = Math.ceil(zsNumArr[temp]/renshu);
            }else{
                zsNum = zsNumArr[temp]
            }
        }

        this.createRoomLayer && this.createRoomLayer.updateZsNum(zsNum);
    },

    getSocketRuleData:function(){
        var data = {params:[],strParams:""};
        var jushu = 8;
        for(var i = 0;i<3;++i){
            if(this.getItemByIdx(0,i).isSelected()){
                jushu = 8 + 4*i;
                break;
            }
        }
        if(this.getItemByIdx(0,3).isSelected())jushu = 4;

        var costway = 1;
        if(this.createRoomLayer.clubData && ClickClubModel.getClubIsOpenLeaderPay()){
            costway = 3;
        }else{
            if(this.getItemByIdx(1,1).isSelected())costway = 2;
        }

        var renshu = 4;
        for(var i = 0;i<2;++i){
            if(this.getItemByIdx(2,i).isSelected()){
                renshu = 4-i;
                break;
            }
        }

        var sjdc = 0;
        if(this.getItemByIdx(3,0).isSelected()){
            sjdc = 1;
        }

        var yxcp = 0;
        if(this.getItemByIdx(3,1).isSelected()){
            yxcp = 1;
        }

        var bfls = 0;
        if(this.getItemByIdx(3,2).isSelected()){
            bfls = 1;
        }

        var chouliu = 0;
        if(this.getItemByIdx(3,3).isSelected()){
            chouliu = 1;
        }

        var txxxw = 0;
        if(this.getItemByIdx(3,4).isSelected()){
            txxxw = 1;
        }

        var qijiao = 100;
        for(var i = 0;i<5;++i){
            if(this.getItemByIdx(4,i).isSelected()){
                qijiao = 100 - i*10;
            }
        }


        var ddtqjs = 0;
        if(this.getItemByIdx(3,5).isSelected()){
            ddtqjs = 1;
        }

        var jfjp = 0;
        if(this.getItemByIdx(3,6).isSelected()){
            jfjp = 1;
        }

        var jfjingdang = 0;
        if(this.getItemByIdx(3,7).isSelected()){
            jfjingdang = 1;
        }

        var ddfd = 0;
        if(this.getItemByIdx(3,8).isSelected()){
            ddfd = 1;
        }

        var csjf = 0;//长沙叫分
        if(this.getItemByIdx(3,9).isSelected()){
            csjf = 1;
        }

        var txjd = 0;//投降进档
        if(this.getItemByIdx(3,10).isSelected()){
            txjd = 1;
        }

        var xiaoguofen = 0;
        if(this.getItemByIdx(5,1).isSelected()){
            xiaoguofen = 1;
        }

        var tuoguan =0;
        for(var i = 0;i<4;++i){
            if(this.getItemByIdx(6,i).isSelected()){
                tuoguan = i*60;
                break;
            }
        }
        if(this.getItemByIdx(6,4).isSelected()){
            tuoguan = 300;
        }
        var tuoguan_type = 2;
        for(var i = 0;i<3;++i){
            if (this.getItemByIdx(7,i).isSelected()){
                tuoguan_type = i+1;
            }
        }


        data.params = [
            jushu,//局数 0
            SDHGameType.XTSDH,//玩法ID 1
            costway,//支付方式 2
            sjdc,//双进单出 3
            bfls,//报副留守 4
            yxcp,//允许查牌 5
            chouliu,//抽六 6
            renshu,//人数 7
            txxxw,//投降需询问 8
            qijiao,//起叫分 9
            xiaoguofen,//小光分 10
            ddtqjs,//大倒提前结束 11
            jfjp,//叫分加拍 12
            jfjingdang,//叫分进档 13
            tuoguan,//托管时间 14
            tuoguan_type,//托管类型 15
            ddfd,//大倒封顶 16
            csjf,//长沙叫分 17
            txjd,//投降进档 18
        ];

        cc.log("data.params =",JSON.stringify(data))
        return data;
    },

    //单独获取游戏类型id,支付方式选项,局数,人数的选择项
    //用于俱乐部的创建
    getWanfas:function(){
        var jushu = 4;
        for(var i = 0;i<3;++i){
            if(this.getItemByIdx(0,i).isSelected()){
                jushu = Math.pow(2,i)*4;
                break;
            }
        }
        if(this.getItemByIdx(0,3).isSelected())jushu = 4;

        var costway = 1;
        if(this.createRoomLayer.clubData && ClickClubModel.getClubIsOpenLeaderPay()){
            costway = 3;
        }else{
            if(this.getItemByIdx(1,1).isSelected())costway = 2;
        }


        var renshu = 4;
        for(var i = 0;i<2;++i){
            if(this.getItemByIdx(2,i).isSelected()){
                renshu = 4-i;
                break;
            }
        }
        return [SDHGameType.XTSDH,costway,jushu,renshu];
    },

    //俱乐部创建玩法包厢,读取配置选项
    readSelectData:function(params){
        var defaultConfig = [[0],[1],[0],[],[2],[0],[0],[0]];

        defaultConfig[0][0] = params[0] == 16?2:params[0] == 12?1:params[0]==4?3:0;
        defaultConfig[1][0] = params[2] == 3?0:params[2] - 1;
        defaultConfig[2][0] = params[7] == 3?1:0;

        if(params[3] == "1")defaultConfig[3].push(0);
        if(params[5] == "1")defaultConfig[3].push(1);
        if(params[4] == "1")defaultConfig[3].push(2);
        if(params[6] == "1")defaultConfig[3].push(3);
        if(params[8] == "1")defaultConfig[3].push(4);
        if(params[11] == "1")defaultConfig[3].push(5);
        if(params[12] == "1")defaultConfig[3].push(6);
        if(params[13] == "1")defaultConfig[3].push(7);
        if(params[16] == "1")defaultConfig[3].push(8);
        if(params[17] == "1")defaultConfig[3].push(9);
        if(params[18] == "1")defaultConfig[3].push(10);

        var qjIdx = 2;
        if(params[9] > 1){
            qjIdx = parseInt((100 - params[9])/10);
        }else if(params[9] == 1){
            qjIdx = 4;
        }
        defaultConfig[4][0] = qjIdx;

        defaultConfig[5][0] = params[10] == 1?1:0;

        defaultConfig[6][0] = params[14]?params[14] == 300?4:params[14]/60:0;
        defaultConfig[7][0] = (params[15]>0?(params[15]-1):1);


        this.defaultConfig = defaultConfig;
    },
});