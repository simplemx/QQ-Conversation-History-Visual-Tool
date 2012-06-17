(function(context){
	var cacheData = null;//the next loaded data 
	var loadedData = null;//the last time loaded data
	var loadDataList = null;//the js list to be load
	var isFirstLoad = true;
	var cIndex = 0;
	var loadIndex = 0;//the current loaded js in loadDataList
	var scriptElem = null;
	var myTextDiv = document.getElementById("myConversation");
	var herTextDiv = document.getElementById("herConversation");
	var dateDiv = document.getElementById("timeDiv");
	var	config = context.Base.config;
	var	evt = context.Base.event;

	var setDate = function(dateStr){
		var yearmonthday = dateStr.substring(0,dateStr.indexOf(" "));
		if(dateDiv.innerText !== yearmonthday){
			dateDiv.innerText = yearmonthday;
		}
	};

	var showConversation = function(){
		if( loadedData.length > cIndex && loadedData[cIndex]["content"]){
			hideWaiting();
			setDate(loadedData[cIndex]["date"]);
			if(loadedData[cIndex]["side"] === "my"){
				setConversation(myTextDiv,loadedData[cIndex]["content"]);
				herTextDiv.innerText = "...";
			}else{
				setConversation(herTextDiv,loadedData[cIndex]["content"]);
				myTextDiv.innerText = "...";
			}
		}
		if(loadedData.length > cIndex){
			cIndex++;
			setTimeout(showConversation, config.CONVERSATION_RATE);
		}else{
			//begin to show another conversation 
			evt.fireEvent(evt.ON_JS_CHANGE);
			if(cacheData && cacheData !== loadedData){
				loadedData = cacheData;
				showWaiting();
				showAndLoadNextJS();
			}
		}	
	};

	var setConversation = function(div,text){
		evt.fireEvent(evt.ON_CONVERSATION_CHANGE,{"content":text});
		div.innerText = text;
	};
	
	var loadJS = function(url){
		if(scriptElem){
			document.body.removeChild(scriptElem);
		}
		scriptElem = document.createElement("script");
		scriptElem.setAttribute("type","text/javascript");
		scriptElem.setAttribute("src",url);
		document.body.appendChild(scriptElem);
	};

	var showAndLoadNextJS = function(){
		cIndex = 0;
		setTimeout(showConversation, config.CONVERSATION_RATE);
		if(loadIndex < loadDataList.length){
			loadJS(loadDataList[loadIndex++]);
		}
	};

	var showWaiting = function(){
		var div = document.getElementById("loading");
		if(div && div.style.display === "none"){
			div.style.display = "block";
		}
	};

	var hideWaiting = function(){
		var div = document.getElementById("loading");
		if(div && div.style.display === "block"){
			div.style.display = "none";
		}
	};

	var beginShow = function(){
		showWaiting();
		loadJS(config.DEFAULT_BASE_JS);
	};

	context.onLoadData = function(data){
		if(isFirstLoad){
			loadedData = data;
			//load a sub js the first time have no cache
			showAndLoadNextJS(data);
			isFirstLoad = false;
		}else{
			cacheData = data;
		}
	};

	context.beginLoad = function(list){ 
		loadDataList = list;
		if(loadDataList && loadDataList.length > 0 ){
			loadJS(loadDataList[loadIndex++]);
		}else{
			alert("no conversation list found");
		}
	};
	
	evt.addListener(evt.ON_LOAD,beginShow);
	
	window.onload = function(){
		evt.fireEvent(evt.ON_LOAD);
	};
})(window);
