var ZERO = 0;
var X = 1;

function Matrix(){
    this.actualPawn = ZERO;
    this.matrix = [
        [null, null, null],
        [null, null, null],
        [null, null, null]
    ];
    this.onPawnAdded = function(){};
}

Matrix.prototype.takePlace = function(event) {
    if(this.matrix[event.row][event.col] !== null)
        return;
    this.matrix[event.row][event.col] = this.actualPawn;
    var evt = {
                x0: event.x0,
                y0: event.y0,
                x1: event.x1,
                y1: event.y1,
                index: event.index,
                row: event.row,
                col: event.col,
                pawn: this.actualPawn
            };
    this.onPawnAdded(evt);
    this.nextPawn();
}

Matrix.prototype.nextPawn = function() {
    this.actualPawn = this.actualPawn === ZERO ? X : ZERO;
}

function ActionManager(mainLayer) {
    this.mainLayer = mainLayer;
}

ActionManager.prototype.getGridDivision = function(x, y) {
     var xOffset = this.mainLayer.sprite.x,
         yOffset = this.mainLayer.sprite.y;
    //console.log("Offset: " + xOffset + ", " + yOffset);
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
                    index: index,
                    row: row,
                    col: col
                };
            }
            index++;
        }
    }
}

var aM = new ActionManager();
var matrix = new Matrix();

var HelloWorldLayer = cc.Layer.extend({
    sprite:null,
    ctor:function () {
        this._super();
        var self = this;
        var size = cc.winSize;
        
        var helloLabel = new cc.LabelTTF("TicTacToe V0.1", "Arial", 38);
        helloLabel.x = size.width / 2;
        helloLabel.y = size.height / 2 + 200;
        this.addChild(helloLabel, 5);
    
        this.sprite = new cc.Sprite(res.tablero_png);
        this.sprite.attr({
            x: size.width/2 - this.sprite.width/2,
            y: size.height/2 - this.sprite.height/2,
            anchorX: 0,
            anchorY: 0
        });
        this.addChild(this.sprite, 0);
        
        matrix.onPawnAdded = function(evt){
            var img = evt.pawn === ZERO ? res.O_png: res.X_png;
            var sprite = new cc.Sprite(img);
            sprite.attr({
                x: evt.x0,
                y: evt.y0,
                anchorX: 0,
                anchorY: 0
            });
            self.addChild(sprite, 1);
        };
        
        return true;
    }
});



var HelloWorldScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new HelloWorldLayer();
        this.addChild(layer);
        aM.mainLayer = layer;
        
        cc.eventManager.addListener({
            event: cc.EventListener.MOUSE,
            onMouseUp: function(event){                             
                var x = event.getLocationX();
                var y = event.getLocationY();
                var evt = aM.getGridDivision(x, y);
                if(evt)
                    matrix.takePlace(evt);
            }            
        }, layer);
    }
});