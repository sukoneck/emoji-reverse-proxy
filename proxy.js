const punycode = require('punycode/');
const Web3 = require('web3');
const http = require('http');

const PORT = process.env.PORT || 8888
const web3 = new Web3(new Web3.providers.HttpProvider("https://mainnet.infura.io/v3/fdf2a581f7d945feaac1377227dd5c61"));
const contract_address = '0xee4C821ed264916d1c035515703F8980410FC149';
const default_dest = "https://nftnft.lol";

// abi for the function that tells you what the redirect is
function abiRedirects(names_result) { 
    return web3.eth.abi.encodeFunctionCall({
        "inputs": [
            {
                "internalType": "bytes",
                "name": "",
                "type": "bytes"
            }
        ],
        "name": "redirects",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }, [names_result]);
}

function callEth(input) {
    return web3.eth.call({
        to: contract_address,
        data: input
    })
}

function decodeEth(type, data) {
    return web3.eth.abi.decodeParameter(type, data)
} 

function failureCallback(error) {
    console.error("Error was: " + error);
}

async function sendIt(hex) {
    try {
        let redirects_data = await abiRedirects(hex);
        let redirects_encoded = await callEth(redirects_data);
        let redirects_result = await decodeEth('string', redirects_encoded);
        return redirects_result;
    } catch(error) {
        failureCallback(error);
    }
}

http.createServer(async function (request, response) {
    let sub_puny = request.headers.host.split(".")[0];
    let sub_uni = punycode.toUnicode(sub_puny);

    // if they tryna go home then just let 'em go home 
    if (sub_uni == "www" || sub_uni.includes("localhost") || sub_uni.includes("nancy") || request.headers.host.includes("heroku")) {
        console.log("received subdomain: " + sub_puny + ", so forwarding to default: " + default_dest);
        response.writeHead(301, { "Location": dest });
        response.end();
    } else {
        try {
            let sub_hex = web3.utils.utf8ToHex(sub_uni);
            let w3_redirect = await sendIt(sub_hex); 
            
            // if there isn't a redirect registered, then send it to default
            if (w3_redirect == "") {
                console.log("received subdomain: " + sub_puny + ", which doesn't have a redirect, so forwarding to default: " + default_dest);
                response.writeHead(301, { "Location": dest });
                response.end();
            } else {

                // if their redirect already has http, then just send it fam
                if (w3_redirect.includes("http")) {
                    console.log("resolved redirect to: " + w3_redirect);
                    response.writeHead(301, { "Location": w3_redirect });
                    response.end();

                // if redirect is chill and doesn't have http in it, then prepend http and send it fam
                } else {
                    let dest = "https://" + w3_redirect;
                    console.log("resolved redirect to: " + dest);
                    response.writeHead(301, { "Location": dest });
                    response.end();
                }
            }
        } catch (error) {
            failureCallback(error);
        }
    }
}).listen(PORT);

