inlets = 3;
outlets = 3



var numTracks = 0;
var trackListener = new LiveAPI(trackListenerCallback, "live_set");
trackListener.property = "tracks";

var numScenes = 0;
var sceneListener = new LiveAPI(sceneListenerCallback, "live_set");
sceneListener.property = "scenes";

var clipsBeingTracked = {};


function trackListenerCallback(args) {
 	post("callback called with arguments:", args, "\n");
	numTracks = (args.length-1)/2;
 	post("num tracks", numTracks, "\n");
}

function sceneListenerCallback(args) {
 	post("callback called with arguments:", args, "\n");
	numScenes = (args.length-1)/2;
 	post("num scenes", numScenes, "\n");
}


function getClipNotesByName(args) {
	for(var i = 0; i < numTracks; i++) {
		for(var j = 0; j < numScenes; j++) {
			
		}
	}
}

function getClipByGridPos(trackNum, sceneNum) {
	var slotPath = "live_set tracks " + trackNum + " clip_slots " + sceneNum;
	var clipPath = slotPath + " clip";
	var slot = new LiveAPI(slotPath);
	var clip = new LiveAPI(clipPath);
	if(slot.get('has_clip') == 1) {
		post("clip name", clip.get('name'), "id", clip.id, "\n");
		if(!clipsBeingTracked[clip.id]) {
			clipsBeingTracked[clip.id] = true;
 			attachNoteObserverToClip(clipPath);
		}

	} else {
		post("no clip in that slot \n");
	}
}

function attachNoteObserverToClip(clipPath) {
	var noteListener = function(args) {
		post('note listener', args, this.id, "\n");
		var start = this.get('start_marker');
		var end = this.get('end_marker');
		var notes = this.call('get_notes', start, 0, end, 127);
		var noteString = JSON.stringify(notes);
		post("notes ", noteString, "\n");
		
		outlet(0, this.get('name'));
		outlet(1, this.id);
		outlet(2, noteString);
	}
	
	var clip = new LiveAPI(noteListener, clipPath);
	clip.property = 'notes';
}


