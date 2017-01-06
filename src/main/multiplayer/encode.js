import {inputData} from "main/input";


function axisToByte( value ) {
  return Math.floor( (value + 1) * 255/2);
}

function triggerToByte ( value ) {
  return Math.floor( value * 255 );  
}

function byteToAxis ( byte ) {
  return byte * 2 / 255 - 1;
}

function byteToTrigger ( byte ) {
  return byte/255;
}

function inputToBytes (input) {
  const byte0 = boolsToByte(input.a, input.b, input.x, input.y, input.s, input.z, input.l, input.r);
  const byte1 = boolsToByte(input.du, input.dr, input.dd, input.dl, false, false, false, false);
  const byte2 = axisToByte(lsX);
  const byte3 = axisToByte(lsY);
  const byte4 = axisToByte(csX);
  const byte5 = axisToByte(csY);
  const byte6 = triggerToByte(input.lA);
  const byte7 = triggerToByte(input.rA);
  return [byte0, byte1, byte2, byte3, byte4, byte5, byte6, byte7];
}

function bytesToInput( bytes ){
  let input = new inputData ();

  const bools0 = byteToBools(bytes[0]);
  input.a = bools0[0];
  input.b = bools0[1];
  input.x = bools0[2];
  input.y = bools0[3];
  input.s = bools0[4];
  input.z = bools0[5];
  input.l = bools0[6];
  input.r = bools0[7];
  const bools1 = byteToBools(bytes[1]);
  input.du = bools1[0];
  input.dr = bools1[1];
  input.dd = bools1[2];
  input.dl = bools1[3];
  input.lsX = byteToAxis(bytes[2]);
  input.lsY = byteToAxis(bytes[3]);
  input.csX = byteToAxis(bytes[4]);
  input.csY = byteToAxis(bytes[5]);
  input.lA = byteToTrigger(bytes[6]);
  input.rA = byteToTrigger(bytes[7]);

  return input;
}

function boolsToByte( b0, b1, b2, b3, b4, b5, b6, b7) {
  return [b0?1:0 + b1?2:0 + b2?4:0 + b3?8:0 + b4?16:0 + b5?32:0 + b6?64:0 + b7?128:0]];
}

function byteToBools( byte ) {
  const digits = byte.toString(2);
  return digits.map ((d) => d === '1' ? true : false);
}

function bytesToString(bytes) {
  return String.fromCharCode( bytes[0]+256*bytes[1]
                            , bytes[2]+256*bytes[3]
                            , bytes[4]+256*bytes[5]
                            , bytes[6]+256*bytes[7]
                            );
}

function stringToBytes(string) {
  return [ string.charCodeAt(0)
         , string.charCodeAt(1)
         , string.charCodeAt(2)
         , string.charCodeAt(3) ];
}