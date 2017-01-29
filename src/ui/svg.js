// @flow

import {Vec2D} from "../main/util/Vec2D";

type Style = { fillColour : void | string, strokeWidth : void | number, strokeColour : void | string, opacity: void | number };
type Rect = { width : number, height : number, topLeft : void | Vec2D, rounded : Vec2D };
type Circle = { center : Vec2D, radius : number };

type Transform = { kind : "translate", vector : Vec2D }
               | { kind : "scale", scale : Vec2D }
               | { kind : "rotate", angle : number, center : void | Vec2D }
               | { kind : "matrix", matrix : [[number,number],[number,number]], translate: void | Vec2D }

function getSVGTransform (transform : void | Transform) : string {
  let output = "";
  if ( transform !== undefined) {
    if (transform.kind === "translate") {
      output = "transform=\x22translate("+transform.vector.x+","+transform.vector.y+")\x22";
    }
    else if (transform.kind === "scale") {
      output = "transform=\x22scale("+transform.scale.x+","+transform.scale.y+")\x22";
    }
    else if (transform.kind === "rotate") {
      let center = "";
      if (transform.center !== undefined) {
        center = ","+transform.center.x+","+transform.center.y;
      }
      output = "transform=\x22rotate("+transform.angle+""+center+")\x22";
    }
    else if (transform.kind === "matrix") {
      let vector = ",0,0";
      if (transform.translate !== undefined) {
        vector = ","+transform.translate.x+","+transform.translate.y;
      }
      output = "transform=\x22matrix("+transform.matrix[0][0]+","+transform.matrix[1][0]+","+transform.matrix[0][1]+","+transform.matrix[1][1]+""+vector+")\x22";
    }
  }
  return output;
}

function getSVGStyle ( style : Style ) : string {
  let svgFillStyle = "";
  let svgStrokeStyle = "";
  let opacity = 1;
  if (style.opacity !== undefined ) {
    opacity = style.opacity;
  }
  if (style.strokeWidth !== undefined && style.strokeColour !== undefined ) {
    const strokeWidth = style.strokeWidth;
    const strokeColour = style.strokeColour;
    svgStrokeStyle = "stroke:"+style.strokeColour.substring(0,7)+";stroke-width:"+strokeWidth+"px;stroke-linecap:round;stroke-linejoin:round;";
    if (strokeColour.length > 7) {
      const strokeOpacity = parseInt(strokeColour.substring(7,9), 16) / 255;
      svgStrokeStyle += "stroke-opacity:"+strokeOpacity;
    }
  }
  if (style.fillColour !== undefined ) {
    const fillColour = style.fillColour;
    svgFillStyle = "fill:"+fillColour.substring(0,7)+";fill-rule=evenodd;";
    if (fillColour.length > 7) {
      const fillOpacity = parseInt(fillColour.substring(7,9),16) / 255;
      svgFillStyle += "fill-opacity:"+fillOpacity;
    }
  }
  return "opacity:"+opacity+""+svgFillStyle+""+svgStrokeStyle+"";
}

function makeIntoSVGPath ( id : string, path : string, style : Style, offset : void | Vec2D) : string {
  const svgStyle = getSVGStyle(style);
  let transform = "";
  if (offset !== undefined) {
    transform = " transform=\x22translate("+offset.x+","+offset.y+")\x22";
  }
  return "<path id=\x22"+id+"\x22 style=\x22"+svgStyle+"\x22 d=\x22"+path+"\x22"+transform+"/>";
}

function makeIntoSVGCircle ( id : string, circle : Circle, style : Style ) : string {
  const svgStyle = getSVGStyle(style);
  return "<circle id=\x22"+id+"\x22 style=\x22"+svgStyle+"\x22 cx=\x22"+circle.center.x+"\x22 cy=\x22"+circle.center.y+"\x22 r=\x22"+circle.radius+"\x22 />";
}

function makeIntoSVGRect ( id : string, rect : Rect, style : Style ) : string {
  const svgStyle = getSVGStyle(style);
  let topLeft = "";
  if (rect.topLeft !== undefined) {
    topLeft = "x=\x22"+rect.topLeft.x+"\x22 y=\x22"+rect.topLeft.y+"\x22";
  }
  let rounded = "";
  if (rect.rounded !== undefined) {
    rounded = "rx=\x22"+rect.rounded.x+"\x22 ry=\x22"+rect.rounded.y+"\x22";
  }
  return "<rect id=\x22"+id+"\x22 style=\x22"+svgStyle+"\x22 width=\x22"+rect.width+"\x22 height=\x22"+rect.height+""+topLeft+""+rounded+" />";
}


function includeSVG(id : string, width : number, height : number, svgData : string) : void {
  const iframe = document.getElementById(id);
  const svg = `
<head></head>
<body>
<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="`+width+`px" height="`+height+`px" xml:space="preserve" style="position:absolute">
`+svgData+`  
</body>`;
  const doc = iframe.contentWindow.document;
  doc.write(svg);
  doc.close();
};