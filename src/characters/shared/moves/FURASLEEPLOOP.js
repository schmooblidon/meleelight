export default {
  name : "FURASLEEPLOOP",
  canEdgeCancel : true,
  canBeGrabbed : true,
  init : function(p){
    player[p].actionState = "FURASLEEPLOOP";
    player[p].timer = 0;
    aS[cS[p]].FURASLEEPLOOP.main(p);
  },
  main : function(p){
    player[p].timer++;
    if (!aS[cS[p]].FURASLEEPLOOP.interrupt(p)){
      player[p].phys.stuckTimer--;
      var originalColour = palettes[pPal[p]][0];
      originalColour = originalColour.substr(4,originalColour.length-5);
      var colourArray = originalColour.split(",");
      //rgb(207, 45, 190)
      var part = player[p].timer%30;
      if (part < 25){
        player[p].colourOverlayBool = true;
        if (part < 13){
          var newCol = blendColours(colourArray,[207,45,190],Math.min(1,part/12));
        }
        else {
          var newCol = blendColours(colourArray,[207,45,190],Math.max(0,1-(part-12/12)));
        }
        player[p].colourOverlay = "rgb("+newCol[0]+","+newCol[1]+","+newCol[2]+")";
      }
      else {
        player[p].colourOverlayBool = false;
      }
    }
  },
  interrupt : function(p){
    if (player[p].phys.stuckTimer <= 0){
      player[p].colourOverlayBool = false;
      aS[cS[p]].FURASLEEPEND.init(p);
      return true;
    }
    else if (player[p].timer > frames[cS[p]].FURASLEEPLOOP){
      player[p].timer = 1;
      player[p].colourOverlayBool = false;
      return false;
    }
    else {
      return false;
    }
  }
};

