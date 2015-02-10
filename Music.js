function Music(){
	this.isPlayMusic = true;
	this.currentSong = 0;
	this.musicLoads = [false,false,false,false,false,false];
	this.music = [
		new Howl({
			urls: ['music/Carefree.mp3'],
			volume: 0.7,
			loop: true,
			onload: function(){musicLoads[0] = true;}
		}),
		
		new Howl({
			urls: ['music/Monkeys Spinning Monkeys.mp3'],
			volume: 0.5,
			loop: true,
			onload: function(){musicLoads[1] = true;}
		}),
	];
	
	this.playMusic = function(musicNum){
		this.currentSong = musicNum;
		if(this.isPlayMusic)
		{
			this.music[musicNum].play();
			return true;
		}
		else
		{
			return false;
		}
	};
	
	this.stopMusic = function(){
		this.music[this.currentSong].stop();
	};
}

function Sound(){
	this.currentSound = "buttonPress";
	this.sounds = new Howl({
		urls: ['music/soundEffects.mp3'],
		sprite: {
			buttonPress: [0,260]
		}
	});
	this.isPlaySound = true;
	this.playSound = function(sound){
		this.currentSound = sound;
		if(this.isPlaySound)
		{
			this.sounds.play(sound);
			return true;
		}
		else
		{
			return false;
		}
	};
	
	this.stopSound = function(){
		
	};
}

var gameMusic = new Music();
var gameSound = new Sound();