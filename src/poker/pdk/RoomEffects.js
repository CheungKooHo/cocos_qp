/**
 * Created by Administrator on 2016/7/9.
 */
var RoomEffects = {

    getPlayerSeq:function(seat){
        var seqArray = PDKRoomModel.seatSeq[PDKRoomModel.mySeat];
        var seq = ArrayUtil.indexOf(seqArray,seat)+1;
        return seq;
    },

    arriveTarget:function(root,target,tplayer,beilv){
        var seat = tplayer._playerVo.seat;
        var seq = this.getPlayerSeq(seat);
        var point = (PDKRoomModel.renshu-1)*beilv;
        tplayer.updatePointByBomb(point);
        var label = new cc.LabelBMFont("+" + point,"res/font/font_res_huang.fnt");
        label.x = target.x;
        label.y = target.y-30;
        if(seq == 3 || seq == 1){
            label.anchorX = 0;
            label.x = target.x - 50;
        }else if(seq == 2){
            label.anchorX = 1;
            label.x = target.x + 50;
        }
        root.addChild(label,3000);
        label.runAction(cc.sequence(cc.moveTo(1,label.x,target.y+50),cc.callFunc(function(){
            label.removeFromParent(true);
        })));
    },

    addFloatLabel:function(root,startPlace,target,tplayer,point,seat,otherSeat){
        //汪海望要求修改动画
        var seq = this.getPlayerSeq(seat);
        var otherSeq = this.getPlayerSeq(otherSeat);
        var label = new cc.LabelBMFont("-"+point,"res/font/font_res_hui.fnt");
        label.x = startPlace.x;
        if(otherSeq == 3 || otherSeq == 1){
            label.anchorX = 0;
            label.x = startPlace.x - 50;
        }else if(otherSeq == 2){
            label.anchorX = 1;
            label.x = startPlace.x + 50;
        }
        label.y = startPlace.y;
        root.addChild(label,3000);
        var self = this;
        label.runAction(cc.sequence(cc.moveTo(1,label.x,startPlace.y+50),cc.callFunc(function(){
            label.removeFromParent(true);
        })));
        if(tplayer)
            this.arriveTarget(root,target,tplayer,point);
    },

    /**
     * 炸弹实时展示扣分效果
     * @param players {Array.<CardPlayer>}
     * @param root {UIWidget}
     * @param seat {number}
     */
    bomb:function(players,root,seat,beilv){
        var beilv = beilv || 1;
        var point = beilv*10;
        var target = ccui.helper.seekWidgetByName(root,"player"+this.getPlayerSeq(seat));
        var others = PDKRoomModel.seatSeq[seat];
        for(var i=0;i<others.length;i++){
            if(i>0){
                var otherSeat = others[i];
                var seq = this.getPlayerSeq(otherSeat);
                var startPlace = ccui.helper.seekWidgetByName(root,"player"+seq);
                players[otherSeat].updatePointByBomb(-point);
                var tplayer = (i==(others.length-1)) ? players[seat] : null;
                this.addFloatLabel(root,startPlace,target,tplayer,point,seat,otherSeat);
            }
        }
    },

    finish:function(animate){
        animate.stop();
        animate.removeFromParent(true);
    },

    /**
     *
     * @param root
     * @param cardPattern {CardPattern}
     */
    play:function(root,cardPattern){
        if(!cardPattern)
            return;
        var type = cardPattern.type;
        var plist = "";
        var prefix = "";
        var unit = 0;
        var x = root.width/2;
        var y = root.height/2;
        // if(type == AI.PAIR && cardPattern.length>2){
        //     plist = "res/plist/liandui.plist";
        //     prefix = "liandui";
        //     unit = 1/12;
        // }else if(type == AI.BOMB){
        if(type == AI.BOMB){
            plist = "res/plist/zhadan.plist";
            prefix = "zhadan";
            unit = 1/16;
            y+=80;
        }else if(type == AI.PLANE){
            plist = "res/plist/feiji.plist";
            prefix = "feiji";
            unit = 1/16;
            x=root.width;
        }
        // }else if(type == AI.SHUNZI){
        //     plist = "res/plist/shunzi.plist";
        //     prefix = "shunzi";
        //     unit = 1/16;
        // }
        if(plist!="" && prefix!="" && unit>0){
            var self = this;
            var action = null;
            var animate = new AnimateSprite(plist,prefix,unit);
            if(type == AI.PLANE){
                action = cc.sequence(cc.moveTo(1.5,0,root.height/2),cc.callFunc(function(){
                    self.finish(animate);
                }))
            }else{
                animate.setRepeatTimes(1);
                animate.setCallBack(this.finish,this);
            }
            animate.play();
            animate.x = x;
            animate.y = y;
            root.addChild(animate,1000);
            if(action){
                animate.runAction(action);
            }
        }
    }

}