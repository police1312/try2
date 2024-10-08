// First sketch: Particle system with moving target points
let sketch1 = function(p) {
  let particles = [];
  let particleCount = 25;

  p.setup = function() {
    p.createCanvas(400, 400);
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle(p.random(p.width), p.random(p.height)));
    }
  };

  p.draw = function() {
    p.background(0, 0, 0, 20);
    for (let particle of particles) {
      particle.update();
      particle.display();
    }
  };

  class Particle {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.targetX = x;
      this.targetY = y;
      this.size = 5;
      this.lerpSpeed = 0.005;
      this.alpha = 255;
    }

    update() {
      let previousX = this.x;
      let previousY = this.y;
      this.x = p.lerp(this.x, this.targetX, this.lerpSpeed);
      this.y = p.lerp(this.y, this.targetY, this.lerpSpeed);
      let speed = p.dist(this.x, this.y, previousX, previousY);
      this.alpha = p.map(speed, 0, 2, 0, 255);
      if (p.dist(this.x, this.y, this.targetX, this.targetY) < 1) {
        this.targetX = p.random(p.width);
        this.targetY = p.random(p.height);
      }
    }

    display() {
      let numSegments = 10;
      for (let i = 0; i < numSegments; i++) {
        let t = i / numSegments;
        let alpha = this.alpha * (1 - t);
        let weight = p.map(t, 0, 1, 2, 0);
        p.stroke(255, 0, 0, alpha);
        p.strokeWeight(weight);

        let x1 = p.lerp(this.x, 0, t);
        let x2 = p.lerp(this.x, p.width, t);
        p.line(this.x, this.y, x1, this.y);
        p.line(this.x, this.y, x2, this.y);

        let y1 = p.lerp(this.y, 0, t);
        let y2 = p.lerp(this.y, p.height, t);
        p.line(this.x, this.y, this.x, y1);
        p.line(this.x, this.y, this.x, y2);
      }

      p.noStroke();
      p.fill(255, 255, 255, 0);
      p.ellipse(this.x, this.y, this.size);
    }
  }
};

// Second sketch: Fading circular particle system
let sketch2 = function(p) {
  let particles = [];
  let alphaBack = 20;

  p.setup = function() {
    p.createCanvas(400, 400);
    p.noFill();
  };

  p.draw = function() {
    p.background(255, 255, 255, alphaBack);
    if (p.frameCount % 7 === 0) {
      particles.push(new Particle(p.random(p.width), p.random(p.height)));
    }

    for (let i = particles.length - 1; i >= 0; i--) {
      particles[i].update();
      particles[i].show();
      if (particles[i].alpha <= 0) {
        particles.splice(i, 1);
      }
    }
  };

  class Particle {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.r = 0;
      this.alpha = 255;
    }

    update() {
      this.r += 2;
      this.alpha -= 1;
    }

    show() {
      p.stroke(0, 0, 255, this.alpha);
      p.ellipse(this.x, this.y, this.r * 2, this.r * 2);
    }
  }
};

// Third sketch: Expanding and fading shapes (ellipses, rectangles, polygons)
let sketch3 = function(p) {
  let shapes = [];

  p.setup = function() {
    p.createCanvas(400, 400);
    p.noFill();
  };

  p.draw = function() {
    p.background(255, 255, 0, 25);
    
    if (p.frameCount % 15 === 0) {
      shapes.push(new Shape());
    }

    for (let i = shapes.length - 1; i >= 0; i--) {
      shapes[i].update();
      shapes[i].display();
      if (shapes[i].alpha <= 0) {
        shapes.splice(i, 1);
      }
    }
  };

  class Shape {
    constructor() {
      this.x = p.width / 2;
      this.y = p.height / 2;
      this.size = 0;
      this.maxSize = p.width * p.random(0.5, 1);
      this.expansionRate = this.maxSize / p.random(30, 180);
      this.alpha = 255;
      this.shapeType = p.int(p.random(0, 3));
      this.sides = p.int(p.random(3, 8));
      this.rotation = 0;
      this.rotationSpeed = p.random(-0.05, 0.05);
    }

    update() {
      this.size += this.expansionRate;
      this.alpha = p.map(this.size, 0, this.maxSize, 255, 0);
      this.rotation += this.rotationSpeed;
    }

    display() {
      p.stroke(240, 255, 255, this.alpha);
      p.strokeWeight(2);
      p.push();
      p.translate(this.x, this.y);
      p.rotate(this.rotation);
      if (this.shapeType === 0) {
        p.ellipse(0, 0, this.size, this.size);
      } else if (this.shapeType === 1) {
        p.rectMode(p.CENTER);
        p.rect(0, 0, this.size, this.size);
      } else if (this.shapeType === 2) {
        polygon(0, 0, this.size / 2, this.sides);
      }
      p.pop();
    }
  }

  function polygon(x, y, radius, npoints) {
    let angle = p.TWO_PI / npoints;
    p.beginShape();
    for (let a = 0; a < p.TWO_PI; a += angle) {
      let sx = x + p.cos(a) * radius;
      let sy = y + p.sin(a) * radius;
      p.vertex(sx, sy);
    }
    p.endShape(p.CLOSE);
  }
};

// Fourth sketch: Stacking rectangles with angles moving frantically
let sketch4 = function(p) {
  let rectangles = [];
  let maxRectangles = 500;
  let angle = 25;
  let franticness = 1;

  p.setup = function() {
    p.createCanvas(400, 400);
    p.angleMode(p.DEGREES);
    p.noFill();
  };

  p.draw = function() {
    p.background(255);
    if (rectangles.length < maxRectangles) {
      let newRectangle = {
        x: p.random(p.width),
        y: p.random(p.height),
        angle: angle + p.random(-5, 5),
        w: p.random(30, 400),
        h: p.random(20, 360)
      };
      rectangles.push(newRectangle);
    }

    for (let r of rectangles) {
      p.push();
      p.translate(r.x, r.y);
      p.rotate(r.angle);
      p.stroke(0);
      p.rect(0, 0, r.w, r.h);
      p.pop();
      r.x += p.random(-franticness, franticness);
      if (franticness < 10) {
        franticness = p.map(rectangles.length, 0, maxRectangles, 1, 10);
      }
    }

    rectangles = rectangles.filter(rect => rect.x + rect.w > 0 && rect.x < p.width);
  };
};

// Fifth sketch: Falling rectangles affected by wind speed
let sketch5 = function(p) {
  let rectangles = [];

  p.setup = function() {
    p.createCanvas(400, 400);
    for (let i = 0; i < 10; i++) {
      rectangles.push(new FallingRectangle());
    }
  };

  p.draw = function() {
    p.background(255, 190, 200);
    for (let i = rectangles.length - 1; i >= 0; i--) {
      let rect = rectangles[i];
      rect.update();
      rect.display();
      if (rect.isOffScreen()) {
        rectangles.splice(i, 1);
      }
    }
    if (p.random(1) < 0.05) {
      rectangles.push(new FallingRectangle());
    }
  };

  class FallingRectangle {
    constructor() {
      this.x = p.random(p.width);
      this.y = -p.random(50, 150);
      this.w = p.random(30, 100);
      this.h = p.random(20, 80);
      this.speed = p.random(1, 3);
      this.acceleration = p.random(0.02, 0.05);
      this.alpha = 255;
      this.alphaDecreaseRate = p.random(1, 3);
      this.windSpeed = p.random(0.5, 2);
      this.dimensionChangeRate = p.random(-2, 2);
    }

    update() {
      this.y += this.speed;
      this.x += this.windSpeed;
      this.speed += this.acceleration;
      this.alpha -= this.alphaDecreaseRate;
      this.w += this.dimensionChangeRate * p.random(0.5, 2);
      this.h += this.dimensionChangeRate * p.random(0.5, 2);
      this.w = p.max(this.w, 5);
      this.h = p.max(this.h, 5);
    }

    display() {
      p.stroke(150, 255, 255, this.alpha);
      p.noFill();
      p.rect(this.x, this.y, this.w, this.h);
    }

    isOffScreen() {
      return this.y > p.height || this.x > p.width || this.alpha <= 0;
    }
  }
};

let sketch6 = function (p) {
  let particles = [];
  let particleCount = 25;

  p.setup = function () {
    p.createCanvas(400, 400);
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle(p.random(p.width), p.random(p.height)));
    }
  };

  p.draw = function () {
    p.background(0, 0, 0, 20);

    // Draw red lines between close particles
    p.stroke(150, 255, 0);
    p.strokeWeight(1);
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        let d = p.dist(particles[i].x, particles[i].y, particles[j].x, particles[j].y);
        if (d < 100) {  // Draw lines between particles closer than 100 pixels
          p.line(particles[i].x, particles[i].y, particles[j].x, particles[j].y);
        }
      }
    }

    // Update and display all particles
    for (let particle of particles) {
      particle.update();
      particle.display();
    }
  };

  class Particle {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.targetX = x;
      this.targetY = y;
      this.size = 5;
      this.lerpSpeed = 0.005;  // Speed at which particles move toward their target positions
    }

    update() {
      // Move particle toward its target position
      this.x = p.lerp(this.x, this.targetX, this.lerpSpeed);
      this.y = p.lerp(this.y, this.targetY, this.lerpSpeed);
      
      // If particle reaches its target, assign a new random target
      if (p.dist(this.x, this.y, this.targetX, this.targetY) < 1) {
        this.targetX = p.random(p.width);
        this.targetY = p.random(p.height);
      }
    }

    display() {
      // Draw the particle as a small red dot
      p.noStroke();
      p.fill(180, 255, 0);
      p.ellipse(this.x, this.y, this.size);
    }
  }
};


// Create instances of all five sketches
let myp5_1 = new p5(sketch1);
let myp5_2 = new p5(sketch2);
let myp5_3 = new p5(sketch3);
let myp5_4 = new p5(sketch4);
let myp5_5 = new p5(sketch5);
let myp5_6 = new p5(sketch6);
