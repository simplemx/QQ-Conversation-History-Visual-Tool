(function(context){
	var zz = {};
	zz.cacheData = null;//the next loaded data 
	zz.loadedData = null;//the last time loaded data
	zz.loadDataList = null;//the js list to be load
	zz.isFirstLoad = true;
	zz.cIndex = 0;
	zz.loadIndex = 0;//the current loaded js in loadDataList
	zz.myTextDiv = null;
	zz.herTextDiv = null;
	zz.dateDiv = null;
	zz.scriptElem = null;
	zz.scriptBaseUrl = "script/data/";
	
	var setDate = function(dateStr){
		var yearmonthday = dateStr.substring(0,dateStr.indexOf(" "));
		if(zz.dateDiv.innerText != yearmonthday){
			zz.dateDiv.innerText = yearmonthday;
		}
	};

	var showConversation = function(){
		if( zz.loadedData.length > zz.cIndex && zz.loadedData[zz.cIndex]["content"]){
			hideWaiting();
			setDate(zz.loadedData[zz.cIndex]["date"]);
			if(zz.loadedData[zz.cIndex]["side"] === "my"){
				zz.myTextDiv.innerText  = zz.loadedData[zz.cIndex]["content"];
				zz.herTextDiv.innerText = "бн";
			}else{
				zz.herTextDiv.innerText = zz.loadedData[zz.cIndex]["content"];
				zz.myTextDiv.innerText = "бн";
			}
		}
		if(zz.loadedData.length > zz.cIndex){
			zz.cIndex++;
			setTimeout(showConversation,20);
		}else{
			//begin to show another conversation 
			/*
			zz.cIndex = 0;
			
			if(zz.loadIndex < zz.loadDataList.length){
				loadJS(zz.loadDataList[zz.loadIndex++]);
			}
			*/
			/*
			if(zz.cacheData){
				zz.loadedData = zz.cacheData;
				setTimeout(showConversation,20);
			}
			*/
			if(zz.cacheData && zz.cacheData !== zz.loadedData){
				zz.loadedData = zz.cacheData;
				showWaiting();
				showAndLoadNextJS();
			}
		}	
	};

	var loadJS = function(url){
		if(zz.scriptElem){
			document.body.removeChild(zz.scriptElem);
		}
		zz.scriptElem = document.createElement("script");
		zz.scriptElem.setAttribute("type","text/javascript");
		zz.scriptElem.setAttribute("src",zz.scriptBaseUrl + url);
		document.body.appendChild(zz.scriptElem);
	};

	var showAndLoadNextJS = function(){
		zz.cIndex = 0;
		setTimeout(showConversation,20);
		if(zz.loadIndex < zz.loadDataList.length){
			loadJS(zz.loadDataList[zz.loadIndex++]);
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

	context.onLoadData = function(data){
		if(zz.isFirstLoad){
			zz.loadedData = data;
			//load a sub js the first time have no cache
			showAndLoadNextJS(data);
			zz.isFirstLoad = false;
		}else{
			zz.cacheData = data;
		}
	};

	context.beginLoad = function(loadDataList){ 
		zz.loadDataList = loadDataList;
		if(zz.loadDataList && zz.loadDataList.length > 0 ){
			loadJS(zz.loadDataList[zz.loadIndex++]);
		}else{
			alert("no conversation list found");
		}
	};

	window.onload = function(){
		zz.myTextDiv = document.getElementById("myConversation");
		zz.herTextDiv = document.getElementById("herConversation");
		zz.dateDiv = document.getElementById("timeDiv");
		showWaiting();
		loadJS("data.js");
	};
})(window);
