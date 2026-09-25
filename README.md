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


## Player Entry
The Player Entry screen allows the Photon desk worker to add players to either the red or green team.

The desk worker first enters the player's ID. If that ID is already in the database, the player's codename will load automatically.

If the player ID is new, the desk worker enters a new ID number and a codename for the player.

The desk worker then enters the equipment ID the player is using for that game. New player information is saved to the PostgreSQL database after the player's ID and codename are entered. The equipment ID is then sent through UDP.



