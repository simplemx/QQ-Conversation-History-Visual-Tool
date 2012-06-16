(function(context){
	var myTextDiv = document.getElementById("myConversation");
	var herTextDiv = document.getElementById("herConversation");
	var dateDiv = document.getElementById("timeDiv");
	var myImgDiv = document.getElementById("myDiv");
	var herImgDiv = document.getElementById("herDiv");
	var height = document.body.clientHeight;
	var width = document.body.clientWidth;
	var myDivContent = document.getElementById("myDivContent");
	var herDivContent = document.getElementById("herDivContent");

	var	evt = context.Base.event;
	var TRANSFORM_PROPS = [
		'transform', 
		'MozTransform', 
		'WebkitTransform', 
		'msTransform', 
		'OTransform'
		];
	var SUPPORTED_TRANSFORM = null;
	
	var isRotate = function(){
		return Math.random() * 2 > 0.6;
	};
	
	//since domAttributeModified is not support in chrome so add this function to make some
	// hook
	var setAnimation = function(div,styleAttr){
		if(div && styleAttr){
			div.style[SUPPORTED_TRANSFORM] = styleAttr;
			//rotate the div
			var rotateDiv = null;
			if(div === myImgDiv){
				rotateDiv = myDivContent;
			}else if(div === herImgDiv){
				rotateDiv = herDivContent;
			}
			if(rotateDiv && isRotate() ){
				if(rotateDiv.style[SUPPORTED_TRANSFORM] === "rotate(360deg)"){
					rotateDiv.style[SUPPORTED_TRANSFORM] = "rotate(0deg)"
				}else{
					rotateDiv.style[SUPPORTED_TRANSFORM] = "rotate(360deg)";
				}
			}
		}
	};

	var move2Right = function(div){
		return function(){
			setAnimation(div , "translate(" + (width - div.offsetWidth) + "px,0)");
		};
	};

	var move2Top = function(div){
		return function(){
			if(div === myImgDiv || div === myTextDiv){
				setAnimation(div , "translate(0,0)");
			}
			else if(div === herImgDiv){
				setAnimation(div , "translate(0,-" + (div.offsetTop - myImgDiv.offsetTop) + "px)");
			}
			else{
				setAnimation(div , "translate(0,-" + (div.offsetTop - myTextDiv.offsetTop) + "px)"); 
			}
		};
	};

	var move2Origin = function(div){
		return function(){
			setAnimation(div , "translate(0,0)");
		};
	};

	var move2BottomRight = function(div){
		if(div === herTextDiv || div === herImgDiv){
			return move2Right(div);
		}
		else{
			return function(){
				if(div === myImgDiv){
					setAnimation(div , "translate(" + (width - div.offsetWidth) + "px," + (herImgDiv.offsetTop - div.offsetTop) + "px)");
				}else{
					setAnimation(div , "translate(" + (width - div.offsetWidth) + "px," + (herTextDiv.offsetTop - div.offsetTop) + "px)");
				}
			};
		}
	};

	var move2TopRight = function(div){
		if(div === myImgDiv || div === myTextDiv){
			return move2Right(div);
		}
		else{
			return function(){
				if(div === herImgDiv){
					setAnimation(div , "translate(" + (width - div.offsetWidth) + "px,-" + (div.offsetTop - myImgDiv.offsetTop) + "px)");
				}
				else{
					setAnimation(div , "translate(" + (width - div.offsetWidth) + "px,-" + (div.offsetTop - myTextDiv.offsetTop) + "px)");
				}
			};
		}
	};

	var move2MiddleLeft = function(div){
		return function(){
			setAnimation(div , "translate(" + (width/2 - div.offsetWidth) + "px,0)");
		};
	};

	var move2MiddleRight = function(div){
		return function(){
			setAnimation(div , "translate(" + (width/2) +"px,0)");
		};
	};
	
	var move2MiddleLeftTop = function(div){
		if(div === myImgDiv || div === myTextDiv){
			return move2MiddleLeft(div);
		} 
		else {
			return function(){
				if(div === herImgDiv){
					setAnimation(div , "translate(" + (width/2 - div.offsetWidth) + "px,-" + (div.offsetTop - myImgDiv.offsetTop) + "px)");
				}
				else{
					setAnimation(div , "translate(" + (width/2 - div.offsetWidth) + "px,-" + (div.offsetTop - myTextDiv.offsetTop) + "px)");
				}
			};
		}
	};

	var move2MiddleRightTop = function(div){
		if(div === myImgDiv || div === myTextDiv){
			return move2MiddleRight(div);
		} 
		else {
			return function(){
				if(div === herImgDiv){
					setAnimation(div , "translate(" + (width/2 ) + "px,-" + (div.offsetTop - myImgDiv.offsetTop) + "px)");
				}
				else{
					setAnimation(div , "translate(" + (width/2 ) + "px,-" + (div.offsetTop - myTextDiv.offsetTop) + "px)");
				}
			};
		}
	};

	var constructAnimation = function(anim1,anim2,anim3,anim4){
		return function(){
			if(anim1){
				anim1();
			}
			var next = 1000;
			if(anim2){
				setTimeout(anim2,next);
				next += 1000;
			}
			if(anim3){
				setTimeout(anim3,next);
				next += 1000;
			}
			if(anim4){
				setTimeout(anim4,next);
			}
		};
	};

	var animationIndex = 1;
	var animation_funcs = null;
	var showAnimation = function(){
		var index = (animationIndex++) % animation_funcs.length;
		var func = animation_funcs[index];
		if(func){
			func();
		}
	};

	var initAnimation = function(){
		animation_funcs = [
			constructAnimation(
				move2Right(herImgDiv),
				move2Right(herTextDiv),
				move2Origin(myImgDiv),
				move2Origin(myTextDiv)
			),
			constructAnimation(
				move2MiddleLeft(myImgDiv),
				move2MiddleLeft(myTextDiv),
				move2MiddleRight(herImgDiv),
				move2MiddleRight(herTextDiv)
			),
			constructAnimation(
				move2Right(myImgDiv),
				move2Right(myTextDiv),
				move2Top(herImgDiv),
				move2Top(herTextDiv)
			),
			constructAnimation(
				move2MiddleLeft(herImgDiv),
				move2MiddleLeft(herTextDiv),
				move2MiddleRight(myImgDiv),
				move2MiddleRight(myTextDiv)
			),
			constructAnimation(
				move2MiddleLeftTop(myImgDiv),
				move2MiddleLeftTop(myTextDiv),
				move2MiddleRightTop(herImgDiv),
				move2MiddleRightTop(herTextDiv)
			)
		];
	};

	var initValue = function(){
		if(myImgDiv){
			for(var i = 0 ; i < TRANSFORM_PROPS.length ; i++){
				if(typeof myImgDiv.style[TRANSFORM_PROPS[i]] === "string"){
					SUPPORTED_TRANSFORM = TRANSFORM_PROPS[i];
					break;
				}
			}
		}
		//init animation
		initAnimation();
	};

	evt.addListener(evt.ON_LOAD,initValue);
	evt.addListener(evt.ON_JS_CHANGE,showAnimation);
})(window);