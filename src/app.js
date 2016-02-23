function ActionManager(mainLayer){
    this.mainLayer = mainLayer;
}

ActionManager.prototype.paintPawn = function(x, y){
     var xOffset = this.mainLayer.sprite.x,
         yOffset = this.mainLayer.sprite.y;
    console.log("Offset: " + xOffset + ", " + yOffset);
    var grid = {
        x: 21,
        y: 23,
        w: 88,
        h: 99
    };
    var index = 0;
    //console.log("Mouse: " + x + " " + y);
    for(var row = 0; row < 3; row++) {
        for(var col = 0; col < 3; col++) {
            var x0 = (grid.x * (col + 1)) + (grid.w * col) + xOffset;
            var y0 = (grid.y * (row + 1))+ (grid.h * row) + yOffset;
            var x1 = x0 + grid.w;
            var y1 = y0 + grid.h;
            //console.log("x0: " + x0 + " x1: " + x1 + " y0: " + y0 + " y1: " + y1);
            if(x >= x0 && x <= x1 && y >= y0 && y <= y1){
                //console.log("yes: " + x + " " + y);
                return {
                    x0: x0,
                    y0: y0,
                    x1: x1,
                    y1: y1,
                    index: index
                };
            }
            index++;
        }
    }
}

var HelloWorldLayer = cc.Layer.extend({
    sprite:null,
    ctor:function () {
        //////////////////////////////
        // 1. super init first
        this._super();

        /////////////////////////////
        // 2. add a menu item with "X" image, which is clicked to quit the program
        //    you may modify it.
        // ask the window size
        var size = cc.winSize;

        /////////////////////////////
        // 3. add your codes below...
        // add a label shows "Hello World"
        // create and initialize a label
        var helloLabel = new cc.LabelTTF("TicTacToe V0.1", "Arial", 38);
        // position the label on the center of the screen
        helloLabel.x = size.width / 2;
        helloLabel.y = size.height / 2 + 200;
        // add the label as a child to this layer
        this.addChild(helloLabel, 5);

        // add "HelloWorld" splash screen"
        this.sprite = new cc.Sprite(res.tablero_png);
        this.sprite.attr({
            x: size.width/2 - this.sprite.width/2,
            y: size.height/2 - this.sprite.height/2,
            anchorX: 0,
            anchorY: 0
        });
        this.addChild(this.sprite, 0);

        return true;
    }
});

var aM = new ActionManager();

var HelloWorldScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new HelloWorldLayer();
        this.addChild(layer);
        aM.mainLayer = layer;
        
        cc.eventManager.addListener({
            event: cc.EventListener.MOUSE,
            onMouseMove: function(event){
                var str = "MousePosition X: " + event.getLocationX() + "  Y:" + event.getLocationY();
                // do something...
            },
            onMouseUp: function(event){
                var str = "Mouse Up detected, Key: " + event.getButton();                
                var x = event.getLocationX();
                var y = event.getLocationY();
                var i = aM.paintPawn(x, y);
                console.log(i);
            },
            onMouseDown: function(event){
                var str = "Mouse Down detected, Key: " + event.getButton();
            },
            onMouseScroll: function(event){
                var str = "Mouse Scroll detected, X: " + event.getLocationX() + "  Y:" + event.getLocationY();
            }
        }, layer);
    }
});