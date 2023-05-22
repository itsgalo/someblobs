//body class for physics interactions
//office ca 2022

import Point from './point.js';
import Spring from './spring.js';
import Vector from './vec.js';

class Body {
  constructor(points, springs, iterations, color, id, isBlob) {
    this.points = points;
    this.springs = springs;
    this.iterations = iterations || 4;
    this.id = id;
    this.others = [];
    this.targetVolume = this.getArea();
    this.color = color;
    if (isBlob) {
      for (let i = 0; i < this.points.length; i++){ //set i = 1 and length-1 for broken ends
        this.addBlobSprings(i);
      }
    }
  }

  addPoint(x, y, r, c) {
    this.points.push(new Point(x, y, r, c));
  }

  addSpring(p1, p2, stiffness, length, c) {
    //this.springs.push(new Spring(this.points[p1], this.points[p2], color, length));
    this.springs.push(new Spring(p1, p2, stiffness, length, c));
  }

  insertPoint() {
    //inserts new point and a set of springs
    let len = this.points[0].radius * 2;
    //first get midpoint
    //this.points.splice(this.points.indexOf(index), 1);

    let midPt = this.getMidpoint(this.points[0], this.points[this.points.length-1])
    let pt = new Point(midPt.x, midPt.y, this.points[0].radius, this.color);
    //this.addPoint(this.points[index].pos.x, this.points[index].pos.y, this.points[index].radius, this.color);
    this.points.push(pt);

    //reset the springs
    this.springs = [];
    //rebuild springs
    
    for (let i = 0; i < this.points.length-1; i++) {
      this.addSpring(this.points[i], this.points[i+1], 0.9, this.color, len);
    }
    this.addSpring(this.points[this.points.length-1], this.points[0], 0.9, this.color, len);

    for (let i = 0; i < this.points.length; i++){ //set i = 1 and length-1 for broken ends
      this.addBlobSprings(i);
    }
    //update area
    this.targetVolume *= 1.1;
  }

  removeSpring(sp) {
    this.springs.splice(this.springs.indexOf(sp), 1);
  }

  tear(threshold) {
    for (let i = 0; i < this.springs.length; i++) {
      // find the distance between two points
      let dx = this.springs[i].endPoint.pos.x - this.springs[i].startPoint.pos.x;
      let dy = this.springs[i].endPoint.pos.y - this.springs[i].startPoint.pos.y;
      let dist = Math.sqrt(dx * dx + dy * dy);
      if (dist > (threshold || 150)) { // remove if the dist is > than threshold
        this.removeSpring(this.springs[i]);
      }
    }
  }

  trackPoints(mx, my) {
    for (let i = 0; i < this.points.length; i++) {
      let dx = mx - this.points[i].pos.x;
      let dy = my - this.points[i].pos.y;
      if ((dx*dx) / Math.pow(this.points[i].radius, 2) + (dy*dy) / Math.pow(this.points[i].radius, 2) <= 1) {
        if (!this.points.find(e => e.grabbed == true)) {
          this.points[i].grabbable = true;
        }
      } else {
        this.points[i].grabbable = false;
      }
    }
  }

  collidePoints(otherBodies) {
    //loop through other bodies and push their points into temp array
    let otherPoints = [];
    for (let i = 0; i < otherBodies.length; i++) {
      if (otherBodies[i].id != this.id) {
        otherPoints.push(...otherBodies[i].points);
      }
    }
    this.others = otherPoints;

    //collide other bodies
    for (let i = 0; i < this.points.length; i++) {
      let pt = this.points[i];
      pt.collide(otherPoints, i);
      pt.collide(this.points, i);
    }
    
  }

  updatePoints(c, mx, my, md) {
    for (let i = 0; i < this.points.length; i++) {
      this.points[i].update(c, mx, my, md);
    }
  }

  updateSprings() {
    for (let i = 0; i < this.springs.length; i++) {
      this.springs[i].update();
    }
  }

  updateConstraints(c, m) {
    for (let i = 0; i < this.points.length; i++) {
      this.points[i].constrain(c, m);
    }
  }

  renderPoints(ctx) {
    for (let i = 0; i < this.points.length; i++) {
      this.points[i].render(ctx);
    }
  }
  renderSprings(ctx) {
    //render springs
    for (let i = 0; i < this.springs.length; i++) {
      this.springs[i].render(ctx);
    }
  }
  renderShape(ctx) {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    for(let i = 0; i < this.points.length; i++) {      
      ctx.lineTo(this.points[i].pos.x, this.points[i].pos.y);
    }
    //ctx.closePath();
    ctx.fill();
  }

  //blob joint code
  getArea() {
    let area = 0;
    area += this.points[this.points.length-1].pos.x
        * this.points[0].pos.y
        - this.points[0].pos.x
        * this.points[this.points.length-1].pos.y;

    for (let i = 0; i < this.points.length-1; i++){
      area += this.points[i].pos.x
            * this.points[i+1].pos.y
            - this.points[i+1].pos.x
            * this.points[i].pos.y;
    }
    area *= 0.5;
    return area;
  }
  getConnectedPts(index) {
      let previousPt, nextPt;
      // Find previous node, if there is one
      if(index == 0) {
        previousPt = this.points[this.points.length - 1];
      } else if(index >= 1) {
        previousPt = this.points[index - 1];
      }

      // Find next node, if there is one
      if(index == this.points.length - 1) {
        nextPt = this.points[0];
      } else if(index <= this.points.length - 1) {
        nextPt = this.points[index + 1];
      }

      return {
        previousPt,
        nextPt
      };
  }
  getMidpoint(pt1, pt2) {
    return new Vector((pt1.pos.x + pt2.pos.x) / 2, (pt1.pos.y + pt2.pos.y) / 2, 0);
  }
  applyRepulsion(index) {
    let neighbors = this.getConnectedPts(index);
    let dx = neighbors.previousPt.pos.x - neighbors.nextPt.pos.x;
    let dy = neighbors.previousPt.pos.y - neighbors.nextPt.pos.y;
    let norm = new Vector(-dy, dx, 0);

    this.points[index].pos.x += norm.x * 0.0001;//0.1-0.001
    this.points[index].pos.y += norm.y * 0.0001;//0.1-0.001

    //If we define dx = x2 - x1 and dy = y2 - y1, then the normals are (-dy, dx) and (dy, -dx).

  }
  addBlobSprings(index) {
    let neighbors = this.getConnectedPts(index);
    let dx = neighbors.previousPt.pos.x - neighbors.nextPt.pos.x;
    let dy = neighbors.previousPt.pos.y - neighbors.nextPt.pos.y;
    let d = neighbors.previousPt.pos.dist(neighbors.nextPt.pos)*2;
    this.springs.push(new Spring(neighbors.previousPt, neighbors.nextPt, 0.9, this.color, this.points[0].radius*4));
  }

  update(ctx, canvas, mx, my, md, bodyPoints) {
    if (this.getArea() < this.targetVolume*0.99) {
      for (let i = 0; i < this.points.length; i++){
          this.applyRepulsion(i);
      }
    }
    this.trackPoints(mx, my);
    this.updatePoints(canvas, mx, my, md);
    //this.tear(200);
    for (let j = 0; j < this.iterations; j++) {
      this.collidePoints(bodyPoints);
      this.updateSprings();
      this.updateConstraints(canvas, canvas.height/50);
    }

    //this.renderPoints(ctx);
    //this.renderSprings(ctx); //main spring renderer!
    this.renderShape(ctx);
  }
}

export default Body;
