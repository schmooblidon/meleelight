// Metric pipe for analytics real quick
//will do more if this works out


var batchSize = 60;
var countSoFar = 0;
var message = '';
var dataOut = function (payloadLine, type = "log") {
    message += type === 'metric' ? (payloadLine + " " + Date.now()) : (Date.now() + " " + payloadLine) + "\n";
    countSoFar++;
    if (countSoFar % 25 === 0) {
        $.ajax({
            url: "https://endpoint2.collection.us2.sumologic.com/receiver/v1/http/ZaVnC4dhaV0jxzviQPX-Y-vaYlUKfmHEFaMgpkghubWmP6fE-_Nx-urqnOHF8erdUy4bWHK3-IrZuz2uNe3sDyurABdvQlxTxOh3HoemZXHABZzHu9mOcw==",
            type: "POST",
            data: message,
            headers: {'Content-Type': type === 'metric' ? "application/vnd.sumologic.carbon2" : ""},
        })
            .done((response) => {
                console.log('Success!')
                message = '';
            })
            .fail((error) => {
                console.log('Failed', error)
                message = '';
            })
            .always(() => {
                console.log('Done.')
            });
    }
}