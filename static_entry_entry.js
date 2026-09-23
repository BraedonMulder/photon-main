console.log("Player entry database test loaded");

// containers for each team
var playerContainer_red = document.getElementById("player-container_red");
var playerContainer_green = document.getElementById("player-container_green");

var numPlayerFields = 20;
var id_maxLength = 8;
var name_maxLength = 20;

// create 20 rows for each team
for (let i = 0; i < numPlayerFields; i++) {
    playerContainer_red.innerHTML +=
        '<div class="horizontal-flex">' +
            '<input id="player-enable-button_red_' + i + '" class="player-enable-button" type="checkbox" disabled>' +
            '<input id="player-id-field_red_' + i + '" class="player-id-field" maxlength="' + id_maxLength + '" placeholder="ID">' +
            '<input id="player-name-field_red_' + i + '" class="player-name-field" maxlength="' + name_maxLength + '" type="text" readonly>' +
        '</div>';

    playerContainer_green.innerHTML +=
        '<div class="horizontal-flex">' +
            '<input id="player-enable-button_green_' + i + '" class="player-enable-button" type="checkbox" disabled>' +
            '<input id="player-id-field_green_' + i + '" class="player-id-field" maxlength="' + id_maxLength + '" placeholder="ID">' +
            '<input id="player-name-field_green_' + i + '" class="player-name-field" maxlength="' + name_maxLength + '" type="text" readonly>' +
        '</div>';
}

// looks up a player using Flask/PostgreSQL
async function lookupPlayer(index, team, playerId) {
    // make sure ID only contains numbers
    if (!/^[0-9]+$/.test(playerId)) {
        alert("Invalid ID. Please enter numbers only.");
        return false;
    }

    const nameField = document.getElementById("player-name-field_" + team + "_" + index);
    const enableButton = document.getElementById("player-enable-button_" + team + "_" + index);

    try {
        const response = await fetch("/api/player/" + playerId);

        // Player not found - Trigger POST to create new player
        if (!response.ok) {
            nameField.value = "";
            enableButton.checked = false;

            const addPlayer = confirm("Player ID " + playerId + " was not found. Would you like to add them?");
            
            if (addPlayer) {
                const firstName = prompt("Enter First Name:");
                const lastName = prompt("Enter Last Name:");
                const codename = prompt("Enter Codename:");

                if (codename) {
                    // Send POST request to save new player
                    const postResponse = await fetch("/api/player", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            id: playerId,
                            first_name: firstName,
                            last_name: lastName,
                            codename: codename
                        })
                    });

                    if (postResponse.ok) {
                        console.log("Player " + playerId + " added to database successfully.");
                        nameField.value = codename;
                        enableButton.checked = true;
                        return true;
                    } else {
                        alert("Error saving player to database.");
                        return false;
                    }
                } else {
                    alert("A codename is required to create a player.");
                    return false;
                }
            }
            return false;
        }

        // Player found - Populate UI
        const player = await response.json();
        nameField.value = player.codename;
        enableButton.checked = true;

        console.log("Found player " + player.id + ": " + player.codename);
        return true;

    } catch (error) {
        console.error("Network or database error:", error);
        alert("Could not connect to the database.");
        return false;
    }
}

// red team ID changes
playerContainer_red.addEventListener("change", function(event) {
    if (event.target.classList.contains("player-id-field")) {
        const index = event.target.id.split("_").pop();
        lookupPlayer(index, "red", event.target.value);
    }
});

// green team ID changes
playerContainer_green.addEventListener("change", function(event) {
    if (event.target.classList.contains("player-id-field")) {
        const index = event.target.id.split("_").pop();
        lookupPlayer(index, "green", event.target.value);
    }
});