/*
Note from Bodie: This file was giving me some errors, and freezing the game, usually saying "musicNum is not defined".
I changed some musicNum varibale to this.currentSong, because I thought that was what you originally wanted.
if you want to see exactly what I changed, use GIT lo log the changes of this file.
*/

function Music(){
	this.isPlayMusic = true;
	this.currentSong = 0;
	this.musicLoads = [false,false,false,false,false,false];
	this.music = [
		new Howl({
			urls: ['music/Carefree.mp3'],
			volume: 0.7,
			loop: false,
		}),
		
		new Howl({
			urls: ['music/Monkeys Spinning Monkeys.mp3'],
			volume: 0.5,
			loop: false,
		}),
	];
	
	this.playMusic = function(musicNum){
		this.currentSong = musicNum;
		if(this.isPlayMusic)
		{
			this.music[musicNum].loop = true;
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
		this.music[this.currentSong].loop = false;
	};
	
	this.changeMusic = function(musicNum){
		this.stopMusic();
		this.playMusic(this.currentSong);
	};
	
	this.muteMusic = function(){
		this.isPlayMusic = false;
		this.stopMusic();
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
	
	this.muteSounds = function(){
		this.isPlaySound = false;
	};
	
	this.unmuteSounds = function(){
		this.isPlaySound = true;
	};
}

var gameMusic = new Music();
gameMusic.playMusic(0);
var gameSound = new Sound();