//TASKS RN:
//DO A WALKING AI
// DO A MENU
// DO A MAP EDITOR
//fix map.png size to match the walls


import {init, GameLoop, Scene, load, Sprite, keyPressed, initKeys, collides, initPointer, getPointer, pointerPressed, angleToTarget} from '../lib/kontra.min.mjs';

const {canvas, context} = init();
initKeys();
initPointer();

//console.log(canvas, context);

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

let ray_left2;
let ray_straight2;
let ray_right2;

let ray_left3;
let ray_straight3;
let ray_right3;

let ray_left4;
let ray_straight4;
let ray_right4;

let finish_tile = null;

//console.log('mapWidth', mapWidth);
//console.log('mapHeight', mapHeight);


function generate_coords_from_map(map){
    let coords = [[]];
    let k = 0;
    for (let i = 0; i < 17; i++){
        for (let j = 0; j <= 17; j++){
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
    //console.log('k',k)
    return coords;
}

function generate_walls_from_coords(coords){
    let walls = []
    
    for (let i = 0; i < coords.length; i++){
        //console.log('inside walls func. coords', coords[i][0], coords[i][1])
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
            //console.log('coords = w', coords[i][1])
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
    //console.log("loaded")
    //console.log(assets)
    

    // let map = [
    //     [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    //     [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1],
    //     [1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 0, 1, 1, 0, 1],
    //     [1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
    //     [1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 0, 0, 1, 1, 1],
    //     [1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1],
    //     [1, 0, 0, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1],
    //     [1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1],
    //     [1, 0, 1, 0, 0, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1],
    //     [1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1],
    //     [1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 0, 0, 1],
    //     [1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1],
    //     [1, 0, 1, 0, 0, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1],
    //     [1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 0, 0, 1, 0, 1, 0, 1],
    //     [1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 1, 1, 0, 1, 0, 1],
    //     [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 2, 1],
    //     [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        
    // ]


    let map = [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        
    ]

    let coords = generate_coords_from_map(map);
    
    //console.log('coords ', coords)

    // 32 x 32 pixels // this 
    //let coords = [ [100, 100], [132, 100], [200, 200], [300, 300], [400, 400], [500, 500], [600, 600], [700, 700], [800, 800], [900, 900], [1000, 1000], [1100, 1100], [1200, 1200], [1300, 1300], [1400, 1400], [1500, 1500]]

    let walls = generate_walls_from_coords( coords)
    //console.log('walls', walls)
    walls.forEach(function(wall){
        //console.log('wall', wall.x, wall.y)
    })  

    


    // let wall = Sprite ({
    //     x: 100,
    //     y: 100,
    //     width: 32,
    //     height: 32,
    //     color: 'white'
    // })

    let player1 = Sprite ({
        lives: 1,
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

                //console.log('relative pointer x', pointer_x);
                //console.log('relative pointer y', pointer_y);

                //console.log('x from player', pointer_x - this.x);
                //console.log('y from player', pointer_y - this.y);

                //console.log('angle', angle);

                let x_speed = bullet_speed * Math.cos(angle);
                let y_speed = bullet_speed * Math.sin(angle);

                let x_offset = 15 * Math.cos(angle);
                let y_offset = 15 * Math.sin(angle);
                //console.log('x_speed', x_speed);
                //console.log('y_speed', y_speed);

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
                    //         //console.log(this.y);
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
        x: 116,
        y: 116,
        image: assets[0],
        attack_delay: max_attack_delay_player2,
        ray_delay: max_ray_delay,
        anchor: {x: 0.5, y: 0.5},

        alive: function(){
            return this.lives > 0;
        },

        shoot_rays: function(){

            //console.log('shooted ray')
            //console.log('direction', this.direction)
            
            let angle = this.direction * Math.PI / 2; // convert direction to radians
            let angle_left = angle - Math.PI / 2.5; // 45 degrees to the left
            let angle_right = angle + Math.PI / 2.5; // 45 degrees to the right

            ray_left2 = Sprite({
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

            ray_straight2 = Sprite({
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

            ray_right2 = Sprite({
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
            scene.add(ray_left2);
            scene.add(ray_straight2);
            scene.add(ray_right2);

        },

        shoot: function(){
            if (this.attack_delay <= 0){
                let angle = angleToTarget(this, {x: player1.x, y: player1.y});

                //console.log('enemy angle', angle);

                let x_speed = bullet_speed * Math.cos(angle);
                let y_speed = bullet_speed * Math.sin(angle);

                let x_offset = 15 * Math.cos(angle);
                let y_offset = 15 * Math.sin(angle);
                //console.log('x_speed', x_speed);
                //console.log('y_speed', y_speed);

                bullet2 = Sprite({
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
                    //         //console.log(this.y);
                    //         this.ttl = 0;
                    //     }
                    // }
                })
                scene.add(bullet2);
                this.attack_delay = max_attack_delay_player2;
            }
        }
    })


    let player3 = Sprite ({
        
        lives: 4,
        direction: 2, // in 90 * direction. 1 - up, 2 - right, 3 - down, 4 left
        dx: 1,
        dy: 0,
        x: 296,     
        y: 180,
        image: assets[0],
        attack_delay: max_attack_delay_player2,
        ray_delay: max_ray_delay,
        anchor: {x: 0.5, y: 0.5},

        alive: function(){
            return this.lives > 0;
        },

        shoot_rays: function(){

            //console.log('shooted ray')
            //console.log('direction', this.direction)
            
            let angle = this.direction * Math.PI / 2; // convert direction to radians
            let angle_left = angle - Math.PI / 2.5; // 45 degrees to the left
            let angle_right = angle + Math.PI / 2.5; // 45 degrees to the right

            ray_left3 = Sprite({
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

            ray_straight3 = Sprite({
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

            ray_right3 = Sprite({
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
            scene.add(ray_left3);
            scene.add(ray_straight3);
            scene.add(ray_right3);

        },

        shoot: function(){
            if (this.attack_delay <= 0){
                let angle = angleToTarget(this, {x: player1.x, y: player1.y});

                //console.log('enemy angle', angle);

                let x_speed = bullet_speed * Math.cos(angle);
                let y_speed = bullet_speed * Math.sin(angle);

                let x_offset = 15 * Math.cos(angle);
                let y_offset = 15 * Math.sin(angle);
                //console.log('x_speed', x_speed);
                //console.log('y_speed', y_speed);

                bullet2 = Sprite({
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
                    //         //console.log(this.y);
                    //         this.ttl = 0;
                    //     }
                    // }
                })
                scene.add(bullet2);
                this.attack_delay = max_attack_delay_player2;
            }
        }
    })


    let player4 = Sprite ({
        
        lives: 4,
        direction: 2, // in 90 * direction. 1 - up, 2 - right, 3 - down, 4 left
        dx: 1,
        dy: 0,
        x: 490,
        y: 236,
        image: assets[0],
        attack_delay: max_attack_delay_player2,
        ray_delay: max_ray_delay,
        anchor: {x: 0.5, y: 0.5},

        alive: function(){
            return this.lives > 0;
        },

        shoot_rays: function(){

            //console.log('shooted ray')
            //console.log('direction', this.direction)
            
            let angle = this.direction * Math.PI / 2; // convert direction to radians
            let angle_left = angle - Math.PI / 2.5; // 45 degrees to the left
            let angle_right = angle + Math.PI / 2.5; // 45 degrees to the right

            ray_left4 = Sprite({
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

            ray_straight4 = Sprite({
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

            ray_right4 = Sprite({
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
            scene.add(ray_left4);
            scene.add(ray_straight4);
            scene.add(ray_right4);

        },

        shoot: function(){
            if (this.attack_delay <= 0){
                let angle = angleToTarget(this, {x: player1.x, y: player1.y});

                //console.log('enemy angle', angle);

                let x_speed = bullet_speed * Math.cos(angle);
                let y_speed = bullet_speed * Math.sin(angle);

                let x_offset = 15 * Math.cos(angle);
                let y_offset = 15 * Math.sin(angle);
                //console.log('x_speed', x_speed);
                //console.log('y_speed', y_speed);

                bullet2 = Sprite({
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
                    //         //console.log(this.y);
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
        objects: [background, finish_tile, player1, player2, player3, player4, ...walls],

    })
    //console.log('finish tiel', finish_tile)
    

    let tmpx1 = 0;
    let tmpy1 = 0;

    let tmpx2 = 0;
    let tmpy2 = 0;

    let tmpx3 = 0;
    let tmpy3 = 0;

    let tmpx4 = 0;
    let tmpy4 = 0;



    //GAMELOOP
    const loop = GameLoop({
        update: function(dt){

            //console.log('player2 x y', player2.x, player2.y);
            player1.attack_delay -= dt;
            player2.attack_delay -= dt;
            player2.ray_delay -= dt;
            player3.attack_delay -= dt;
            player3.ray_delay -= dt;    
            player4.attack_delay -= dt;
            player4.ray_delay -= dt;

            if (ray_left2){
                ray_left2.time_alive += dt;
            }
            if (ray_straight2){
                ray_straight2.time_alive += dt;
            }   
            if(ray_right2){      
                ray_right2.time_alive += dt;
            }

            if (ray_left3){
                ray_left3.time_alive += dt;
            }
            if (ray_straight3){
                ray_straight3.time_alive += dt;
            }
            if(ray_right3){
                ray_right3.time_alive += dt;
            }

            if (ray_left4){
                ray_left4.time_alive += dt;
            }
            if (ray_straight4){
                ray_straight4.time_alive += dt;
            }
            if(ray_right4){
                ray_right4.time_alive += dt;
            }

            scene.lookAt(player1);

            ////console.log('player.x', player1.x);

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
            
            //  //console.log('tmpx', tmpx);
            //     //console.log('tmpy', tmpy);
            
            walls.forEach(function(wall) {
                if (collides(player1, wall)){
                    player1.x = tmpx1; 
                    player1.y = tmpy1;
                }

                if (collides(player2, wall)){
                    player2.x = tmpx2;
                    player2.y = tmpy2;
                }

                if (collides(player3, wall)){
                    player3.x = tmpx3;
                    player3.y = tmpy3;
                }

                if (collides(player4, wall)){
                    player4.x = tmpx4;
                    player4.y = tmpy4;
                }



                if (bullet1 && collides(bullet1, wall)){
                    //console.log('collided 1');
                    let index = scene.objects.indexOf(bullet1);
                    if (index > -1) {
                        scene.objects.splice(index, 1);
                    }
                    bullet1 = null;
                }

                if (bullet2 && collides(bullet2, wall)){
                    //console.log('collided 2');
                    let index = scene.objects.indexOf(bullet2);
                    if (index > -1) {
                        scene.objects.splice(index, 1);
                    }
                    bullet2 = null;
                }

                if (ray_left2 && collides(ray_left2, wall)){
                    ray_left2.collided = true;
                }

                if (ray_straight2 && collides(ray_straight2, wall)){
                    ray_straight2.collided = true;
                }

                if (ray_right2 && collides(ray_right2, wall)){
                    ray_right2.collided = true;
                }

                if (ray_left3 && collides(ray_left3, wall)){
                    ray_left3.collided = true;
                }
                if (ray_straight3 && collides(ray_straight3, wall)){
                    ray_straight3.collided = true;
                }
                if (ray_right3 && collides(ray_right3, wall)){
                    ray_right3.collided = true;
                }

                if (ray_left4 && collides(ray_left4, wall)){
                    ray_left4.collided = true;
                }
                if (ray_straight4 && collides(ray_straight4, wall)){
                    ray_straight4.collided = true;
                }
                if (ray_right4 && collides(ray_right4, wall)){
                    ray_right4.collided = true;
                }


                
            })

            tmpx1 = player1.x;
            tmpy1 = player1.y;
            tmpx2 = player2.x;
            tmpy2 = player2.y;
            tmpx3 = player3.x;
            tmpy3 = player3.y;
            tmpx4 = player4.x;
            tmpy4 = player4.y;
            ////console.log(getPointer());

            //rays and player2 movement

            if (player2.ray_delay <= 0 && player2.alive()){
                //console.log('shoot')
                player2.shoot_rays();
                player2.ray_delay = max_ray_delay;
            }

            if ( ray_left2 && ray_left2.time_alive >= ray_time_alive){
                let index = scene.objects.indexOf(ray_left2);
                if (index > -1) {
                    scene.objects.splice(index, 1);
                }
            }

            if ( ray_straight2 && ray_straight2.time_alive >= ray_time_alive){
                let index = scene.objects.indexOf(ray_straight2);
                if (index > -1) {
                    scene.objects.splice(index, 1);
                }
            }

            if ( ray_right2 && ray_right2.time_alive >= ray_time_alive){
                let index = scene.objects.indexOf(ray_right2);
                if (index > -1) {
                    scene.objects.splice(index, 1);
                }
            }

            if (player3.ray_delay <= 0 && player3.alive()){
                //console.log('shoot')
                player3.shoot_rays();
                player3.ray_delay = max_ray_delay;
            }

            if ( ray_left3 && ray_left3.time_alive >= ray_time_alive){
                let index = scene.objects.indexOf(ray_left3);
                if (index > -1) {
                    scene.objects.splice(index, 1);
                }
            }

            if ( ray_straight3 && ray_straight3.time_alive >= ray_time_alive){
                let index = scene.objects.indexOf(ray_straight3);
                if (index > -1) {
                    scene.objects.splice(index, 1);
                }
            }

            if ( ray_right3 && ray_right3.time_alive >= ray_time_alive){
                let index = scene.objects.indexOf(ray_right3);
                if (index > -1) {
                    scene.objects.splice(index, 1);
                }
            }

            if (player4.ray_delay <= 0 && player4.alive()){
                //console.log('shoot')
                player4.shoot_rays();
                player4.ray_delay = max_ray_delay;
            }

            if ( ray_left4 && ray_left4.time_alive >= ray_time_alive){
                let index = scene.objects.indexOf(ray_left4);
                if (index > -1) {
                    scene.objects.splice(index, 1);
                }
            }

            if ( ray_straight4 && ray_straight4.time_alive >= ray_time_alive){
                let index = scene.objects.indexOf(ray_straight4);
                if (index > -1) {
                    scene.objects.splice(index, 1);
                }
            }

            if ( ray_right4 && ray_right4.time_alive >= ray_time_alive){
                let index = scene.objects.indexOf(ray_right4);
                if (index > -1) {
                    scene.objects.splice(index, 1);
                }
            }


            if (player2.alive()){

                if (ray_left2){
                    //console.log('ray_left2 collided = ', ray_left2.collided);
                    //console.log('ray_left2 changed = ', ray_left2.changed);
                }
                if (ray_straight2){
                    //console.log('ray_straight2 collided = ', ray_straight2.collided);
                    //console.log('ray_straight2 changed = ', ray_straight2.changed);
                }
                if (ray_right2){
                    //console.log('ray_right2 collided = ', ray_right2.collided);
                    //console.log('ray_right2 changed = ', ray_right2.changed);
                }


                //console.log('direction WAS', player2.direction)

                //console.log('dx WAS', player2.dx)
                //console.log('dy WAS', player2.dy)
                
                if (ray_left2 && ray_left2.collided && !ray_left2.changed){
                    ray_left2.changed = true;
                    if (ray_straight2.collided && !ray_straight2.changed){
                        ray_straight2.changed = true;
                        if (ray_right2.collided){
                            
                                player2.direction += 1; // turn right
                                ray_left2.changed = false;
                                ray_straight2.changed = false;
                            
                        } else if (!ray_right2.collided){
                            player2.direction -= 1; // turn left
                            ray_left2.changed = false;
                            ray_straight2.changed = false;
                        }
                        
                    } // else if !ray_straight2.collided -> do nothing

                } else if (ray_left2 && !ray_left2.collided && !ray_left2.changed){
                    if (ray_straight2.collided && !ray_straight2.changed){
                        ray_straight2.changed = true;
                        if (ray_right2.collided && !ray_right2.changed){
                            ray_right2.changed = true;
                            player2.direction -= 1; //turn left
                            ray_left2.changed = false;
                                ray_straight2.changed = false;

                        } else if (!ray_right2.collided){
                            player2.direction += 1 //turn right for no reason
                            ray_left2.changed = false;
                                ray_straight2.changed = false;
                        }
                    } // else do nothing
                }

                //console.log('direction NEW', player2.direction)
                //console.log('dx NEW', player2.dx)
                //console.log('dy NEW', player2.dy)

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

            if (player3.alive()){

                if (ray_left3){
                    //console.log('ray_left3 collided = ', ray_left3.collided);
                    //console.log('ray_left3 changed = ', ray_left3.changed);
                }
                if (ray_straight3){
                    //console.log('ray_straight3 collided = ', ray_straight3.collided);
                    //console.log('ray_straight3 changed = ', ray_straight3.changed);
                }
                if (ray_right3){
                    //console.log('ray_right3 collided = ', ray_right3.collided);
                    //console.log('ray_right3 changed = ', ray_right3.changed);
                }


                //console.log('direction WAS', player3.direction)

                //console.log('dx WAS', player3.dx)
                //console.log('dy WAS', player3.dy)
                
                if (ray_left3 && ray_left3.collided && !ray_left3.changed){
                    ray_left3.changed = true;
                    if (ray_straight3.collided && !ray_straight3.changed){
                        ray_straight3.changed = true;
                        if (ray_right3.collided){
                            
                                player3.direction += 1; // turn right
                                ray_left3.changed = false;
                                ray_straight3.changed = false;
                            
                        } else if (!ray_right3.collided){
                            player3.direction -= 1; // turn left
                            ray_left3.changed = false;
                            ray_straight3.changed = false;
                        }
                        
                    } // else if !ray_straight3.collided -> do nothing

                } else if (ray_left3 && !ray_left3.collided && !ray_left3.changed){
                    if (ray_straight3.collided && !ray_straight3.changed){
                        ray_straight3.changed = true;
                        if (ray_right3.collided && !ray_right3.changed){
                            ray_right3.changed = true;
                            player3.direction -= 1; //turn left
                            ray_left3.changed = false;
                                ray_straight3.changed = false;

                        } else if (!ray_right3.collided){
                            player3.direction += 1 //turn right for no reason
                            ray_left3.changed = false;
                                ray_straight3.changed = false;
                        }
                    } // else do nothing
                }

                //console.log('direction NEW', player3.direction)
                //console.log('dx NEW', player3.dx)
                //console.log('dy NEW', player3.dy)

                if (player3.direction > 4){
                    player3.direction = 1;
                }

                if (player3.direction < 1){
                    player3.direction = 4;
                }

                switch(player3.direction) {
                    case 1: // up
                        player3.dx = 0;
                        player3.dy = -enemy_speed;
                        break;
                    case 2: // right
                        player3.dx = enemy_speed;
                        player3.dy = 0;
                        break;
                    case 3: // down
                        player3.dx = 0;
                        player3.dy = enemy_speed;
                        break;
                    case 4: // left
                        player3.dx = -enemy_speed;
                        player3.dy = 0;
                        break;
                }

                if (player3.attack_delay <= 0 && get_distance(player1.x, player1.y, player3.x, player3.y) < 90){

                    player3.shoot();
                }
            }

            if (player4.alive()){

                if (ray_left4){
                    //console.log('ray_left4 collided = ', ray_left4.collided);
                    //console.log('ray_left4 changed = ', ray_left4.changed);
                }
                if (ray_straight4){
                    //console.log('ray_straight4 collided = ', ray_straight4.collided);
                    //console.log('ray_straight4 changed = ', ray_straight4.changed);
                }
                if (ray_right4){
                    //console.log('ray_right4 collided = ', ray_right4.collided);
                    //console.log('ray_right4 changed = ', ray_right4.changed);
                }


                //console.log('direction WAS', player4.direction)

                //console.log('dx WAS', player4.dx)
                //console.log('dy WAS', player4.dy)
                
                if (ray_left4 && ray_left4.collided && !ray_left4.changed){
                    ray_left4.changed = true;
                    if (ray_straight4.collided && !ray_straight4.changed){
                        ray_straight4.changed = true;
                        if (ray_right4.collided){
                            
                                player4.direction += 1; // turn right
                                ray_left4.changed = false;
                                ray_straight4.changed = false;
                            
                        } else if (!ray_right4.collided){
                            player4.direction -= 1; // turn left
                            ray_left4.changed = false;
                            ray_straight4.changed = false;
                        }
                        
                    } // else if !ray_straight4.collided -> do nothing

                } else if (ray_left4 && !ray_left4.collided && !ray_left4.changed){
                    if (ray_straight4.collided && !ray_straight4.changed){
                        ray_straight4.changed = true;
                        if (ray_right4.collided && !ray_right4.changed){
                            ray_right4.changed = true;
                            player4.direction -= 1; //turn left
                            ray_left4.changed = false;
                                ray_straight4.changed = false;

                        } else if (!ray_right4.collided){
                            player4.direction += 1 //turn right for no reason
                            ray_left4.changed = false;
                                ray_straight4.changed = false;
                        }
                    } // else do nothing
                }

                //console.log('direction NEW', player4.direction)
                //console.log('dx NEW', player4.dx)
                //console.log('dy NEW', player4.dy)

                if (player4.direction > 4){
                    player4.direction = 1;
                }

                if (player4.direction < 1){
                    player4.direction = 4;
                }

                switch(player4.direction) {
                    case 1: // up
                        player4.dx = 0;
                        player4.dy = -enemy_speed;
                        break;
                    case 2: // right
                        player4.dx = enemy_speed;
                        player4.dy = 0;
                        break;
                    case 3: // down
                        player4.dx = 0;
                        player4.dy = enemy_speed;
                        break;
                    case 4: // left
                        player4.dx = -enemy_speed;
                        player4.dy = 0;
                        break;
                }

                if (player4.attack_delay <= 0 && get_distance(player1.x, player1.y, player4.x, player4.y) < 90){

                    player4.shoot();
                }
            }

            // shooting

            if (pointerPressed('left') && player1.attack_delay <= 0){
                
                //console.log('\n\n\nnew click \n');
                //console.log()
                const {x, y} = getPointer();
                
                const {relative_x, relative_y} = get_pointer_pos_relative_to_map(player1.x, player1.y, x, y);
                //console.log('player x', player1.x);
                //console.log('player y', player1.y);
                
                //console.log('pointer x', x);
                //console.log('pointer y', y);
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
                        //console.log('hit 2');
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
                if (collides(bullet1, player3)){
                    if (!player3.alive()){
                        let index = scene.objects.indexOf(player3);
                        if (index > -1) {
                            scene.objects.splice(index, 1);
                        }
                    } else {
                        player3.lives -= 1;
                        //console.log('hit 3');
                        let index = scene.objects.indexOf(bullet1);
                        if (index > -1) {
                            scene.objects.splice(index, 1);
                        }
                        bullet1 = null;

                        if (!player3.alive()){
                            let index = scene.objects.indexOf(player3);
                            if (index > -1) {
                                scene.objects.splice(index, 1);
                            }
                        }
                    }
                }
                if (collides(bullet1, player4)){
                    if (!player4.alive()){
                        let index = scene.objects.indexOf(player4);
                        if (index > -1) {
                            scene.objects.splice(index, 1);
                        }
                    } else {
                        player4.lives -= 1;
                        //console.log('hit 4');
                        let index = scene.objects.indexOf(bullet1);
                        if (index > -1) {
                            scene.objects.splice(index, 1);
                        }
                        bullet1 = null;

                        if (!player4.alive()){
                            let index = scene.objects.indexOf(player4);
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
                    //console.log('hit 1');
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

    






