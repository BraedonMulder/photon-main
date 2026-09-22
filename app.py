from flask import Flask, render_template

app = Flask(__name__)

@app.route("/")
def splash():
    return render_template("splash.html")

@app.route("/players")
def players():
    return render_template("player_entry.html")

app.run(host='127.0.0.1', port = 5000, debug=False)