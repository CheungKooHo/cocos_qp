/**
 * Created by zhoufan on 2016/10/22.
 */
var MJJetton = cc.Sprite.extend({

    ctor:function(){
        this._super("res/ui/nmw/common/coin_icon.png");
    },
    reuse:function() {
    },
    unuse:function() {
        this.retain();
    }

});
MJJetton.getFromPool = function(){
    if(cc.pool.hasObject(MJJetton)) {
        return cc.pool.getFromPool(MJJetton);
    }else{
        return new MJJetton();
    }
}
/**
 *
 * @param root
 * @param fromPlayer {MJPlayer}
 * @param targetPlayer {MJPlayer}
 * @param isDisPatch {boolean}
 */
MJJetton.runEffect = function(root,fromPlayer,targetPlayer,point,isDisPatch){
    var MAX = point*2;
    var MAX_ZORDER = 2000;
    var runActionFunc = function(target,i,targetX,targetY,sprite){
        var action = cc.sequence(cc.delayTime(i*0.03),cc.moveTo(0.5,targetX,targetY),cc.callFunc(function(){
            sprite.setLocalZOrder(MAX_ZORDER+i);
            target.pushJettonData(sprite);
            if(target.getJettonCount()>10){
                target.shiftJettonData();
            }
        }));
        if(i==(MAX-1)){//最后一个到达，将之前的金币全部移除
            action = cc.sequence(cc.delayTime(i*0.03),cc.moveTo(0.5,targetX,targetY),cc.callFunc(function(){
                sprite.setLocalZOrder(MAX_ZORDER+i);
                target.pushJettonData(sprite);
                target.playJettonArmature();
            }),cc.delayTime(0.1),cc.callFunc(function(){
                target.cleanJettonData();
                AudioManager.stop("res/audio/mj/jetton.mp3");
                if(isDisPatch){
                    SyEventManager.dispatchEvent(SyEvent.DOUNIU_JETTON_FINISH,"");
                }
            }));
        }
        sprite.runAction(action);
    }
    AudioManager.play("res/audio/mj/jetton.mp3",true);
    var targetX = targetPlayer.getContainer().x;
    var targetY = targetPlayer.getContainer().y;
    var x = fromPlayer.getContainer().x;
    var y = fromPlayer.getContainer().y;
    for(var i=0;i<MAX;i++){
        var sprite = MJJetton.getFromPool();
        sprite.scale = 1.3;
        sprite.x=x//+MathUtil.mt_rand(-15,15);
        sprite.y=y//+MathUtil.mt_rand(-15,15);
        //targetX=targetX+MathUtil.mt_rand(-15,15);
        //targetY=targetY+MathUtil.mt_rand(-10,10);
        root.addChild(sprite,MAX_ZORDER-i);
        runActionFunc(targetPlayer,i,targetX,targetY,sprite);
    }
}