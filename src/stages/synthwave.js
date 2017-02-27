import {bg1,bg2,fg1,fg2, ui} from "main/main";
import {Vec2D} from "main/util/Vec2D";
import {Vec3D, splatCoordinates, add} from "./3D";
import {chromaticAberration} from "main/vfx/chromaticAberration";
import {makeColour} from "main/vfx/makeColour";

const lines = [];
const hScale = 1;
const lineCount = 20;
const height = 1000;
const heightOffset = -500;
const speed = -0.04;
const focal = 1;

// camera data
const origin = new Vec3D(0,3,-5);
const direction = new Vec3D(0,0,1);
const right = new Vec3D(1,0,0);
const up = new Vec3D(0,1,0);

const offset = - height + height * lineCount * hScale / (focal + lineCount * hScale);

function tetrahedronAt(v) {
  return { edges    : [[0,1], [0,2], [1,2],[0,3],[1,3],[2,3]]
         , vertices : [ new Vec3D(1,0,0), new Vec3D(-0.5, 0, 0.866), new Vec3D(-0.5,0,-0.866), new Vec3D(0,0.866,0) ]
         , offset   : v
         , zmin : -0.866
         , zmax :  0.866 };
};

const objects = [ tetrahedronAt( new Vec3D(-4,0,15))
                , tetrahedronAt( new Vec3D(-3,10,24))
                , tetrahedronAt( new Vec3D(4,5,26))
                , tetrahedronAt( new Vec3D(2,-3,37)) ];

for (let i=0;i<lineCount;i++) {
  lines.push(i*hScale);
}

export function drawSynthWaveInit() {
  // sun
  // create gradient
  const top = 150;
  const topLine = top+60;
  const radius = 200;
  const bottom = 500;
  const sunGlow = bg1.createRadialGradient(600,top+radius,radius,600,top+radius,radius+60);
  sunGlow.addColorStop(0, "rgba(232, 76, 110, 0.4)");
  sunGlow.addColorStop(1, "rgba(142, 67, 168, 0)");
  bg1.fillStyle = sunGlow;
  bg1.fillRect(0,0,1200,750);
  const sunGrad = bg1.createLinearGradient(0, top, 0, top+radius*2);
  sunGrad.addColorStop(0, "rgba(250, 227, 59, 1)");
  sunGrad.addColorStop(0.5, "rgba(250, 97, 96, 1)");
  sunGrad.addColorStop(0.75, "rgba(250, 52, 104, 1)");
  sunGrad.addColorStop(1, "rgba(250, 60, 134, 1)");
  bg1.fillStyle = sunGrad;
  // creating clipping path
  const lineSeperation = 40;
  const thickness = 3;
  bg1.save();
  bg1.beginPath();
  bg1.moveTo(0,0);
  bg1.lineTo(1200,0);
  bg1.lineTo(1200,topLine);
  bg1.lineTo(0,topLine);
  for (let i=0;i<7;i++) {  
    bg1.moveTo(0,topLine+i*lineSeperation+i*thickness);
    bg1.lineTo(1200,topLine+i*lineSeperation+i*thickness);
    bg1.lineTo(1200,topLine+(i+1)*lineSeperation);
    bg1.lineTo(0,topLine+(i+1)*lineSeperation);
  }
  bg1.clip();
  // draw sun
  bg1.beginPath();
  bg1.arc(600,top+radius,radius,0,Math.PI*2);
  bg1.closePath();
  bg1.fill();
  bg1.restore();
  // draw screen over everything else
  fg1.globalCompositeOperation = "screen";
  const bgGrad = fg1.createLinearGradient(0, 0, 0, 750);
  bgGrad.addColorStop(0, "rgba(253, 117, 121, 0.6");
  bgGrad.addColorStop(0.6, "rgba(224, 36, 131, 0.6");
  fg1.fillStyle = bgGrad;
  fg1.fillRect(0,0,1200,750);
  fg1.globalCompositeOperation = "source-over";
}

export function drawSynthWave() {
  const col = { r : 130, g : 30, b : 190 };
  // draw vertical lines
  chromaticAberration( bg2, (c1,c2) => drawVertLines(c1), col, col, 1, new Vec2D(1.3,0) );
  // draw horizontal lines
  chromaticAberration( bg2, (c1,c2) => drawHorizLines(c1), col, col, 1, new Vec2D(0,1.3) );
  // thick line on the horizon, at y-coordinate height + heightOffset;
  bg2.lineWidth = 5;
  bg2.strokeStyle = makeColour(col.r, col.g, col.b, 1);
  const y = height + heightOffset;
  bg2.beginPath();
  bg2.moveTo(0,y);
  bg2.lineTo(1200,y);
  bg2.stroke();
  bg2.lineWidth = 2;
  bg2.strokeStyle = "#dc6eec";
  bg2.stroke();

  drawObjects(bg2, col);

  // move lines for the next frame
  for (let i=0;i<lineCount;i++) {
    lines[i] += speed;
    if (lines[i] < 0) {
      lines[i] = lineCount * hScale;
    }
    else if (lines[i] > lineCount * hScale) {
      lines[i] = 0;
    }
  }
  // move objects
  for (let o=0; o<objects.length; o++) {
    const obj = objects[o];
    if (obj.offset.z + obj.zmax < -6) {
      obj.offset.z += 20;
    }
    else if (obj.offset.z + obj.zmin > 60) {
      obj.offset.z -= 60;
    }
    else {
      obj.offset.z += speed;
    }
  }

}

function drawObjects(ctx, col) {  
  for (let o=0; o<objects.length; o++) {
    const obj = objects[o];
    chromaticAberration( bg2, (c1,c2) => drawObject(ctx, c1, obj), col, col, 1, new Vec2D(Math.max(0.1, 2-0.2*obj.offset.z),0) );
  }
}

function drawObject(ctx, col, obj) {
  ctx.lineWidth = Math.max(0.5,3-0.2*obj.offset.z);
  ctx.strokeStyle = col;
  ctx.beginPath();
  for (let e=0; e<obj.edges.length; e++) {
    const edge = obj.edges[e];
    const v1 = add(obj.vertices[edge[0]], obj.offset);
    const v2 = add(obj.vertices[edge[1]], obj.offset);
    const p1 = splatCoordinates(origin, direction, right, up, v1);
    const p2 = splatCoordinates(origin, direction, right, up, v2);
    if (p1 !== null && p2 !== null) {
      ctx.moveTo(600 + 166*p1.x, 300 - 166*p1.y);
      ctx.lineTo(600 + 166*p2.x, 300 - 166*p2.y);
    }
  }
  ctx.stroke();
}

function drawVertLines(col) {
  bg2.lineWidth = 3;
  bg2.strokeStyle = col;
  bg2.beginPath();
  for (let i=-12;i<13;i++) {
    bg2.moveTo(600+(1200/25)*i,height + heightOffset);
    bg2.lineTo(600+(1200/7)*i,750);
  }
  bg2.stroke();
}

function drawHorizLines(col) {
  bg2.lineWidth = 3;
  bg2.strokeStyle = col;
  bg2.beginPath();
  for (let i=0;i<lineCount;i++) {
    const y = projectedYCoord(lines[i]) ;
    bg2.moveTo(0   , y);
    bg2.lineTo(1200, y);
  }
  bg2.stroke();
}

function projectedYCoord ( y ) {
  return heightOffset + offset + 2 * height - height * y / (focal + y);
}