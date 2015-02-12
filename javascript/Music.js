function Music(){
	this.isPlayMusic = true;
	this.currentSong = 0;
	this.musicLoads = [false,false,false,false,false,false];
	this.music = [
		new Howl({
			urls: ['music/Carefree.mp3'],
			volume: 0.7,
			loop: true,
		}),
		
		new Howl({
			urls: ['music/Monkeys Spinning Monkeys.mp3'],
			volume: 0.5,
			loop: true,
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
	
	this.changeMusic = function(musicNum){
		this.stopMusic();
		this.playMusic(musicNum);
	};
	
	this.stopMusic = function(){
		this.music[this.currentSong].stop();
	};
	
	this.muteMusic = function(){
		this.isPlayMusic = false;
		this.music[this.currentSong].stop();
	};
	
	this.unmuteMusic = function(){
		this.isPlayMusic = true;
		this.playMusic(this.currentSong);
	};
}

function Sound(){
	this.isPlaySound = true;
	this.currentSound = "buttonPress";
	this.sounds = new Howl({
		urls: ['music/soundEffects.mp3'],
		sprite: {
			buttonPress: [0,260]
		}
	});
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
	
	this.muteSounds = function(
		this.isPlaySound = false;
	};
	
	this.unmuteSounds = functions(){
		this.isPlaySound = true;
	};
}

var gameMusic = new Music();
gameMusic.playMusic(0);
var gameSound = new Sound();