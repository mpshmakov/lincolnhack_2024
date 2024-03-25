//TASKS RN:
//DO A WALKING AI
// DO A MENU
// DO A MAP EDITOR
//fix map.png size to match the walls


import {init, Button, GameLoop, Scene, load, Sprite, keyPressed, initKeys, collides, initPointer, getPointer, pointerPressed, angleToTarget} from '../lib/kontra.min.mjs';

const {canvas, context} = init();
initKeys();
initPointer();

//console.log(canvas, context);

let customMap = false;

let mapWidth = 576;
let mapHeight = 576;   

let canvasCenter_x = canvas.width / 2;
let canvasCenter_y = canvas.height / 2;


let max_attack_delay_player1 = 0.5;
let max_attack_delay_player2 = 0.7;
let max_ray_delay = 0.15;

let ray_time_alive = 0.1;

let spec_speed = 3.5;
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
                color: 'white',
                
                
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

function check_if_outside_map (x, y){
    //console.log(x< 0 || y < 0 || x > mapWidth || y > mapHeight)
    return (x < 0 || y < 0 || x > mapWidth || y > mapHeight)
}


load(
    'assets/images/player.png',
    
    'assets/images/map1.png',
    'assets/images/enemy.png',
    'assets/images/player2.png',
  ).then(function(assets) {
    //console.log("loaded")
    //console.log(assets)
    

    let map = [
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1],
        [1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 0, 1, 1, 0, 1],
        [1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
        [1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 0, 0, 1, 1, 1],
        [1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1],
        [1, 0, 0, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1],
        [1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1],
        [1, 0, 1, 0, 0, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1],
        [1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1],
        [1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 0, 0, 1],
        [1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1],
        [1, 0, 1, 0, 0, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1],
        [1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 0, 0, 1, 0, 1, 0, 1],
        [1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 1, 1, 0, 1, 0, 1],
        [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 2, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        
    ]

    let coords = generate_coords_from_map(map);
    
    console.log('coords ', coords)

    // 32 x 32 pixels // this 
    //let coords = [ [100, 100], [132, 100], [200, 200], [300, 300], [400, 400], [500, 500], [600, 600], [700, 700], [800, 800], [900, 900], [1000, 1000], [1100, 1100], [1200, 1200], [1300, 1300], [1400, 1400], [1500, 1500]]
    let walls = [];
    let customWalls = [];

    if (!customMap){
        walls = generate_walls_from_coords( coords)
    } else {
        walls = generate_walls_from_coords(new_map_coords)
    }
    //console.log('walls', walls)
    

    


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
        time_alive: 0,

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
        x: 52,
        y: 52,  
        image: assets[3],
        attack_delay: max_attack_delay_player2,
        ray_delay: max_ray_delay,
        anchor: {x: 0.5, y: 0.5},
        time_alive: 0,

        alive: function(){
            return this.lives > 0;
        },

        shoot_rays: function(){

            //console.log('shooted ray')
            //console.log('direction', this.direction)
            
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
                    color: 'blue',

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
        objects: [background, finish_tile, player1, player2, ...walls],

    })
    //console.log('finish tiel', finish_tile)
    

    let tmpx1 = 0;
    let tmpy1 = 0;

    let tmpx2 = 0;
    let tmpy2 = 0;

    // end of first scene

    let new_map_coords = []

    let sprites = [];

    for (let i = 0; i < 17; i++){
        for (let j = 0; j < 17; j++){
            
            let sprite = Sprite({
                x: 32*j,
                y: 32*i,
                width: 32,
                height: 32,
                toggle: false,
            })
            sprites.push(sprite);
        }
    }

    function updatesprites(){
        for (let i = 0; i < sprites.length; i++){
            if (sprites[i].toggle == 'wc'){
                        
                finish_tilecustom = Sprite({
                    x: sprites[i].x,
                    y: sprites[i].y,
                    width: 32,
                    height: 32,
                    color: 'yellow'
                })
                sprites[i].color = 'yellow'
                console.log('executed 1')

            } else if (sprites[i].toggle == 's'){
                console.log('; in')
                start_tile = {x: sprites[i].x, y: sprites[i].y}
                sprites[i].color = 'blue'
            }

            else if (sprites[i].toggle == true){
                console.log('executed 2')
                sprites[i].color = 'white'
            }else if (sprites[i].toggle == false){
                sprites[i].color = null
            }
        }
    }


    let spectator = Sprite({
        x: 0,
        y: 0,
        anchor: {x: 0.5, y: 0.5},
        color: 'red',
        width: 8,
        height: 8,
    })

    let mapScene = Scene({
        id: 'map',
        objects: [background, ...sprites, spectator]
    })

    mapScene.hide();

    let btnpressed = false;

    //scene 3

    let player1custom = Sprite ({
        lives: 4,
        x: 52,
        y: 52,  
        image: assets[0],
        attack_delay: max_attack_delay_player1,  //BUG THAT BULLET STILL COLLIDES WITH A PLAYER THAT HAS BEEN
        anchor: {x: 0.5, y: 0.5},
        time_alive: 0,

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
                scene_3.add(bullet1);
                this.attack_delay = max_attack_delay_player1;
            }
        }

    })

    console.log('canvas center x', canvasCenter_x)
    console.log('canvas center y', canvasCenter_y)

    let player2custom = Sprite ({
        
        lives: 4,
        direction: 2, // in 90 * direction. 1 - up, 2 - right, 3 - down, 4 left
        dx: 1,
        dy: 0,
        x: canvasCenter_x,
        y: canvasCenter_y,  
        image: assets[3],
        attack_delay: max_attack_delay_player2,
        ray_delay: max_ray_delay,
        anchor: {x: 0.5, y: 0.5},
        time_alive: 0,

        alive: function(){
            return this.lives > 0;
        },

        shoot_rays: function(){

            //console.log('shooted ray')
            //console.log('direction', this.direction)
            
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
            scene_3.add(ray_left);
            scene_3.add(ray_straight);
            scene_3.add(ray_right);

        },

        shoot: function(){
            if (this.attack_delay <= 0){
                let angle = angleToTarget(this, {x: player1custom.x, y: player1custom.y});

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
                    color: 'blue',

                    // update: function(){
                    //     this.advance();
                    //     if (this.y < 0){
                    //         //console.log(this.y);
                    //         this.ttl = 0;
                    //     }
                    // }
                })
                scene_3.add(bullet2);
                this.attack_delay = max_attack_delay_player2;
            }
        }
    })



    let scene_3;
    let finish_tilecustom = null;
    let start_tile = null;

    function init_scene_3(){
        
        player1custom.x = start_tile.x + 16
        player1custom.y = start_tile.y + 16

        let coll = true
        console.log('walls', customWalls)

        

            for (let i = 0; i < customWalls.length; i++){
                
                
                if (collides(player2custom, customWalls[i]) || get_distance(player2custom.x, player2custom.y, start_tile.x, start_tile.y) < 100){
                    console.log('player2 collided')
                    player2custom.x = Math.floor(Math.random() * (mapWidth-32)) + 16
                    player2custom.y = Math.floor(Math.random() * (mapHeight-32)) + 16
                    coll = true;
                } else {
                    console.log('player2 not collided')
                    coll = false;
                    break;
                }
            }
        
        
        console.log("collided = ", coll)
        console.log('player 2 position x y', player2custom.x, player2custom.y)
        
        scene_3 = Scene({
            id: 'scene 3',
            objects: [background, finish_tilecustom, player1custom, player2custom, ...customWalls],
        })
        loop2.stop()
    }


    //menu scene
    
    let playbtn = Button({
        x: canvasCenter_x,
        y: canvasCenter_y - 30,
        width: 120,
        height: 40,
        color: 'green',
        anchor : {x: 0.5, y: 0.5},

        text: {
            text: 'Play',
            color: 'white',
            font: '20px Arial, sans-serif',
            anchor: {x: 0.5, y: 0.5}
        },
    })

    let createmapbtn = Button({
        x: canvasCenter_x,
        y: canvasCenter_y + 30,
        width: 120,
        height: 40,
        color: 'green',
        anchor : {x: 0.5, y: 0.5},

        text: {
            text: 'Create Map',
            color: 'white',
            font: '20px Arial, sans-serif',
            anchor: {x: 0.5, y: 0.5}
        },
    })

    let menuscene = Scene({
        id: 'menu',
        objects: [playbtn, createmapbtn]
    })


    //GAMELOOPs
    const menuloop = GameLoop({
        update: function(dt){
            if (playbtn.hovered){
                playbtn.color = 'darkgreen';
            } else if (!playbtn.hovered){
                playbtn.color = 'green'
            }

            if (createmapbtn.hovered){
                createmapbtn.color = 'darkgreen';
            } else if (!createmapbtn.hovered){
                createmapbtn.color = 'green'
            }

            if (playbtn.pressed){
                menuloop.stop();
                menuscene.hide();
                scene.show();
                loop1.start();
            }

            if (createmapbtn.pressed){
                menuloop.stop();
                menuscene.hide();
                mapScene.show();
                loop2.start();
            }

            menuscene.update();
        },
        render: function(){
            menuscene.render();
        }
    })

    const loop3 = GameLoop({
        update: function(dt){
            console.log("update 1")

            //console.log('player2custom x y', player2custom.x, player2custom.y);
            player1custom.attack_delay -= dt;
            player2custom.attack_delay -= dt;
            player2custom.ray_delay -= dt;

            player1custom.time_alive += dt;
            player2custom.time_alive += dt;

            if (ray_left){
                ray_left.time_alive += dt;
            }
            if (ray_straight){
                ray_straight.time_alive += dt;
            }   
            if(ray_right){      
                ray_right.time_alive += dt;
            }

            scene_3.lookAt(player1custom);

            ////console.log('player.x', player1custom.x);

            if (keyPressed('w')){
                player1custom.y -= player_speed;
            }
            if (keyPressed('s')){
                player1custom.y +=  player_speed;
            }
            if (keyPressed('a')){
                player1custom.x -=  player_speed;
            }
            if (keyPressed('d')){
                player1custom.x +=  player_speed;
            }


            if (player1custom.x > background.width - player1custom.width){
                player1custom.x = background.width - player1custom.width;
            }

            if (player1custom.x < 0){
                player1custom.x = 0;
            }

            if (player1custom.y > background.height - player1custom.height){
                player1custom.y = background.height - player1custom.height;
            }

            if (player1custom.y < 0){
                player1custom.y = 0;
            }

            if (player2custom.x > background.width - player2custom.width){
                console.log('player2 x > background.width')
                player2custom.x = background.width - player2custom.width;
            }

            if (player2custom.x <= 0){
                console.log('player2 x <= 0')
                player2custom.x = 1;
            }

            if (player2custom.y > background.height - player2custom.height){
                console.log('player2 y > background.height')
                player2custom.y = background.height - player2custom.height;
            }

            if (player2custom.y <= 0){
                console.log('player2 y <= 0')
                player2custom.y = 1;
            }


            if (!player1custom.alive()){
                loop3.stop();
                alert('You lost');
                window.location.reload();   
            }

            if (collides(player1custom, finish_tilecustom) || keyPressed('u')){
                loop3.stop();
                player1custom.x = 0;
                player1custom.y = 0;
                alert('You won');
                
                window.location.reload(); 
            }
            
            //  //console.log('tmpx', tmpx);
            //     //console.log('tmpy', tmpy);
            
            customWalls.forEach(function(wall) {
                if (collides(player1custom, wall)){
                    

                    // player1custom.x = tmpx1; 
                    // player1custom.y = tmpy1;
                }

                if (collides(player2custom, wall) ){
                    
                    console.log('player 2 collided with wall', player2custom.x, player2custom.y)
                    if (player2custom.time_alive < 1){
                        player2custom.x = Math.floor(Math.random() * (mapWidth-32)) + 16
                        player2custom.y = Math.floor(Math.random() * (mapHeight-32)) + 16
                    } else {
                        player2custom.x = tmpx2;
                        player2custom.y = tmpy2;
                    }
                    
                    
                    
                }

                if (bullet1 && collides(bullet1, wall)){
                    //console.log('collided 1');
                    let index = scene_3.objects.indexOf(bullet1);
                    if (index > -1) {
                        scene_3.objects.splice(index, 1);
                    }
                    bullet1 = null;
                }

                if (bullet2 && collides(bullet2, wall)){
                    //console.log('collided 2');
                    let index = scene_3.objects.indexOf(bullet2);
                    if (index > -1) {
                        scene_3.objects.splice(index, 1);
                    }
                    bullet2 = null;
                }

                if (ray_left && (collides(ray_left, wall) || check_if_outside_map(ray_left.x, ray_left.y))){
                    ray_left.collided = true;
                }

                if (ray_straight && (collides(ray_straight, wall)|| check_if_outside_map(ray_straight.x, ray_straight.y))){
                    ray_straight.collided = true;
                }

                if (ray_right && (collides(ray_right, wall)|| check_if_outside_map(ray_right.x, ray_right.y))){
                    ray_right.collided = true;
                }

                
            })

            tmpx1 = player1custom.x;
            tmpy1 = player1custom.y;
            tmpx2 = player2custom.x;
            tmpy2 = player2custom.y;
            ////console.log(getPointer());

            //rays and player2custom movement

            if (player2custom.ray_delay <= 0 && player2custom.alive()){
                //console.log('shoot')
                player2custom.shoot_rays();
                player2custom.ray_delay = max_ray_delay;
            }

            if ( ray_left && ray_left.time_alive >= ray_time_alive){
                let index = scene_3.objects.indexOf(ray_left);
                if (index > -1) {
                    scene_3.objects.splice(index, 1);
                }
            }

            if ( ray_straight && ray_straight.time_alive >= ray_time_alive){
                let index = scene_3.objects.indexOf(ray_straight);
                if (index > -1) {
                    scene_3.objects.splice(index, 1);
                }
            }

            if ( ray_right && ray_right.time_alive >= ray_time_alive){
                let index = scene_3.objects.indexOf(ray_right);
                if (index > -1) {
                    scene_3.objects.splice(index, 1);
                }
            }

            if (player2custom.alive()){

                if (ray_left){
                    //console.log('ray_left collided = ', ray_left.collided);
                    //console.log('ray_left changed = ', ray_left.changed);
                }
                if (ray_straight){
                    //console.log('ray_straight collided = ', ray_straight.collided);
                    //console.log('ray_straight changed = ', ray_straight.changed);
                }
                if (ray_right){
                    //console.log('ray_right collided = ', ray_right.collided);
                    //console.log('ray_right changed = ', ray_right.changed);
                }


                console.log('direction WAS', player2custom.direction)

                //console.log('dx WAS', player2custom.dx)
                //console.log('dy WAS', player2custom.dy)
                
                if (ray_left && ray_left.collided && !ray_left.changed){
                    ray_left.changed = true;
                    if (ray_straight.collided && !ray_straight.changed){
                        ray_straight.changed = true;
                        if (ray_right.collided){
                            
                                player2custom.direction += 1; // turn right
                                ray_left.changed = false;
                                ray_straight.changed = false;
                            
                        } else if (!ray_right.collided){
                            player2custom.direction += 1; // turn right
                            ray_left.changed = false;
                            ray_straight.changed = false;
                        }
                        
                    } // else if !ray_straight.collided -> do nothing

                } else if (ray_left && !ray_left.collided && !ray_left.changed){
                    if (ray_straight.collided && !ray_straight.changed){
                        ray_straight.changed = true;

                        if (ray_right.collided && !ray_right.changed){

                            ray_right.changed = true;
                            player2custom.direction -= 1; //turn left
                            ray_left.changed = false;
                            ray_straight.changed = false;

                        } else if (!ray_right.collided){

                            let dir = Math.floor(Math.random()*1)

                            if (dir == 1){
                                player2custom.direction += 1
                            } else {
                                player2custom.direction -= 1
                            } 

                            ray_left.changed = false;
                            ray_straight.changed = false;
                        }
                    } // else do nothing
                }

                // console.log('direction NEW', player2custom.direction)
                // console.log('dx NEW', player2custom.dx)
                // console.log('dy NEW', player2custom.dy)

                console.log ('directoin new', player2custom.direction)

                if (player2custom.direction > 4){
                    player2custom.direction = 1;
                }

                if (player2custom.direction < 1){
                    player2custom.direction = 4;
                }

                switch(player2custom.direction) {
                    case 1: // up
                        player2custom.dx = 0;
                        player2custom.dy = -enemy_speed;
                        break;
                    case 2: // right
                        player2custom.dx = enemy_speed;
                        player2custom.dy = 0;
                        break;
                    case 3: // down
                        player2custom.dx = 0;
                        player2custom.dy = enemy_speed;
                        break;
                    case 4: // left
                        player2custom.dx = -enemy_speed;
                        player2custom.dy = 0;
                        break;
                }

                if (player2custom.attack_delay <= 0 && get_distance(player1custom.x, player1custom.y, player2custom.x, player2custom.y) < 90){

                    player2custom.shoot();
                }
            }

            // shooting

            if (pointerPressed('left') && player1custom.attack_delay <= 0){
                
                //console.log('\n\n\nnew click \n');
                //console.log()
                const {x, y} = getPointer();
                
                const {relative_x, relative_y} = get_pointer_pos_relative_to_map(player1custom.x, player1custom.y, x, y);
                //console.log('player x', player1custom.x);
                //console.log('player y', player1custom.y);
                
                //console.log('pointer x', x);
                //console.log('pointer y', y);
                player1custom.shoot(relative_x, relative_y);
            }

            if (bullet1){
                if (collides(bullet1, player2custom)){
                    if (!player2custom.alive()){
                        let index = scene_3.objects.indexOf(player2custom);
                        if (index > -1) {
                            scene_3.objects.splice(index, 1);
                        }
                    } else {
                        player2custom.lives -= 1;
                        //console.log('hit 2');
                        let index = scene_3.objects.indexOf(bullet1);
                        if (index > -1) {
                            scene_3.objects.splice(index, 1);
                        }
                        bullet1 = null;

                        if (!player2custom.alive()){
                            let index = scene_3.objects.indexOf(player2custom);
                            if (index > -1) {
                                scene_3.objects.splice(index, 1);
                            }
                        }
                    }
                }
            }

            if (bullet2){
                if (collides(bullet2, player1custom)){
                    player1custom.lives -= 1;
                    //console.log('hit 1');
                    let index = scene_3.objects.indexOf(bullet2);
                    if (index > -1) {
                        scene_3.objects.splice(index, 1);
                    }
                    bullet2 = null;
                    if (!player1custom.alive()){
                        let index = scene_3.objects.indexOf(player1custom);
                        if (index > -1) {
                            scene_3.objects.splice(index, 1);
                        }
                    }
                }
            }

            if (bullet1){
                if (bullet1.y < 0 || bullet1.y > mapHeight || bullet1.x < 0 || bullet1.x > mapWidth){
                    
                    let index = scene_3.objects.indexOf(bullet1);
                    if (index > -1) {
                        scene_3.objects.splice(index, 1);
                    }
                    bullet1 = null;
                }
            }
            
            if (bullet2){
                if (bullet2.y < 0 || bullet2.y > mapHeight || bullet2.x < 0 || bullet2.x > mapWidth){
                    
                    let index = scene_3.objects.indexOf(bullet2);
                    if (index > -1) {
                        scene_3.objects.splice(index, 1);
                    }
                    bullet2 = null;
                }
            }

            //console.log("mapscene hideen", mapscene_3.hidden);
            //console.log("scene hidden", scene_3.hidden);

                        scene_3.update();
            

        },
        render: function(){
            scene_3.render();

        }
    });



    const loop2 = GameLoop({
        update: function(dt){
            console.log("update 2")


            mapScene.lookAt(spectator)

            //console.log("player speed", player_speed)

            if (keyPressed('w')){
                spectator.y -= spec_speed;
                //console.log('w pressed')
            }
            if (keyPressed('s')){
                spectator.y +=  spec_speed;
            }
            if (keyPressed('a')){
                spectator.x -=  spec_speed;
            }
            if (keyPressed('d')){
                spectator.x +=  spec_speed;
            }

            if (spectator.x > mapWidth - spectator.width){
                spectator.x = mapWidth - spectator.width;
            }

            if (spectator.x < 0){
                spectator.x = 0;
            }

            if (spectator.y > mapHeight - spectator.height){
                spectator.y = mapHeight - spectator.height;
            }

            if (spectator.y < 0){
                spectator.y = 0;
            }

            //console.log('spectator x', spectator.x);
            //console.log('spectator y', spectator.y);

            if (keyPressed('space')){
                loop2.stop();
                spectator.x = -20;
                spectator.y = -20;
                sprites.forEach(function(sprite){
                    if (sprite.toggle == true){
                        new_map_coords.push([sprite.x, sprite.y])
                        console.log('sprite x', sprite.x);
                        console.log('sprite y', sprite.y);
                    }
                    //  else if (sprite.toggle == 'w'){
                    //     new_map_coords.push(['w', [sprite.x, sprite.y]])
                    // }
                });

                
                mapScene.hide();
                console.log('new map coords', new_map_coords)
                customWalls = generate_walls_from_coords(new_map_coords)


                init_scene_3();
                alert('Level created!');
                scene_3.show();
                //customMap = true;
                
                
                loop3.start();
                
            }

            for (let i = 0; i < sprites.length; i++){
                
                if (collides(spectator, sprites[i])){
                    if (keyPressed('j')){
                        sprites[i].toggle = true;
                        updatesprites();
                    }
                    if (keyPressed('k')){
                        if (sprites[i].toggle == 's'){
                            start_tile = null
                        }
                        sprites[i].toggle = false;
                        updatesprites();
                    }
                    if (keyPressed('l')){
                        if (sprites[i].toggle == 's'){
                            start_tile = null
                        }
                        sprites[i].toggle = 'wc';
                        console.log('\n\n',sprites[i].toggle, '\n\n')
                        updatesprites();
                    }
                    if (keyPressed('h') && start_tile == null){
                        sprites[i].toggle = 's'
                        console.log('; toggle executed')
                        updatesprites();
                    }
                }

                
            }
            mapScene.update();

        },
        render: function(){
            mapScene.render();
        }
    })


    const loop1 = GameLoop({
        update: function(dt){
            console.log("update 1")

            //console.log('player2 x y', player2.x, player2.y);
            player1.attack_delay -= dt;
            player2.attack_delay -= dt;
            player2.ray_delay -= dt;

            player1.time_alive += dt;
            player2.time_alive += dt;

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
                loop1.stop();
                alert('You lost');
                window.location.reload();   
            }

            if (collides(player1, finish_tile) || keyPressed('u')){
                loop1.stop();
                player1.x = 0;
                player1.y = 0;
                alert('You won');

                scene.hide()
                menuscene.show()
                menuloop.start();
            }
            
            //  //console.log('tmpx', tmpx);
            //     //console.log('tmpy', tmpy);
            
            walls.forEach(function(wall) {
                if (collides(player1, wall)){
                    if (player1.time_alive < 1){
                        console.log('1 collided')
                        player1.x = Math.floor(Math.random()*mapWidth);
                        player1.y = Math.floor(Math.random()*mapHeight);
                        player1.time_alive = 0;
                    }

                    player1.x = tmpx1; 
                    player1.y = tmpy1;
                }

                if (collides(player2, wall)){
                    if (player2.time_alive < 1){
                        console.log('2 collided')
                        player2.x = Math.floor(Math.random()*mapWidth);
                        player2.y = Math.floor(Math.random()*mapHeight);
                        player2.time_alive = 0;
                    }
                    
                    player2.x = tmpx2;
                    player2.y = tmpy2;
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
            ////console.log(getPointer());

            //rays and player2 movement

            if (player2.ray_delay <= 0 && player2.alive()){
                //console.log('shoot')
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
                    //console.log('ray_left collided = ', ray_left.collided);
                    //console.log('ray_left changed = ', ray_left.changed);
                }
                if (ray_straight){
                    //console.log('ray_straight collided = ', ray_straight.collided);
                    //console.log('ray_straight changed = ', ray_straight.changed);
                }
                if (ray_right){
                    //console.log('ray_right collided = ', ray_right.collided);
                    //console.log('ray_right changed = ', ray_right.changed);
                }


                //console.log('direction WAS', player2.direction)

                //console.log('dx WAS', player2.dx)
                //console.log('dy WAS', player2.dy)
                
                if (ray_left && ray_left.collided && !ray_left.changed){
                    ray_left.changed = true;
                    if (ray_straight.collided && !ray_straight.changed){
                        ray_straight.changed = true;
                        if (ray_right.collided){
                                
                                console.log('3 rays collided')
                                player2.direction += 1; // turn right
                                
                                
                                ray_left.changed = false;
                                ray_straight.changed = false;
                            
                        } else if (!ray_right.collided){
                            console.log('ray left straight collided, turning right')
                            player2.direction += 1; // turn right
                            ray_left.changed = false;
                            ray_straight.changed = false;
                        }
                        
                    } // else if !ray_straight.collided -> do nothing

                } else if (ray_left && !ray_left.collided && !ray_left.changed){
                    if (ray_straight.collided && !ray_straight.changed){
                        ray_straight.changed = true;
                        if (ray_right.collided && !ray_right.changed){
                            console.log('straight right rays collided, turning left')

                            ray_right.changed = true;
                            player2.direction -= 1; //turn left
                            ray_left.changed = false;
                                ray_straight.changed = false;

                        } else if (!ray_right.collided){

                            console.log('ray straight collided')
                            let dir = Math.floor(Math.random()*1)
                            if (dir == 1){
                                player2.direction += 1
                                console.log('turning right')
                            } else {
                                player2.direction -= 1
                                console.log('turning left')
                            } 
                            ray_left.changed = false;
                            ray_straight.changed = false;
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

            //console.log("mapscene hideen", mapScene.hidden);
            //console.log("scene hidden", scene.hidden);

                        scene.update();
            

        },
        render: function(){

            scene.render();
            

        }
    });

    menuloop.start();
        
  })

    






