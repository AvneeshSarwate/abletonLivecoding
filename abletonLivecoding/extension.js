// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const osc = require('osc');

const clips = {};
const channels = {};

class Channel {

	constructor(channelName) {
		this.channelName = channelName;
		channels[channelName] = this;
		this.state = {};
		this.history = [];
		this.channelInfo = {};
		this.midiInfo = {
			device: "loopMIDI Port",
			port: "loopMIDI Port",
			channel: 0
		}
	}

	playFunction() {}

	play(playFunction) {
		//play function body must add the "end" event to signal buffer duration
		if(playFunction) this.playFunction = playFunction
		this.callPlay();
	}

	callPlay() {
		this.playFunction(this.state, this.history, this.out, this.channelInfo, a => a)
	}

	out(eventBuffer) {
		this.history.push(eventBuffer);
		//add "update" event to request next buffer of events before play finishes
		sendMsg("/scheduleBuffer", [this.channelName, JSON.stringify(eventBuffer)]);
	}

	register(playFunction) {
		this.playFunction = playFunction
	}

	updateInfo(superColliderInfoJson) {
		this.channelInfo = JSON.parse(superColliderInfoJson);
	}

	stop() {

	}
}

function channel(channelStr, midiChan = 0, midiDevice = "loopMIDI Port", midiPort = "loopMIDI Port"){
	if(channels[channelStr]) return channels[channelStr];

	sendMsg("/initChannel", [midiDevice, midiPort, midiChan]);

	channels[channelStr] = new Channel(channelStr);
	channels[channelStr].midiInfo = {
		device: midiDevice, 
		port: midiPort,
		channel: midiChan
	};



	return channels[midiChan];
}

const udpPort = new osc.UDPPort({
    // This is the port we're listening on.
    localAddress: "127.0.0.1",
    localPort: 2346,

    // This is where sclang is listening for OSC messages.
    remoteAddress: "127.0.0.1",
    remotePort: 57120,
    metadata: true
});

function sendMsg(addr, args){
	let typedArgs = args.map(a => {
		return {
			value: a,
			type: typeof a == "string" ? "s" : "f"
		}
	});
	udpPort.send({address: addr, args: typedArgs});
}

function getClip(clipName){
	sendMsg("/getClip", [clipName])
}

udpPort.on('message', oscMessage => {
	console.log("osc message", oscMessage)
	sendString(oscMessage.args[2].value)
	let {address, args} = oscMessage;
	switch(address) {
		case '/clipNotes':
			clips[args[0]] = oscMessage.args
			break;
		case '/channelUpdate':
			channels[args[0]].updateInfo(args[1]);
			channels[args[0]].callPlay();
			break;
		default:
			console.log("no handler for address ", address)
	}
});

function formatNoteList(noteListString) {
	let noteList = JSON.parse(noteList);
	//add "end" event to allow silent space after last midi event
}


udpPort.open();


// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "abletonLivecoding" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('abletonLivecoding.helloWorld', function () {
		// The code you place here will be executed every time your command is executed

		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from abletonLivecoding!');
	});

	context.subscriptions.push(disposable);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
