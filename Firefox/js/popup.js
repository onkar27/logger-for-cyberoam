var showContact=true;

document.addEventListener('DOMContentLoaded', function () {
    document.getElementsByClassName('settingsButton')[0].addEventListener('click', showSettings);
	document.getElementsByClassName('closeSettingsButton')[0].addEventListener('click', hideSettings);
	document.getElementsByClassName('infoButton')[0].addEventListener('click', showInfo);
	document.getElementsByClassName('closeInfoButton')[0].addEventListener('click', hideInfo);
	document.getElementsByClassName('addButton')[0].addEventListener('click', addTableRow);
	document.getElementsByClassName('deleteButton')[0].addEventListener('click', deleteTableRows);
	document.getElementsByClassName('saveButton')[0].addEventListener('click', saveTableData);
	document.getElementsByClassName('loginButton')[0].addEventListener('click', login);
	document.getElementsByClassName('helpButton')[0].addEventListener('click', showContactUs);
	
	loadTableData();
});

function showContactUs(){
	if(showContact===true)
	{
		document.getElementsByClassName("contactUs")[0].style.transform = "translateX(-260px)";
		document.getElementsByClassName("helpButton")[0].style.transform = "translateX(-260px)";
		showContact=false;
	}
	else
	{
		document.getElementsByClassName("contactUs")[0].style.transform = "translateX(0)";
		document.getElementsByClassName("helpButton")[0].style.transform = "translateX(0)";
		showContact=true;
	}
}

function showSettings() {
    document.getElementsByClassName("settingsOverlay")[0].style.transform = "translateX(-100%)";
}

function hideSettings() {
    document.getElementsByClassName("settingsOverlay")[0].style.transform = "translateX(0%)";
}

function showInfo() {
    document.getElementsByClassName("infoOverlay")[0].style.transform = "translateX(100%)";
}

function hideInfo() {
    document.getElementsByClassName("infoOverlay")[0].style.transform = "translateX(0%)";
}

function addTableRow(t,u,p){
	var type="";
	if(u==undefined)
		u="";
	if(p==undefined)
	{
		p="";
		type = "text";
	}
	else
		type = "password";
	
	var table=document.getElementsByClassName('listTable')[0];
	var rowCount=table.rows.length;
	
	var row=table.insertRow(rowCount);
	
	var tcell=row.insertCell(0);
	tcell.className+="checkboxClass";
	var telement=document.createElement("input");
	telement.type="checkbox";
	tcell.appendChild(telement);
	
	tcell=row.insertCell(1);
	tcell.className+="usernameData";
	telement=document.createElement("input");
	telement.type="text";
	telement.className+="usernameText";
	telement.value=u;
	telement.placeholder="Username";
	tcell.appendChild(telement);
	
	tcell=row.insertCell(2);
	tcell.className+="passwordData";
	telement=document.createElement("input");
	telement.type=type;
	telement.className+="passwordText";
	telement.value=p;
	telement.placeholder="Password";
	tcell.appendChild(telement);
}

function deleteTableRows(){
	var table=document.getElementsByClassName('listTable')[0];
	var rowCount=table.rows.length;
	
	for(var i=0;i<rowCount;i++)
	{
		var row=table.rows[i];
		var chkBox=row.cells[0].childNodes[0];
		if(chkBox!=null && chkBox.checked==true)
		{
			table.deleteRow(i);
			rowCount--;
			i--;
		}
	}
}

function saveTableData(){
	var table=document.getElementsByClassName('listTable')[0];
	var passwords=document.getElementsByClassName('passwordText');
	
	var rowCount=table.rows.length;

	var array=new Array();
	
	for(var i=1;i<rowCount;i++)
	{
		var obj={
			"un":table.rows[i].cells[1].childNodes[0].value,
			"pw":table.rows[i].cells[2].childNodes[0].value
		};
		array.push(obj);
	}
	
	browser.storage.sync.set({'credentials':array},function(){});
	
	saveIPData();
	
	for(var i=0;i<passwords.length;i++)
	{
		passwords[i].setAttribute("type","password");
	}
}

function saveIPData(){
	var ipbox=document.getElementsByClassName('IPText')[0];
	var portbox=document.getElementsByClassName('PortText')[0];
	
	var obj={
		"ip":ipbox.value,
		"port":portbox.value
	};
	
	browser.storage.sync.set({'ip':obj},function(){});
}

function loadTableData(){
	var table=document.getElementsByClassName('listTable')[0];
	
	browser.storage.sync.get({'credentials':[]},function(tobj){
		if(tobj != undefined){
			var array=tobj.credentials;
			
			if(array!=undefined)
			{
				for(var i=0;i<array.length;i++)
				{
					addTableRow("",array[i].un,array[i].pw);
				}
			}
		}
	});
	
	loadIPData();
}

function loadIPData(){
	var ipbox=document.getElementsByClassName('IPText')[0];
	var portbox=document.getElementsByClassName('PortText')[0];
	
	browser.storage.sync.get('ip',function(tobj){
		if(tobj != undefined){
			var obj=tobj.ip;
			if(obj!=undefined)
			{
				ipbox.value=obj.ip;
				portbox.value=obj.port;
			}
			else
			{
				ipbox.value="192.168.1.8";
				portbox.value="8090";
			}
		}
		else
		{
			ipbox.value="192.168.1.8";
			portbox.value="8090";
		}
	});
}

/*------------------------------Login part--------------------------------------*/
var index=1;
var producttype = "&producttype=0";

function validateIP(ip, port){
	if(isNaN(port) || port<0 || port>65535)
		return false;
	if(/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ip)==true)
	{
		return true;
	}
	return false;
}

function login(){
	//alert("in login");
	var loginButton = document.getElementsByClassName('loginButton')[0];
	loginButton.textContent = "";
	var loader = document.createElement('div');
	loader.className += 'loader';
	loginButton.append(loader);
	
	var ip=document.getElementsByClassName('IPText')[0].value;
	var port=document.getElementsByClassName('PortText')[0].value;
	
	if(validateIP(ip,port)==false)
	{
		index=1;
		update("Invalid Gateway IP or Port no! Click here to try again.","#e60000","18px",true);
		return;
	}
	
	var table=document.getElementsByClassName('listTable')[0];
	var rowCount=table.rows.length;
	
	if(rowCount<=1)
	{
		index=1;
		update("No credentials to login! You can add some in settings. Click here to try again.","#e60000","18px",true);
		return;
	}
	
	if(index>=rowCount)
	{
		index=1;
		update("Failed to login! Click here to try again.","#e60000","18px",true);
		return;
	}
	
	var un=table.rows[index].cells[1].childNodes[0].value;
	var pw=table.rows[index].cells[2].childNodes[0].value;
	
	cyberLogin(ip,port,un,pw);
}

function cyberLogin(ip,port,un,pw){
	try
	{
		//alert("in cyberLogin");
		var queryString = "mode=191&username=" + encodeURIComponent(un) + "&password=" + encodeURIComponent(pw) + "&a=" + (new Date).getTime() + producttype;
		var url = "http://"+ip+":"+port+"/login.xml";
		//alert("query:"+queryString);
		//alert("url:"+url);
		makeAjaxRequest("POST", queryString, url, loginResponse,un);
	}
	catch(err){
		update("Gateway not reachable! Click here to try again","#e60000","18px",true);
	}
}

function makeAjaxRequest(reqType, queryString, url, callback,un) {
	try
	{
		//alert("in makeAjaxRequest");
		var ajaxObj = getAjaxObject();
		ajaxObj.open(reqType, url, true);
		ajaxObj.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		ajaxObj.onreadystatechange = getReadyStateHandler(ajaxObj, callback,un);
		ajaxObj.send(queryString);
	}
	catch(err){
		update("Gateway not reachable! Click here to try again","#e60000","18px",true);
	}
}

function getAjaxObject(){
	//alert("in getAjaxObject");
	try{
		// create XMLHttpRequest for firefox, safari, opera
		ajaxObject = new XMLHttpRequest();
	} 
	catch(e){
		try{
			// create XMLHttpRequest for IE 6.0+
			ajaxObject = new ActiveXObject('Msxml2.XMLHTTP');
		}
		catch(e){
			try{
				// create XMLHttpRequest for IE 6.0+
				ajaxObject = new ActiveXObject('Microsoft.XMLHTTP');
			}
			catch(e){
				alert('Your browser is not supporting AJAX');
			}
		}
	} 
	return ajaxObject;
}

function getReadyStateHandler(req, responseXmlHandler,un) {
	//alert("in getReadyStateHandler");
	try {
		// Return an anonymous function that listens to the XMLHttpRequest instance
	  	return function () {
	    	// If the request is completed successfully.
			//alert("req.readyState:"+req.readyState);
	    	if (req.readyState == 4) {       
	      		// Check whether we have received a successful response from the server
		      	if (req.status == 200) {
		        	// Pass the XML payload of the response to the handler function.
		        	
		        	responseXmlHandler(req.responseXML,un);
		        } else {
		        	// An HTTP problem has occurred
		        	//alert("Connection to the Authentication Server is lost.");
					//removeOverlay();
		      	}
	    	}
	  	}
	} catch(e) {
	}	
}

function loginResponse(g,un) {
	//alert("in loginResponse");
	var d = g.documentElement;
	message = d.getElementsByTagName("message")[0].childNodes[0].nodeValue;
	status = d.getElementsByTagName("status")[0].childNodes[0].nodeValue;
	if(status=="LIVE")
	{
		index=1;
		update("Logged in as: "+un,"#2eb82e","18px",false);
		return;
	}
	else
	{
		index++;
		/*if(message == "The system could not log you on. Make sure your password is correct")
			message="Invalid credentials!";
		if(message == "You have reached Maximum Login Limit.")
			message="Max login limit!";
		else
			message="Failed to login!";
		update(un+": "+message,"#e60000","18px",false);*/
		login();
		return;
	}
}

function update(msg,color,size,enable){
	//alert("update("+msg+","+color+","+size+","+enable+")");
	var loginButton=document.getElementsByClassName('loginButton')[0];
	/*if(loginButton.innerHTML == "login")
		loginButton.innerHTML="";
	
	var span=document.createElement("span");
	span.innerHTML=msg;
	span.style.color=color;
	span.style.fontSize=size;
	var br=document.createElement("br");
	loginButton.appendChild(br);*/
	loginButton.textContent=msg;
	loginButton.style.color=color;
	loginButton.style.fontSize=size;
	loginButton.disabled=(!enable);
}