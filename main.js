var sy = sy || {};
var globalVar = {};
cc.game.onStart = function () {
  console.log('onStart');
  //根据不同平台 选择不同的分辨率适应
  //根据不同平台 选择不同的分辨率适应
  if (!cc.sys.isNative) {
    var displayMode = cc.ResolutionPolicy.SHOW_ALL;
    sy.realWidthSize = cc.winSize.width;
    sy.realHeightSize = cc.winSize.height;
    sy.imagepath = 'res/imgRes/';
    sy.timeid = -1;
    cc.view.adjustViewPort(true);
    cc.view.setDesignResolutionSize(1280, 720, cc.ResolutionPolicy.SHOW_ALL);
    //自适应随窗口大小变化。
    cc.view.resizeWithBrowserSize(true);
    cc.director.runScene(new AssetsManagerLoaderScene());
  } else {
    var displayMode = cc.ResolutionPolicy.FIXED_HEIGHT;
    sy.imagepath = 'res/imgRes/';
    sy.timeid = -1;
    cc.view.adjustViewPort(true);
    cc.view.setDesignResolutionSize(1280, 720, displayMode);
    cc.director.runScene(new AssetsManagerLoaderScene());
  }
};
cc.game.run();
