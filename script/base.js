(function(context){
	var eventMap = {};

	context.Base = context.Base || {};
	context.Base.event = {
		ON_LOAD:"onload",//trigger when window onload
		
		ON_CONVERSATION_CHANGE:"onconversationchange",//trigger when every conversation change
		
		ON_JS_CHANGE:"onjschange",//trigger when show another js's conversation

		addListener:function(eventName,listener){
			if(listener && listener instanceof Function){
				var array = eventMap[eventName] || [];
				array.push(listener);
				eventMap[eventName] = array;
			}
		},

		removeListener:function(eventName,listener){
			if(listener && listener instanceof Function){
				var array = eventMap[eventName] || [];
				var index = array.indexOf(listener);
				if(index > -1){
					array.splice(index,1);
				}
			}
		},
		
		clearListener:function(eventName){
			if(eventMap[eventName]){
				delete eventMap[eventName];
			}
		},

		fireEvent:function(eventName,param){
			if(eventMap[eventName]){
				for(var i = 0 ;i<eventMap[eventName].length;i++){
					eventMap[eventName][i](param);
				}
			}
		}	
	};

})(window);