//general purpose vector class
//office ca 2022

class Vector {

  constructor(x, y, z) {
    this.x = x || 0;
    this.y = y || 0;
    this.z = z || 0;
  }
  //static functions are of the class itself, like P5.Vector. use Vector.zero();
  static zero() {
      return new Vector(0, 0, 0);
  }
  static fromAngle(t) {
      return new Vector(Math.cos(t), Math.sin(t))
  }
  static random2D() {
      return Vector.fromAngle(Math.random() * Math.PI * 2)
  }
  static add(t, e) {
      return new Vector(t.x + e.x, t.y + e.y, t.z + e.z)
  }
  static sub(t, e) {
      return new Vector(t.x - e.x, t.y - e.y, t.z - e.z)
  }
  static div(t, e) {
      return new Vector(t.x / e, t.y / e, t.z / e)
  }
  static mult(t, e) {
      return new Vector(t.x * e, t.y * e, t.z * e)
  }
  static angleBetween(t, e) {
      if (t.x == 0 && t.y == 0 && t.z == 0 || e.x == 0 && e.y == 0 && e.z == 0) return 0;
      let r = t.x * e.x + t.y * e.y + t.z * e.z,
          n = Math.sqrt(t.x * t.x + t.y * t.y + t.z * t.z),
          o = Math.sqrt(e.x * e.x + e.y * e.y + e.z * e.z),
          s = r / (n * o);
      return s <= -1 ? Math.PI : s >= 1 ? 0 : Math.acos(s)
  }
  static average(t) {
      if (t.length === 0) return;
      let e = new Vector;
      return t.forEach(r => e.addVector(r)), e.div(t.length), e;
  }
  static distXY(t1, t2, e1, e2) {
      let y = Math.abs(t2 - t1);
      let x = Math.abs(e2 - e1);
      return Math.sqrt(x * x + y * y);
  }
  dist(t) {
      let e = t.x - this.x;
      let r = t.y - this.y;
      let n = t.z - this.z;
      return Math.sqrt(e * e + r * r + n * n);
  }
  distXY(t, e) {
      let r = t - this.x;
      let n = e - this.y;
      return Math.sqrt(r * r + n * n);
  }
  addVector(t) {
      this.x += t.x;
      this.y += t.y;
      this.z += t.z;
      return this;
  }
  add(t, e, r) {
      this.x += t;
      this.y += e;
      this.z += r;
      return this;
  }
  subVector(t) {
      this.x -= t.x
      this.y -= t.y
      this.z -= t.z
      return this;
  }
  sub(t, e, r) {
      this.x -= t;
      this.y -= e;
      this.z -= r;
      return this;
  }
  mult(t) {
      this.x *= t;
      this.y *= t;
      this.z *= t;
      return this;
  }
  div(t) {
      this.x /= t;
      this.y /= t;
      this.z /= t;
      return this;
  }
  magnitude() {
      return Math.sqrt(this.x * this.x + this.y * this.y);
  }
  magnitudeSquared() {
      return this.x * this.x + this.y * this.y + this.z * this.z;
  }
  heading2D() {
      return Math.atan2(this.y, this.x)
  }
  normal() {
    let m = Math.sqrt(this.x*this.x + this.y*this.y);
	return new Vector(this.x/m, this.y/m, 0);
  }
  normalize() {
      let t = this.magnitude();
      this.div(t);
      return this;
      //return new Vector(this.x/(Math.sqrt(this.x * this.x + this.y * this.y)), this.y/(Math.sqrt(this.x * this.x + this.y * this.y)));
  }
  normalizeTo(length) {
    let mag = this.magnitude();
    if (mag > 0) {
      mag = length / mag;
      this.mult(mag);
    }
    return this;
  }
  setMag(t) {
      this.normalize();
      this.mult(t);
      return this;
  }
  copy() {
      return new Vector(this.x, this.y, this.z);
  }
  rotate(t, angle) {
      let radians = (Math.PI / 180) * angle;
      let cos = Math.cos(radians);
      let sin = Math.sin(radians);
      let nx = (cos * (this.x - t.x)) + (sin * (this.y - t.y)) + t.x;
      let ny = (cos * (this.y - t.y)) - (sin * (this.x - t.x)) + t.y;
      return new Vector(nx, ny, 0);
  }
  zero() {
      this.x = this.y = this.z = 0;
  }
  set(t, e, r) {
      this.x = t;
      this.y = e;
      this.z = r;
  }
  setFromVector(t) {
      this.x = t.x;
      this.y = t.y;
      this.z = t.z;
  }
  setXYZ(t, e, r) {
      this.x = t;
      this.y = e;
      this.z = r;
  }
  swapXY() {
      let t = this.x;
      this.x = this.y;
      this.y = t;
  }
  toString() {
      return "<" + this.x + ", " + this.y + ", " + this.z + ">";
  }
  dot(t) {
      let e = Vector.angleBetween(this, t);
      return this.magnitude() * t.magnitude() * Math.cos(e);
  }
  cross(t) {
      let e = Vector.angleBetween(this, t);
      return this.magnitude() * t.magnitude() * Math.sin(e);
  }
}

export default Vector;
