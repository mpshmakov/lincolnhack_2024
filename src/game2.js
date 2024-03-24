//TASKS RN:
//DO A WALKING AI
// DO A MENU
// DO A MAP EDITOR
//fix map.png size to match the walls


let {init, GameLoop, Scene, load, TileEngine, dataAssets, Sprite, keyPressed, initKeys, collides, initPointer, getPointer, pointerPressed, angleToTarget} = kontra;

const {canvas, context} = init();
initKeys();
initPointer();

console.log(canvas, context);

let mapWidth = 576;
let mapHeight = 576;   

let canvasCenter_x = canvas.width / 2;
let canvasCenter_y = canvas.height / 2;


let max_attack_delay_player1 = 0.5;
let max_attack_delay_player2 = 0.7;
let max_ray_delay = 0.15;

let ray_time_alive = 0.1;

let player_speed = 1.45;
let enemy_speed = 0.8;
let bullet_speed = 4.5;
let ray_speed = 3.5;

let bullet1;
let bullet2;

let ray_left;
let ray_straight;
let ray_right;

let finish_tile = null;

console.log('mapWidth', mapWidth);
console.log('mapHeight', mapHeight);


function generate_coords_from_map(map){
    let coords = [[]];
    let k = 0;
    for (i = 0; i < 17; i++){
        for (j = 0; j <= 17; j++){
            if (map[i][j] == 1){
                
                k++;
                coords.push([32*(j), 32*(i)]);
            } 
            if (map[i][j] == 2){
                k++;
                coords.push(['w', [32*j, 32*i]])
            }
            
        }
    }
    console.log('k',k)
    return coords;
}

function generate_walls_from_coords(coords){
    let walls = []
    
    for (let i = 0; i < coords.length; i++){
        console.log('inside walls func. coords', coords[i][0], coords[i][1])
        if (( coords[i][0] <= mapWidth && coords[i][1] <= mapHeight && coords[i][0] >= 0 && coords[i][1] >= 0)){

            let wall = Sprite({
                x: coords[i][0],
                y: coords[i][1],
                width: 32,
                height: 32,
                color: 'white'
            })
            walls.push(wall)
        } else if (coords[i][0] == 'w'){
            console.log('coords = w', coords[i][1])
            finish_tile = Sprite ({
                x: coords[i][1][0],
                y: coords[i][1][1],
                width: 32,
                height: 32,
                color: 'yellow'
            })
        }
    }   
    return walls
}

function get_pointer_pos_relative_to_map(player_x, player_y, pointer_x, pointer_y){
    pointer_x -= canvasCenter_x;
    pointer_y -= canvasCenter_y;



    return {relative_x: player_x + pointer_x, relative_y: player_y + pointer_y}
}

function get_distance(x1, y1, x2, y2){
    return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2)
}


load(
    'assets/images/player.png',
    'assets/images/map1.png',
    'assets/images/enemy.png'
  ).then(function(assets) {
    console.log("loaded")
    console.log(assets)
    

    map = [
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1],
        [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
        [1, 0, 1, 0, 0, 1, 1, 1, 1, 0, 1, 1, 0, 0, 1, 0, 1],
        [1, 0, 1, 0, 0, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1],
        [1, 0, 0, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1],
        [1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1],
        [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1],
        [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1],
        [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1],
        [1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1],
        [1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1],
        [1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1],
        [1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1],
        [1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 2, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        
    ]

    let coords = generate_coords_from_map(map);
    
    console.log('coords ', coords)

    // 32 x 32 pixels // this 
    //let coords = [ [100, 100], [132, 100], [200, 200], [300, 300], [400, 400], [500, 500], [600, 600], [700, 700], [800, 800], [900, 900], [1000, 1000], [1100, 1100], [1200, 1200], [1300, 1300], [1400, 1400], [1500, 1500]]

    let walls = generate_walls_from_coords( coords)
    console.log('walls', walls)
    walls.forEach(function(wall){
        console.log('wall', wall.x, wall.y)
    })  

    


    // let wall = Sprite ({
    //     x: 100,
    //     y: 100,
    //     width: 32,
    //     height: 32,
    //     color: 'white'
    // })

    let player1 = Sprite ({
        lives: 4,
        x: 52,
        y: 52,  
        image: assets[0],
        attack_delay: max_attack_delay_player1,  //BUG THAT BULLET STILL COLLIDES WITH A PLAYER THAT HAS BEEN
        anchor: {x: 0.5, y: 0.5},

        alive: function(){
            return this.lives > 0;
        },
        
        shoot: function(pointer_x, pointer_y){
            if (this.attack_delay <= 0){
                let angle = angleToTarget(this, {x: pointer_x, y: pointer_y});

                console.log('relative pointer x', pointer_x);
                console.log('relative pointer y', pointer_y);

                console.log('x from player', pointer_x - this.x);
                console.log('y from player', pointer_y - this.y);

                console.log('angle', angle);

                let x_speed = bullet_speed * Math.cos(angle);
                let y_speed = bullet_speed * Math.sin(angle);

                let x_offset = 15 * Math.cos(angle);
                let y_offset = 15 * Math.sin(angle);
                console.log('x_speed', x_speed);
                console.log('y_speed', y_speed);

                bullet1 = Sprite({
                    x: this.x + x_offset,
                    y: this.y + y_offset,
                    dx: x_speed,
                    dy: y_speed,
                    
                    width: 5,
                    height: 10,
                    anchor: {x: 0.5, y: 0.5},
                    rotation: angle + Math.PI / 2,
                    color: 'red',

                    // update: function(){
                    //     this.advance();
                    //     if (this.y < 0){
                    //         console.log(this.y);
                    //         this.ttl = 0;
                    //     }
                    // }
                })
                scene.add(bullet1);
                this.attack_delay = max_attack_delay_player1;
            }
        }

    })

    

    let player2 = Sprite ({
        
        lives: 4,
        direction: 2, // in 90 * direction. 1 - up, 2 - right, 3 - down, 4 left
        dx: 1,
        dy: 0,
        x: 52,
        y: 52,  
        image: assets[0],
        attack_delay: max_attack_delay_player2,
        ray_delay: max_ray_delay,
        anchor: {x: 0.5, y: 0.5},

        alive: function(){
            return this.lives > 0;
        },

        shoot_rays: function(){

            console.log('shooted ray')
            console.log('direction', this.direction)
            
            let angle = this.direction * Math.PI / 2; // convert direction to radians
            let angle_left = angle - Math.PI / 2.5; // 45 degrees to the left
            let angle_right = angle + Math.PI / 2.5; // 45 degrees to the right

            ray_left = Sprite({
                x: this.x,
                y: this.y,
                dx: -ray_speed * Math.cos(angle_left) * 0.9,
                dy: -ray_speed * Math.sin(angle_left) * 0.9,
                color: 'red',
                width: 5,
                height: 5,
                time_alive: 0,  
                collided: false,
                changed: false,
            })

            ray_straight = Sprite({
                x: this.x,
                y: this.y,
                dx: -ray_speed * Math.cos(angle)*1,
                dy: -ray_speed * Math.sin(angle)*1,
                color: 'blue',
                width: 5,
                height: 5,
                time_alive: 0,
                collided: false,
                changed: false,
            })

            ray_right = Sprite({
                x: this.x,
                y: this.y,
                dx: -ray_speed * Math.cos(angle_right) * 0.9,
                dy: -ray_speed * Math.sin(angle_right) * 0.9,
                color: 'yellow',
                width: 5,
                height: 5,
                time_alive: 0,
                collided: false,
                changed: false,
            })
            scene.add(ray_left);
            scene.add(ray_straight);
            scene.add(ray_right);

        },

        shoot: function(){
            if (this.attack_delay <= 0){
                let angle = angleToTarget(this, {x: player1.x, y: player1.y});

                console.log('enemy angle', angle);

                let x_speed = bullet_speed * Math.cos(angle);
                let y_speed = bullet_speed * Math.sin(angle);

                let x_offset = 15 * Math.cos(angle);
                let y_offset = 15 * Math.sin(angle);
                console.log('x_speed', x_speed);
                console.log('y_speed', y_speed);

                bullet2 = Sprite({
                    x: this.x + x_offset,
                    y: this.y + y_offset,
                    dx: x_speed,
                    dy: y_speed,
                    
                    width: 5,
                    height: 10,
                    anchor: {x: 0.5, y: 0.5},
                    rotation: angle + Math.PI / 2,
                    color: 'blue',

                    // update: function(){
                    //     this.advance();
                    //     if (this.y < 0){
                    //         console.log(this.y);
                    //         this.ttl = 0;
                    //     }
                    // }
                })
                scene.add(bullet2);
                this.attack_delay = max_attack_delay_player2;
            }
        }
    })

    let background = Sprite({
        x: 0,
        y:0,
        image: assets[1]
        
        //image: dataAssets['images/player.png']
    })


    let scene = Scene({
        id: 'game',
        objects: [background, finish_tile, player1, player2, ...walls],

    })
    console.log('finish tiel', finish_tile)
    

    let tmpx1 = 0;
    let tmpy1 = 0;

    let tmpx2 = 0;
    let tmpy2 = 0;



    //GAMELOOP
    const loop = GameLoop({
        update: function(dt){

            console.log('player2 x y', player2.x, player2.y);
            player1.attack_delay -= dt;
            player2.attack_delay -= dt;
            player2.ray_delay -= dt;

            if (ray_left){
                ray_left.time_alive += dt;
            }
            if (ray_straight){
                ray_straight.time_alive += dt;
            }   
            if(ray_right){      
                ray_right.time_alive += dt;
            }

            scene.lookAt(player1);

            //console.log('player.x', player1.x);

            if (keyPressed('w')){
                player1.y -= player_speed;
            }
            if (keyPressed('s')){
                player1.y +=  player_speed;
            }
            if (keyPressed('a')){
                player1.x -=  player_speed;
            }
            if (keyPressed('d')){
                player1.x +=  player_speed;
            }

            if (player1.x > background.width - player1.width){
                player1.x = background.width - player1.width;
            }

            if (player1.x < 0){
                player1.x = 0;
            }

            if (player1.y > background.height - player1.height){
                player1.y = background.height - player1.height;
            }

            if (player1.y < 0){
                player1.y = 0;
            }

            if (!player1.alive()){
                loop.stop();
                alert('You lost');
                window.location.reload();
            }

            if (collides(player1, finish_tile)){
                loop.stop();
                alert('You won');
                window.location.reload();
            }
            
            //  console.log('tmpx', tmpx);
            //     console.log('tmpy', tmpy);
            
            walls.forEach(function(wall) {
                if (collides(player1, wall)){
                    player1.x = tmpx1; 
                    player1.y = tmpy1;
                }

                if (collides(player2, wall)){
                    player2.x = tmpx2;
                    player2.y = tmpy2;
                }

                if (bullet1 && collides(bullet1, wall)){
                    console.log('collided 1');
                    let index = scene.objects.indexOf(bullet1);
                    if (index > -1) {
                        scene.objects.splice(index, 1);
                    }
                    bullet1 = null;
                }

                if (bullet2 && collides(bullet2, wall)){
                    console.log('collided 2');
                    let index = scene.objects.indexOf(bullet2);
                    if (index > -1) {
                        scene.objects.splice(index, 1);
                    }
                    bullet2 = null;
                }

                if (ray_left && collides(ray_left, wall)){
                    ray_left.collided = true;
                }

                if (ray_straight && collides(ray_straight, wall)){
                    ray_straight.collided = true;
                }

                if (ray_right && collides(ray_right, wall)){
                    ray_right.collided = true;
                }

                
            })

            tmpx1 = player1.x;
            tmpy1 = player1.y;
            tmpx2 = player2.x;
            tmpy2 = player2.y;
            //console.log(getPointer());

            //rays and player2 movement

            if (player2.ray_delay <= 0 && player2.alive()){
                console.log('shoot')
                player2.shoot_rays();
                player2.ray_delay = max_ray_delay;
            }

            if ( ray_left && ray_left.time_alive >= ray_time_alive){
                let index = scene.objects.indexOf(ray_left);
                if (index > -1) {
                    scene.objects.splice(index, 1);
                }
            }

            if ( ray_straight && ray_straight.time_alive >= ray_time_alive){
                let index = scene.objects.indexOf(ray_straight);
                if (index > -1) {
                    scene.objects.splice(index, 1);
                }
            }

            if ( ray_right && ray_right.time_alive >= ray_time_alive){
                let index = scene.objects.indexOf(ray_right);
                if (index > -1) {
                    scene.objects.splice(index, 1);
                }
            }

            if (player2.alive()){

                if (ray_left){
                    console.log('ray_left collided = ', ray_left.collided);
                    console.log('ray_left changed = ', ray_left.changed);
                }
                if (ray_straight){
                    console.log('ray_straight collided = ', ray_straight.collided);
                    console.log('ray_straight changed = ', ray_straight.changed);
                }
                if (ray_right){
                    console.log('ray_right collided = ', ray_right.collided);
                    console.log('ray_right changed = ', ray_right.changed);
                }


                console.log('direction WAS', player2.direction)

                console.log('dx WAS', player2.dx)
                console.log('dy WAS', player2.dy)
                
                if (ray_left && ray_left.collided && !ray_left.changed){
                    ray_left.changed = true;
                    if (ray_straight.collided && !ray_straight.changed){
                        ray_straight.changed = true;
                        if (ray_right.collided){
                            
                                player2.direction += 1; // turn right
                                ray_left.changed = false;
                                ray_straight.changed = false;
                            
                        } else if (!ray_right.collided){
                            player2.direction -= 1; // turn left
                            ray_left.changed = false;
                            ray_straight.changed = false;
                        }
                        
                    } // else if !ray_straight.collided -> do nothing

                } else if (ray_left && !ray_left.collided && !ray_left.changed){
                    if (ray_straight.collided && !ray_straight.changed){
                        ray_straight.changed = true;
                        if (ray_right.collided && !ray_right.changed){
                            ray_right.changed = true;
                            player2.direction -= 1; //turn left
                            ray_left.changed = false;
                                ray_straight.changed = false;

                        } else if (!ray_right.collided){
                            player2.direction += 1 //turn right for no reason
                            ray_left.changed = false;
                                ray_straight.changed = false;
                        }
                    } // else do nothing
                }

                console.log('direction NEW', player2.direction)
                console.log('dx NEW', player2.dx)
                console.log('dy NEW', player2.dy)

                if (player2.direction > 4){
                    player2.direction = 1;
                }

                if (player2.direction < 1){
                    player2.direction = 4;
                }

                switch(player2.direction) {
                    case 1: // up
                        player2.dx = 0;
                        player2.dy = -enemy_speed;
                        break;
                    case 2: // right
                        player2.dx = enemy_speed;
                        player2.dy = 0;
                        break;
                    case 3: // down
                        player2.dx = 0;
                        player2.dy = enemy_speed;
                        break;
                    case 4: // left
                        player2.dx = -enemy_speed;
                        player2.dy = 0;
                        break;
                }

                if (player2.attack_delay <= 0 && get_distance(player1.x, player1.y, player2.x, player2.y) < 90){

                    player2.shoot();
                }
            }

            // shooting

            if (pointerPressed('left') && player1.attack_delay <= 0){
                
                console.log('\n\n\nnew click \n');
                console.log()
                const {x, y} = getPointer();
                
                const {relative_x, relative_y} = get_pointer_pos_relative_to_map(player1.x, player1.y, x, y);
                console.log('player x', player1.x);
                console.log('player y', player1.y);
                
                console.log('pointer x', x);
                console.log('pointer y', y);
                player1.shoot(relative_x, relative_y);
            }

            if (bullet1){
                if (collides(bullet1, player2)){
                    if (!player2.alive()){
                        let index = scene.objects.indexOf(player2);
                        if (index > -1) {
                            scene.objects.splice(index, 1);
                        }
                    } else {
                        player2.lives -= 1;
                        console.log('hit 2');
                        let index = scene.objects.indexOf(bullet1);
                        if (index > -1) {
                            scene.objects.splice(index, 1);
                        }
                        bullet1 = null;

                        if (!player2.alive()){
                            let index = scene.objects.indexOf(player2);
                            if (index > -1) {
                                scene.objects.splice(index, 1);
                            }
                        }
                    }
                }
            }

            if (bullet2){
                if (collides(bullet2, player1)){
                    player1.lives -= 1;
                    console.log('hit 1');
                    let index = scene.objects.indexOf(bullet2);
                    if (index > -1) {
                        scene.objects.splice(index, 1);
                    }
                    bullet2 = null;
                    if (!player1.alive()){
                        let index = scene.objects.indexOf(player1);
                        if (index > -1) {
                            scene.objects.splice(index, 1);
                        }
                    }
                }
            }

            if (bullet1){
                if (bullet1.y < 0 || bullet1.y > mapHeight || bullet1.x < 0 || bullet1.x > mapWidth){
                    
                    let index = scene.objects.indexOf(bullet1);
                    if (index > -1) {
                        scene.objects.splice(index, 1);
                    }
                    bullet1 = null;
                }
            }
            
            if (bullet2){
                if (bullet2.y < 0 || bullet2.y > mapHeight || bullet2.x < 0 || bullet2.x > mapWidth){
                    
                    let index = scene.objects.indexOf(bullet2);
                    if (index > -1) {
                        scene.objects.splice(index, 1);
                    }
                    bullet2 = null;
                }
            }
            scene.update();

        },
        render: function(){

            scene.render();

        }
    });

    loop.start();
        
  })

    






