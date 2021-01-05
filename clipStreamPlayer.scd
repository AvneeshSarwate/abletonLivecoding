OSCFunc.trace

(
var clock, channels, createPattern, ports, timestampsToDeltas;
MIDIClient.init;
MIDIIn.connectAll;



//map of channelString -> {playingPattern, onDeckPattern, midiPort}
channels = Dictionary.new;

clock = LinkClock.new;

OSCFunc.new({|msg, time, addr, recvPort|

}, "/scheduleBuffer");

OSCFunc.new({|msg, time, addr, recvPort|
	channels[msg[1]] = Dictionary.new;
	channels[msg[1]]["midiPort"] = MIDIOut.newByName(msg[2], msg[3]);
	channels[msg[1]]["midiPort"].latency = 0;
}, "/initChannel");

createPattern ={|midiBufferJson|
	var midiInfo = midiBufferJson.parseJSON;
	var deltas = timestampsToDeltas.(midiInfo.collect({|elem| elem.time}));
	var pat = Pbind(
		\delta, Pseq(deltas),
		\noteInfo, Pseq(noteInfo),
		\play, {

		}
	);
	pat
};

timestampsToDeltas = {|timestamps|
	var lastTime = 0;
	var deltas = timestamps.collect({|time|
		var dt = time - lastTime;
		lastTime = time;
		dt
	});
	deltas;
}


)

MIDIClient.init

