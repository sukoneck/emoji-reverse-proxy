from flask import Flask,request,redirect,Response
from urllib.parse import urlparse,quote

app = Flask(__name__)

# DEST_BASE_URL = 'http://localhost:6969'
# DEST_DOMAIN = 'localhost:8888'
# DEST_DEFAULT_URL = 'http://localhost:6969/default'
DEST_BASE_URL = 'http://nftnft.lol/#/a'
DEST_DEFAULT_URL = 'http://nftnft.lol'
DEST_DOMAIN = 'nftnft'

def log(field, message):
    print(field, ": ", message)

@app.route('/',methods=['GET'])
def proxy():
    encoded = quote(request.url, safe=':/.')
    parsed = urlparse(encoded)
    first_domain = parsed.netloc.split(".")[0]
    log("incoming", request.url)
    log("encoded", encoded)
    log("parsed", parsed)
    if first_domain == DEST_DOMAIN:
        dest = DEST_DEFAULT_URL
        log("destination", dest)
        return redirect(dest, code=301)
    else:
        dest = DEST_BASE_URL + "/" + first_domain
        log("destination", dest)
        return redirect(dest, code=301)

if __name__ == '__main__':
    app.run(debug = False,port=8888)
