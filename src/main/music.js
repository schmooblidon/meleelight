/* eslint-disable no-undef */
import {masterVolume} from '../menus/audiomenu';

export class MusicManager {

  constructor() {
  }

  static menu = new Howl({
    src: ['music/menu.ogg'],
    volume: 1,
    html5: true,
    sprite: {
      menuStart: [0, 7425],
      menuLoop: [7425, 173500]
      //end - 181070
    },
    onend: function () {
      this.play("menuLoop");
    }
  })
  static battlefield = new Howl({
    src: ['music/battlefield.ogg'],
    sprite: {
      battlefieldStart: [0, 12366],
      battlefieldLoop: [12366, 184256]
      // 196622
    },
    volume: 1,
    html5: true,
    onend: function () {
      this.play("battlefieldLoop");
    }
  })
  static yStory = new Howl({
    src: ['music/yStory.ogg'],
    sprite: {
      yStoryStart: [0, 2957],
      yStoryLoop: [2957, 252182]
      // 255139
    },
    volume: 1,
    html5: true,
    onend: function () {
      this.play("yStoryLoop");
    }
  })
  static pStadium = new Howl({
    src: ['music/pStadium.ogg'],
    sprite: {
      pStadiumStart: [0, 1],
      pStadiumLoop: [0, 219496]
    },
    volume: 1,
    html5: true,
    onend: function () {
      this.play("pStadiumLoop");
    }
  })
  static dreamland = new Howl({
    src: ['music/dreamland.ogg'],
    sprite: {
      dreamlandStart: [0, 16320],
      dreamlandLoop: [16320, 194782]
      // end 211102
    },
    volume: 1,
    html5: true,
    onend: function () {
      this.play("dreamlandLoop");
    }
  })
  static targettest = new Howl({
    src: ['music/targettest.ogg'],
    sprite: {
      targettestStart: [0, 1],
      targettestLoop: [0, 224459]
      //224459
    },
    volume: 1,
    html5: true,
    onend: function () {
      this.play("targettestLoop");
    }
  })

  static whatisPlaying;

  static playLoop(track, sprite) {
    this.stopWhatisPlaying();
    console.log("starting sound");
    console.log(getStackTrace());
    console.log(track);
    track.play(sprite);
    this.whatisPlaying = track;
    console.log("now what is playing");
    console.log(this.whatisPlaying);
    console.log(this.whatisPlaying._src);
    console.log(this.whatisPlaying._state);
  }

  static playMenuLoop() {
    this.playLoop(this.menu, "menuStart");
  }

  static playBattleFieldLoop() {
    this.playLoop(this.battlefield, "battlefieldStart");
  }

  static playyStoryLoop() {
    this.playLoop(this.yStory, "yStoryStart");
  }

  static playpStadiumLoop() {
    this.playLoop(this.pStadium, "pStadiumStart");
  }

  static playDreamLandLoop() {
    this.playLoop(this.dreamland, "dreamlandStart");
  }

  static playTargetTestLoop() {
    this.playLoop(this.targettest, "targettestStart");
  }

  static isWhatisPlaying(track) {
    return this.whatisPlaying === track;
  }

  static setWhatisPlaying(track) {
    this.whatisPlaying = track;
  }

  static stopWhatisPlaying() {
    console.log("stopping sound");
    console.log(this.whatisPlaying);
    console.log(getStackTrace());

    if (!this.whatisPlaying) {
      return;
    }
    console.log(this.whatisPlaying._state);
    console.log(this.whatisPlaying._src);
    console.log("waiting to stop playing");
    while (this.whatisPlaying.playing()) {
      this.whatisPlaying.stop();
      console.log("confirmed stopped sound");
    }
    console.log("checking what sound after stop");
    console.log(this.whatisPlaying._state);
    console.log(this.whatisPlaying._src);
  }
}

function getStackTrace () {

  let stack;

  try {
    throw new Error('');
  }
  catch (error) {
    stack = error.stack || '';
  }

  stack = stack.split('\n').map((line) => line.trim());
  return stack.splice(stack[0] === 'Error' ? 2 : 1);
}