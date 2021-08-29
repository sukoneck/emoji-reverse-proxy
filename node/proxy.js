const punycode = require('punycode/');
const Web3 = require('web3');
const http = require('http');

const web3 = new Web3(new Web3.providers.HttpProvider("https://mainnet.infura.io/v3/fdf2a581f7d945feaac1377227dd5c61"));

const contract_address = '0xee4C821ed264916d1c035515703F8980410FC149';

function abiNames(numbo) {
    return web3.eth.abi.encodeFunctionCall({
        "inputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "names",
        "outputs": [
            {
                "internalType": "bytes",
                "name": "",
                "type": "bytes"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }, [numbo]);
}

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

function decodeEth2(data) {
    return web3.eth.abi.decodeParameter('string', data)
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
    if (sub_uni == "www" || sub_uni.includes("localhost")) {
        console.log(sub_uni);
        // response.writeHead(301, { "Location": "https://nftnft.lol" });
        response.writeHead(200, { "Content-Type": "text/plain" });
        response.write("you made it");
        response.end();
    } else {
        try {
            let sub_hex = web3.utils.utf8ToHex(sub_uni);
            let w3_redirect = await sendIt(sub_hex); 
            console.log(w3_redirect);
            response.writeHead(301, { "Location": w3_redirect });
            response.end();
        } catch (error) {
            console.log(error);
        }
    }
}).listen(8888);

