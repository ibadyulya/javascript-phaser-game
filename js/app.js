let game = new Phaser.Game(1000, 600, Phaser.AUTO, 'game', { preload: preload, create: create, update: update });




function preload() {

 
    game.load.image('city', 'assets/background/city.png');
    game.load.spritesheet('zombie', 'assets/sprites/zombies.png', 85, 118.5);
    game.load.spritesheet('coin', 'assets/sprites/coin.png', 50, 50);
    game.load.spritesheet('player', 'assets/sprites/char1.png', 99, 120);
    game.load.audio('back_music', 'assets/audio/backM1.mp3');
    game.load.audio('coin', 'assets/audio/coin.mp3');
    game.load.audio('shoot', 'assets/audio/shoot.mp3');
    game.load.audio('game_over', 'assets/audio/gameover.mp3');
    game.load.audio('game_win', 'assets/audio/gamewin.mp3');
    game.load.audio('zombie_kill', 'assets/audio/zombie_kill1.mp3');
    game.load.audio('jump', 'assets/audio/jump.mp3');
    game.load.audio('run', 'assets/audio/run.mp3');
    game.load.tilemap('map', 'assets/tileset/tileset_00.2.csv', null, Phaser.Tilemap.CSV);
    game.load.image('tileset', 'assets/tileset/tileset_0.02.png');
    game.load.image('bullet', 'assets/sprites/bullet.png');
    game.load.spritesheet('button', 'assets/sprites/buttons.png', 45, 45);
 

}

let music;
let backG;
let player;
let playerTurn = 0;
let zombies;
let zombie;
let coins;
let cursors;
let score = 0;
let scoreText;
let stateText;
let map;
let layer;
let bullets;
let bullet;
let bulletTime = 0;
let fireButton;
let firingTimer = 0;
let restartGame;
let coin_sound;
let shoot_sound;
let jump_sound;
let gameover_sound;
let gamewin_sound;
let zombie_kill_sound;
let buttonMute;
let buttonRestart;
let button_mod = 0;

function create() { 
  
    game.physics.startSystem(Phaser.Physics.ARCADE);
    restartGame = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
    backG = game.add.tileSprite(0, 0, 12000,556, 'city'); 
    map = game.add.tilemap('map', 60, 60);
    map.addTilesetImage('tileset');
    layer = map.createLayer(0);
    map.setCollisionBetween(0, 5);
    map.setCollisionBetween(7, 10);
    layer.resizeWorld();
    musicCreate();
    playerCreate();
    zombiesCreate();
    coinsCreate();
    bulletsCreate();
    stateText = game.add.text(game.world.centerY,game.world.centerY,' ', { font: '30px Bold', fill: '#fff' });
   
    stateText.visible = false;
    stateText.fixedToCamera = true;
    stateText.anchor.setTo(0.2, 0.5);
    scoreText = game.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#ddf702' });
    scoreText.fixedToCamera = true;
    cursors = game.input.keyboard.createCursorKeys();
    buttonMute = game.add.button( 945, 10, 'button', actionOnClick, this, 0, 0 ,0);
    buttonMute.fixedToCamera = true;
    buttonRestart = game.add.button( 895, 10, 'button', restart, this, 4, 3 ,5);
    buttonRestart.fixedToCamera = true;
}

function update() {
    soundCheck(music, false);
    playerBehavior ();
    zombieBehavior();
    bulletRange(500);
    
    game.physics.arcade.collide(coins, layer);
    game.physics.arcade.overlap(player, coins, collectCoins, null, this);
    game.physics.arcade.collide(zombies, layer);
    game.physics.arcade.overlap(bullets, zombies, killZombie, null, this);
}

  
    function zombiesCreate() {
        zombies = game.add.group();
        game.physics.arcade.enable(zombies);
        zombies.enableBody = true;
    
        for (let i = 0; i < 40; i++)
        {
            zombie = zombies.create(getRandomPos(500, 11800), game.world.randomY, 'zombie');
            zombie.body.gravity.y = 400;
            // zombie.body.collideWorldBounds = true;
        }
    
        zombies.callAll('animations.add', 'animations', 'right', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], 10, true);
        zombies.callAll('animations.add', 'animations', 'left', [10, 11, 12, 13, 14, 15, 16, 17, 18, 19], 10, true);
        zombies.callAll('animations.add', 'animations', 'iddle', [20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31 ,32, 33, 34], 10, true);
        
    }
    function getRandomPos(min, max) {
        return Math.random() * (max - min) + min;
    }
  
    function playerCreate() {
        player = game.add.sprite(290, game.world.height - 290, 'player');
        game.camera.follow(player);
        game.physics.arcade.enable(player);
        // player.body.collideWorldBounds = true;
        player.body.gravity.y = 400;
        player.animations.add('right',[0, 1, 2, 3, 4, 5, 6, 7, 8, 9], 35, true);
        player.animations.add('left', [19, 18, 17, 16, 15, 14, 13, 12, 11, 10], 35, true);
        player.animations.add('iddle', [20, 21, 22, 23, 24, 25, 26, 27, 28, 29], 17, true);
        player.animations.add('left_iddle', [40, 41, 42, 43, 44, 45, 46, 47, 48, 49], 17, true);
        player.animations.add('right_fire', [32, 33, 34], 15, true);
        player.animations.add('left_fire', [35, 36, 37], 15, true);
 
    }
    function coinsCreate() {
        coins = game.add.group();
        game.physics.arcade.enable(coins);
        coins.enableBody = true;
    
        for (let i = 0; i < 90; i++)
        {
        let coin = coins.create(game.world.randomX, game.world.randomY, 'coin');
        coin.body.gravity.y = 400;
        // coin.body.collideWorldBounds = true;
        }
    
        coins.callAll('animations.add', 'animations', 'flip', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], 20, true);
        coins.callAll('animations.play', 'animations', 'flip');
       
    }
    function bulletsCreate(){
        bullets = game.add.group();
        bullets.enableBody = true;
        bullets.physicsBodyType = Phaser.Physics.ARCADE;
        bullets.createMultiple(300, 'bullet');
        bullets.setAll('outOfBoundsKill', true);
        bullets.setAll('checkWorldBounds', true);
        fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    }
    function musicCreate() {
       
        music = game.add.audio('back_music');
        coin_sound = game.add.audio('coin');
        shoot_sound = game.add.audio('shoot');
        gameover_sound = game.add.audio('game_over');
        gamewin_sound = game.add.audio('game_win');
        zombie_kill_sound = game.add.audio('zombie_kill');
        jump_sound = game.add.audio('jump');
        run = game.add.audio('run');
        
    }
    function actionOnClick () {
       
        if(button_mod == 0){
             buttonMute.setFrames(2);
             button_mod = 1;
           
             
        }else if(button_mod == 1){
             button_mod = 0;
             buttonMute.setFrames(0);
             
        }
     }


    
     function collectCoins (player, coin) { 
        soundCheck(coin_sound, true);
        coin.kill(); 
        score += 10;
        scoreText.text = 'Score: ' + score;   
    }
    function soundCheck(soundName, forceSound) {
        if (button_mod == 0){
            soundName.play('', 0, 1, false, forceSound);
        }else if (button_mod == 1){
            soundName.stop();
        }
    }
    function playerBehavior () {
       
        // scoreText.x = player.x - 450;
        game.physics.arcade.collide(player, layer);
        player.body.velocity.x = 0;
        if (cursors.left.isDown){
          
            player.body.velocity.x = -300;
            player.animations.play('left');
            playerTurn = 1;
        }else if (cursors.right.isDown){
         
            player.body.velocity.x = 300;
            player.animations.play('right');
            playerTurn = 0;
            
        }else if ( fireButton.isDown ) {
            if ( playerTurn == 0){
                fireBullet(700, -1.5, -1.3);//r
                player.animations.play('right_fire');
            }else if ( playerTurn == 1){
                fireBullet(-700, 0.7, -1.3);//l
                player.animations.play('left_fire');
                }
        }else{
            if (playerTurn == 0) {
                player.animations.play('iddle');
            }else if (playerTurn == 1)
            {
                player.animations.play('left_iddle');
            }
        } 
   
        if (cursors.up.isDown && player.body.onFloor()){
            player.body.velocity.y = -350; 
            soundCheck(jump_sound, false);
        }else if ( cursors.right.isDown && !player.body.onFloor()){
            playerTurn = 0;
            player.animations.stop();
            player.frame = 30;
        } else if (cursors.left.isDown && !player.body.onFloor()) {
            playerTurn = 1;
            player.animations.stop();
            player.frame = 31;
        }
        if (fireButton.isDown && cursors.right.isDown){
            
             player.animations.play('right_fire');
             fireBullet(700, -1.5, -1.3);
         } else if (fireButton.isDown && cursors.left.isDown){
             fireBullet(-700, 0.7, -1.3);
            
             player.animations.play('left_fire');
             
         }  
       
        if (player.y > 556)
        {   
            gameOverOrWon(' GAME OVER \n  Press ENTER \n   to restart', gameover_sound);
          
        }
        if (player.x > 11864){
            gameOverOrWon('    You Won!!! \n  Press ENTER \n      to restart', gamewin_sound);
        }
     
        
    }
    function zombieBehavior() {
        game.physics.arcade.collide(zombies, layer);
        zombies.forEachAlive(function(zombie){
            if (zombie.y > 556){
                zombie.kill();
            }
            if((zombie.x - player.x < 30 && zombie.x - player.x  > 0) && (zombie.y - player.y > -30 ) && (zombie.y - player.y < 30 ) ||
                (zombie.x - player.x > -30 && zombie.x - player.x  < 0) && (zombie.y - player.y > -30 ) && (zombie.y - player.y < 30 ) ){
                gameOverOrWon(' GAME OVER \n  Press ENTER \n     to restart', gameover_sound);
            }
            if(zombie.x - player.x < 400 && zombie.x - player.x  > 11){
                zombie.animations.play('left');
                zombie.body.velocity.x = -100;
            }else  if(zombie.x - player.x > -400 && zombie.x - player.x  < -11){
                zombie.animations.play('right');
                zombie.body.velocity.x = 100;
            }else if (zombie.x == player.x){

            }else{
                zombie.animations.play('iddle');
                // zombie.animations.stop();
                zombie.body.velocity.x = 0;
            } 

                });

    }
    
    function fireBullet (direction, xAnch, yAnch) {
        soundCheck(shoot_sound, true);   
        if (game.time.now > bulletTime)
        {
            bullet = bullets.getFirstExists(false);
    
            if (bullet)
            {   
                bullets.setAll('anchor.x', xAnch);
                bullets.setAll('anchor.y', yAnch);
                bullet.reset(player.x, player.y);
                bullet.body.velocity.x = direction;
                bulletTime = game.time.now + 300;
            }
            
        }
        
    }
    function killZombie (bullet, zombies) {
        bullet.kill();
        zombies.kill();
        soundCheck(zombie_kill_sound, true);
        score += 20;
        scoreText.text = 'Score: ' + score;
    
    }
    function restart () {
       gameover_sound.stop();
       gamewin_sound.stop();
        music.restart();
        zombies.removeAll();
        zombiesCreate();
        player.revive();
        bullets.revive();
        player.x = 290;
        player.y = 290;
        game.camera.follow(player);
        stateText.visible = false;
        backG.tint = 0xffffff;
        stateText.fontSize = 20;
        
    }

    function gameOverOrWon(textcontent, sound) {
        soundCheck(sound, false);
        music.pause();
        player.kill();
        bullets.kill();
        stateText.text = textcontent;
        stateText.visible = true;
        backG.tint = 0x454141;
        if (stateText.fontSize < 100)
        {
            stateText.fontSize += 1;
        }
        restartGame.onDown.addOnce(restart, this);
    }
    function bulletRange(b_range) {
        bullets.forEachAlive(function(bullet){ 
            // console.log(Math.abs(player.x - bullet.x));
            if(Math.abs(player.x - bullet.x) > b_range){
                bullet.kill();
            }
        });
    }
   
        

function render() {

    game.debug.text('Score: ' + scoreText, 32, 32);
}


