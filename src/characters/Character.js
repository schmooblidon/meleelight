import {deepCopyObject} from "../main/util/deepCopyObject";

function Character(charID)
{
    this.charID = charID;
}

Character.prototype.setHitBoxes = function(hitboxes)
{
    this.hitboxes = hitboxes;
};

Character.prototype.setOffsets = function(offsets)
{
    this.offsets = offsets;
};

Character.prototype.setCharAttributes = function(charAttributes)
{
    this.charAttributes = charAttributes;
};

Character.prototype.setIntangibility = function(intangibility)
{
    this.intangibility = intangibility;
};

Character.prototype.setFrames = function(framesData)
{
    this.framesData = framesData;
};

Character.prototype.setActionSounds = function(actionSounds)
{
    this.actionSounds = actionSounds;
};

Character.prototype.getEcB = function()
{
    return this.ecb;
};

Character.prototype.setEcbData = function(ecb)
{
    this.ecb = val;
};

Character.prototype.setupActionStates = function(actionStates)
{
    this.actionStates;
    deepCopyObject(true, this.actionStates, actionStates);
}

export default Character;