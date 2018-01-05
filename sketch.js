function preload() {
  //ocra = loadFont("OCRAStd.otf");
}
function setup() {
  createCanvas(1000, 700);
  textSize(40);
  gotoMenu();
}
var timer;
//var scene = 4;
var ship;
var particles = [];
var isover = false;
var level = 1;
var messages = ["You're still trash.", "You're worse than the garbage\n you just destroyed.", "You'll never amount to anything.", "Here you are sitting around \nplaying video games. This is why\nwe haven't cured cancer.", "Your most productive years were \nages 5 to 10. In that time you \ndid nothing.", ""];
var message;

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

function Ship(x, y) {
  SpaceObject.call(this, x, y);
  this.agility = 5;
  this.speed = 0.2;
  this.health = 100;
  this.mass = 1;
  this.cooldown = 0;
}
Ship.prototype = Object.create(SpaceObject.prototype);
Ship.prototype.constructor = Ship;
Ship.prototype.display = function() {
  fill(2.55*(100-this.health), 2.55*this.health, 0, 100);
  text('Shields: ' + this.health + '%', 100, 100);
  fill(5.1*(this.cooldown), 5.1*(50-this.cooldown), 0, 100);
  text('Cannon Charge: ' + 2*(50-this.cooldown) + '%', 100, 160);
  push();
  translate(this.position.x, this.position.y);
  rotate(radians(this.orientation-90));
  fill(200, 200, 200);
  rect(-10, -5, 20, 10);
  triangle(-10, 5, 10, 5, -10, 15);
  triangle(-10, -5, 10, -5, -10, -15);
  if (this.force.mag() > 0) {
    fill(255, 0, 0);
    ellipse(-30, 0, 15, 5);
  }
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
Ship.prototype.quadrant = function() {
  orientation = this.orientation%360;
  if (orientation < 0) {
    orientation += 360;
  }
  if (orientation > 0 && orientation < 90) {
    return 1;
  } else if (orientation > 90 && orientation < 180) {
    return 2;
  } else if (orientation > 180 && orientation < 270) {
    return 3;
  } else if (orientation > 270 && orientation < 360) {
    return 4;
  } else if (orientation === 0 || orientation === 360) {
    return 41;
  } else if (orientation === 90) {
    return 12;
  } else if (orientation === 180) {
    return 23;
  } else if (orientation === 270) {
    return 34;
  }
};
Ship.prototype.simulate = function() {
  force = createVector(0, 0);
  var quadrant = this.quadrant();

  if (keyIsPressed && keyCode == UP_ARROW) {
    if (quadrant === 1 || quadrant === 2 || quadrant === 12 || quadrant === 23) {
      this.orientation -= this.agility;
    } else {
      this.orientation += this.agility;
    }
  }
  if (keyIsPressed && keyCode == DOWN_ARROW) {
    if (quadrant === 3 || quadrant === 4 || quadrant === 41 || quadrant === 34) {
      this.orientation -= this.agility;
    } else {
      this.orientation += this.agility;
    }
  }
  if (keyIsPressed && keyCode == RIGHT_ARROW) {
    if (quadrant === 2 || quadrant === 3 || quadrant === 34 || quadrant === 23) {
      this.orientation -= this.agility;
    } else {
      this.orientation += this.agility;
    }
  }
  if (keyIsPressed && keyCode == LEFT_ARROW) {
    if (quadrant === 1 || quadrant === 4 || quadrant === 41 || quadrant === 12) {
      this.orientation -= this.agility;
    } else {
      this.orientation += this.agility;
    }
  }
  if (keyIsPressed && key === ' ') {
    force.x = this.speed*sin(radians(orientation));
    force.y = -this.speed*cos(radians(orientation));
  }
  this.force.add(force);

  if (keyIsPressed && key === 'a') {
    if (this.cooldown === 0) {
      var bulletVel = createVector(cos(radians(this.orientation-90)), sin(radians(this.orientation-90)))
      bulletVel.mult(15);
      particles.push(new Bullet(this.position.x + 45*cos(radians(this.orientation-90)), this.position.y + 45*sin(radians(this.orientation-90)), bulletVel));
      this.cooldown = 50;
    }
  }
  if (this.cooldown > 0) {
    this.cooldown --;
  }
};
Ship.prototype.onCollide = function(o) {
  if (!(o instanceof Explosion)){
    this.health -= o.mass*10;
  }
}
Ship.prototype.onDeath = function() {
  return new Explosion(this.position.x, this.position.y, 30);
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
  return new Explosion(this.position.x, this.position.y, 15);
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
  fill(255, 0, 0);
  ellipse(0, 0, 5, 30);
  pop();

  this.health --;

};
Bullet.prototype.onEdge = function() {
  this.orientation = degrees(atan(this.velocity.y/this.velocity.x));
};
//Bullet.prototype.checkEdges = function() {};

function nothing() {
  // Do nothing
  console.log('Well, that did nothing.');
}
//var button;
var bback, bstart, binfo;
function gotoMenu() {
  scene = 0;
  bstart = new Button(380, 300, 'Start', gotoStart);
  binfo = new Button(400, 450, 'Info', gotoInfo);
}
function gotoStart() {
  isover = false;
  scene = 1;
  var force;
  particles = [];
  ship = new Ship(200, 200);
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
  bback = new Button(320, 500, 'Back', gotoMenu);
}
function gotoGameover() {
  scene = 3;
  message = messages[int(random(0, messages.length-1))]
}
function gotoWin() {
  scene = 4;
  message = messages[int(random(0, messages.length-1))]
}

function menu() {
  background(9, 37, 84);
  fill(0, 255, 0, 100);
  textSize(80);
  text('Space Trash Destroyer', 90, 190);
  textSize(40);

  bstart.display();
  binfo.display();
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
        particles.push(death);
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
      gotoWin();
    }
  }
}

function gameover() {
  //background(0, 0, 0);
  if ((frameCount - timer)/frameRate() > 2) {
    level = 1;
    gotoMenu();
  } else {
    main();
    fill(255, 0, 0);
    textSize(40);
    text('Game Over\n' + message, 370, 330);
  }
}

function win() {
  if ((frameCount - timer)/frameRate() > 2) {
    level ++;
    gotoStart();
  } else {
    fill(255, 0, 0);
    textSize(40);
    text('Mission Success!\n' + message, 370, 330);
  }

}

function draw() {
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
  }

}
