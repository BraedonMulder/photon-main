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

    const response = await fetch("/api/player/" + playerId);

    const nameField =
        document.getElementById("player-name-field_" + team + "_" + index);

    const enableButton =
        document.getElementById("player-enable-button_" + team + "_" + index);



    // player not found
    if (!response.ok) {
        nameField.value = "";
        enableButton.checked = false;

        alert("Player ID " + playerId + " was not found.");

        return false;
    }

    const player = await response.json();

    // put database codename into readonly field
    nameField.value = player.codename;

    enableButton.checked = true;

    console.log(
        "Found player " +
        player.id +
        ": " +
        player.codename
    );

    return true;
}



// red team ID changes
playerContainer_red.addEventListener("change", function(event) {

    if (event.target.classList.contains("player-id-field")) {

        const index = event.target.id.split("_").pop();

        lookupPlayer(
            index,
            "red",
            event.target.value
        );
    }

});



// green team ID changes
playerContainer_green.addEventListener("change", function(event) {

    if (event.target.classList.contains("player-id-field")) {

        const index = event.target.id.split("_").pop();

        lookupPlayer(
            index,
            "green",
            event.target.value
        );
    }

});
