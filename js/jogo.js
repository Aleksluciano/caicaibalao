// create a new scene named "Game"
let telaJogo = new Phaser.Scene('Jogo');

// some parameters for our scene
telaJogo.init = function() {
    this.velocidadeVento = 0;
     // we are not terminating
  this.isTerminating = false;
      
}

// carrega as figuras do jogo
telaJogo.preload = function() {

    this.load.image('teladefundo', 'assets/images/teladefundo.png');
    this.load.image('boneco', 'assets/images/boneco.png');
    this.load.image('carro', 'assets/images/carro.png');
    this.load.image('balao', 'assets/images/balao.png');
    this.load.image('meteoro', 'assets/images/meteoro.png');
    this.load.image('estrada', 'assets/images/estrada.png');

    this.load.audio('pegoubalao', 'assets/sounds/pegoubalao.mp3');
    this.load.audio('dor', 'assets/sounds/dor.mp3');
    this.load.audio('batida', 'assets/sounds/batida.mp3');
    this.load.audio('gameover', 'assets/sounds/gameover.mp3');

};

// executa uma vez depois que as figuras foram carregadas
telaJogo.create = function() {

    this.somDor = this.sound.add('dor');
    this.somBatida = this.sound.add('batida');
    this.somGameOver = this.sound.add('gameover');

    this.timer = this.time.addEvent({
        loop: true
    });
    this.tempo = this.timer.getElapsedSeconds(); // sec
    
    this.add.sprite(640/2, 360/2, 'teladefundo');
    this.score = 0;
    this.scoreText = this.add.text(10, 10, 'Pontos: 0', { fontSize: '16px', fill: '#f0ffff' });
    
    
    this.tempoText = this.add.text(500, 10, 'Tempo: '+ this.tempo, { fontSize: '16px', fill: '#f0ffff' });


   
    this.estrada = this.physics.add.sprite(640/2, 350, 'estrada');
    this.estrada.body.allowGravity = false;
    this.estrada.body.immovable = true;

    this.balao = this.physics.add.sprite(180, -130, 'balao');
    this.balao.setScale(0.5)
    this.balao.body.allowGravity = false;

    this.meteoro = this.physics.add.sprite(80, -30, 'meteoro');
    this.meteoro.setScale(0.1);

    this.carro = this.physics.add.sprite(600, 310, 'carro');
    this.carro.setBounce(0.2);
    this.carro.setScale(0.5);

    
   

  
    this.boneco = this.physics.add.sprite(10, 300, 'boneco');
    this.boneco.setBounce(0.2);
    this.boneco.setCollideWorldBounds(true);
    this.boneco.setScale(1.5);
    this.boneco.body.setGravityY(300);


    this.physics.add.collider(this.boneco, this.carro);
    this.physics.add.collider(this.carro, this.estrada);
    this.physics.add.collider(this.boneco, this.estrada);

    

    this.botaoSeta = this.input.keyboard.createCursorKeys();

   
  
};




telaJogo.update = function(){

    if(this.isTerminating) return;

    if (this.botaoSeta.left.isDown)
    {
     
        this.boneco.x -= 2.2;
    
     
    }
    else if (this.botaoSeta.right.isDown)
    {
        this.boneco.x += 2.2;
    }
    else
    {
        this.boneco.x += 0;
      
    }
    
    if (this.botaoSeta.up.isDown)
    {
        this.boneco.y -= 5;
    }
   

    if(this.meteoro.y > 360){
   
        this.meteoro.x = Phaser.Math.Between(20, 620);
        this.meteoro.y = Phaser.Math.Between(-30, -50)
        this.meteoro.setScale(Phaser.Math.FloatBetween(0.1, 0.3));
        this.meteoro.body.setVelocity(0);
        
     
    }

    this.balao.y += 1.5;
    this.balao.x += this.velocidadeVento;

    
    let meteoroRetangulo = this.meteoro.getBounds();
    let bonecoRetangulo = this.boneco.getBounds();
    let balaoRetangulo = this.balao.getBounds();
 
    if(Phaser.Geom.Intersects.RectangleToRectangle(bonecoRetangulo, meteoroRetangulo)) {
        this.cameras.main.shake(500);

        if(!this.somDor.isPlaying){
        this.somDor.play();       
        }

        this.score -= 2;
        if(this.score < 0)this.score = 0;
        this.scoreText.setText('Pontos: ' + this.score);

        this.boneco.setTint(0xff0000);
        setTimeout(() => { 
            console.log("deu certo")
            this.boneco.clearTint();
    
    }, 2000);

  
    }

    let pegouBalao = Phaser.Geom.Intersects.RectangleToRectangle(bonecoRetangulo, balaoRetangulo)
    if(pegouBalao) {
        this.sound.play('pegoubalao');

        this.score += 10;
        this.scoreText.setText('Pontos: ' + this.score);
    }

    if(this.balao.y > 360 || pegouBalao){
        
        this.balao.x = Phaser.Math.Between(80, 500)
        this.balao.y = Phaser.Math.Between(-30, -50);
        this.velocidadeVento = Phaser.Math.FloatBetween(-1.5, +1.5);
        this.balao.body.setVelocity(0);
  
     
     
    }

   


    this.carro.x -= 1.8;
    this.physics.world.wrap(this.carro, 45);
    
   
    
    if(this.boneco.x >= this.carro.x - 60 && this.boneco.x <= this.carro.x - 50 && this.boneco.y > 285){
        this.cameras.main.shake(500);
        if(!this.somBatida.isPlaying){
        this.somBatida.play();
        }
        this.score = 0;
        this.scoreText.setText('Pontos: ' + this.score);

    }
  


    this.tempoSegundos = this.timer.getElapsedSeconds();
    let formatTempo = this.tempoSegundos.toString()
    let index = formatTempo.indexOf('.');
    let segundos = formatTempo.substr(0,index);
    this.tempoText.setText('Tempo: ' + segundos);
    if(segundos == "60")
    return this.gameOver();
}

// configuração básica do jogo
let config = {
  type: Phaser.AUTO,
  width: 640,
  height: 360,
  scene: telaJogo,
  title: 'Cai Cai Balão',
  physics: {
    default: 'arcade',
    arcade: {
        gravity: { y: 300 },
        debug: false
    }
  },
  audio: {
    disableWebAudio: true
},
fps:{
    target: 40
}
}



telaJogo.gameOver = function() {

    // initiated game over sequence
    this.isTerminating = true;
  
    // shake camera
    //this.cameras.main.shake(500);
  
    // listen for event completion
    //this.cameras.main.on('camerashakecomplete', function(camera, effect){
  
      // fade out
      //this.cameras.main.fade(500);
      //this.scoreText = this.add.text(300, 160, 'Pontos: ' + this.score, { fontSize: '16px', fill: '#f0ffff' });
      this.scoreText = this.add.text(300, 360/2, 'Game Over', { fontSize: '16px', fill: '#f0ffff' });
      this.somGameOver.play();
    //}, this);
  
    //this.cameras.main.on('camerafadeoutcomplete', function(camera, effect){
      // restart the Scene
     // this.scene.restart();
    //}, this);
  
  
  };

// cria o jogo passando as configurações básicas
let jogo = new Phaser.Game(config);
