from flask import Flask,request

app = Flask(__name__)

@app.route('/')
def default():
    return 'default all good'

@app.route('/<path:path>')
def path(path):
    print("source: ", request.url)
    return path + ' all good'

if __name__ == '__main__':
    app.run(port=6969)