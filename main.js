/*
 * References:
 * 1. https://www.html5rocks.com/en/tutorials/file/dndfiles/
 *      - Used for reading in files
 * 2. https://blog.teamtreehouse.com/reading-files-using-the-html5-filereader-api
 *      - Used for reading in files
 */

var runEmulator = null;
function main(usrFile) {
        document.getElementById("runTest").onclick = function () { runTest()};
        document.getElementById("startEmulator").onclick = function () { startEmulator(usrFile)};

} 

function startEmulator(usrFile) {
	let chip = new Chip8();
    chip.reset();
    if (usrFile) {
        chip.loadProgram(prog);
    }

    //click  >> 
    //click  <<
    //run like norm
	runEmulator = setInterval(function(){ chip.runEmulator(); }, 1);
    //window.requestAnimationFrame(chip.runEmulator());

    //If click  pause -> clear setinterval
    document.getElementById("pause").onclick = function() { 
		window.clearInterval(runEmulator); 
		chip.updateHTMLLogMessage("Emulator Paused");
    };

    //If click  resume -> run emulator is true
    document.getElementById("resume").onclick = function() { 
	    runEmulator = setInterval(function(){ chip.runEmulator(); }, 1); 
		chip.updateHTMLLogMessage("Emulator Resumed");
	};

    //If click step forward -> move forward one opcode
    document.getElementById("stepforward").onclick = function() { 
        chip.runEmulator();
        chip.updateHTMLLogMessage("Stepped Forward");
    };
    
    //if delaytimer or soundtimer nonzero, function will be added to queue at a rate of 1s 
    if (chip.delayTimer !== 0) {
        setInterval(function(){ chip.startDelayTimer();}, 1000);
    } 
    if (chip.soundTimer !== 0) {
        setInterval(function(){ chip.startSoundTimer(); }, 1000);
    } 

	var translateKeys = {
	        49: 1,
            50: 2,
            51: 3,
            52: 12,
            81: 4,
            87: 5,
            69: 6,
            82: 13,
            65: 7,
            83: 8,
            68: 9,
            70: 14,
            90: 10,
            88: 0,
            67: 11,
            86: 15,
					 };
					 document.addEventListener("keydown", function(event) {
						 chip.keydown(translateKeys[event.keyCode]);
					 });
					 document.addEventListener("keyup", function(event) {
						 chip.keyup(translateKeys[event.keyCode]);
					 });
}

function runTest() {
    opCoTest();
}

let inputElement = document.getElementById("myFile");
inputElement.addEventListener("change", handleFiles, false);
let file;
let prog;
function handleFiles() {
    window.clearInterval(runEmulator);
    file = this.files[0];
    let reader = new FileReader();
    let result;
    reader.onload = function(event) {
        result = event.target.result; //result = contents of file
        result = result.replace(/\n/g, " "); //replace any newline characters with spaces
        let arr = result.split(" "); //string to array, split by spaces
        prog = new Uint8Array(arr.length*2); //Array to hold program
        let j = 0;
        for (let i = 0; j <= arr.length; i += 2) { //loop to split opcodes into 1 byte
            prog[i] = (parseInt(arr[j], 16) & 0xFF00) >>> 8; //first byte (parse int --> convert string to int)
            prog[i+1] = (parseInt(arr[j], 16) & 0x00FF);     //second byte
            j++;
        }
        alert("Your file has been loaded, please press \"Start Emulation\"");
    main(true); //call main, with true boolean to show it should load a file
    };
    reader.readAsBinaryString(file);
}


main(false);


