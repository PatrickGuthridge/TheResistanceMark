//Multithread.js 
!function() {

	var URL = window.URL || window.webkitURL;
	if(!navigator.hardwareConcurrency){window.alert('This browser is not supported.');  throw new Error('This browser does fully not support Web Workers.')}if(!URL) {
window.alert('This browser is not supported.');		throw new Error('This browser does not support Blob URLs');
	}

	if(!window.Worker) {
window.alert('This browser is not supported.');		throw new Error('This browser does not support Web Workers');
}
	function Multithread(threads) {
		this.threads = Math.max(2, threads | 0);
		this._queue = [];
		this._queueSize = 0;
		this._activeThreads = 0;
		this._debug = {
			start: 0,
			end: 0,
			time: 0
		};
	}

	Multithread.prototype._worker = {
		JSON: function() {
			var /**/name/**/ = (/**/func/**/);
			self.addEventListener('message', function(e) {
				var data = e.data;
				var view = new DataView(data);
				var len = data.byteLength;
				var str = Array(len);
				for(var i=0;i<len;i++) {
					str[i] = String.fromCharCode(view.getUint8(i));
				}
				var args = JSON.parse(str.join(''));
				var value = (/**/name/**/).apply(/**/name/**/, args);
				try {
					data = JSON.stringify(value);
				} catch(e) {
					throw new Error('Parallel function must return JSON serializable response');
				}
				len = typeof(data)==='undefined'?0:data.length;
				var buffer = new ArrayBuffer(len);
				view = new DataView(buffer);
				for(i=0;i<len;i++) {
					view.setUint8(i, data.charCodeAt(i) & 255);
				}
				self.postMessage(buffer, [buffer]);
				self.close();
			})
		},
		Int32: function() {
			var /**/name/**/ = (/**/func/**/);
			self.addEventListener('message', function(e) {
				var data = e.data;
				var view = new DataView(data);
				var len = data.byteLength / 4;
				var arr = Array(len);
				for(var i=0;i<len;i++) {
					arr[i] = view.getInt32(i*4);
				}
				var value = (/**/name/**/).apply(/**/name/**/, arr);
				if(!(value instanceof Array)) { value = [value]; }
				len = value.length;
				var buffer = new ArrayBuffer(len * 4);
				view = new DataView(buffer);
				for(i=0;i<len;i++) {
					view.setInt32(i*4, value[i]);
				}
				self.postMessage(buffer, [buffer]);
				self.close();
			})
		},
		Float64: function() {
			var /**/name/**/ = (/**/func/**/);
			self.addEventListener('message', function(e) {
				var data = e.data;
				var view = new DataView(data);
				var len = data.byteLength / 8;
				var arr = Array(len);
				for(var i=0;i<len;i++) {
					arr[i] = view.getFloat64(i*8);
				}
				var value = (/**/name/**/).apply(/**/name/**/, arr);
				if(!(value instanceof Array)) { value = [value]; }
				len = value.length;
				var buffer = new ArrayBuffer(len * 8);
				view = new DataView(buffer);
				for(i=0;i<len;i++) {
					view.setFloat64(i*8, value[i]);
				}
				self.postMessage(buffer, [buffer]);
				self.close();
			})
		}
	};

	Multithread.prototype._encode = {
		JSON: function(args) {
			try {
				var data = JSON.stringify(args);
			} catch(e) {
				throw new Error('Arguments provided to parallel function must be JSON serializable');
			}
			len = data.length;
			var buffer = new ArrayBuffer(len);
			var view = new DataView(buffer);
			for(var i=0;i<len;i++) {
				view.setUint8(i, data.charCodeAt(i) & 255);
			}
			return buffer;
		},
		Int32: function(args) {
			len = args.length;
			var buffer = new ArrayBuffer(len*4);
			var view = new DataView(buffer);
			for(var i=0;i<len;i++) {
				view.setInt32(i*4, args[i]);
			}
			return buffer;
		},
		Float64: function(args) {
			len = args.length;
			var buffer = new ArrayBuffer(len*8);
			var view = new DataView(buffer);
			for(var i=0;i<len;i++) {
				view.setFloat64(i*8, args[i]);
			}
			return buffer;
		}
	};

	Multithread.prototype._decode = {
		JSON: function(data) {
			var view = new DataView(data);
			var len = data.byteLength;
			var str = Array(len);
			for(var i=0;i<len;i++) {
				str[i] = String.fromCharCode(view.getUint8(i));
			}
			if(!str.length) {
				return;
			} else {
				return JSON.parse(str.join(''));
			}
		},
		Int32: function(data) {
			var view = new DataView(data);
			var len = data.byteLength / 4;
			var arr = Array(len);
			for(var i=0;i<len;i++) {
				arr[i] = view.getInt32(i*4);
			}
			return arr;
		},
		Float64: function(data) {
			var view = new DataView(data);
			var len = data.byteLength / 8;
			var arr = Array(len);
			for(var i=0;i<len;i++) {
				arr[i] = view.getFloat64(i*8);
			}
			return arr;
		},
	};

	Multithread.prototype._execute = function(resource, args, type, callback) {
		if(!this._activeThreads) {
			this._debug.start = (new Date).valueOf();
		}
		if(this._activeThreads < this.threads) {
			this._activeThreads++;
			var t = (new Date()).valueOf();
			var worker = new Worker(resource);
			var buffer = this._encode[type](args);
			var decode = this._decode[type];
			var self = this;
			if(type==='JSON') {
				var listener = function(e) {
					callback.call(self, decode(e.data));
					self.ready();
				};
			} else {
				var listener = function(e) {
					callback.apply(self, decode(e.data));
					self.ready();
				};
			}
			worker.addEventListener('message', listener);
			worker.postMessage(buffer, [buffer]);
		} else {
			this._queueSize++;
			this._queue.push([resource, args, type, callback]);
		}
	};

	Multithread.prototype.ready = function() {
		this._activeThreads--;
		if(this._queueSize) {
			this._execute.apply(this, this._queue.shift());
			this._queueSize--;
		} else if(!this._activeThreads) {
			this._debug.end = (new Date).valueOf();
			this._debug.time = this._debug.end - this._debug.start;
		}
	};

	Multithread.prototype._prepare = function(fn, type) {

		fn = fn;

		var name = fn.name;
		var fnStr = fn.toString();
		if(!name) {
			name = '$' + ((Math.random()*10)|0);
			while (fnStr.indexOf(name) !== -1) {
				name += ((Math.random()*10)|0);
			}
		}

		var script = this._worker[type]
			.toString()
			.replace(/^.*?[\n\r]+/gi, '')
			.replace(/\}[\s]*$/, '')
			.replace(/\/\*\*\/name\/\*\*\//gi, name)
			.replace(/\/\*\*\/func\/\*\*\//gi, fnStr);

		var resource = URL.createObjectURL(new Blob([script], {type: 'text/javascript'}));

		return resource;

	};

	Multithread.prototype.process = function(fn, callback) {

		var resource = this._prepare(fn, 'JSON');
		var self = this;

		return function() {
			self._execute(resource, [].slice.call(arguments), 'JSON', callback)
		};

	};

	Multithread.prototype.processInt32 = function(fn, callback) {

		var resource = this._prepare(fn, 'Int32');
		var self = this;

		return function() {
			self._execute(resource, [].slice.call(arguments), 'Int32', callback)
		};

	};

	Multithread.prototype.processFloat64 = function(fn, callback) {

		var resource = this._prepare(fn, 'Float64');
		var self = this;

		return function() {
			self._execute(resource, [].slice.call(arguments), 'Float64', callback)
		};

	};

	window['Multithread'] = Multithread;

}();
//
//
//
//
//
var progressA = 0;
var progress = 0;
var progressScore = 0;
function uriParameter(parameter) {
	return window.decodeURIComponent((new RegExp('[?|&]' + parameter + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [null, ''])[1].replace(/\+/g, '%20')) || null;
}
  var benchC = 0;
  var benchT = 0;
  var go = 0; 
  var app = 0;
  var curr = 0;
  var r = 0;
  var x = Math.random();
  var y = Math.random();
  var z = Math.random();
var test_threads = navigator.hardwareConcurrency;
console.log("running " + test_threads + " threads.");
var MT = new Multithread(test_threads);

  var q = MT.process(
    function(output,xaa,yaa,zaa){
       var a = output;
       var b = a - xaa;
       var c = b + yaa;
       var d = c + zaa;
    
       var e = d / c;
       var f = b - e;
       var g = a / f;
       b = a * c;
       e = d / f;
      	return{
	   in1: b,
 	   in2: e,
	   in3: g,
	}
   },
   function(input){
    x = input.in1;
    y = input.in2;
    z = input.in3;
    console.log("EvClc-[" + r + "] @" + curr + " // " , x , y , z);
    if(z < x + y){
      start(2,x,y,z);
      return;
    }
    else if(x > y){
      start(5,x,y,z);
      return;
    }
    else if(y > z){
      start(4,x,y,z);
      return;
    }

    else{
      start(Math.random,Math.random,Math.random,Math.random);
      return;
    }
   }
 );
var timer = MT.process(
 function(ti) { 
  return ti + 3;
 },
 function(returnv){
      console.log("EvTme-[" + returnv + "]");
  curr = returnv;
  if(go == 1){
	setTimeout(function(){
	timer(returnv);
	}, benchT);
	return;
  }
  else{
     score();
     return;
  }  
 }
);
function init() {
    data = document.getElementById('benchQu').value;
    window.location = "index.htm?test=" + data;	
}
function custom() {
	data = document.getElementById("form").value;
	window.location = "index.htm?test=" + data;
}


  function start(i){
    benchT = benchC / 1024 * 9;
    r++;
    if(i == 3 && r <= benchC){
       setTimeout(function(){q(i,x,y,z);},550);
    }
    if(i !== 3 && r <= benchC){
       q(i,x,y,z);
    }
    else{
       go = 0;
       return;
    }
   updateDOM();
     if(app == 0){app++; tstart();};
  }
function updateDOM(){

if(progressA == 1){
progress.style.width = r / benchC * 100 + "%";
progressScore.innerHTML = curr;
}
}	


function tstart(){
    go = 1;
    timer(curr);
    return 1;
}
function score(){
	if(test == "qck" || test == "std" || test == "ext" || test == "xtr" || test == "fll"){
		var next = testCurrent + 1;
		window.location = "index.htm?test=" + test + "&prev=" + testPrevScore + "/" + curr + "&current=" + next;		
	}
	else{
		window.location = "index.htm?test=results&prev=/" + curr;
	}
}
function results(){
	var scores = testPrevScore.split("/");
	for(i = 1;i < scores.length;i++){
		document.body.innerHTML += "<p>" + scores[i] + "</p>";
	}
	
}
function readMe(){
	request("README.md");
}
function scoreAnalysis(){
	request("scoreAnalysis");
}
function request(src){
		var request = new XMLHttpRequest();
		request.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200)
			{
				document.body.innerHTML += this.responseText;
					console.log("recived data.")
				if(src == "test"){
					progress = document.getElementById("progressCurrent");
					progressScore = document.getElementById("scorexxx");
					progressA = 1;
				}
			}}
		request.open("GET", src, true);
		request.send();
		console.log("sent request.")
}
var test = uriParameter("test");
var getCurrent = uriParameter("current");
var legacy = uriParameter("legacy");
var testCurrent = 0;
if(getCurrent != null){
	testCurrent = parseInt(getCurrent);
}
var testPrevScore = uriParameter("prev");
if(testPrevScore == null){
	testPrevScore = "";
}
window.onload = function() {
	window.history.pushState("index.htm", "","index.htm");
	document.title = "TheResistanceMark Beta";
	if(test == null && legacy != 1 || test == 0 && legacy != 1){
		window.location = "display.html"
	}
	if(legacy == 1){
		request("legacyMenu");
	}
	else if(test == "results"){
		request("legacyMenu");
		setTimeout(function(){
			results();
			request("score");
		},250);
	}
	else if(test == "cst"){
		request("customForm");
	}
	else{
		request("test");
	}
	if(test !== "qck" && test !== "std" && test !== "ext" && test !== "xtr" && test !== "fll" && test !== "results" && test !== 0 && test !== null){
		benchC = test;
		start(3);
	}
	else if(test == "qck"){
		if(testCurrent == 0 || testCurrent == null){
			benchC = 512;
			start(3);
		}
		if(testCurrent == 1){
			benchC = 1024;
			start(3);
		}
		if(testCurrent == 2){
			benchC = 2048;
			start(3);
		}
		if(testCurrent == 3){
  		        window.location = "index.htm?test=results&prev=" + testPrevScore;				
		}
	}
	else if(test == "std"){
		if(testCurrent == 0 || testCurrent == null){
			benchC = 1024;
			start(3);
		}
		if(testCurrent == 1){
			benchC = 2048;
			start(3);
		}
		if(testCurrent == 2){
			benchC = 4096;
			start(3);
		}
		if(testCurrent == 3){
  		        window.location = "index.htm?test=results&prev=" + testPrevScore;				
		}	
	}
	else if(test == "ext"){
		if(testCurrent == 0 || testCurrent == null){
			benchC = 4096;
			start(3);
		}
		if(testCurrent == 1){
			benchC = 8192;
			start(3);
		}
		if(testCurrent == 2){
			benchC = 16384;
			start(3);
		}
		if(testCurrent == 3){
			benchC = 32768;
			start(3);
		}	
		if(testCurrent == 4){
  		        window.location = "index.htm?test=results&prev=" + testPrevScore;				
		}	
	}
	else if(test == "xtr"){
		if(testCurrent == 0 || testCurrent == null){
			benchC = 16384;
			start(3);
		}
		if(testCurrent == 1){
			benchC = 32768;
			start(3);
		}
		if(testCurrent == 2){
			benchC = 65536;
			start(3);
		}
		if(testCurrent == 3){
			benchC = 131072;
			start(3);
		}	
		if(testCurrent == 4){
  		        window.location = "index.htm?test=results&prev=" + testPrevScore;				
		}	
	}
	else if(test == "fll"){
		if(testCurrent == 0 || testCurrent == null){
			benchC = 1024;
			start(3);
		}
		if(testCurrent == 1){
			benchC = 2048;
			start(3);
		}
		if(testCurrent == 2){
			benchC = 4096;
			start(3);
		}
		if(testCurrent == 3){
			benchC = 8192;
			start(3);
		}
		if(testCurrent == 4){
			benchC = 16384;
			start(3);
		}
		if(testCurrent == 5){
			benchC = 32768;
			start(3);
		}
		if(testCurrent == 6){
			benchC = 65536;
			start(3);
		}
		if(testCurrent == 7){
  		        window.location = "index.htm?test=results&prev=" + testPrevScore;				
		}		
	}


}
