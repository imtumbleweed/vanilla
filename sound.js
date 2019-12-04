let SFX_OW1 = 0;
let SFX_WIND = 1;

window.sfx = new Array(1000);
window.sound = new Array(1000);

let SoundStation = function(filename)
{
	this.that = this;
	this.context = null;
	this.audio = new Audio(filename);
//	this.volumeGain = null;	// currently used only for background music volume
	this.volumeGainContext = null;	// currently used only for background music volume
	this.musicVolume = 1.0;
	let that = this;

    // Play sound in __buffer_ID
	this.play = function(__buffer_ID, repeatSound, contextGain) {
	
		// To turn all sounds off, uncomment this line:
		// return false;
	
		if (window.sfx[__buffer_ID] == undefined)
			return;
		let __buffer = window.sfx[__buffer_ID];
		let source = this.context.createBufferSource();
        source.buffer = __buffer;

		  // tie to gain context so we can control this sound's volume
		  if (contextGain)
		  {
	  		  this.volumeGainContext = this.context.createGain();
			  source.connect(this.volumeGainContext);
			  this.volumeGainContext.connect(this.context.destination);
			  this.volumeGainContext.gain.value = 1.0;
		  } else

		  // do regular connect (full volume)

		  source.connect(this.context.destination);
		  source.start(0);
		  if (repeatSound)
		  	source.loop = true;
	}
	this.available = false;

	// call this function from your program entry point to intitialize
	this.Initialize = function() {
		let contextClass = (window.AudioContext || 
		    window.webkitAudioContext ||
		    window.mozAudioContext ||
		    window.oAudioContext ||
		    window.msAudioContext);
		if (contextClass) {
			this.available = true;
			this.context = new contextClass();
            LoadSfx(); 
		} else
			this.available = false;
	}

	this.onError = function() { console.log("Sound.load('" + filename_url + "')... Failed!"); }

    // Load sound into __buffer_ID from URL (full-path required)
	this.load = function(__buffer_ID, filename_url) {
		let request = new XMLHttpRequest();
		request.open('GET', filename_url, true);
		request.responseType = 'arraybuffer';
		let that_v2 = this.that;
		request.onload = function() {
		  that_v2.context.decodeAudioData(request.response, function(theBuffer) {
		    window.sfx[__buffer_ID] = theBuffer;
	//" + filename_url + "
		    console.log("Sound.load('mp3')... Ok!");
//		    if (filename_url == "http://www.learnjquery.org/games/gem/sfx/delune.mp3")
		    	window.soundtrackReady = true;
		    	    
		  }, this.onError);
		}
		request.send();
	}
}

// Load sound resources into buffer index locations
function LoadSfx() {
	console.log("LoadSfx()...");
	Sound.load(0,  website.url + "/sfx/jewel9.mp3");
	Sound.load(1,  website.url + "/sfx/jewel2.mp3");
	Sound.load(2,  website.url + "/sfx/swoosh.mp3");
	// ... etc (mp3 must be available @ URL)
}

// initialize sound station
let Sound = new SoundStation();