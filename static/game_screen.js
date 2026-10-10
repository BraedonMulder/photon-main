console.log(`game-screen.js loaded`);

//---------- DOM ELEMENTS ----------//

var teamChunk_red = document.getElementById('team-chunk_red'),
    teamChunk_red_overflow = document.getElementById('team-chunk_red_overflow'),
    teamChunk_green = document.getElementById('team-chunk_green'),
    teamChunk_green_overflow = document.getElementById('team-chunk_green_overflow'),
    feedContainer = document.getElementById('feed-container');

//---------- NAME/SCORE ARRAYS (test) ----------//

// these should actually be unified with the player arrays used in the entry screen

var players_red = ['Bill', 'Francis', 'Louis', 'Zoey', 'Coach', 'Nick', 'Ellis', 'Rochelle', 'Virgil', 'Whitaker', 'Keith'];
var players_green = ['Bill', 'Francis', 'Louis', 'Zoey', 'Coach', 'Nick', 'Ellis', 'Rochelle', 'Virgil', 'Whitaker', 'Keith'];

var scores_red = [];
var scores_green = [];

//---------- CREATE HTML ELEMENTS ----------//

for(let i = 0; i < players_red.length; i++)
{
    scores_red[i] = 0;

    if(i <= 7) // split for better looking formatting. has no reprecussions past this
    {
        teamChunk_red.innerHTML += '<div class="player-score-container" id="player-score-container_red_' + i + '">' + 
                                        '<p>' + players_red[i] + '</p>' +
                                        '<p>0</p>' +
                                    '</div>';
    }
    else
    {
        teamChunk_red_overflow.innerHTML += '<div class="player-score-container" id="player-score-container_red_' + i + '">' + 
                                    '<p>' + players_red[i] + '</p>' +
                                    '<p>0</p>' +
                                '</div>';
    }
}

for(let i = 0; i < players_green.length; i++)
{
    scores_green[i] = 0;

    if(i <= 7) // split for better looking formatting. has no reprecussions past this
    {
        teamChunk_green.innerHTML += '<div class="player-score-container" id="player-score-container_green_' + i + '">' + 
                                        '<p>' + players_green[i] + '</p>' +
                                        '<p>0</p>' +
                                     '</div>';
    }
    else
    {
        teamChunk_green_overflow.innerHTML += '<div class="player-score-container" id="player-score-container_green_' + i + '">' + 
                                                    '<p>' + players_green[i] + '</p>' +
                                                    '<p>0</p>' +
                                              '</div>';
    }
}

//---------- DEBUG ----------//

// for testing formatting, score calls and such

var fakeEvent_button = document.getElementById('fake-event_button');

fakeEvent_button.addEventListener('click', function()
{
    // pick random players
    let randRed = Math.floor(Math.random() * players_red.length);
    let randGreen = Math.floor(Math.random() * players_green.length);

    // points and stuff. proof of concept, this is scuffed
    if(Math.floor(Math.random() * 2))
    {
        feedContainer.innerHTML += '<label class="feed-message">' + players_red[randRed] + ` hit ` + players_green[randGreen] + '</label>';

        scores_red[randRed] = scores_red[randRed] + 10; 

        scorePointer = document.getElementById(`player-score-container_red_` + randRed);
        scorePointer.innerHTML =    '<p>' + players_red[randRed] + '</p>' +
                                        '<p>' + scores_red[randRed] + '</p>' +
                                    '</div>';
    }
    else
    {
        feedContainer.innerHTML += '<label class="feed-message">' + players_green[randGreen] + ` hit ` + players_red[randRed] + '</label>';

        scores_green[randGreen] = scores_green[randGreen] + 10; 

        scorePointer = document.getElementById(`player-score-container_green_` + randGreen);
        scorePointer.innerHTML =    '<p>' + players_green[randGreen] + '</p>' +
                                        '<p>' + scores_green[randGreen] + '</p>' +
                                    '</div>';
    }

    // remember to cull messages after theyre offscreen. im lazy rn
});