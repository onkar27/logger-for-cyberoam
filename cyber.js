alert("Hello World");
/*document.forms[0].username.value="rathirg";
document.forms[0].password.value="Rrathi@wcewifi";
document.forms[0].submit();*/

var status="";
var UserValue="";
var queryString="";
var loginstate=null;
var message="";
var ack=0;
var producttype = "&producttype=0";


//function checkSubmit() {
	if (status != "LIVE") {
		//document.frmHTTPClientLogin.mode.value = 191;

			UserValue = "rathirg";	//replaceAll(document.frmHTTPClientLogin.username.value, "'", "''");
			queryString = "mode=191&username=" + encodeURIComponent(UserValue) + "&password=" + encodeURIComponent("Rrathi@wcewifi"/*document.frmHTTPClientLogin.password.value*/) + "&a=" + (new Date).getTime() + producttype;
			if (loginstate != null) {
				queryString += "&state=" + loginstate
			}
			url = "http://192.168.1.8:8090/login.xml";
			makeAjaxRequest("POST", queryString, url, loginResponse);
			alert("makeAjaxRequest(POST, "+queryString +","+ url+", loginResponse)");
	} 
	else {
		alert("in not live else");
		if (document.forms[0].btnSubmit.value == logoutValue) {
			document.frmHTTPClientLogin.mode.value = 193;
			queryString = "mode=193&username=" + encodeURIComponent(document.frmHTTPClientLogin.username.value) + "&a=" + (new Date).getTime() + producttype;
			url = "logout.xml";
			makeAjaxRequest("POST", queryString, url, logoutResponse)
		}
	}
	//return false
//}

function getAjaxObject(){
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

function getReadyStateHandler(req, responseXmlHandler) {
	try {
		// Return an anonymous function that listens to the XMLHttpRequest instance
	  	return function () {
	    	// If the request is completed successfully.
	    	if (req.readyState == 4) {       
	      		// Check whether we have received a successful response from the server
		      	if (req.status == 200) {
		        	// Pass the XML payload of the response to the handler function.
		        	
		        	responseXmlHandler(req.responseXML);
		        } else {
		        	// An HTTP problem has occurred
		        	alert("Connection to the Authentication Server is lost.");
					//removeOverlay();
		      	}
	    	}
	  	}
	} catch(e) {
	}	
}

function makeAjaxRequest(e, d, a, c) {
	alert("in makeAjaxRequest");
	var b = getAjaxObject();
	b.open(e, a, true);
	b.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	b.send(d);
	b.onreadystatechange = getReadyStateHandler(b, c);
	//addOverlay()
}

function loginResponse(g) {
	alert("in login response " +g);
	var d = g.documentElement;
	message = d.getElementsByTagName("message")[0].childNodes[0].nodeValue;
	ack = 1;
	status = d.getElementsByTagName("status")[0].childNodes[0].nodeValue;
	if (status == "CHALLENGE") {
		alert("in status challenge");
		loginstate = d.getElementsByTagName("state")[0].childNodes[0].nodeValue;
		//changeView(status);
		//removeOverlay();
		return
	}
	else
	{
		alert("in status not challenge "+status);
	}
	loginstate = null;
	if (status == "LOGIN") {
		alert("in status login (failed to login check username and password)");
		ack = -1
	}
	//document.frmHTTPClientLogin.password.value = "";
	try {
		logoutMessage = d.getElementsByTagName("logoutmessage")[0].childNodes[0].nodeValue
	} catch (f) {}
	//removeOverlay();
	/*if (status != "LOGIN") {
		if ((navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i)) && navigator.userAgent.match(/mozilla/i) && navigator.userAgent.match(/applewebkit/i) && navigator.userAgent.match(/mobile/i) && (!navigator.userAgent.match(/safari/i))) {
			location.href = "http://ios.cyberoam.com/app/s.html"
		}
		var b = "";
		if (location.href.indexOf("u=") != -1) {
			b = location.href.substring(location.href.indexOf("u=") + 2)
		}
		if (redirectTo != "") {
			if (redirectTo.indexOf("http") == -1) {
				redirectTo = "http://" + redirectTo
			}
			b = redirectTo
		}
		if (b != "" && !isPopup) {
			redirectURL = b;
			if (preserveCaptivePortal == "Y") {
				if (navigator.userAgent.toLowerCase().indexOf("chrome") == -1) {
					changeView(status);
					var c = document.createElement("a");
					c.innerHTML = b;
					c.href = b;
					c.id = "redirectionanchor";
					c.target = "_new";
					c.style.textDecoration = "underline";
					c.style.color = "#000000";
					c.style.fontSize = "13px";
					c.style.fontFamily = "Arial,sans-serif";
					if (document.getElementById("redirecturl")) {
						document.getElementById("redirecturl").appendChild(c)
					}
					if (navigator.userAgent.toLowerCase().indexOf("safari") != -1) {
						var a = document.createEvent("MouseEvents");
						a.initMouseEvent("click", true, true, window);
						c.dispatchEvent(a)
					}
					c.click();
					c.style.display = "none"
				} else {
					var h = location.href;
					if (location.href.indexOf("?") != -1) {
						h = location.href.substring(0, location.href.indexOf("?"))
					}
					openWindow = window.open(h, null, "status=yes,height=600,width=700,resizable=no");
					setTimeout(function() {
						chromePopup(b)
					}, 1000)
				}
			} else {
				location.href = redirectURL
			}
		} else {
			changeView(status)
		}
	} else {
		changeView(status)
	}*/
}