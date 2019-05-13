/* eslint-disable */

import {MusicManager} from "./music";

export const sounds = {
  menuBack: new Howl({
    src: ['sfx/menu-back.wav']
  }),
  menuForward: new Howl({
    src: ['sfx/menu-forward.wav']
  }),
  menuSelect: new Howl({
    src: ['sfx/menu-select.wav']
  }),
  marth: new Howl({
    src: ['sfx/marth.wav']
  }),
  ready: new Howl({
    src: ['sfx/ready.wav']
  }),
  go: new Howl({
    src: ['sfx/go.wav']
  }),
  game: new Howl({
    src: ['sfx/game.wav']
  }),
  dash: new Howl({
    src: ['sfx/dash.wav'],
    volume: 0.3
  }),
  tech: new Howl({
    src: ['sfx/tech.wav']
  }),
  airdodge: new Howl({
    src: ['sfx/airdodge.wav'],
    volume: 0.7
  }),
  dolphinSlash: new Howl({
    src: ['sfx/dolphin-slash.wav']
  }),
  dolphinSlash2: new Howl({
    src: ['sfx/dolphin-slash2.wav']
  }),
  grab: new Howl({
    src: ['sfx/grab.wav'],
    volume: 0.5
  }),
  grabbed: new Howl({
    src: ['sfx/grabbed.wav']
  }),
  jump: new Howl({
    src: ['sfx/jump.wav'],
    volume: 0.7
  }),
  jump2: new Howl({
    src: ['sfx/jump2.wav'],
    volume: 0.4
  }),
  kill: new Howl({
    src: ['sfx/kill.wav']
  }),
  land: new Howl({
    src: ['sfx/land.wav'],
    volume: 0.7
  }),
  ledgegrab: new Howl({
    src: ['sfx/ledgegrab.wav'],
    volume: 0.7
  }),
  powershield: new Howl({
    src: ['sfx/powershield.wav']
  }),
  powershieldreflect: new Howl({
    src: ['sfx/powershieldreflect.wav']
  }),
  roll: new Howl({
    src: ['sfx/roll.wav']
  }),
  shieldbreak: new Howl({
    src: ['sfx/shieldbreak.wav']
  }),
  shieldup: new Howl({
    src: ['sfx/shieldup.wav'],
    volume: 0.7
  }),
  swordsheath: new Howl({
    src: ['sfx/swordsheath.wav'],
    volume: 0.7
  }),
  sworddraw: new Howl({
    src: ['sfx/sworddraw.wav'],
    volume: 0.7
  }),
  fastfall: new Howl({
    src: ['sfx/fastfall.wav'],
    volume: 0.4
  }),
  spotdodge: new Howl({
    src: ['sfx/spotdodge.wav']
  }),
  dancingBlade: new Howl({
    src: ['sfx/dancing-blade.wav']
  }),
  dancingBlade2: new Howl({
    src: ['sfx/dancing-blade2.wav']
  }),
  shieldoff: new Howl({
    src: ['sfx/shieldoff.wav'],
    volume: 0.4
  }),
  runbrake: new Howl({
    src: ['sfx/runbrake.wav']
  }),
  shout1: new Howl({
    src: ['sfx/shout1.wav']
  }),
  shout2: new Howl({
    src: ['sfx/shout2.wav']
  }),
  shout3: new Howl({
    src: ['sfx/shout3.wav']
  }),
  shout4: new Howl({
    src: ['sfx/shout4.wav']
  }),
  shout5: new Howl({
    src: ['sfx/shout5.wav']
  }),
  shout6: new Howl({
    src: ['sfx/shout6.wav']
  }),
  shout7: new Howl({
    src: ['sfx/shout7.wav']
  }),
  shout8: new Howl({
    src: ['sfx/shout8.wav']
  }),
  sword1: new Howl({
    src: ['sfx/sword1.wav'],
    volume: 0.7
  }),
  sword2: new Howl({
    src: ['sfx/sword2.wav'],
    volume: 0.7
  }),
  sword3: new Howl({
    src: ['sfx/sword3.wav'],
    volume: 0.7
  }),
  footstep: new Howl({
    src: ['sfx/footstep.wav']
  }),
  smashcharge: new Howl({
    src: ['sfx/smashcharge.wav']
  }),
  deathShout: new Howl({
    src: ['sfx/death.wav']
  }),
  walljump: new Howl({
    src: ['sfx/walljump.wav']
  }),
  weakhurt: new Howl({
    src: ['sfx/weakhurt.wav']
  }),
  stronghurt: new Howl({
    src: ['sfx/stronghurt.wav']
  }),
  swordweakhit: new Howl({
    src: ['sfx/swordweakhit.wav'],
    volume: 0.5
  }),
  swordmediumhit: new Howl({
    src: ['sfx/swordmediumhit.wav'],
    volume: 0.5
  }),
  swordstronghit: new Howl({
    src: ['sfx/swordstronghit.wav'],
    volume: 0.5
  }),
  swordreallystronghit: new Howl({
    src: ['sfx/swordreallystronghit.wav'],
    volume: 0.7
  }),
  stronghit: new Howl({
    src: ['sfx/stronghit.wav']
  }),
  strongerhit: new Howl({
    src: ['sfx/strongerhit.wav']
  }),
  normalweakhit: new Howl({
    src: ['sfx/normalweakhit.wav']
  }),
  cheer: new Howl({
    src: ['sfx/cheer.wav']
  }),
  lowdown: new Howl({
    src: ['sfx/lowdown.wav']
  }),
  bounce: new Howl({
    src: ['sfx/bounce.wav']
  }),
  pause: new Howl({
    src: ['sfx/pause.wav']
  }),
  furacry: new Howl({
    src: ['sfx/furacry.wav'],
    volume: 0.4
  }),
  furaloop: new Howl({
    src: ['sfx/furaloop.wav'],
    loop: true
  }),
  parry: new Howl({
    src: ['sfx/parry.wav']
  }),
  blunthit: new Howl({
    src: ['sfx/blunthit.wav'],
    volume: 0.7
  }),
  clank: new Howl({
    src: ['sfx/clank.wav']
  }),
  deny: new Howl({
    src: ['sfx/deny.wav']
  }),
  targetBreak: new Howl({
    src: ['sfx/target-break.wav']
  }),
  complete: new Howl({
    src: ['sfx/complete.wav']
  }),
  newRecord: new Howl({
    src: ['sfx/new-record.wav']
  }),
  failure: new Howl({
    src: ['sfx/failure.wav']
  }),
  time: new Howl({
    src: ['sfx/time.wav']
  }),
  puffshout1: new Howl({
    src: ['sfx/puffshout1.wav']
  }),
  puffshout2: new Howl({
    src: ['sfx/puffshout2.wav']
  }),
  puffshout3: new Howl({
    src: ['sfx/puffshout3.wav']
  }),
  puffshout4: new Howl({
    src: ['sfx/puffshout4.wav']
  }),
  puffshout5: new Howl({
    src: ['sfx/puffshout5.wav']
  }),
  rest1: new Howl({
    src: ['sfx/rest1.wav']
  }),
  rest2: new Howl({
    src: ['sfx/rest2.wav']
  }),
  restbubbles: new Howl({
    src: ['sfx/restbubbles.wav']
  }),
  sing1: new Howl({
    src: ['sfx/sing1.wav']
  }),
  sing2: new Howl({
    src: ['sfx/sing2.wav']
  }),
  puffdeath: new Howl({
    src: ['sfx/puffkill.wav']
  }),
  normalswing1: new Howl({
    src: ['sfx/normalswing1.wav'],
    volume: 0.5
  }),
  normalswing2: new Howl({
    src: ['sfx/normalswing2.wav'],
    volume: 0.5
  }),
  puffledgegrab: new Howl({
    src: ['sfx/puffledgegrab.wav'],
    volume: 0.7
  }),
  normalmediumhit: new Howl({
    src: ['sfx/normalmediumhit.wav']
  }),
  normalstronghit: new Howl({
    src: ['sfx/normalstronghit.wav']
  }),
  bathit: new Howl({
    src: ['sfx/bathit.wav']
  }),
  fireweakhit: new Howl({
    src: ['sfx/fireweakhit.wav']
  }),
  firemediumhit: new Howl({
    src: ['sfx/firemediumhit.wav']
  }),
  firestronghit: new Howl({
    src: ['sfx/firestronghit.wav'],
    volume: 0.6
  }),
  jigglypuff: new Howl({
    src: ['sfx/jigglypuff.wav']
  }),
  foxairdodge: new Howl({
    src: ['sfx/foxairdodge.wav']
  }),
  foxjump: new Howl({
    src: ['sfx/foxjump.wav']
  }),
  foxshine: new Howl({
    src: ['sfx/foxshine.wav']
  }),
  foxshout1: new Howl({
    src: ['sfx/foxshout1.wav']
  }),
  foxshout2: new Howl({
    src: ['sfx/foxshout2.wav']
  }),
  foxshout3: new Howl({
    src: ['sfx/foxshout3.wav']
  }),
  foxshout4: new Howl({
    src: ['sfx/foxshout4.wav']
  }),
  foxshout5: new Howl({
    src: ['sfx/foxshout5.wav']
  }),
  foxupbburn: new Howl({
    src: ['sfx/foxupbburn.wav']
  }),
  foxupbshout: new Howl({
    src: ['sfx/foxupbshout.wav']
  }),
  foxillusion1: new Howl({
    src: ['sfx/foxillusion1.wav']
  }),
  foxillusion2: new Howl({
    src: ['sfx/foxillusion2.wav']
  }),
  foxcliffcatch: new Howl({
    src: ['sfx/foxcliffcatch.wav']
  }),
  foxupblaunch: new Howl({
    src: ['sfx/foxupblaunch.wav']
  }),
  foxlasercock: new Howl({
    src: ['sfx/foxlasercock.wav']
  }),
  foxlaserfire: new Howl({
    src: ['sfx/foxlaserfire.wav']
  }),
  foxlaserholster: new Howl({
    src: ['sfx/foxlaserholster.wav']
  }),
  foxfura: new Howl({
    src: ['sfx/foxfura.wav']
  }),
  foxdeath: new Howl({
    src: ['sfx/foxdeath.wav']
  }),
  foxweakhurt: new Howl({
    src: ['sfx/foxweakhurt.wav']
  }),
  foxstronghurt: new Howl({
    src: ['sfx/foxstronghurt.wav']
  }),
  star: new Howl({
    src: ['sfx/star.wav']
  }),
  vcancel: new Howl({
    src: ['sfx/vcancel.wav']
  }),
  outofcamera: new Howl({
    src: ['sfx/outofcamera.wav']
  }),
  fox: new Howl({
    src: ['sfx/fox.wav']
  }),
  rolloutshout: new Howl({
    src: ['sfx/rolloutshout.wav']
  }),
  rollouttickground: new Howl({
    src: ['sfx/rollouttickground.wav']
  }),
  rollouttickair: new Howl({
    src: ['sfx/rollouttickair.wav']
  }),
  rolloutlaunch: new Howl({
    src: ['sfx/rolloutlaunch.wav']
  }),
  rollouthit: new Howl({
    src: ['sfx/rollouthit.wav']
  }),
  shieldbreaker1: new Howl({
    src: ['sfx/shieldbreaker1.wav']
  }),
  shieldbreaker2: new Howl({
    src: ['sfx/shieldbreaker2.wav']
  }),
  shieldbreakershout: new Howl({
    src: ['sfx/shieldbreakershout.wav']
  }),
  shieldbreakercharge: new Howl({
    src: ['sfx/shieldbreakercharge.wav']
  }),
  marthcounter: new Howl({
    src: ['sfx/marthcounter.wav']
  }),
  marthcountershout: new Howl({
    src: ['sfx/marthcountershout.wav']
  }),
  marthcounterclank: new Howl({
    src: ['sfx/marthcounterclank.wav'],
    volume: 0.6
  }),
  puffhurt: new Howl({
    src: ['sfx/puffhurt.wav']
  }),
  electricfizz: new Howl({
    src: ['sfx/electricfizz.wav'],
    volume: 0.2
  }),
  loudelectricfizz: new Howl({
    src: ['sfx/electricfizz.wav'],
    volume: 1
  }),
  foxshinereflect: new Howl({
    src: ['sfx/foxshinereflect.wav']
  }),
  falco: new Howl({
    src: ['sfx/falco.wav']
  }),
  falcotaunt: new Howl({
    src: ['sfx/falcotaunt.wav']
  }),
  foxtaunt: new Howl({
    src: ['sfx/foxtaunt.wav']
  }),
  marthtaunt: new Howl({
    src: ['sfx/marthtaunt.wav']
  }),
  pufftaunt: new Howl({
    src: ['sfx/pufftaunt.wav']
  }),
  falcofirebird: new Howl({
    src: ['sfx/falcofirebird.wav']
  }),
  falcocliffcatch: new Howl({
    src: ['sfx/falcocliffcatch.wav']
  }),
  falcoshout1: new Howl({
    src: ['sfx/falcoshout1.wav']
  }),
  falcoshout2: new Howl({
    src: ['sfx/falcoshout2.wav']
  }),
  falcoshout3: new Howl({
    src: ['sfx/falcoshout3.wav']
  }),
  falcoshout4: new Howl({
    src: ['sfx/falcoshout4.wav']
  }),
  falcoshout5: new Howl({
    src: ['sfx/falcoshout5.wav']
  }),
  falcofura: new Howl({
    src: ['sfx/falcofura.wav']
  }),
  falcodeath: new Howl({
    src: ['sfx/falcodeath.wav']
  }),
  falcodoublejump: new Howl({
    src: ['sfx/falcodoublejump.wav']
  }),
  falcoairdodge: new Howl({
    src: ['sfx/falcoairdodge.wav']
  }),
  falcotech: new Howl({
    src: ['sfx/falcotech.wav']
  }),
  falcohurt1: new Howl({
    src: ['sfx/falcohurt1.wav']
  }),
  falcohurt2: new Howl({
    src: ['sfx/falcohurt2.wav']
  }),
  falcohurt3: new Howl({
    src: ['sfx/falcohurt3.wav']
  }),
  phantasm: new Howl({
    src: ['sfx/phantasm.wav']
  }),
  phantasmshout: new Howl({
    src: ['sfx/phantasmshout.wav']
  }),
  firebirdcharge: new Howl({
    src: ['sfx/firebirdcharge.wav']
  }),
  firebirdlaunch: new Howl({
    src: ['sfx/firebirdlaunch.wav']
  }),
  falcosleep: new Howl({
    src: ['sfx/falcosleep.wav']
  }),
  hitspin: new Howl({
    src: ['sfx/hitspin.wav']
  }),
  falcondeath: new Howl({
    src: ['sfx/falcondeath.wav']
  }),
  falcondive: new Howl({
    src: ['sfx/falcondive.wav']
  }),
  falcondoublejump: new Howl({
    src: ['sfx/falcondoublejump.wav']
  }),
  falconfura: new Howl({
    src: ['sfx/falconfura.wav']
  }),
  falconhurt: new Howl({
    src: ['sfx/falconhurt.wav']
  }),
  falconkick: new Howl({
    src: ['sfx/falconkick.wav']
  }),
  falconkickshout: new Howl({
    src: ['sfx/falconkickshout.wav']
  }),
  falconpunchbird: new Howl({
    src: ['sfx/falconpunchbird.wav']
  }),
  falconpunchshout1: new Howl({
    src: ['sfx/falconpunchshout1.wav']
  }),
  falconpunchshout2: new Howl({
    src: ['sfx/falconpunchshout2.wav']
  }),
  falconshout1: new Howl({
    src: ['sfx/falconshout1.wav']
  }),
  falconshout2: new Howl({
    src: ['sfx/falconshout2.wav']
  }),
  falconshout3: new Howl({
    src: ['sfx/falconshout3.wav']
  }),
  falconshout4: new Howl({
    src: ['sfx/falconshout4.wav']
  }),
  falconshout5: new Howl({
    src: ['sfx/falconshout5.wav']
  }),
  falconshout6: new Howl({
    src: ['sfx/falconshout6.wav']
  }),
  falconsleep: new Howl({
    src: ['sfx/falconsleep.wav']
  }),
  falcontaunt: new Howl({
    src: ['sfx/falcontaunt.wav']
  }),
  falconyes: new Howl({
    src: ['sfx/falconyes.wav']
  }),
  raptorboost: new Howl({
    src: ['sfx/raptorboost.wav']
  }),
  falcon: new Howl({
    src: ['sfx/falcon.wav']
  })
}



const volumeOverwrites = {
  dash: 0.3,
  airdodge: 0.7,
  grab: 0.5,
  jump: 0.7,
  jump2: 0.4,
  land: 0.7,
  ledgegrab: 0.7,
  shieldup: 0.7,
  swordsheath: 0.7,
  sworddraw: 0.7,
  fastfall: 0.4,
  shieldoff: 0.4,
  sword1: 0.7,
  sword2: 0.7,
  sword3: 0.7,
  swordweakhit: 0.5,
  swordmediumhit: 0.5,
  swordstronghit: 0.5,
  swordreallystronghit: 0.7,
  furacry: 0.4,
  blunthit: 0.7,
  normalswing1: 0.5,
  normalswing2: 0.5,
  puffledgegrab: 0.7,
  marthcounterclank: 0.6,
  electricfizz: 0.2,
  firestronghit: 0.6
}

window.changeVolume = function(audioGroup, newVolume, groupType) {
  var keys = Object.keys(audioGroup);
  for (var i = 0; i < keys.length; i++) {
    if (volumeOverwrites[keys[i]]) {
      audioGroup[keys[i]]._volume = newVolume * volumeOverwrites[keys[i]];
    } else {
      audioGroup[keys[i]]._volume = newVolume;
    }
    if (groupType && audioGroup[keys[i]].volume) {
      audioGroup[keys[i]].volume(newVolume);
    }
  }
}

changeVolume(sounds, 0.5, 0);
changeVolume(MusicManager, 0.3, 1);

window.playSfx = function(name) {
  sounds[name].play();
}
