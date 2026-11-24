# Photon Laser Tag

Photon is a laser tag web application made for our Software Engineering project. It uses Python Flask for the web application, PostgreSQL for the player database, and UDP sockets for communication with the laser tag equipment.

## Team 11

| GitHub Username | Real Name |
| --- | --- |
| HGatz | Hudson Gatz |
| BraedonMulder | Braedon Mulder |
| DDLVV | Diego Vazquez |
| MSutton | Maddox Sutton |
| Peyton | Peyton Northington |

## Installation

This project is designed to run on the provided Photon Debian virtual machine.

### Intel VM

Run:

bash install.sh

## Running the Application

After completing the installation process the application will be automatically started.

If the application has already been installed, first activate the python virtual environment with:

    source venv/bin/activate

Then start the program with:

    python3 app.py

If your environment uses `python` instead of `python3`, run:

    python app.py

Then open the HTTP address (http://127.0.0.1:5000) shown in the terminal in your browser.

## Splash Screen

The Photon logo is shown for 3 seconds, then the program moves to the Player Entry screen.

## Player Entry

The Player Entry screen allows the Photon desk worker to add players to either the red or green team.

The desk worker first enters the player's ID. If that ID is already in the database, the player's codename will load automatically.

If the player ID is new, the desk worker enters a new ID number and a codename for the player.

The desk worker then enters the equipment ID the player is using for that game. New player information is saved to the PostgreSQL database after the player's ID and codename are entered. The equipment ID is then sent through UDP.
Red players use odd equipment IDs and green players use even equipment IDs.

## Keyboard Shortcuts

| Keys | Action |
| --- | --- |
| `Ctrl` + `Enter` | Start the game: shows the countdown, then the Play Action Display |
| `Ctrl` + `Fn` + `Delete` | Clear all player entries on the Player Entry screen |
| `Ctrl` + `Backspace` | Return to Player Entry screen from Play Action Display |

## Countdown and Music

A 30-second countdown is shown before the game starts. A music track is picked at random from the 8 tracks in `photon_tracks/`. The music starts when the countdown shows 15, so the track's own "5, 4, 3, 2, 1" countdown lines up with the screen. When the countdown reaches 0 the game start code (202) is sent and the program moves to the Play Action Display.

## Play Action Display

The Play Action Display shows:

- the red and green team windows with each player's codename and score
- each team's total score, updated as soon as hit data is received over the network
- an event feed showing the latest hits
- a 6-minute game timer, which starts when the countdown ends

The music keeps playing during the game. When the timer reaches 0:00, the track plays on to its own ending instead of being cut off.

## Scoring

| Event | Result |
| --- | --- |
| Tagging a player on the other team | +10 points |
| Tagging the other team's base (red base code 53, green base code 43) | +100 points, and a base icon is shown next to the player's name for the rest of the game. Only the first base hit counts. |
| Tagging a teammate (friendly fire) | -10 points for both players involved. |

## Testing with the Traffic Generator

The instructor's traffic generator simulates players sending hit data to the game.

1. Start the application and enter at least 2 red players and 2 green players, with odd equipment IDs for red and even equipment IDs for green.
2. Open a second terminal in the `photon-main` folder and run:

       python3 udp_files/python_trafficgenarator_v2.py

3. Enter the same equipment IDs into the traffic generator when it asks for them.
4. Press `Ctrl` + `Enter` in the browser. When the countdown ends, the game sends the start code (202) and the traffic generator starts sending hits, which appear on the Play Action Display.

### Network Ports

| Port | Use |
| --- | --- |
| 7500 | The game broadcasts equipment IDs, hit codes and start/stop codes |
| 7501 | The game listens for hit data (`attacker:victim`) from the equipment |

## Project Structure

| File / Folder | Purpose |
| --- | --- |
| `app.py` | Flask application, routes and the network listener |
| `networking.py` | Sends and receives UDP codes |
| `database.py` | Looks up and saves players in PostgreSQL |
| `templates/` | HTML pages (splash, player entry, countdown, game screen) |
| `static/` | JavaScript, CSS, fonts, logo, base icons and countdown images |
| `photon_tracks/` | Game music tracks |
| `udp_files/` | UDP helper code and the instructor's traffic generator |
| `install.sh` | Installs dependencies and starts the app |
| `Requirements.txt` | Python package list |

**Important:** Remember to enter equipment ID's to see the players in the entered in the entry screen once the game starts.

## Testing with the Traffic Generator

Teams are determined by equipment ID parity:

- **Red team:** odd equipment IDs (1, 3, 101, 103, ...)
- **Green team:** even equipment IDs (2, 4, 102, 104, ...)

When running `udp_files/python_trafficgenarator_v2.py`, enter two odd IDs for the red players and two even IDs for the green players, and make sure those same equipment IDs were entered on the player entry screen. Otherwise hits can't be matched to players, and same-team hits will be treated as enemy hits.

Example: red = 101 and 103, green = 102 and 104.

### Test run order
1. Start the app: `python3 app.py`
2. On the player entry screen, enter players and submit their equipment IDs **(Make sure Red is odd and Green is even)**.
3. In a second terminal, start the generator and enter the four IDs. Leave it on "waiting for start".
4. Start the game from the app. The generator begins sending hits once the app broadcasts the start code (202).