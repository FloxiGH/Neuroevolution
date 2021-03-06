var pac;
var genAn;
var wands = []; //walls
var essen = []; //food
var monsters = []; //monster
var boosts = []; //boosts
var gamestart = false; //check if game has started
const kastlen = 50; //grid length
let direction = 1; //input direction of player
let olddir = 1; //direction player is actually going
var freespacesplayer = []; //spaces next to the player where there is no wall
var freespacesmonster = []; //spaces next to the monster where there is no wall
// variables that state if somthing is next to the player
let checkd = false;
let checku = false;
let checkl = false;
let checkr = false;
let stuck = true; //tells if player is walking into a wall
const buffer = 26; //shortest distance between wall an player
let lives = 3; //lives of the player
let boostMode = false; //is activated when player eats boost thing
let boostduration = 0;

//AI stuff
const TOTAL = 5;
var savedPacs = [];
var bestPac;
var slider;


var level1 = [[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
              [1,0,0,0,0,0,0,0,4,0,0,0,0,0,0,1],
              [1,1,1,0,1,1,1,0,1,0,1,1,1,1,0,1],
              [1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,1],
              [1,0,0,0,1,1,3,1,3,1,0,1,0,1,0,1],
              [1,0,1,0,0,1,3,1,3,1,0,1,0,0,0,1],
              [1,0,1,0,1,0,1,1,1,1,0,1,0,1,0,1],
              [1,1,1,0,1,0,1,0,1,1,0,1,0,0,0,1],
              [1,0,4,0,0,0,0,0,2,0,0,0,0,1,0,1],
              [1,1,1,1,0,1,1,0,1,1,1,1,0,1,1,1],
              [1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,1],
              [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]] // level layout

function setup() {
  createCanvas(800, 600);
  background(0);
  genAn = new genanzeige();
  slider = createSlider(1, 500, 1);
  buildGame();
  textSize(32);





}

function draw() {
  if (gamestart == true) {
    for (let i = 0; i < slider.value(); i++) {


      pac.think(monsters, wands, essen);
      pac.update();




      let z = 0;
      for (boost of boosts) {
        boost.coll(z)
        z++;
      }
      info();
      let i = 0;
      for (kirsche of essen) {
        kirsche.coll(i);
        i++;
      }
      i = 0;
      for (monster of monsters) {
        monster.update(monster);
        if (monster.coll() == true && lives != 1) {
          if (boostMode == true) {
            monsters.splice(i, 1);
          }
          else {
            reset();
          }
        }
        else if (monster.coll() == true && lives == 1) {
          if (boostMode == true) {
            monsters.splice(i, 1);
          }
          else {
            gameOver();
          }
        }
        i++;
      }
      if (essen.length == 0) {
        gameOver();
      }
      if (boostMode == true) {
        boostduration++;
      }
      if (boostduration == 300) {
        boostMode = false;
        boostduration =0;
      }


    }
    background(0);
    pac.display();
    for (wand of wands) {
      wand.display();
    }
    genAn.display();
    info();
    for (boost of boosts) {
      boost.display();
    }
    for (kirsche of essen) {
      kirsche.display();
    }
    for (monster of monsters) {
      monster.display();
    }
    }
    else {
      fill(255);
      textSize(50);
      text("To start game, press RA", 140, 280);
    }

}
function keyPressed () {
  if (keyCode === RIGHT_ARROW) {
    gamestart = true;
  }
}

function reset() {
  lives -= 1;
  monsters = [];
  boostMode = false;
  let x = 0;
  let y = 0;
  for (row of level1) {

    for (column of row) {
      if (column == 2) {
        pac.x = x + kastlen / 2;
        pac.y = y + kastlen / 2;
      }
      else if (column == 3) {
        var newm = new Monster(x, y);
        monsters.push(newm);
      }
      x += kastlen;
    }
    y += kastlen;
    x = 0;


  }

}

function gameOver() {
  essen = [];
  wands = [];
  monsters = [];
  boosts = [];
  boostMode = false;
  lives = 3;
  savedPacs.push(pac);
  if (savedPacs.length == TOTAL) {
    nextGeneration();
  }
  buildGame();

}

function buildGame() {
  let x = 0;
  let y = 0;
  for (row of level1) {

    for (column of row) {
      if (column == 1) {
        var neww = new Wand(x, y);
        wands.push(neww);
      }
      else if (column == 2) {
        if (genAn.gen == 0) {
          pac = new Pac(x,y);
        }
        else {
          pac = new Pac(x,y,bestPac.brain);
        }

      }
      else if (column == 0) {
        var newe = new Kirsche(x, y);
        essen.push(newe);
      }
      else if (column == 3) {
        var newm = new Monster(x, y);
        monsters.push(newm);
      }
      else if (column == 4) {
        var newb = new Boost(x, y);
        boosts.push(newb);
      }
      x += kastlen;
    }
    y += kastlen;
    x = 0;


  }
}

function info() {
  fill(255);
  text(lives, 20, 35);
}

function findFreespaces(thing) {
  var freespaces = [];
  for (wand of wands) {
    wand.coll(thing)
  }
  if (checkd == false) {
    freespaces.push(2);
  }
  if (checku == false) {
    freespaces.push(0);
  }
  if (checkr == false) {
    freespaces.push(1);
  }
  if (checkl == false) {
    freespaces.push(3);
  }
  checkd = false;
  checku = false;
  checkl = false;
  checkr = false;
  return freespaces;
}
