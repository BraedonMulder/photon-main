from flask import Flask, render_template, jsonify, request, send_from_directory

from database import get_player_by_id, save_player
from udp_files.udp_transmit import broadcast_equipment_id

import networking

import os
import random
import threading
import time

event_buffer = []
event_buffer_lock = threading.Lock()
network_thread = False
network_thread_lock = threading.Lock()
def network_listener(networking_address):
    networking.init(networking_address) #put the network address for the game in here as a string like so "127.0.0.1".
    while True:
        codes = None
        codes = networking.receive_codes()
        if codes is None:
            continue

        #send out hit signal to those who have been hit and also friendly fire instances.
        networking.broadcast_code(codes[1])
        if codes[1] != 53 and codes[1] != 43:
            if (codes[0] % 2) == (codes[1] % 2):
                networking.broadcast_code(codes[0])

        with event_buffer_lock:
            event_buffer.append(codes)
# creates the Flask app
app = Flask(__name__)

@app.route("/api/score_buffer")
def get_score():
    with event_buffer_lock:
        pending_events = list(event_buffer)
        event_buffer.clear()
    response = jsonify({"events" : pending_events})
    return jsonify({"events" : pending_events})

# folder that holds the game music (Track01.mp3 ... Track08.mp3)
TRACK_FOLDER = os.path.join(app.root_path, "photon_tracks")


# picks one of the saved music tracks at random and returns its URL
@app.route("/api/random_track")
def random_track():
    tracks = [f for f in os.listdir(TRACK_FOLDER) if f.lower().endswith(".mp3")]

    if not tracks:
        return jsonify({"success": False, "message": "No music tracks found."}), 404

    return jsonify({"success": True, "track": "/tracks/" + random.choice(tracks)})


# serves a music file so the browser can play it
@app.route("/tracks/<path:filename>")
def serve_track(filename):
    return send_from_directory(TRACK_FOLDER, filename)


@app.route("/api/start_game", methods=["POST"])
def start_game():
    try:
        networking.broadcast_code(202)
    except Exception as e:
        return jsonify(success=False)
    return jsonify(success=True)

@app.route("/api/end_game", methods=["POST"])
def end_game():
    try:
        networking.broadcast_code(211)
        time.sleep(0.1)
        networking.broadcast_code(211)
        time.sleep(0.1)
        networking.broadcast_code(211)
    except Exception as e:
        return jsonify(success=False)
    return jsonify(success=True)

# shows the splash screen when the program starts
@app.route("/")
def splash():
    return render_template("splash.html")


# opens the player entry screen
@app.route("/players")
def players():
    return render_template("player_entry.html")

# opens the countdown screen
@app.route("/countdown")
def countdown():
    return render_template("countdown.html")

# opens the game screen
@app.route("/gamescreen")
def gamescreen():
    return render_template("game_screen.html")


# looks up a player using their player ID
@app.route("/api/player/<int:player_id>")
def player_lookup(player_id):
    player = get_player_by_id(player_id)

    if player is None:
        return jsonify({"found": False}), 404

    return jsonify({
        "found": True,
        "id": player["id"],
        "codename": player["codename"]
    })


# saves a new player from the player entry screen
@app.route("/api/player", methods=["POST"])
def create_player():
    data = request.get_json(silent=True) or {}

    player_id = data.get("id")
    codename = data.get("codename", "").strip()

    if player_id is None or codename == "":
        return jsonify({
            "success": False,
            "message": "Player ID and codename are required."
        }), 400

    if get_player_by_id(player_id) is not None:
        return jsonify({
            "success": False,
            "message": "Player already exists."
        }), 409

    if save_player(player_id, codename):
        return jsonify({"success": True}), 201

    return jsonify({
        "success": False,
        "message": "Could not save player."
    }), 500


# sends an equipment ID through UDP port 7500
@app.route("/api/equipment", methods=["POST"])
def send_equipment():
    data = request.get_json(silent=True) or {}

    equipment_id = data.get("equipment_id")
    network_address = data.get("network_address", "127.0.0.1").strip()

    global network_thread
    with network_thread_lock:
        if not network_thread:
            listener_thread = threading.Thread(target=network_listener, args=(network_address,), daemon=True)
            listener_thread.start()
            network_thread = True

    try:
        equipment_id = int(equipment_id)
    except (ValueError, TypeError):
        return jsonify({
            "success": False,
            "message": "Equipment ID must be an integer."
        }), 400

    try:
        broadcast_equipment_id(equipment_id, network_address)
    except Exception as e:
        print(f"UDP Error: {e}")
        return jsonify({
            "success": False,
            "message": "Could not send equipment ID."
        }), 500

    return jsonify({"success": True})


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=True) # REMEMBER TO SET THIS TO FALSE WHEN WE SUBMIT
