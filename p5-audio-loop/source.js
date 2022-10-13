let song;
let bg;
let fft;
let particleArray = [];

function preload() {
    song = loadSound("p5/11212019.mp3");
    bg = loadImage('p5/1650405.jpeg');
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    angleMode(DEGREES);
    imageMode(CENTER);
    rectMode(CENTER);
    fft = new p5.FFT();

    bg.filter(BLUR, 6);
}
function draw() {
    background(0);
    
    translate(width / 2, height / 2);
    fft.analyze();
    amp = fft.getEnergy(20, 200);
    
    push();
    if (amp > 230) {
        rotate(random(-0.25, 0.25));
    }
    image(bg, 0, 0, width + 200, height + 100);
    pop();

    let alpha = map(amp, 0, 255, 180, 150);
    fill(0, alpha);
    noStroke();
    rect(0, 0, width, height);

    stroke(255); //white
    strokeWeight(3);
    noFill();

    let wave = fft.waveform()
    for (let j = -1; j <= 1; j+=2) {
        beginShape();
        for (let i = 0; i <= 180; i+=0.5) {
            let index = floor(map(i, 0, 180, 0, wave.length -1));

            let r = map(wave[index], -1, 1, 150, 350); // radius

            // let x = i;
            // let y = wave[index] * 300 + height / 2;
            let x = r * sin(i) * j;
            let y = r * cos(i);
            vertex(x, y);
        }
        endShape()
    }

    particleArray.push(new Particle());
    // looping backwards may lead to cleaner visual
    particleArray.forEach((particle, index) => {
        if (!particle.edges()) {
            particle.update(amp > 230);
            particle.show();
        } else {
            particleArray.splice(index, 1);
        }
    })
}

function mouseClicked() {
    if (song.isPlaying()) {
        song.pause();
        noLoop();
    } else {
        song.play();
        loop();
    }
}

class Particle {
    constructor() {
        this.pos = p5.Vector.random2D().mult(250);
        this.vel = createVector(0, 0);
        this.acc =  this.pos.copy().mult(random(0.0001, 0.00001));

        this.w = random(3, 5);
        this.color = [random(0, 255), random(0, 255), random(0, 255)]
    }
    show() {
        noStroke();
        fill(this.color);
        ellipse(this.pos.x, this.pos.y, this.w);
    }
    update(cond) {
        this.vel.add(this.acc);
        this.pos.add(this.vel);
        if (cond) {
            this.pos.add(this.vel);
            this.pos.add(this.vel);
            this.pos.add(this.vel);
        }
    }
    edges() {
        if (this.pos.x < -width/2 || this.pos.x > width/2 || this.pos.y < -height/2 || this.pos.y > height/2) {
            return true;
        } else {
            return false;
        }
    }
}