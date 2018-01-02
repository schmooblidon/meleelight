// Metric pipe for analytics real quick
//will do more if this works out


const batchSize = 60;
let lcountSoFar = 0;
let mcountSoFar = 0;
let lmessage = '';
let mmessage = '';
const mheader = "application/vnd.sumologic.carbon2";
const lheader = "log";

export function dataOut(payloadLine, type = "log") {
  type === 'metric' ? mPayload(payloadLine) : lPayload(payloadLine);
};

export function flushDataOut(){
  sendPayload(lheader);
  sendPayload(mheader);
}

// logs payload compiler
function lPayload(message){
  lmessage += (Date.now() + " " + message) + "\n";
  lcountSoFar++;

  if (lcountSoFar % 25 === 0) {
    sendPayload(lheader);
    lmessage = '';
    console.log('Logs Sent.');
  }
}

// metrics payload compiler
function mPayload(message){
  mmessage += (message + " " + Date.now())+ "\n";
  mcountSoFar++;

  if (mcountSoFar % 25 === 0) {
    sendPayload(mheader);
    mmessage = '';
    console.log('Metrics Sent.');
  }
}

function sendPayload(header){
  $.ajax({
    url: "https://endpoint2.collection.us2.sumologic.com/receiver/v1/http/ZaVnC4dhaV0jxzviQPX-Y-vaYlUKfmHEFaMgpkghubWmP6fE-_Nx-urqnOHF8erdUy4bWHK3-IrZuz2uNe3sDyurABdvQlxTxOh3HoemZXHABZzHu9mOcw==",
    type: "POST",
    data: header === mheader ? mmessage : lmessage,
    headers: {'Content-Type': header},
  })
    .done((response) => {
      console.log('Success!');
    })
    .fail((error) => {
      console.log('Failed', error);
    })
    .always(() => {
      console.log('Done.');
    });
}
