/**
 * @name mobile event
 * @author zkk
 * @description
 * 	移动端常用事件
 */

var ztmEvent=function(dom){
	var that=this;
	dom.addEventListener("touchstart", function(event){that.touchStart(event)}, false);
	dom.addEventListener("touchmove", function(event){that.touchMove(event)}, false);
	dom.addEventListener("touchend", function(event){that.touchEnd(event)}, false);

	this.startX=null;
	this.endX=null;
	this.startY=null;
	this.endY=null;
	this.longTapTimes=500;  //长时间触摸门限
	this.longTapTimer=null;
	this.callback={
		tap:function(event){},  //触摸事件
		longTap:function(){},   //长时间触摸事件
		swipeLeft:function(count){},  //左划事件
		swipeRight:function(count){} , //右划事件
		swipeUp:function(count){},  //上划事件
		swipeDown:function(count){},  //下划事件

		swipeLeftUp:function(count){},  //左上事件
		swipeRightDown:function(count){},  //右下事件
		swipeLeftDown:function(count){},  //左下事件
		swipeRightUp:function(count){},  //右上事件

		swipeUping:function(count){},  //上划事件
		swipeDowning:function(count){},  //下划事件

	}
	this.setLongTapTimes=function(value){
		if(typeof value=="number"){
			this.longTapTimer=null;
		}
		return this;
	}
	
	this.on=function(callbackName, fn) {
		var callback = this.callback[callbackName];
		if (callback && typeof(fn) == "function") {
			 this.callback[callbackName]=fn;
		}
		return this;

	},
	this.setStartX=function(value){
		this.startX=value;
		return this;
	}
	this.getStartX=function(){
		return this.startX;
	}

	this.setStartY=function(value){
		this.startY=value;
		return this;
	}
	this.getStartY=function(){
		return this.startY;
	}

	this.setEndX=function(value){
		this.endX=value;
		return this;
	}
	this.getEndX=function(value){
		return this.endX;
	}

	this.setEndY=function(value){
		this.endY=value;
		return this;
	}
	this.getEndY=function(value){
		return this.endY;
	}


	this.touchStart=function(event){
		var that=this;
		var touch = event.touches[0];
		if(touch){
			this.setStartX(touch.pageX)
			this.setStartY(touch.pageY)

			this.callback.tap(this.getStartX(),this.getStartY(),event)
		}
		var tapStartTime = new Date().getTime()
		this.longTapTimer= setInterval(function(){
			var offset= new Date().getTime()-tapStartTime; 
			if(offset>that.longTapTimes){
				clearInterval(that.longTapTimer)
				that.callback.longTap(event)
			}	
		},20)
		event.preventDefault(); //阻止触摸时浏览器的缩放、滚动条滚动等  
	}

	this.touchMove=function(event){
    	this.setEndX(event.touches[0].pageX)
		this.setEndY(event.touches[0].pageY)
		var xOffset=this.getEndX()-this.getStartX();
		var yOffset=this.getEndY()-this.getStartY();

		// 上划事件 
		if(yOffset<0){
			this.callback.swipeUping(this.getStartY(),this.getEndY(),Math.abs(yOffset))
		}
		//下划事件
		else if(yOffset>0){
			this.callback.swipeDowning(this.getStartY(),this.getEndY(),yOffset)
		}

		event.preventDefault(); //阻止触摸时浏览器的缩放、滚动条滚动等  
	}

	this.touchEnd=function(event){
		clearInterval(that.longTapTimer)  //停止定时器
		event.preventDefault(); //阻止触摸时浏览器的缩放、滚动条滚动等  
		var xOffset=this.getEndX()-this.getStartX();
		var yOffset=this.getEndY()-this.getStartY();
		//左划事件 
		if(xOffset<0){
			this.callback.swipeLeft(this.getStartX(),this.getEndX(),Math.abs(xOffset))
		}
		//右划事件
		else if(xOffset>0){
			this.callback.swipeLeft(this.getStartX(),this.getEndX(),xOffset)
		}

		// 上划事件 
		if(yOffset<0){
			this.callback.swipeUp(this.getStartY(),this.getEndY(),Math.abs(yOffset))
		}
		//下划事件
		else if(yOffset>0){
			this.callback.swipeDown(this.getStartY(),this.getEndY(),yOffset)
		}

		//左上角滑动事件
		if(xOffset<0 && yOffset<0){
			this.callback.swipeLeftUp(this.getStartX(),this.getEndX(),Math.abs(xOffset),this.getStartY(),this.getEndY(),Math.abs(yOffset))
		}
		//右下角滑动事件
		else if(xOffset>0 && yOffset>0){
			this.callback.swipeRightDown(this.getStartX(),this.getEndX(),xOffset,this.getStartY(),this.getEndY(),yOffset)
		}

		//左下角滑动事件
		if(xOffset<0 && yOffset>0){
			this.callback.swipeLeftDown(this.getStartX(),this.getEndX(),Math.abs(xOffset),this.getStartY(),this.getEndY(),yOffset)
		}
		//右上角滑动事件
		else if(xOffset>0 && yOffset<0){
			this.callback.swipeRightUp(this.getStartX(),this.getEndX(),xOffset,this.getStartY(),this.getEndY(),Math.abs(yOffset))
		}
	}
}