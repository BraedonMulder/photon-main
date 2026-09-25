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

If the player ID is new, the desk worker adds the next ID number available and enters a codename for the player.

The desk worker must then enter an equipment ID that the plyer is using for that game. Once the equipment ID is entered, the new player information is saved to the PostgreSQL database and the equipment code is sent through UDP.



