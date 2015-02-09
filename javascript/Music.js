var sounds = new Howl({
		urls: ['music/soundEffects.mp3'],
		sprite: {
			buttonPress: [0,260]
		}
	});
	
	var music = [
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
	
	var musicLoads = [false,false,false,false,false,false];
	var playMusic = true;