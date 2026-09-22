console.log(`test message`);

//---------- DOM ELEMENTS ----------//

var playerContainer_red = document.getElementById('player-container_red'),
    playerContainer_green = document.getElementById('player-container_green');

//---------- VARIABLES ----------//

var numPlayerFields = 20;   // maximum number of players on each team

var id_maxLength = 8;       // maximum chars allowed in ID field
var name_maxLength = 20;    // maximum chars allowed in name field

//---------- CREATE HTML ELEMENTS ----------//

for(let i = 0; i < numPlayerFields; i++)
{
    playerContainer_red.innerHTML += '<div class="horizontal-flex">' +
                                        '<input id="player-enable-button_red_' + i + '"class="player-enable-button" type="checkbox" tabindex="-1" disabled>' +
                                        '<input id="player-id-field_red_' + i + '"class="player-id-field" maxlength="' + id_maxLength + '" placeholder="ID">' +
                                        '<input id="player-name-field_red_' + i + '"class="player-name-field" maxlength="' + name_maxLength + 'type="text" tabindex="-1" readonly>' +
                                    '</div>';

    playerContainer_green.innerHTML += '<div class="horizontal-flex">' +
                                        '<input id="player-enable-button_green_' + i + '"class="player-enable-button" type="checkbox" tabindex="-1" disabled>' +
                                        '<input id="player-id-field_green_' + i + '"class="player-id-field" maxlength="' + id_maxLength + '" placeholder="ID">' +
                                        '<input id="player-name-field_green_' + i + '"class="player-name-field" maxlength="' + name_maxLength + '" type="text" tabindex="-1" readonly>' +
                                    '</div>';
}

//---------- CREATE PLAYER OBJECTS ----------//

var players_red = [];
var players_green = [];

for(let i = 0; i < numPlayerFields; i++)
{
    // add elements as attributes of player objects
    players_red.push({
        enableButton: document.getElementById('player-enable-button_red_' + i),
        idField: document.getElementById('player-id-field_red_' + i),
        nameField: document.getElementById('player-name-field_red_' + i)
    });

    players_green.push({
        enableButton: document.getElementById('player-enable-button_green_' + i),
        idField: document.getElementById('player-id-field_green_' + i),
        nameField: document.getElementById('player-name-field_green_' + i)
    });
}

//---------- EVENT LISTENERS ----------//

playerContainer_red.addEventListener('change', function(event) // change fires on deselect field, input fires on keystroke
{
    // detect change to an ID field
    if(event.target.classList.contains('player-id-field'))
    {
        let entryIndex = event.target.id.slice(20);

        if(!idChangeAttempt(entryIndex, 'red', event.target.value))
        {
            event.target.value = '';                           // sets ID field to empty
            players_red[entryIndex].nameField.readOnly = true; // sets name field to read only
            players_red[entryIndex].nameField.value = '';      // sets name field to empty
        }
    }

    // detect change to a name field
    if(event.target.classList.contains('player-name-field'))
    {
        let entryIndex = event.target.id.slice(22);
        
        console.log(`[red ` + entryIndex + `] changed Name to: "` + event.target.value + `"`);
    }
}
);

playerContainer_green.addEventListener('change', function(event)
{
    // detect change to an ID field
    if(event.target.classList.contains('player-id-field'))
    {
        let entryIndex = event.target.id.slice(22);

        if(!idChangeAttempt(entryIndex, 'green', event.target.value))
        {
            event.target.value = '';                             // sets ID field to empty
            players_green[entryIndex].nameField.readOnly = true; // sets name field to read only
            players_green[entryIndex].nameField.value = '';      // sets name field to empty
        }
    }

    // detect change to a name field
    if(event.target.classList.contains('player-name-field'))
    {
        let entryIndex = event.target.id.slice(24);
        
        console.log(`[green ` + entryIndex + `] changed Name to: "` + event.target.value + `"`);
    }
}
);

//---------- ID CHANGE HANDLING ----------//

function idChangeAttempt(index, team, newValue)
{
    if(!/^[0-9]+$/.test(newValue)) // regex for ensuring only numeric chars
    {
        if(newValue == '') // ID field has been set to empty
        {
            console.log(`[` + team + ` `  + index + `] emptied!`);
        }
        else // ID input invalid
        {
            window.alert("Invalid ID. Please enter numbers only.");
        }

        return false; // signals to set the ID and NAME fields to empty
    }
    else // when ID box changed to a valid ID
    {
        if(team == 'red')
        {
            players_red[index].nameField.readOnly = false;
        }
        else
        {
            players_green[index].nameField.readOnly = false;
        }
        /* 
        if ID field is changed:
            if newValue does not exist in DB:
            {
                prompt user to enter a name
                ID and name are saved to DB
                set name box readonly = false
            }
            elif newValue does exist in DB:
            {
                recall name into corresponding name box
                set name box readonly = false
            }        
        */
    }
    
    console.log(`[` + team + ` `  + index + `] changed ID to: "` + newValue + `"`);
    return true; // necessary so the boxes don't get cleared
}

//---------- DEBUG ----------//

var debugButton = document.getElementById('debug-button');

debugButton.addEventListener('click', function()
{
    let activePlayer;
    for(let i = 0; i < numPlayerFields; i++)
    {
        activePlayer = redPlayers[i];
        console.log(`[red ` + i + `] ` + activePlayer.idField.value + ', ' + activePlayer.nameField.value + ', ' + activePlayer.enableButton.checked);
    }
    for(let i = 0; i < numPlayerFields; i++)
    {
        activePlayer = greenPlayers[i];
        console.log(`[green ` + i + `] ` + activePlayer.idField.value + ', ' + activePlayer.nameField.value + ', ' + activePlayer.enableButton.checked);
    }
});