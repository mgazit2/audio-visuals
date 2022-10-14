let song;
let bg;
let fft;
let ball;
let amp = 1;
let theta = 0;
let xMult = 1, yMult = 1;
let particleArray = [];
fft = new p5.FFT();

let density, densitySlider;

function preload() {
    song = loadSound("p5/Flight.mp3");
    // = loadImage('p5/1650405.jpeg');
    ball = new SphereParticle();
}

function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL);
    angleMode(DEGREES);
    imageMode(CENTER);
    rectMode(CENTER);
    //colorMode(HSB);
    //bg.filter(BLUR, 6);
}
function draw() {
    background(0);
    theta+=0.5;
    fft.analyze();
    amp = fft.getEnergy(20, 200);

    let rotateXVal = (frameCount + amp)*0.05;
    let rotateYVal = (rotateXVal - amp)*2;
    let r = 50;
    for (let i=0; i < 2; i++) {
        push();
        for (let j=0; j < 10; j++) {
            stroke(199, 80, 85);
            strokeWeight(3);
            noFill();
            //rotateX(rotateXVal);
            rotateY(rotateYVal);
            rotateZ(frameCount * 0.002);
            translate(
                cos(frameCount * 0.001 + j)**1 * 100,
                cos(frameCount * 0.001 + j) * 100,
                i * 0.1
              );
            push();
            for (let phi=0; phi < floor(180); phi+=180/(amp/4)) {
                beginShape(amp > 200 ? POINTS : null);
                for (let theta=0; theta < floor(360); theta += 360/(amp/4)) {
                    //let x = r * cos(phi) * cos(theta) * sin(theta);
                    let x = amp <= 150 ? r * cos(phi) : r*cos(phi)*sin(theta);
                    let y = amp >= 150 && amp <= 200 ? r * sin(phi) * sin(theta) * cos(theta): r * sin(phi) * sin(theta);
                    let z = amp > 200 ? r * sin(phi) * cos(theta) * tan(phi/2) : r * sin(phi) * cos(theta);
                    vertex(x, y, z);
                }
                endShape(CLOSE);
            }
            pop();
        }
        pop();
    }
    // push(); // push()/pop() used to block off instructions to a specific entity
    // rotateX(rotateXVal);rotateY(rotateYVal);
    // ball.show();
    // ball.update();
    // pop();
    
    
    // push();
    // if (amp > 230) {
    //     rotate(random(-0.25, 0.25));
    // }
    // image(bg, 0, 0, width + 200, height + 100);
    // pop();

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
            let x = r * sin(i)**(yMult) * j;
            let y = r * cos(i)**xMult;
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

function keyPressed() {
    switch (keyCode) {
        case LEFT_ARROW:
            xMult-=2;
            yMult-=0.25;
            break;
        case RIGHT_ARROW:
            xMult+=2;
            yMult+=0.25;
            break;
        // case DOWN_ARROW:
        //     yMult == 1 ? null : yMult--;
        //     break;
        // case UP_ARROW:
        //     yMult++;
        //     break;
    }
}

class SphereParticle {
    constructor() {
        this.pos = p5.Vector.random3D().mult(250);
        this.vel = createVector(0, 0);
        this.acc = this.pos.copy().mult(random(0.0001, 0.00001));

        this.w = random(80, 160);
        this.color = [random(0, 255), random(0, 255), random(0, 255)];
    }
    show() {
        noStroke();
        //texture(bg);
        sphere(this.w);
    }
    update(){
    }
}

class Particle {
    constructor() {
        this.pos = p5.Vector.random3D().mult(250);
        this.vel = createVector(0, 0);
        this.acc =  this.pos.copy().mult(random(0.0001, 0.00001));

        this.w = random(3, 5);
        this.color = [random(0, 255), random(0, 255), random(0, 255)];
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