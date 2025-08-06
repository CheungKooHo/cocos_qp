/**
 * Created by zhoufan on 2017/7/26.
 */
var MJRoomInfoCell = ccui.Widget.extend({

    ctor:function(data){
        this._super();
        var label = UICtor.cLabel(data.content1,30,cc.size(250,36),cc.color("#745E47"),0,2);
        label.anchorX = label.anchorY = 0;
        label.x = 0;
        label.y = 0;
        this.addChild(label);
        if(data.content2) {
            var label = UICtor.cLabel(data.content2,30,cc.size(250,36),cc.color("#745E47"),0,2);
            label.anchorX = label.anchorY =0;
            label.x = 280;
            label.y = 0;
            this.addChild(label);
        }
        this.setContentSize(500,36);
    }
});
var MJRoomInfoPop = BasePopup.extend({

    ctor: function() {
        this._super("res/mjRoomInfo.json");
    },

    selfRender: function() {
        this.ListView_14 = this.getWidget("ListView_14");
        var data = [];
        data.push(MJRoomModel.totalBurCount+"局");
        data.push(MJRoomModel.getFangFeiName(MJRoomModel.getFangFei()));
        data.push(MJRoomModel.getZuiZiName(MJRoomModel.getFuType()));
        data.push(MJRoomModel.getChiPengName(MJRoomModel.getChiPengConf()));
        data.push(MJRoomModel.getJiangLeiName(MJRoomModel.getJiangLeiConf()));
        data.push(MJRoomModel.getJiangName(MJRoomModel.getJiangConf()));
        data.push(MJRoomModel.getTingHuName(MJRoomModel.getTingHuConf()));
        data.push(MJRoomModel.getJiFenName(MJRoomModel.getJiFenConf()));
        data.push(MJRoomModel.getHuCountName(MJRoomModel.getHuCountConf()));
        for (var i=1;i<=2;i++) {
            var str = MJRoomModel.getKeXuanName(i);
            if (str!="") {
                data.push(str);
            }
        }
        for(var i=0;i<data.length;i++) {
            var obj = {};
            obj.content1 = data[i];
            if(data[i+1]) {
                obj.content2 = data[i+1];
                i+=1;
            }
            this.ListView_14.pushBackCustomItem(new MJRoomInfoCell(obj));
        }
    }

});
