kontra.init();

var x_border = 256
var y_border = 256

var speed = 2;

kontra.assetPaths.images= 'assets/images/';

kontra.loadAssets('background1.png', 'enemy.png', 'player.png').then(
  function(){
        
    var background1 = kontra.sprite ({
      x: 0,
      y:0,
      image: kontra.images.background1 
    });

    var player = kontra.sprite ({
      x: 120,
      y: 210,

      image: kontra.images.player
    });

    var enemies = [
      
      kontra.sprite ({
        x: 180,
        y: 130,
        dx: speed -1,
        image: kontra.images.enemy
        
      }),
      kontra.sprite ({
        x: 40,
        y: 100,
        dx: speed,
        image: kontra.images.enemy
        
      }),
      kontra.sprite ({
        x: 40,
        y: 70,
        dx: speed-0.5,
        image: kontra.images.enemy
        
      }),
      kontra.sprite ({
        x: 40,
        y: 50,
        dx: speed+1,
        image: kontra.images.enemy
        
      })
    ]



    var loop = kontra.gameLoop({
      update: function() {

        //player movement
        if (kontra.keys.pressed('w')){
          player.y -= speed;
        }

        if (kontra.keys.pressed('s')){
          player.y += speed;
        }

        if (kontra.keys.pressed('a')){
          player.x -= speed;
        }

        if (kontra.keys.pressed('d')){
          player.x += speed;
        }

        // player border checks
        if (player.x > x_border - kontra.images.player.width){
          player.x = x_border - kontra.images.player.width;
        }

        if (player.x < 0){
          player.x = 0;
        }

        if (player.y > y_border - kontra.images.player.height){
          player.y = y_border - kontra.images.player.height;
        }

        if (player.y < 0){
          player.y = 0;
        }

        if (player.x < 150 && player.x > 110 && player.y < 30){
          loop.stop();

          alert("You have won the game!");

          window.location = ''
        }

        player.update();

        //enemy code

        enemies.forEach(function(enemy){
              
          if (enemy.x > x_border - kontra.images.enemy.width){
            enemy.dx = -speed;
          }

          if (enemy.x < 0){
            enemy.dx = speed;
          }

          enemy.update();

          //check for collision wit player

          if (enemy.collidesWith(player)){
            loop.stop();

            alert("you have lost the game!");

            window.location = ''  
          }
        })

        
        background1.update();
      },

      render: function() {
    
        
        background1.render();
        player.render();
        enemies.forEach(function(enemy){
          enemy.render();
        })

      }
    })

    loop.start();
  }
)

