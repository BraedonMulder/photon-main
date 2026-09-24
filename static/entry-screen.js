console.log(`test message`);

//---------- DOM ELEMENTS ----------//

var playerContainer_red = document.getElementById('player-container_red'),
    playerContainer_green = document.getElementById('player-container_green'),
    networkAddress = document.getElementById('network-address');

//---------- VARIABLES ----------//

var numPlayerFields = 15;

var id_maxLength = 8;
var name_maxLength = 20;
var equipment_maxLength = 8;

//---------- CREATE HTML ELEMENTS ----------//

for(let i = 0; i < numPlayerFields; i++)
{
    playerContainer_red.innerHTML += '<div class="horizontal-flex">' +
                                        '<input id="player-enable-button_red_' + i + '" class="player-enable-button" type="checkbox" tabindex="-1" disabled>' +
                                        '<input id="player-id-field_red_' + i + '" class="player-id-field" maxlength="' + id_maxLength + '" placeholder="ID">' +
                                        '<input id="player-name-field_red_' + i + '" class="player-name-field" maxlength="' + name_maxLength + '" placeholder="Codename" type="text" tabindex="-1" readonly>' +
                                        '<input id="player-equipment-field_red_' + i + '" class="player-equipment-field" maxlength="' + equipment_maxLength + '" placeholder="Equip">' +
                                    '</div>';

    playerContainer_green.innerHTML += '<div class="horizontal-flex">' +
                                        '<input id="player-enable-button_green_' + i + '" class="player-enable-button" type="checkbox" tabindex="-1" disabled>' +
                                        '<input id="player-id-field_green_' + i + '" class="player-id-field" maxlength="' + id_maxLength + '" placeholder="ID">' +
                                        '<input id="player-name-field_green_' + i + '" class="player-name-field" maxlength="' + name_maxLength + '" placeholder="Codename" type="text" tabindex="-1" readonly>' +
                                        '<input id="player-equipment-field_green_' + i + '" class="player-equipment-field" maxlength="' + equipment_maxLength + '" placeholder="Equip">' +
                                    '</div>';
}

//---------- CREATE PLAYER OBJECTS ----------//

var players_red = [];
var players_green = [];

for(let i = 0; i < numPlayerFields; i++)
{
    players_red.push({
        enableButton: document.getElementById('player-enable-button_red_' + i),
        idField: document.getElementById('player-id-field_red_' + i),
        nameField: document.getElementById('player-name-field_red_' + i),
        equipmentField: document.getElementById('player-equipment-field_red_' + i),
        existsInDatabase: false
    });

    players_green.push({
        enableButton: document.getElementById('player-enable-button_green_' + i),
        idField: document.getElementById('player-id-field_green_' + i),
        nameField: document.getElementById('player-name-field_green_' + i),
        equipmentField: document.getElementById('player-equipment-field_green_' + i),
        existsInDatabase: false
    });
}

//---------- EVENT LISTENERS ----------//

playerContainer_red.addEventListener('change', async function(event)
{
    if(event.target.classList.contains('player-id-field'))
    {
        let entryIndex = event.target.id.slice(20);

        if(!await idChangeAttempt(entryIndex, 'red', event.target.value))
        {
            clearPlayer(players_red[entryIndex]);
        }
    }

    if(event.target.classList.contains('player-name-field'))
    {
        let entryIndex = event.target.id.slice(22);

        await saveNewPlayer(entryIndex, 'red');
    }

    if(event.target.classList.contains('player-equipment-field'))
    {
        let entryIndex = event.target.id.slice(27);

        await equipmentChangeAttempt(entryIndex, 'red');
    }
});


playerContainer_green.addEventListener('change', async function(event)
{
    if(event.target.classList.contains('player-id-field'))
    {
        let entryIndex = event.target.id.slice(22);

        if(!await idChangeAttempt(entryIndex, 'green', event.target.value))
        {
            clearPlayer(players_green[entryIndex]);
        }
    }

    if(event.target.classList.contains('player-name-field'))
    {
        let entryIndex = event.target.id.slice(24);

        await saveNewPlayer(entryIndex, 'green');
    }

    if(event.target.classList.contains('player-equipment-field'))
    {
        let entryIndex = event.target.id.slice(29);

        await equipmentChangeAttempt(entryIndex, 'green');
    }
});

//---------- ID CHANGE HANDLING ----------//

async function idChangeAttempt(index, team, newValue)
{
    let player = getPlayerObject(index, team);

    player.enableButton.checked = false;
    player.existsInDatabase = false;

    player.nameField.value = '';
    player.nameField.readOnly = true;

    player.equipmentField.value = '';

    if(!/^[0-9]+$/.test(newValue))
    {
        if(newValue == '')
        {
            console.log(`[` + team + ` ` + index + `] emptied!`);
        }
        else
        {
            window.alert("Invalid ID. Please enter numbers only.");
        }

        return false;
    }

    try
    {
        let response = await fetch('/api/player/' + newValue);

        if(response.ok)
        {
            let playerData = await response.json();

            player.nameField.value = playerData.codename;
            player.nameField.readOnly = true;
            player.existsInDatabase = true;
        }
        else if(response.status == 404)
        {
            player.nameField.readOnly = false;
            player.nameField.focus();
        }
        else
        {
            window.alert("Could not look up player.");
            return false;
        }
    }
    catch(error)
    {
        console.log(error);
        window.alert("Could not contact the server.");
        return false;
    }

    console.log(
        `[` + team + ` ` + index + `] changed ID to: "` +
        newValue + `"`
    );

    return true;
}

//---------- SAVE NEW PLAYER ----------//

async function saveNewPlayer(index, team)
{
    let player = getPlayerObject(index, team);

    if(player.existsInDatabase)
    {
        return;
    }

    let playerId = player.idField.value.trim();
    let codename = player.nameField.value.trim();

    if(codename == '')
    {
        window.alert("Please enter a codename.");
        return;
    }

    try
    {
        let response = await fetch('/api/player',
        {
            method: 'POST',

            headers:
            {
                'Content-Type': 'application/json'
            },

            body: JSON.stringify({
                id: Number(playerId),
                codename: codename
            })
        });

        if(response.ok)
        {
            player.existsInDatabase = true;
            player.nameField.readOnly = true;

            console.log(
                `[` + team + ` ` + index + `] saved player: ` +
                playerId + `, ` + codename
            );
        }
        else
        {
            window.alert("Could not save player.");
        }
    }
    catch(error)
    {
        console.log(error);
        window.alert("Could not save player.");
    }
}

//---------- EQUIPMENT HANDLING ----------//

async function equipmentChangeAttempt(index, team)
{
    let player = getPlayerObject(index, team);

    let equipmentId = player.equipmentField.value.trim();
    let address = networkAddress.value.trim();

    if(!player.existsInDatabase)
    {
        window.alert("Save the player before entering equipment.");
        return;
    }

    if(!/^[0-9]+$/.test(equipmentId))
    {
        window.alert("Equipment ID must contain numbers only.");
        return;
    }

    if(address == '')
    {
        window.alert("Enter a network address.");
        return;
    }

    try
    {
        let response = await fetch('/api/equipment',
        {
            method: 'POST',

            headers:
            {
                'Content-Type': 'application/json'
            },

            body: JSON.stringify({
                equipment_id: Number(equipmentId),
                network_address: address
            })
        });

        if(response.ok)
        {
            player.enableButton.checked = true;

            console.log(
                `[` + team + ` ` + index + `] equipment: ` +
                equipmentId
            );
        }
        else
        {
            window.alert("Could not send equipment ID.");
        }
    }
    catch(error)
    {
        console.log(error);
        window.alert("Could not send equipment ID.");
    }
}

//---------- HELPER FUNCTIONS ----------//

function getPlayerObject(index, team)
{
    if(team == 'red')
    {
        return players_red[index];
    }
    else
    {
        return players_green[index];
    }
}


function clearPlayer(player)
{
    player.idField.value = '';
    player.nameField.value = '';
    player.equipmentField.value = '';

    player.nameField.readOnly = true;

    player.enableButton.checked = false;
    player.existsInDatabase = false;
}

//---------- DEBUG ----------//

var debugButton = document.getElementById('debug-button');

debugButton.addEventListener('click', function()
{
    let activePlayer;

    for(let i = 0; i < numPlayerFields; i++)
    {
        activePlayer = players_red[i];

        console.log(
            `[red ` + i + `] ` +
            activePlayer.idField.value + ', ' +
            activePlayer.nameField.value + ', ' +
            activePlayer.equipmentField.value + ', ' +
            activePlayer.enableButton.checked
        );
    }

    for(let i = 0; i < numPlayerFields; i++)
    {
        activePlayer = players_green[i];

        console.log(
            `[green ` + i + `] ` +
            activePlayer.idField.value + ', ' +
            activePlayer.nameField.value + ', ' +
            activePlayer.equipmentField.value + ', ' +
            activePlayer.enableButton.checked
        );
    }
});