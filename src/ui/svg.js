type Style = { fillColour : void | string, strokeWidth : void | number, strokeColour : void | string, opacity: void | number };

function getSVGStyle ( style : Style ) : string {
  let svgFillStyle = "";
  let svgStrokeStyle = "";
  let opacity = 1;
  if (style.opacity !== undefined ) {
    opacity = style.opacity;
  }
  if (style.strokeWidth !== undefined && style.strokeColour !== undefined ) {
    svgStrokeStyle = "stroke:"+style.strokeColour.substring(0,7)+";stroke-width:"+style.strokeWidth+"px;stroke-linecap:round;stroke-linejoin:round;";
    if (style.strokeColour.length > 7) {
      const strokeOpacity = parseInt(style.strokeColour.substring(7,9), 16) / 255;
      svgStrokeStyle += "stroke-opacity:"+strokeOpacity;
    }
  }
  if (style.fillColour !== undefined ) {
    svgFillStyle = "fill:"+style.fillColour.substring(0,7)+";fill-rule=evenodd;";
    if (style.fillColour.length > 7) {
      const fillOpacity = parseInt(style.fillColour.substring(7,9),16) / 255;
      svgFillStyle += "fill-opacity:"+fillOpacity;
    }
  }
  return "opacity:"+opacity+""+svgFillStyle+""+svgStrokeStyle+"";
}

function makeIntoSVGPath ( id : string, path : string, style : Style, offset : void | Vec2D) : string {
  const style = getSVGStyle(style);
  let transform = "";
  if (offset !== undefined) {
    transform = " transform=\x22translate("+offset.x+","+offset.y+")\x22";
  }
  return "<path id=\x22"+id+"\x22 style=\x22"+style+"\x22 d=\x22"+path+"\x22"+transform+"/>";
}

function makeIntoSVGCircle ( id : string, center : Vec2D, radius : number, style : Style ) : string {
  const style = getSVGStyle(style);
  return "<circle id=\x22"+id+"\x22 style=\x22"+style+"\x22 cx=\x22"+center.x+"\x22 cy=\x22"+center.y+"\x22 r=\x22"+radius+"\x22 />";
}

function makeIntoSVGRect ( id : string, topLeft : Vec2D, width : number, height : number, style : Style ) : string {
  const style = getSVGStyle(style);
  return "<rect id=\x22"+id+"\x22 style=\x22"+style+"\x22 width=\x22"+width+"\x22 height=\x22"+height+"\x22 x=\x22"+topLeft.x+"\x22 y=\x22"+topLeft.y+"\x22 />";
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