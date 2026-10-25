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

If the application has already been installed, start it with:

    python3 app.py

If your environment uses `python` instead of `python3`, run:

    python app.py

Then open the HTTP address shown in the terminal in your browser.

## Splash Screen

The Photon logo is shown for 3 seconds, then the program moves to the Player Entry screen.

## Player Entry

The Player Entry screen allows the Photon desk worker to add players to either the red or green team.

The desk worker first enters the player's ID. If that ID is already in the database, the player's codename will load automatically.

If the player ID is new, the desk worker enters a new ID number and a codename for the player.

The desk worker then enters the equipment ID the player is using for that game. New player information is saved to the PostgreSQL database after the player's ID and codename are entered. The equipment ID is then sent through UDP.

## Keyboard Shortcuts

| Keys | Action |
| --- | --- |
| `Ctrl` + `Enter` | Start the game: shows the countdown, then the Play Action Display |
| `Ctrl` + `Fn` + `Delete` | Clear all player entries on the Player Entry screen |

## Countdown

A 30-second countdown is shown. When it reaches 0 the program moves to the Play Action Display automatically.

## Play Action Display

Shows the red and green team windows with each player's codename and score, plus the team totals and an event feed. Game events from the equipment are not connected yet.



