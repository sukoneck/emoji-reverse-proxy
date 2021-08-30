const punycode = require('punycode/');
const Web3 = require('web3');
const http = require('http');

const PORT = process.env.PORT || 8888
const web3 = new Web3(new Web3.providers.HttpProvider("https://mainnet.infura.io/v3/fdf2a581f7d945feaac1377227dd5c61"));
const contract_address = '0xee4C821ed264916d1c035515703F8980410FC149';

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
    if (sub_uni == "www" || sub_uni.includes("localhost") || sub_uni.includes("nancy") || request.headers.host.includes("heroku")) {
        let content = "did you do a subdomain? it looks like: " + sub_puny
        console.log(content);
        response.writeHead(200, { "Content-Type": "text/plain" });
        response.write(content);
        response.end();
    } else {
        try {
            let sub_hex = web3.utils.utf8ToHex(sub_uni);
            let w3_redirect = await sendIt(sub_hex); 
            if (w3_redirect == "") {
                let content = "no redirect registered in web3 for: " + sub_puny + "\n" + w3_redirect;
                console.log(content);
                response.writeHead(200, { "Content-Type": "text/plain" });
                response.write(content);
                response.end();
            } else {
                let content = "let's go: " + w3_redirect;
                console.log(content);
                let dest = "http://" + w3_redirect;
                console.log(dest);
                response.writeHead(301, { "Location": dest });
                response.end();
            }
        } catch (error) {
            console.log(error);
        }
    }
}).listen(PORT);

// async function handleRequest(request) {
//     let statusCode = 301;
//     let url = new URL(request.url);
//     let sub = url.hostname.split(".")[0];
//     let sub_uni = punycode.toUnicode(sub);
//     if (sub_uni == "www" || sub_uni.includes("localhost") || url.hostname.includes("netlify")) {
//         console.log("did you do a subdomain? it looks like: " + sub_uni);
//         let destinationURL = "https://example.com/" + sub_uni;
//         return Response.redirect(destinationURL, statusCode);
//     } else {
//         try {
//             let sub_hex = web3.utils.utf8ToHex(sub_uni);
//             let w3_redirect = await sendIt(sub_hex); 
//             if (w3_redirect != null && !w3_redirect.trim().isEmpty) {
//                 console.log("no redirect registered in web3 for: " + sub);
//                 let destinationURL = "https://example.com/" + sub;
//                 return Response.redirect(destinationURL, statusCode);
//             } else {
//                 console.log("let's go: " + sub);
//                 return Response.redirect(w3_redirect, statusCode);
//             }
//         } catch (error) {
//             console.log(error);
//         }
//     }
// }

// const target = new EventTarget();

// target.addEventListener("fetch", async event => {
//     event.respondWith(handleRequest(event.request))
// })

