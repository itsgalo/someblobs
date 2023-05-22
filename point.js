//point class for particle interactions
//office ca 2022
import Vector from './vec.js';

class Point {
  constructor(x, y, r, c) {
    this.pos = new Vector(x, y, 0);
    this.oldpos = new Vector(x, y, 0);
    this.vel = new Vector(0, 0, 0);
    this.pinned = false;
    this.grabbed = false;
    this.grabbable = false;
    this.friction = 0.999;
    this.bounce = 0.1; //hard bounce
    this.index = 0;
    this.isCollided = false;
    //this.groundFriction = 0.9;

    this.gravity = new Vector(0, 0.0, 0);

    this.radius = r//0.01;
    this.finalRad = r;
    this.color = c;
    this.mass = 1;
    this.rand = Math.random();
  }
  pin() {
    this.pinned = true;
    return this;
  }
  unpin() {
    this.pinned = false;
    return this;
  }
  applyImpulse(x, y, z) {
    this.applyForce(new Vector(x, y, z));
  }
  applyForce(f) {
    this.pos.addVector(f);
  }
  collide(otherPoints, i) {
    this.index = i;
    for (let p = 0; p < otherPoints.length; p++) {
      let other = otherPoints[p];
      if (other.index != this.index) {
        //let dist = Vector.distXY(bp.pos.x, pt.pos.x, bp.pos.y, pt.pos.y);
        let dx = Math.abs(other.pos.x - this.pos.x);
        let dy = Math.abs(other.pos.y - this.pos.y);
        let dist = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
        if (dist < this.radius + other.radius) {
          let newvel = this.pos.copy();
          newvel = newvel.subVector(other.pos);
          newvel = newvel.div(dist);
          newvel = newvel.mult(dist - (this.radius + other.radius))
          newvel = newvel.mult(-this.bounce);
          this.pos = this.pos.addVector(newvel);
          other.pos = other.pos.subVector(newvel);
        }
      }
    }
  }

  resolveBehaviors(p, radius = this.radius, strength = 1) {
    let delta = Vector.sub(this.pos, p.pos);
    let dist = delta.magnitudeSquared();
    let magR = radius * radius;
    if (dist < magR) {
      var f = delta.normalizeTo(1 - (dist / magR)).mult(strength);
      this.applyForce(f);
    }
  }

  update(c, mx, my, md) {
    if (this.pinned) return;
    if (this.grabbable && md) {
      this.grabbed = true;
    } else if (!md) {
      this.grabbed = false;
    }
    if (this.grabbed) {
      this.pos.x = mx;
      this.pos.y = my;
      this.oldpos.setXYZ(this.pos.x, this.pos.y, 0);
    } else {
      this.vel = Vector.sub(this.pos, this.oldpos);
      this.vel.mult(this.friction);

      this.oldpos.setXYZ(this.pos.x, this.pos.y, 0);
      this.pos.addVector(this.vel);
      this.pos.addVector(this.gravity);
    }
    if(this.radius < this.finalRad) {
      this.radius += 0.1;
      
    }
  }
  constrain(c, margin) {
    this.vel = Vector.sub(this.pos, this.oldpos);
    this.vel.mult(this.friction);

     if (this.pos.x > (c.width-margin) - this.radius) {
       this.pos.x = (c.width-margin) - this.radius;
       this.oldpos.x = this.pos.x + this.vel.x * this.restitution;
     }
     if (this.pos.x < this.radius+margin) {
       this.pos.x = this.radius+margin;
       this.oldpos.x = this.pos.x + this.vel.x * this.restitution;
     }
     if (this.pos.y > (c.height-margin) - this.radius) {
       this.pos.y = (c.height-margin) - this.radius;
       this.oldpos.y = this.pos.y + this.vel.y * this.restitution;
     }
     if (this.pos.y < this.radius+margin) {
       this.pos.y = this.radius+margin;
       this.oldpos.y = this.pos.y + this.vel.y * this.restitution;
     }
  }
  render(ctx) {
    ctx.beginPath();
    ctx.strokeStyle = this.color;
    ctx.arc(this.pos.x, this.pos.y, this.radius, 0, Math.PI * 2);
    ctx.stroke();
    ctx.closePath();
  }
}

export default Point;
