import {firstNonFalse} from "main/util/firstNonFalse";




// for stages to have connected grounds/platforms, they need to provide a 'connectednessFunction'
// input of a connectedness function: [type, index ], side
// type is either "g" (ground) or "p" (platform),
// index is the index of that surface in the stage's list of surfaces (grounds or platforms depending on type)
// side is either "l" (left) or "r" (right)
// given such an input, the function should return which ground/platform is connected to that side of the given ground/platform,
// in the format [ newType, newIndex ],
// or return 'false' if the ground/platform is not connected on that side to any other ground/platform

// here I am constructing a 'connectednessFunction' from the data of chains of connected grounds/platforms
// if no chains are supplied, it is assumed that no grounds/platforms are connected to any other grounds/platforms
export function connectednessFromChains(label, side, isLoopThenChains) {
  return firstNonFalse ( isLoopThenChains.map( (isLoopThenChain) => searchThroughChain(label, side, isLoopThenChain[1], isLoopThenChain[0]) ));
};

function searchThroughChain(label, side, chain, isLoop, current = false) {
  if (chain === null || chain === undefined || chain.length < 1) {
    return false;
  }
  else {
    const lg = chain.length;
    const [head, ...tail] = chain;
    const last = chain[lg-1];
    if (isLoop) {
      switch(side) {
        case "l":
          if (head[0] === label[0] && head[1] === label[1] ) {
            return last;
          }
          else {
            return searchThroughChain(label, side, tail, false, head);
          }
          break;
        case "r":
          if (last[0] === label[0] && last[1] === label[1]) {
            return head;
          }
          else {
            return searchThroughChain(label, side, chain, false);
          }
          break;
      }
    }
    else {
      switch(side) {
        case "l":
          if (head[0] === label[0] && head[1] === label[1] ) {
            return current;
          }
          else {
            return (searchThroughChain(label, side, tail, false, head));
          }
          break;
        case "r":
          if (head[0] === label[0] && head[1] === label[1]) {
            if (chain[1] === null || chain[1] === undefined) {
              return false;
            }
            else {
              return chain[1];
            }
          }
          else {
            return (searchThroughChain(label, side, tail, false));
          }
          break;
      }
    }
  }
};