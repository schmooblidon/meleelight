// @flow
/* eslint indent:0*/ 

import {Box2D} from "../main/util/Box2D";
import {Vec2D} from "../main/util/Vec2D";
import {deepValue} from "../main/util/deepValue";
import {getConnected} from "../target/util/getConnected";

import type {Stage, Surface, Ledge} from "./stage";

export function createStageCode ( stage : Stage ) : string {
  let tCode = "";
  for (let i=0;i<stage.startingPoint.length;i++){
    tCode += stage.startingPoint[i].x.toFixed(2)+","+stage.startingPoint[i].y.toFixed(2);
    if (i !== stage.startingPoint.length - 1){
      tCode += "~";
    }
  }
  tCode += "&";
  if (stage.startingFace === undefined) {
    tCode += "1,1,1,1";
  }
  else {
    for (let i=0;i<stage.startingFace.length;i++) {
      tCode += stage.startingFace[i];
      if (i !== stage.startingFace.length - 1){
        tCode += ",";
      }
    }
  }
  const types = ["ground","ceiling","wallL","wallR","platform", "background.line"];
  for (let n=0;n<types.length;n++) {
    tCode += "&";
    const surfaces = deepValue(stage,types[n]);
    if (surfaces !== undefined) {
      for (let i=0; i<surfaces.length;i++) {
        const surface = surfaces[i];
        tCode += surface[0].x.toFixed(2)+","+surface[0].y.toFixed(2)+","+surface[1].x.toFixed(2)+","+surface[1].y.toFixed(2)+",";
        if (i !== 5) {
          if (surface[2]) {
            switch (surface[2].damageType) {
              case "fire":
                tCode += "1";
                break;
              case "electric":
                tCode += "2";
                break;
              case "slash":
                tCode += "3";
                break;
              case "darkness":
                tCode += "4";
                break;
              default:
                tCode += "0";
                break;
            }
          } 
          else {
            tCode += "0";
          }
        }
        if (i !== surfaces.length - 1){
          tCode += "~";
        }
      }
    }
  }
  const ptypes = ["polygon", "background.polygon"];
  for (let n=0; n < ptypes.length; n++) {
    tCode += "&";
    const polys = deepValue(stage, ptypes[n]);
    if (polys !== undefined) {
      for (let i=0;i<polys.length;i++) {
        const pts = polys[i];
        for (let j=0;j<pts.length;j++) {
          tCode += pts[j].x.toFixed(2)+","+pts[j].y.toFixed(2);
          if (j !== pts.length-1) {
            tCode += ",";
          }
        }
        if (i !== polys.length-1) {
          tCode += "~";
        }
      }
    }
  }
  tCode += "&";
  for (let i=0;i<stage.ledge.length;i++){
    tCode += stage.ledge[i][0][0]+","+stage.ledge[i][1]+","+stage.ledge[i][2];
    if (i !== stage.ledge.length - 1){
      tCode += "~";
    }
  }
  tCode += "&";
  if (stage.target !== undefined) {
    const targets = stage.target;
    for (let i=0;i<targets.length;i++){
      tCode += targets[i].x.toFixed(2)+","+targets[i].y.toFixed(2);
      if (i !== targets.length - 1){
        tCode += "~";
      }
    }
  }
  tCode += "&"+stage.blastzone.min.x.toFixed(2)+","+stage.blastzone.min.y.toFixed(2)+","+stage.blastzone.max.x.toFixed(2)+","+stage.blastzone.max.y.toFixed(2);
  tCode += "&"+stage.scale.toFixed(2);
  return tCode;
}

function parseVec2D( s1 : string, s2 : string) : Vec2D {
  return new Vec2D(parseFloat(s1),parseFloat(s2));
}

function parseBox2D ( s1 : string, s2 : string, s3 : string, s4 : string ) : Box2D {
  return new Box2D( [parseFloat(s1), parseFloat(s2)], [parseFloat(s3), parseFloat(s4)] );
}

function parseSurface ( s1 : string, s2 : string, s3 : string, s4 : string, s5 : void | string ) : Surface {
  let surfaceProperties;
  if (s5 !== undefined) {
    let damageType = null;
    switch(s5) {
      case "1":
        damageType = "fire";
        break;
      case "2":
        damageType = "electric";
        break;
      case "3":
        damageType = "slash";
        break;
      case "4":
        damageType = "darkness";
        break;
      default:
        break;
    }
    surfaceProperties = { damageType : damageType };
    return [parseVec2D(s1,s2), parseVec2D(s3,s4), surfaceProperties];
  }
  return [parseVec2D(s1,s2), parseVec2D(s3,s4)];
}


function parseLedge ( s1 : string, s2 : string, s3 : string) : Ledge {
  let side = parseInt(s3);
  if (side !== 0 && side !== 1) {
    side = 0;
  }
  if (s1[0] === "p") {
    return [ "platform", parseInt(s2), side ];
  }
  else {
    return [ "ground", parseInt(s2), side ];
  }
}

function parseSign ( s : string ) : 1 | -1 {
  const sign = parseInt(s);
  if ( sign === -1 ) {
    return -1;
  }
  else {
    return 1;
  }
}

function parsePolygon ( arr : Array<string> ) : Array<Vec2D> {
  const polygon = [];
  if (arr.length % 2 === 1) {
    return polygon;
  }
  for (let i = 0; 2*i < arr.length; i++) {
    polygon.push(parseVec2D(arr[2*i], arr[2*i+1]));
  }
  return polygon;
}

function sep(s:string, sep:string) : Array<string> {
  return (s === undefined || s === '') ? [] : s.split(sep);
}

export function parseStageCode ( code : string ) : null | Stage {
  const stage : Stage = { startingPoint:[]
                        , startingFace:[]
                        , respawnPoints:[]
                        , respawnFace:[]
                        , box:[]
                        , polygon:[]
                        , polygonMap:[]
                        , ground:[]
                        , ceiling:[]
                        , wallL:[]
                        , wallR:[]
                        , platform:[]
                        , ledge:[]
                        , ledgePos:[]
                        , target:[]
                        , scale:3
                        , blastzone:new Box2D([-250,-250],[250,250])
                        , offset:[600,375]
                        , connected:[[],[]]
                        , background : { polygon : [], line : []}
                        };

  const objects = code.split("&");

  if (code.length < 14) {
    return null;
  }

  try {
    
    let stageBG = stage.background;
    // to please the type-checker
    if (stageBG === null || stageBG === undefined) {
      stage.background = { polygon : [], line : [] };
      stageBG = stage.background;
    }

    stage.startingPoint = sep(objects[0 ],'~').map((s) => parseVec2D  (...sep(s,',')));
    stage.startingFace  = sep(objects[1 ],',').map((s) => parseSign   (   s         ));
    stage.ground        = sep(objects[2 ],'~').map((s) => parseSurface(...sep(s,',')));
    stage.ceiling       = sep(objects[3 ],'~').map((s) => parseSurface(...sep(s,',')));
    stage.wallL         = sep(objects[4 ],'~').map((s) => parseSurface(...sep(s,',')));
    stage.wallR         = sep(objects[5 ],'~').map((s) => parseSurface(...sep(s,',')));
    stage.platform      = sep(objects[6 ],'~').map((s) => parseSurface(...sep(s,',')));
    stageBG.line        = sep(objects[7 ],'~').map((s) => parseSurface(...sep(s,',')));
    stage.polygon       = sep(objects[8 ],'~').map((s) => parsePolygon(   sep(s,',')));
    stageBG.polygon     = sep(objects[9 ],'~').map((s) => parsePolygon(   sep(s,',')));
    stage.ledge         = sep(objects[10],'~').map((s) => parseLedge  (...sep(s,',')));
    stage.target        = sep(objects[11],'~').map((s) => parseVec2D  (...sep(s,',')));
    stage.blastzone     = parseBox2D(...sep(objects[12],',')) || new Box2D([-250,-250],[250,250]);
    stage.scale         = parseFloat(objects[13]) || 3;

    stage.ledgePos = (stage.ledge).map((l) => stage[l[0]][l[1]][l[2]] );
    stage.connected = getConnected(stage);
    stage.respawnPoints = stage.startingPoint;
    stage.respawnFace = stage.startingFace;
    if (stage.polygon === undefined) {
      console.log("error in 'parseStageCode': undefined polygon array");
      return null;
    }
    stage.polygonMap = stage.polygon.map((p) => null);

  }
  catch (error) {
    console.log("error in 'parseStageCode': "+error);
    return null;
  }

  if (stage.startingPoint === undefined || stage.startingPoint.length < 1) {
    console.log("error in 'parseStageCode': missing starting point");
    return null;
  }

  return stage;
}