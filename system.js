var noEdge = new Image();
noEdge.src = "noedge.png";
var viv = new Image();
viv.src = "browser.png";
var URL = window.URL || window.webkitURL;
	if(!navigator.hardwareConcurrency){window.alert('This browser is not supported.');  throw new Error('This browser does fully not support Web Workers.')}if(!URL) {
window.alert('This browser is not supported.');		throw new Error('This browser does not support Blob URLs');
	}

	if(!window.Worker) {
window.alert('This browser is not supported.');		throw new Error('This browser does not support Web Workers');
	}

var scrPXT = 0;
function uA() {if(navigator.userAgent.includes("Edge")){return true;}else{return false;}}
setTimeout(function(){
	var x = document.getElementsByClassName("testBrowser")[0];
	var y = document.getElementsByClassName("resistanceMark")[0];
	x.style.filter = "blur(75px)";
	y.style.opacity = "1";
	
},2150);
function exec(){
	scrPXT++;
}
var autoScroll ={
	top: function(){
		document.body.scrollTo(document.body.scrollTopMax,0);
	}
}
window.onscroll = function(){

    if (document.body.scrollTop >= 0) {	
		var value1 = document.body.scrollTop + 50;
		var value2 = document.body.scrollTop / 10;
		var value3 = 15 / document.body.scrollTop;
		var value4 = document.body.scrollTop * 4 + 50;
		var element1 = document.getElementById("view1");
		element1.style.transform = "translate(-50%,-" + value1 + "%";
		element1.style.filter = "blur(" + value2 + "px)";
		var element2 = document.getElementById("view3");;
		element2.style.opacity = value3;
		var element3 = document.getElementById("benchQu");
		var element4 = document.getElementById("gButton");
		if(document.body.scrollTop <= document.body.clientHeight / 3.35){
			element3.style.transform = "translate(-50%,-" + value4 + "%)";
		}
		if(document.body.scrollTop > document.body.clientHeight / 3.35){
			element3.style.top = "0px";
			element3.style.transform = "translate(-50%,0)";
		}

		else{
			element3.style.top = "";
		}
		if(document.body.scrollTop <=  document.body.clientHeight / 3.15){
			element4.style.transform = "translate(250px,-" + value4 + "%)";
		}
		if(document.body.scrollTop > document.body.clientHeight / 3.15){
			element4.style.top = "0px";
			element4.style.transform = "translate(250px,0)";
		}
		else{
			element4.style.top = "";
		}
		var element1 = document.getElementById("scrollButton")
		if(document.body.scrollTop > 10){
			element1.style.transform = "rotate(180deg)";
		}
		else{
			element1.style.transform = "rotate(360deg)";
		}
		var element1 = document.getElementById("firefoxLogo");	
		var element2 = document.getElementById("chromeLogo");	
		var element3 = document.getElementById("operaLogo");
		if(document.body.scrollTop < 50){
			element1.style.display = "none";
			element2.style.display = "none";
			element3.style.display = "none";
			var value1 = 0;
			var valueA = 0;
		}
		else{
			element1.style.display = "block";
			element2.style.display = "block";
			element3.style.display = "block";			
			var value1 = (document.body.scrollTop - 50) / 5;
			var valueA = (document.body.scrollTop - 50) / 100;
		}
		if(document.body.scrollTop < 150){
			var value2 = 0;
			var valueB = 0;
		}
		else{
			var value2 = (document.body.scrollTop - 150) / 5;
			var valueB = (document.body.scrollTop - 150) / 100;
		}
		if(document.body.scrollTop < 250){
			var value3 = 0;
			var valueC = 0;
		}
		else{
			var value3 = (document.body.scrollTop - 250) / 5;
			var valueC = (document.body.scrollTop - 250) / 100;
		}	
		element1.style.left = value1 + "%";
		element1.style.opacity = valueA;
		element2.style.left = value2 + "%";
		element2.style.opacity = valueB;
		element3.style.left = value3 + "%";
		element3.style.opacity = valueC;
		if(document.body.scrollTop > 120){
			var value1 = (document.body.scrollTop - 120) / 1000;
			var value2 = (document.body.scrollTop - 120) / 100 + 0.75;
			var value3 = 0;
		}
		else{
			var value1 = 0;
			var value2 = 0.75;
			var value3 = 0;

		}
		if(document.body.scrollTop > 550){
			var value3 = (document.body.scrollTop - 550) / 25;
		}
		if(document.body.scrollTop > 770){
			var value1 = 0;
		}
		var element1 = document.getElementById("view4");
		element1.style.opacity = value1;
		element1.style.transform = "scale(" + value2 + ")";
		element1.style.filter = "blur(" + value3 + "px)"
		var element1 = document.getElementsByClassName("view5a");
		var element2 = document.getElementsByClassName("view5b");
		var element3 = document.getElementById("view6");
		var element4 = document.getElementById("view7")
		if(document.body.scrollTop > 630){
			var value1 = (document.body.scrollTop - 630) / 750;
		}
		else{
			var value1 = 0;
		}
			var value2a = document.body.scrollTop - 630;
			var value2b = value2a -150;
			var value2c = value2b- 150;
			var value2d = value2c -150;
			var value2e = value2d -150;
			var value2f = value2e -150;
			var value2g = value2f -150;
			var value2h = value2g- 150;
			var value2i = value2h -150;
			var value2j = value2i -150;
			var value3 = (document.body.scrollTop - 1980) * 3;
		if(document.body.scrollTop > 630){
		element1[0].style.opacity = value1;
		element2[0].style.opacity = value1;
		element1[1].style.opacity = value1 - 0.2;
		element2[1].style.opacity = value1 - 0.2;
		element1[2].style.opacity = value1 - 0.4;
		element2[2].style.opacity = value1 - 0.4;
		element1[3].style.opacity = value1 - 0.6;
		element2[3].style.opacity = value1 - 0.6;
		element1[4].style.opacity = value1 - 0.8;
		element2[4].style.opacity = value1 - 0.8;
		element1[5].style.opacity = value1 - 1;
		element2[5].style.opacity = value1 - 1;
		element1[6].style.opacity = value1 - 1.2;
		element2[6].style.opacity = value1 - 1.2;
		element1[7].style.opacity = value1 - 1.4;
		element2[7].style.opacity = value1 - 1.4;
		element1[8].style.opacity = value1 - 1.6;
		element2[8].style.opacity = value1 - 1.6;
		element1[9].style.opacity = value1 - 1.8;
		element2[9].style.opacity = value1 - 1.8;
	
		element1[0].style.transform = "translate(" + value2a + "px,0)";
		element2[0].style.transform = "translate(-" + value2a + "px,0)";
		element1[1].style.transform = "translate(" + value2b + "px,0)";
		element2[1].style.transform = "translate(-" + value2b + "px,0)";
		element1[2].style.transform = "translate(" + value2c + "px,0)";
		element2[2].style.transform = "translate(-" + value2c + "px,0)";
		element1[3].style.transform = "translate(" + value2d + "px,0)";
		element2[3].style.transform = "translate(-" + value2d + "px,0)";
		element1[4].style.transform = "translate(" + value2e + "px,0)";
		element2[4].style.transform = "translate(-" + value2e + "px,0)";
		element1[5].style.transform = "translate(" + value2f + "px,0)";
		element2[5].style.transform = "translate(-" + value2f + "px,0)";
		element1[6].style.transform = "translate(" + value2g + "px,0)";
		element2[6].style.transform = "translate(-" + value2g + "px,0)";
		element1[7].style.transform = "translate(" + value2h + "px,0)";
		element2[7].style.transform = "translate(-" + value2h + "px,0)";
		element1[8].style.transform = "translate(" + value2i + "px,0)";
		element2[8].style.transform = "translate(-" + value2i + "px,0)";
		element1[9].style.transform = "translate(" + value2j + "px,0)";
		element2[9].style.transform = "translate(-" + value2j + "px,0)";
		element3.style.opacity = 1;
		}
		else{
		element1[0].style.opacity = 0;
		element2[0].style.opacity = 0;
		element1[1].style.opacity = 0;
		element2[1].style.opacity = 0;
		element1[2].style.opacity = 0;
		element2[2].style.opacity = 0;
		element1[3].style.opacity = 0;
		element2[3].style.opacity = 0;
		element1[4].style.opacity = 0;
		element2[4].style.opacity = 0;
		element4.style.width = "0px";
	
		element1[0].style.transform = "";
		element2[0].style.transform = "";
		element1[1].style.transform = "";
		element2[1].style.transform = "";
		element1[2].style.transform = "";
		element2[2].style.transform = "";
		element1[3].style.transform = "";
		element2[3].style.transform = "";
		element1[4].style.transform = "";
		element2[4].style.transform = "";	
		element3.style.opacity = 0;	
		}
		if(document.body.scrollTop > 1980){
			element4.style.width = value3 + "px";
		}
		else{
			element4.style.width = "0px";
		}
		if(document.body.scrollTop == 2700){
			document.getElementById("view9a").style.opacity = 1;
		}
		else{
			document.getElementById("view9a").style.opacity = 0;			
		}
    }

}
function init() {
    data = document.getElementById('benchQu').value;
    window.location = "index.htm?test=" + data;	
}
window.onload = function(){
var x = document.getElementById("scrollable").style.height = 2700 + document.body.clientHeight + "px";
var y = document.getElementById("view8").style.width = document.body.clientWidth + "px";
	var x = uA();
	if(x == true){
		var picky = document.getElementById("picky");
		picky.innerHTML = '<img src="noedge.png" style="height: 55px"><a>Look strange?</a><b><i>Ditch Edge</i></b>';
		picky.style.display = "block";
	}
document.body.className = "";
}

