function preload() {
  //ocra = loadFont("OCRAStd.otf");
}
function setup() {
  createCanvas(1000, 700);
  textSize(40);
  gotoMenu();
  currentShip = new Ship();
  currentShip.wings = new Zephyrates();
  currentShip.engine = new Womper();
  currentShip.weapon = new Machineblaster();
  console.log(currentShip);
  keysDown = [];
}
var timer;

var LEFT = 37;
var UP = 38;
var RIGHT = 39;
var DOWN = 40;
var SPACE = 32;

function quadAttitudeSteer(wings, orientation) {
  var quadrant = wings.quadrant(orientation);
  //console.log(quadrant);
  if (keyDown(38)) {
    if (quadrant === 1 || quadrant === 2 || quadrant === 12 || quadrant === 23) {
      orientation -= wings.agility;
    } else {
      orientation += wings.agility;
    }
  }
  if (keyDown(40)) {
    if (quadrant === 3 || quadrant === 4 || quadrant === 41 || quadrant === 34) {
      orientation -= wings.agility;
    } else {
      orientation += wings.agility;
    }
  }
  if (keyDown(39)) {
    if (quadrant === 2 || quadrant === 3 || quadrant === 34 || quadrant === 23) {
      orientation -= wings.agility;
    } else {
      orientation += wings.agility;
    }
  }
  if (keyDown(37)) {
    if (quadrant === 1 || quadrant === 4 || quadrant === 41 || quadrant === 12) {
      orientation -= wings.agility;
    } else {
      orientation += wings.agility;
    }
  }
  return orientation;
};

function biAttitudeSteer(wings, orientation) {
  var quadrant = wings.quadrant(orientation);
  if (keyDown(39)) {
    if (quadrant === 2 || quadrant === 3 || quadrant === 34 || quadrant === 23) {
      orientation -= wings.agility;
    } else {
      orientation += wings.agility;
    }
  }
  if (keyDown(37)) {
    if (quadrant === 1 || quadrant === 4 || quadrant === 41 || quadrant === 12) {
      orientation -= wings.agility;
    } else {
      orientation += wings.agility;
    }
  }
  return orientation;
}

function clockSteer(wings, orientation) {
  if (keyDown(37)) {
    orientation -= wings.agility;
  }
  if (keyDown(39)) {
    orientation += wings.agility;
  }
  return orientation;
}

function Ship() {
};

function Wings() {
  this.agility = 5;
  this.steerMode = quadAttitudeSteer;
  this.mass = 0.2;
};
Wings.prototype.quadrant = function(orientation) {
  //console.log(orientation);
  orientation = orientation % 360;

  if (orientation < 0) {
    orientation += 360;
  }
  var q;
  if (orientation > 0 && orientation < 90) {
    q = 1;
  } else if (orientation > 90 && orientation < 180) {
    q = 2;
  } else if (orientation > 180 && orientation < 270) {
    q = 3;
  } else if (orientation > 270 && orientation < 360) {
    q = 4;
  } else if (orientation === 0 || orientation === 360) {
    q = 41;
  } else if (orientation === 90) {
    q = 12;
  } else if (orientation === 180) {
    q = 23;
  } else if (orientation === 270) {
    q = 34;
  }
  //console.log(q);
  return q;
};
Wings.prototype.steer = function(orientation) {
  return this.steerMode(this, orientation);
};
Wings.prototype.display = function(protoShip) {
  fill(200, 200, 200);
  triangle(-10, 5, 10, 5, -10, 15);
  triangle(-10, -5, 10, -5, -10, -15);
}

function Engine() {
  this.power = 0.2;
  this.mass = 0.2;
}
Engine.prototype.thrust = function(protoShip) {
  var force = createVector(0, 0);
  if (keyDown(32)) {
    force.x = this.power*sin(radians(protoShip.orientation));
    force.y = -this.power*cos(radians(protoShip.orientation));
  }
  return force;
};
Engine.prototype.display = function(protoShip) {
  fill(0, 0, 0);
  rect(-15, -5, 5, 10);
  if (protoShip.force.mag() > 0) {
    fill(255, 0, 0, 150);
    ellipse(-30, 0, 15, 5+(frameCount%5));
  }
};

function Weapon() {
  this.cooldown = 0;
  this.mass = 0.2;
  this.cooltime = 50;
  this.ammo = Bullet;
  this.velocity = 1;
}
Weapon.prototype.engage = function(protoShip) {
  if (keyDown('A')) {
    if (this.cooldown === 0) {
      this.fire(protoShip);
      this.cooldown = this.cooltime;
    }
  }
  if (this.cooldown > 0) {
    this.cooldown --;
  }
};
Weapon.prototype.fire = function(protoShip) {
  var bulletVel = createVector(this.velocity*cos(radians(protoShip.orientation-90)), this.velocity*sin(radians(protoShip.orientation-90)))
  bulletVel.mult(15);
  particles.push(new this.ammo(protoShip.position.x + 45*cos(radians(protoShip.orientation-90)), protoShip.position.y + 45*sin(radians(protoShip.orientation-90)), bulletVel));
};
Weapon.prototype.display = function(protoShip) {
  ellipse(13, 0, 10, 3);
};

function Poofer() {
  Engine.call(this);
  this.power = 0.1;
}
Poofer.prototype = Object.create(Engine.prototype);

function Womper() {
  Engine.call(this);
  this.power = 0.3;
}
Womper.prototype = Object.create(Engine.prototype);
Womper.prototype.display = function(protoShip) {
  fill(0, 0, 0);
  rect(-15, -5, 5, 10);
  if (protoShip.force.mag() > 0) {
    fill(255, 0, 255);
    ellipse(-30-protoShip.velocity.mag()/3, 0, 15+protoShip.velocity.mag()/3, 5+(frameCount%8));
  }
};

function Cyclomaniac() {
  Engine.call(this);
  this.power = 1;
  this.mass = 1;
}
Cyclomaniac.prototype = Object.create(Engine.prototype);
Cyclomaniac.prototype.display = function(protoShip) {
  fill(0, 0, 0);
  rect(-15-(frameCount%5), -5, 5, 10);
  if (protoShip.force.mag() > 0) {
    fill(0, 0, 255);
    ellipse(-30-protoShip.velocity.mag()/3, 0, 15+protoShip.velocity.mag()/3, 5+(frameCount%8));
  }
};

function Flaps() {
  Wings.call(this);
  this.agility = 3;
  this.steerMode = biAttitudeSteer;
  this.description = "Cute metal triangles. Wiggling them around can help you turn, sometimes.";
}
Flaps.prototype = Object.create(Wings.prototype);

function Herons() {
  Wings.call(this);
  this.agility = 5;
  this.steerMode = biAttitudeSteer;
  this.description = "These were at least designed to be wings. 70 years ago. Hope they still work!";
}
Herons.prototype = Object.create(Wings.prototype);
Herons.prototype.display = function() {
  fill(200, 0, 200);
  triangle(-10, 5, 10, 5, -10, 15);
  triangle(-10, -5, 10, -5, -10, -15);
};

function Aiglets() {
  Wings.call(this);
  this.agility = 6;
  this.steerMode = quadAttitudeSteer;
  this.description = "Revolutionary wing technology allows you to point your ship in brand new directions, like 'up' and 'down.'";
}
Aiglets.prototype = Object.create(Wings.prototype);
Aiglets.prototype.display = function() {
  fill(0, 200, 200);
  triangle(-15, 5, 20, 5, -10, 15);
  triangle(-15, -5, 20, -5, -10, -15);
};


function Zephyrates() {
  Wings.call(this);
  this.agility = 10;
  this.steerMode = clockSteer;
  this.description = "These things turn so fast that directions don't matter anymore. They'll fling your ship clockwise or counterclockwise at dizzying speeds.";
}
Zephyrates.prototype = Object.create(Wings.prototype);
Zephyrates.prototype.display = function() {
  fill(200, 0, 0);
  triangle(-15, 5, 25, 5, -10, 20);
  triangle(-15, -5, 25, -5, -10, -20);
};

function BBgun() {
  Weapon.call(this);
  this.cooltime = 50;
  this.ammo = BBammo;
  this.description = "Wait, they still make these things? It's 2328 for pete's sake!";
}
BBgun.prototype = Object.create(Weapon.prototype);

function Blaster() {
  Weapon.call(this);
  this.cooltime = 50;
  this.description = "Adapted from a BB gun to shoot long red pieces of plastic that you can pretend are lasers if you want.";
}
Blaster.prototype = Object.create(Weapon.prototype);

function Machineblaster() {
  Weapon.call(this);
  this.cooltime = 20;
  this.description = "We stuck a bunch of blasters next to each other and made them fire in sequence. Warranty does not cover overheat damage.";
}
Machineblaster.prototype = Object.create(Weapon.prototype);
Machineblaster.prototype.display = function() {
  fill(100, 0, 0);
  ellipse(13, 2, 10, 3);
  ellipse(13, -2, 10, 3);
};

function Laser() {
  Weapon.call(this);
  this.cooltime = 20;
  this.ammo = LaserBeam;
  this.description = "Shoots high-energy beams of deadly light. Do not point at reflective objects.";
}
Laser.prototype = Object.create(Weapon.prototype);

function Hyperbeam() {
  Weapon.call(this);
  this.cooltime = 5;
  this.ammo = HyperBullet;
  this.velocity = 1.3;
  this.description = "We developed a new type of bullet which causes minimal overheat. It's fragile and doesn't have a very long range, but boy is it fast!";
}
Hyperbeam.prototype = Object.create(Weapon.prototype);

function Supercannon() {
  Weapon.call(this);
  this.cooltime = 100;
  this.ammo = SuperBullet;
  this.description = "The engineering team budget form was accidentally multiplied by 100 due to a sticky zero key. The mistake was rectified in a few hours, but not until they had built this. Don't use it inside.";
}
Supercannon.prototype = Object.create(Weapon.prototype);

function Unfairness() {
  Weapon.call(this);
  this.cooltime = 10;
  this.ammo = SuperBullet;
  this.description = "You can tell a hacker apart from the others by the fact that they never lose.";
}
Unfairness.prototype = Object.create(Weapon.prototype);

//var scene = 4;
var currentShip;
var particles = [];
var isover = false;
var level = 1;
var messages = ["You're still trash.", "You're worse than the garbage\n you just destroyed.", "You'll never amount to anything.", "Here you are sitting around \nplaying video games. This is why\nwe haven't cured cancer.", "Your most productive years were \nages 5 to 10. In that time you \ndid nothing.", ""];
var message;
var credits = 0;
var creditsEarned;


function Button(x, y, text, onClick) {
  this.x = x;
  this.y = y;
  this.text = text;
  this.onClick = onClick;
  this.bg = color(0, 255, 0);
  this.hover = color(0, 200, 0);
  this.clicked = false;
  this.width = 20 + textSize()*this.text.length;
  this.height = 50 + textSize()-10;
}
Button.prototype.display = function() {
  fill(this.bg);
  if (mouseX < this.x + this.width && mouseX > this.x && mouseY > this.y && mouseY < this.y+this.height) {
    this.onHover();
    if (mouseIsPressed && !this.clicked) {
      this.clicked = true;
    } else if (this.clicked && !mouseIsPressed) {
      console.log('Detected click!');
      this.onClick();
      this.clicked = false;

    }
  }
  rect(this.x, this.y, this.width, this.height, 5);
  fill(0, 0, 0);
  text(this.text, this.x + 10, this.y+this.height/2 + 0.5*textSize()-10);
};
Button.prototype.onHover = function() {
  fill(this.hover);
};

function SpaceObject(x, y) {
  this.position = createVector(x, y);
  this.velocity = createVector(0, 0);
  this.acceleration = createVector(0, 0);
  this.mass = 1;
  this.orientation = -90;
  this.elasticity = 0.9;
  this.frictionCoefficient = 0.7;
  this.force = createVector(0, 0);
  this.collisionRadius = 40;
  this.health = 1;
}
SpaceObject.prototype.display = function() {
  push();
  fill(100, 100, 100);
  translate(this.position.x, this.position.y);
  ellipse(0, 0, 40, 40);
  pop();
};
SpaceObject.prototype.update = function() {
  force = this.force;
  force.div(this.mass);
  this.acceleration = force;
  this.velocity.add(this.acceleration);
  this.position.add(this.velocity);
  this.orientation%=360;
  if (this.orientation < 0) {
    this.orientation += 360;
  }
  this.force.mult(0);
}
SpaceObject.prototype.checkEdges = function() {
  if (this.position.x > width) {
        this.position.x = width;
        this.velocity.x *= -this.elasticity;
    } else if (this.position.x < 0) {
        this.position.x = 0;
        this.velocity.x *= -this.elasticity;
    }

    if (this.position.y > height) {
        this.position.y = height;
        this.velocity.y *= -this.elasticity;
    } else if (this.position.y < 0) {
        this.position.y = 0;
        this.velocity.y*= -this.elasticity;
    }
    if (this.position.x === width || this.position.x === 0) {
        this.velocity.y *= this.frictionCoefficient;
    }
    if (this.position.y === width || this.position.y === 0) {
        this.velocity.x *= this.frictionCoefficient;
    }
    this.onEdge();
};
SpaceObject.prototype.simulate = function() {};
SpaceObject.prototype.applyForce = function(f) {
  this.force.add(f);
};
SpaceObject.prototype.collide = function(o) {
  v1 = this.velocity;
  v2 = o.velocity;
  m1 = this.mass;
  m2 = o.mass;
  endv1 = p5.Vector.div(p5.Vector.add(p5.Vector.mult(v1, (m1-m2)), p5.Vector.mult(v2, 2*m2)), m1+m2);
  endv2 = p5.Vector.div(p5.Vector.add(p5.Vector.mult(v2, (m2-m1)), p5.Vector.mult(v1, 2*m1)), m1+m2);
  this.velocity = endv1;
  o.velocity = endv2;
  this.onCollide(o);
  o.onCollide(this);
};
SpaceObject.prototype.onCollide = function(o) {};
SpaceObject.prototype.onDeath = function() {
  return 0;
};
SpaceObject.prototype.render = function() {
  //fill(255, 0, 0, 30);
  //noStroke();
  //ellipse(this.position.x, this.position.y, this.collisionRadius, this.collisionRadius);

  //stroke(0, 0, 0);
  //strokeWeight(1);
  this.display();
}
SpaceObject.prototype.onEdge = function() {};



function instanceShip(x, y, protoShip) {
  SpaceObject.call(this, x, y);
  this.health = 100;
  this.mass = 1;
  this.wings = protoShip.wings;
  this.engine = protoShip.engine;
  this.weapon = protoShip.weapon;
  this.mass += (this.wings.mass + this.engine.mass + this.weapon.mass);
}
instanceShip.prototype = Object.create(SpaceObject.prototype);
instanceShip.prototype.constructor = instanceShip;
instanceShip.prototype.display = function() {
  fill(2.55*(100-this.health), 2.55*this.health, 0, 100);
  text('Shields: ' + this.health + '%', 100, 100);
  fill(5.1*(this.weapon.cooldown), (255/this.weapon.cooltime)*(this.weapon.cooltime-this.weapon.cooldown), 0, 100);
  text('Cannon Charge: ' + (100/this.weapon.cooltime)*(this.weapon.cooltime-this.weapon.cooldown) + '%', 100, 160);
  push();
  translate(this.position.x, this.position.y);
  rotate(radians(this.orientation-90));
  fill(200, 200, 200);
  rect(-10, -5, 20, 10);

  this.wings.display(this);

  this.engine.display(this);

  this.weapon.display(this);
  pop();
  push();
  if (random(0, this.health) > 20) {
    fill(0, 0, 255, 30);
  } else {
    noFill();
  }
  noStroke();
  ellipse(this.position.x, this.position.y, this.collisionRadius, this.collisionRadius);
  if (random(0, this.cooldown) > 10) {
    fill(0, 255, 0, 30);
  } else {
    noFill();
  }
  ellipse(this.position.x + 15*cos(radians(this.orientation-90)), this.position.y + 15*sin(radians(this.orientation-90)), 10, 10);
  pop();
};
instanceShip.prototype.simulate = function() {
  force = createVector(0, 0);
  this.orientation = this.wings.steer(this.orientation);
  this.force.add(this.engine.thrust(this));
  this.weapon.engage(this);

};
instanceShip.prototype.onCollide = function(o) {
  if (!(o instanceof Explosion)){
    this.health -= o.mass*10;
  }
}
instanceShip.prototype.onDeath = function() {
  return [new Explosion(this.position.x, this.position.y, 30)];
};


function Asteroid(x, y) {
  SpaceObject.call(this, x, y);
  this.mass = 3;
  this.health = 10;
}
Asteroid.prototype = Object.create(SpaceObject.prototype);
Asteroid.prototype.constructor = Asteroid;
Asteroid.prototype.simulate = function() {};
Asteroid.prototype.onCollide = function(o) {
  if (!(o instanceof Asteroid)) {
    this.health -=


    10*o.mass;
  }
};
Asteroid.prototype.display = function() {
  push();
  fill(100, 100, 100);
  translate(this.position.x, this.position.y);
  ellipse(0, 0, 40, 40);
  fill(0, 0, 0);
  //text(this.health, 0, 0);
  pop();
};
Asteroid.prototype.onDeath = function() {
  return [new Explosion(this.position.x, this.position.y, 15)];
};

function Explosion(x, y, s) {
  this.s = s;
  SpaceObject.call(this, x, y);
  this.progress = 0;
  this.projectiles = [];
  this.mass = 0.1;
  for (var i = 0; i < random(this.s/3, this.s); i ++) {
    this.projectiles[i] = [createVector(0, 0), createVector(random(-1, 1), random(-1, 1))];
  }
}
Explosion.prototype = Object.create(SpaceObject.prototype);
Explosion.constructor = Explosion;
Explosion.prototype.display = function() {
  push();
  translate(this.position.x, this.position.y);
  //text(this.progress, 0, 0);
  noStroke();
  fill(255, 0, 0, 255-2.55*this.progress)
  for (var i = 0; i < this.projectiles.length; i++) {
    this.projectiles[i][0].add(this.projectiles[i][1]);
    ellipse(this.projectiles[i][0].x, this.projectiles[i][0].y, 5, 5);
  }
  this.progress ++;
  pop();
  if (this.progress === 100) {
    this.health = 0;
  }

};
Explosion.prototype.checkEdges = function() {};
Explosion.prototype.collide = function() {};

function Bullet(x, y, v) {
  SpaceObject.call(this, x, y);
  this.velocity = v;
  this.mass = 0.5;
  this.health = 50;
  this.collisionRadius = 2;
  this.orientation = asin(this.velocity.y/this.velocity.mag())
  this.color = color(255, 0, 0);
  this.width = createVector(5, 30);
}
Bullet.prototype = Object.create(SpaceObject.prototype);
Bullet.constructor = Bullet;
Bullet.prototype.display = function() {

  //text(this.orientation, 100, 50);
  push();
  translate(this.position.x, this.position.y);
  rotate(radians(this.orientation-90));
  //text(this.progress, 0, 0);
  stroke(255, 50, 50, 100);
  fill(this.color);
  ellipse(0, 0, this.width.x, this.width.y);
  pop();

  this.health --;

};
Bullet.prototype.onEdge = function() {
  this.orientation = degrees(atan(this.velocity.y/this.velocity.x));
};
//Bullet.prototype.checkEdges = function() {};

function HyperBullet(x, y, v) {
  Bullet.call(this, x, y, v);
  this.health = 20;
  this.color = color(0, 255, 0);
}
HyperBullet.prototype = Object.create(Bullet.prototype);

function BBammo(x, y, v) {
  Bullet.call(this, x, y, v);
  this.color = color(150, 150, 150);
  this.width = createVector(5, 5);
  this.mass = 0.2;
}
BBammo.prototype = Object.create(Bullet.prototype);


function LaserBeam(x, y, v) {
  Bullet.call(this, x, y, v);
  this.health = 100;
  this.color = color(255, 150, 150);
  this.mass = 3;
  this.pm;
}
LaserBeam.prototype = Object.create(Bullet.prototype);
LaserBeam.prototype.simulate = function() {
  this.pm = this.velocity.mag();
};
LaserBeam.prototype.onCollide = function() {
  this.velocity.normalize();
  this.velocity.mult(this.pm);
  this.health *= 0.1;
};

function SuperBullet(x, y, v) {
  Bullet.call(this, x, y, v);
  this.health = 100;
  this.color = color(150, 150, 255);
  this.collisionRadius = 30;
  this.width = createVector(30, 30);
  this.mass = 30;
}
SuperBullet.prototype = Object.create(Bullet.prototype);
SuperBullet.prototype.onDeath = function() {
  var death = [];
  for (var i = 0; i < 14; i++) {
    death.push(new Bullet(this.position.x, this.position.y, createVector(random(-13, 13), random(-13, 13))));
  }
  return death;
};


function nothing() {
  // Do nothing
  console.log('Well, that did nothing.');
}
//var button;
var bback, bstart, binfo, bplay, bship;
function gotoMenu() {
  scene = 0;
  bplay = new Button(400, 300, 'Play', gotoMenu2);
  binfo = new Button(400, 450, 'Info', gotoInfo);
}
function gotoStart() {
  keysDown = [];
  isover = false;
  scene = 1;
  var force;
  particles = [];
  ship = new instanceShip(200, 200, currentShip);
  particles.push(ship);
  for (var i = 1; i <= 2 + 3*level; i++) {
    particles[i] = new Asteroid(random(0, 1000), random(0, 700));
    force = createVector(random(0, 30), random(0, 30));
    console.log('Asteroid created! Force: ' + force);
    particles[i].applyForce(force);

  }

}
function gotoInfo() {
  scene = 2;
  bback = new Button(400, 550, 'Back', gotoMenu);
}
function gotoGameover() {
  scene = 3;
  message = messages[int(random(0, messages.length-1))]
}
function gotoWin() {
  scene = 4;
  message = messages[int(random(0, messages.length-1))]
  creditsEarned = particles[0].health*level;
  credits += creditsEarned;
}
function gotoMenu2() {
  scene = 5;
  bstart = new Button(380, 300, 'Start', gotoStart);
  bship = new Button(400, 425, 'Ship', gotoShip);
  bback = new Button(400, 550, 'Back', gotoMenu);
}

var item = 0;
var maxItems = 10;
var bleft, bright;
function left() {
  if (item > 0) {
    item --;
  }
}
function right() {
  if (item < maxItems) {
    item ++;
  }
}
function gotoShip() {
  scene = 6;
  bleft = new Button(340, 550, '<', left);
  bright = new Button(600, 550, '>', right);
}

function menu() {
  background(9, 37, 84);
  fill(0, 255, 0, 100);
  textSize(80);
  text('Space Trash Destroyer', 90, 190);
  textSize(40);

  bplay.display();
  binfo.display();
}
function menu2() {
  background(9, 37, 84);
  textSize(80);
  fill(0, 255, 0, 100);
  text('Space Trash Destroyer', 90, 190);
  textSize(40);
  bstart.display();
  bship.display();
  bback.display();
}

function info() {
  textSize(20);

  background(9, 37, 84);
  fill(0, 255, 0, 100);
  text("How to play:\n\nSituation:\nYou are a drone operator on a starship in the middle of nowhere. Your ship's path was recently \nobstructed by an garbage field. Rather than use valuable fuel avoiding it, the captain assigned you \nand your colleagues to this mission.\n\nObjective:\nPilot your drone through the designated quadrant. Destroy any garbage but do not damage your\n drone. To help you, the drone is equipped with shields. These can only withstand so much of a \nbeating, however.\n\nControls:\nAttitude/Rotation: [arrow keys]\nEngine: [space]\nGarbage Destroyer Cannon: [a]" , 100, 100);
  textSize(40);

  bback.display();
}
/*
function main() {
  textSize(20);
  background(245, 235, 223);
  fill(0, 0, 0);
  text("There isn't really much to see here at the moment." , 100, 100);
  textSize(40);
  bback = new Button(320, 500, 'Back', gotoMenu);
  bback.display();
}
*/
function main() {
  background(9, 37, 84);
  for (var i = 0; i < particles.length; i++) {
    if (particles[i].health <= 0) {
      death = particles[i].onDeath();
      if (death !== 0) {
        for (var a = 0; a < death.length; a++) {
          particles.push(death[a]);
        }
      }
      particles.splice(i, 1);
    } else {
      particles[i].simulate();
      particles[i].checkEdges();
      particles[i].render();
      particles[i].update();
      //console.log(particles[i].position);
      if (!(i instanceof Explosion)) {
        for (var a = 0; a < particles.length; a++) {
          cr = particles[i].collisionRadius + particles[a].collisionRadius;
          if (a !== i && !(particles[a] instanceof Explosion)) {
            //console.log(particles.length);
            //console.log(a);
            apos = p5.Vector.sub(particles[a].position, particles[i].position)
            if (apos.mag()*2 < cr) {
              particles[i].collide(particles[a]);
            }
          }
        }
      }
    }
  }
  fill(0, 255, 0, 100);
  text('Level ' + level, 500, 100)
  if (!isover) {
    if (particles[0].health <= 0) {
      gotoGameover();
      isover = true;
      timer = frameCount;
    } else if (particles.length === 1) {
      timer = frameCount;
      isover = true;
      gotoWin();
    }
  }
}

function gameover() {
  //background(0, 0, 0);
  if ((frameCount - timer)/frameRate() > 2) {
    level = 1;
    gotoMenu2();
  } else {
    main();
    fill(255, 0, 0);
    textSize(40);
    text('Game Over\n' + message, 370, 330);
  }
}

function win() {
  main();
  if ((frameCount - timer)/frameRate() > 2) {
    level ++;
    gotoStart();
  } else {
    fill(255, 0, 0);
    textSize(40);
    text('Mission Success!\n' + message + '\nEarned ' + creditsEarned + ' credits.', 370, 330);
  }

}

function shipInfo() {
  background(9, 37, 84);
  text(item, 100, 100);
  bleft.display();
  bright.display();
}

var keysDown = [];

function keyDown(testingKey) {
  //console.log(testingKey);
  if (keysDown.indexOf(testingKey) > -1) {
    return true;
  } else {
    return false;
  }
}

function keyPressed() {
  keysDown.push(getKey());
  //console.log(keysDown);
}

function keyReleased() {
  keysDown.splice(keysDown.indexOf(getKey()), 1)
  //console.log(keysDown);
}

var getKey = function() {

  var code;
  //console.log(key.charCodeAt(0))
  if (key.charCodeAt(0) < 123 && key.charCodeAt(0) > 47) {
    code = key;
    //console.log('Key');
  } else if (keyCode !== undefined) {
    code = keyCode;
    //console.log('KeyCode');
  }

  return code;
};

function draw() {
  if (frameCount === 1) {
    keysDown = [];
  }
  //background(245, 235, 223);
  if (scene === 0) {
    menu();
  } else if (scene === 1) {
    main();
  } else if (scene === 2) {
    info();
  } else if (scene === 3) {
    gameover();
  } else if (scene === 4) {
    win();
  } else if (scene === 5) {
    menu2();
  } else if (scene === 6) {
    shipInfo();
  }
  fill(0, 255, 0, 100);
  text(credits + ' Credits', 10, 40);
}
