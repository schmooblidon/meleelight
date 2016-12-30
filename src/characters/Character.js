import {deepCopyObject} from "../main/util/deepCopyObject";

class Character
{
    constructor(charID)
    {
        this.charID = charID;
        this.hitboxes = null;
        this.offsets = null;
        this.charAttributes = null;
        this.intangibility = null;
        this.framesData = null;
        this.actionSounds = null;
        this.ecb = null;
        this.actionStates = null;
    }

    setHitBoxes(hitboxes)
    {
        this.hitboxes = hitboxes;
    };

    setOffsets(offsets)
    {
        this.offsets = offsets;
    };

    setCharAttributes(charAttributes)
    {
        this.charAttributes = charAttributes;
    };

    setIntangibility(intangibility)
    {
        this.intangibility = intangibility;
    };

    setFrames(framesData)
    {
        this.framesData = framesData;
    };

    setActionSounds(actionSounds)
    {
        this.actionSounds = actionSounds;
    };

    getEcB()
    {
        return this.ecb;
    };

    setEcbData(ecb)
    {
        this.ecb = val;
    };

    setupActionStates(actionStates)
    {
        deepCopyObject(true, this.actionStates, actionStates);
    }
}

module.exports = Character;