from flask import Flask, render_template

# creates the Flask app
app = Flask(__name__)

# shows the splash screen when the program starts
@app.route("/")
def splash():
    return render_template("splash.html")

# opens the player entry screen
@app.route("/players")
def players():
    return render_template("player_entry.html")

app.run(host='127.0.0.1', port = 5000, debug=False)
