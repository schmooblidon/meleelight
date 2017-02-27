import {bg1,bg2,fg1,fg2, ui} from "main/main";
import {Vec2D} from "main/util/Vec2D";
import {Vec3D, splatCoordinates, add} from "./3D";
import {chromaticAberration} from "main/vfx/chromaticAberration";
import {makeColour} from "main/vfx/makeColour";

const hScale = 0.8;
const hLineCount = 20;
const vScale = 2.5;
const vLineCount = 15; // number of vertical lines is actually 2*vLineCount+1
const height = 3;
const heightOffset = 497;
const speed = -0.04;
const focal = 5;

// camera data
const origin = new Vec3D(0,height,-focal);
const direction = new Vec3D(0,0,1);
const right = new Vec3D(1,0,0);
const up = new Vec3D(0,1,0);

const furthest = hLineCount*hScale-focal;

const offsetPoint1 = splatCoordinates(origin, direction, right, up, new Vec3D(0,0, 1e5));
const offsetPoint2 = splatCoordinates(origin, direction, right, up, new Vec3D(0,0, furthest));
const offset = offsetPoint1.y - offsetPoint2.y;

const horizonRightX = scaleToCanvas(splatCoordinates(origin, direction, right, up, new Vec3D(vScale*vLineCount,0, furthest))).x;

function tetrahedronAt(v) {
  return { edges    : [[0,1], [0,2], [1,2],[0,3],[1,3],[2,3]]
         , vertices : [ new Vec3D(1,0,0), new Vec3D(-0.5, 0, 0.866), new Vec3D(-0.5,0,-0.866), new Vec3D(0,0.866,0) ]
         , offset   : v
         , zmin : -0.866
         , zmax :  0.866 };
};

const objects = [ tetrahedronAt( new Vec3D(-6,0,15) )
                , tetrahedronAt( new Vec3D(-4,0,24) )
                , tetrahedronAt( new Vec3D(2 ,0,26) )
                , tetrahedronAt( new Vec3D(7 ,0,37) ) ];

// horizontal lines
for (let i=0;i<hLineCount;i++) {
  objects.push( { edges    : [[0,1]]
                , vertices : [ new Vec3D(-15*vScale,0,0), new Vec3D(15*vScale,0,0)]
                , offset   : new Vec3D(0,0,i*hScale-focal)
                , zmin : 0
                , zmax : 0 } );
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
  // horizon, at y-coordinate height + heightOffset;
  bg2.lineWidth = 3;
  bg2.strokeStyle = makeColour(col.r, col.g, col.b, 1);
  const y = height + heightOffset;
  bg2.beginPath();
  bg2.moveTo(1198-horizonRightX,y);
  bg2.lineTo(   2+horizonRightX,y);
  bg2.stroke();

  drawObjects(bg2, col);

  // move objects
  for (let o=0; o<objects.length; o++) {
    const obj = objects[o];
    if (obj.offset.z + obj.zmax < -focal) {
      obj.offset.z = furthest - obj.zmin;
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
      const sp1 = scaleToCanvas(p1);
      const sp2 = scaleToCanvas(p2);
      ctx.moveTo(sp1.x, sp1.y);
      ctx.lineTo(sp2.x, sp2.y);
    }
  }
  ctx.stroke();
}

function scaleToCanvas( v ) {
  return new Vec2D( 600+166*v.x
                  , height+heightOffset-166*(offset+v.y) );
}

function drawVertLines(col) {
  bg2.save();
  bg2.beginPath();
  bg2.moveTo(0,750);
  bg2.lineTo(1200,750);
  bg2.lineTo(1200, height + heightOffset);
  bg2.lineTo(0, height + heightOffset);
  bg2.clip();
  const sp2 = scaleToCanvas(offsetPoint1);
  bg2.lineWidth = 3;
  bg2.strokeStyle = col;
  bg2.beginPath();
  for (let i=-vLineCount;i<vLineCount+1;i++) {
    const p1 = splatCoordinates(origin, direction, right, up, new Vec3D(vScale*i,0,-focal+1));
    const sp1 = scaleToCanvas(p1);
    bg2.moveTo(sp1.x, sp1.y);
    bg2.lineTo(sp2.x, sp2.y);
  }
  bg2.stroke();
  bg2.restore();
}
