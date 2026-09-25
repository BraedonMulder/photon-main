from flask import Flask, render_template, jsonify, request

from database import get_player_by_id, save_player
from udp_files.udp_transmit import broadcast_equipment_id


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
    app.run(host="127.0.0.1", port=5000, debug=False)
