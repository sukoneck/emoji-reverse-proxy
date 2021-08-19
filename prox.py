# https://medium.com/customorchestrator/simple-reverse-proxy-server-using-flask-936087ce0afb
# https://emojiterra.com/balloon/
# https://stackoverflow.com/a/19016600/13240009
# https://stackoverflow.com/a/31401601/13240009
# https://stackoverflow.com/a/13625238/13240009
# https://docs.python.org/3/library/urllib.parse.html#urllib.parse.quote
# https://docs.python.org/3/library/urllib.parse.html#urllib.parse.urlparse
# https://docs.python-requests.org/en/master/
# https://flask.palletsprojects.com/en/latest/api/#response-objects
# https://stackoverflow.com/a/19569090/13240009
# https://stackoverflow.com/a/40217538/13240009
# https://github.com/owenshen24/a_joke/blob/master/index.html


from flask import Flask,request,redirect,Response
from urllib.parse import urlparse,quote
import requests

app = Flask(__name__)

# DEST_BASE_URL = 'http://localhost:6969'
# DEST_DOMAIN = 'localhost:8888'
DEST_BASE_URL = 'http://nftnft.lol/#/a'
DEST_DOMAIN = 'nftnft'

# def content(subdomain):
#     html = """<!DOCTYPE html>
#     <html>
#         <head>
#             <title>redirecting</title>
#             <meta http-equiv="Refresh" content="0; url={base}/{sub}" />
#         </head>
#         <body>
#         </body>
#     </html>""".replace('\n',' ').format(base = DEST_BASE_URL, sub = subdomain)
#     return html

# def log(message):
#     print("incoming:     ", request.url)
#     print("encoded:      ", encoded)
#     print("parsed:       ", parsed)
#     print("first_domain: ", first_domain)

@app.route('/',methods=['GET'])
def proxy():
    # incoming = request.url
    encoded = quote(request.url, safe=':/.')
    parsed = urlparse(encoded)
    first_domain = parsed.netloc.split(".")[0]
    if first_domain == DEST_DOMAIN:
        return 'homepage'
    else:
        print("incoming:     ", request.url)
        print("encoded:      ", encoded)
        print("parsed:       ", parsed)
        print("first_domain: ", first_domain)
        # resp = requests.get(f'{DEST_BASE_URL}/{first_domain}')
        # con = content(first_domain)
        # response = Response(con, resp.status_code, resp.headers.items())
        # return response
        dest = str(DEST_BASE_URL + "/" + first_domain)
        return redirect(dest, code=301)
        
if __name__ == '__main__':
    app.run(debug = False,port=8888)
