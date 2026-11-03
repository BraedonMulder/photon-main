console.log(`game-screen.js loaded`);

//---------- DOM ELEMENTS ----------//

var teamChunk_red = document.getElementById('team-chunk_red'),
    teamChunk_red_overflow = document.getElementById('team-chunk_red_overflow'),
    teamChunk_green = document.getElementById('team-chunk_green'),
    teamChunk_green_overflow = document.getElementById('team-chunk_green_overflow'),
    feedContainer = document.getElementById('feed-container');

//---------- NAME/SCORE ARRAYS ----------//

var players_red = JSON.parse(sessionStorage.getItem("players_red"));
var players_green = JSON.parse(sessionStorage.getItem("players_green"));

if(players_red == null)
{
    var players_red = [];
}
if(players_green == null)
{
    var players_green = [];
}

var teamScore_red = 0;
var teamScore_green = 0;

var teamScoreLabel_red = document.getElementById('team-score-label_red');
var teamScoreLabel_green = document.getElementById('team-score-label_green');

const hitValue = 10;

//---------- CREATE HTML ELEMENTS ----------//

function initializeScores()
{
    for(let i = 0; i < players_red.length; i++)
    {
        players_red[i].score = 0;

        if(i <= 7) // split for better looking formatting. has no reprecussions past this
        {
            teamChunk_red.innerHTML += '<div class="player-score-container" id="player-score-container_red_' + i + '">' + 
                                            '<p>' + players_red[i].name + '</p>' +
                                            '<p>0</p>' +
                                        '</div>';
        }
        else
        {
            teamChunk_red_overflow.innerHTML += '<div class="player-score-container" id="player-score-container_red_' + i + '">' + 
                                        '<p>' + players_red[i].name + '</p>' +
                                        '<p>0</p>' +
                                    '</div>';
        }
    }

    for(let i = 0; i < players_green.length; i++)
    {
        players_green[i].score = 0;

        if(i <= 7) // split for better looking formatting. has no reprecussions past this
        {
            teamChunk_green.innerHTML += '<div class="player-score-container" id="player-score-container_green_' + i + '">' + 
                                            '<p>' + players_green[i].name + '</p>' +
                                            '<p>0</p>' +
                                        '</div>';
        }
        else
        {
            teamChunk_green_overflow.innerHTML += '<div class="player-score-container" id="player-score-container_green_' + i + '">' + 
                                                        '<p>' + players_green[i].name + '</p>' +
                                                        '<p>0</p>' +
                                                '</div>';
        }
    }

    teamScore_red = 0;
    teamScore_green = 0;

    teamScoreLabel_red.textContent = 0;
    teamScoreLabel_green.textContent = 0;
}
initializeScores();

//---------- DEBUG ----------//

// for testing formatting, score calls and such

var fakePlayers_button = document.getElementById('fake-players_button');
fakePlayers_button.addEventListener('click', function()
{
    if(confirm('This will replace any entered players with sample players, are you sure?') == false)
    {
        return;
    }

    // replace players
    players_red = [{id: 0, name: 'apple', equipid: 100, score: 0},{id: 1, name: 'orange', equipid: 101, score: 0},{id: 2, name: 'lemon', equipid: 102, score: 0},{id: 3, name: 'kiwi', equipid: 103, score: 0}];
    players_green = [{id: 4, name: 'tomato', equipid: 104, score: 0},{id: 5, name: 'cucumber', equipid: 105, score: 0},{id: 6, name: 'carrot', equipid: 106, score: 0},{id: 7, name: 'pepper', equipid: 107, score: 0}];

    // clear event feed
    feedContainer.innerHTML = "";
    eventCount = 0;

    // clear scores
    teamChunk_red.innerHTML = "";
    teamChunk_red_overflow.innerHTML = "";
    teamChunk_green.innerHTML = "";
    teamChunk_green_overflow.innerHTML = "";
    initializeScores();
});

var eventCount = 0;
var fakeEvent_button = document.getElementById('fake-event_button');
fakeEvent_button.addEventListener('click', function()
{
    eventCount++;

    // pick random players
    let randRed = Math.floor(Math.random() * players_red.length);
    let randGreen = Math.floor(Math.random() * players_green.length);

    // remove overflow event
    if(eventCount > 8)
    {
        let targetEvent = eventCount - 8;
        document.getElementById(`event_` + targetEvent).remove();
    }
    
    // points and stuff. proof of concept, a little scuffed
    if(Math.floor(Math.random() * 2))
    {
        feedContainer.innerHTML += `<label class="feed-message" id="event_` + eventCount + `">` + players_red[randRed].name + ` hit ` + players_green[randGreen].name + '</label>';

        players_red[randRed].score = players_red[randRed].score + hitValue;
        teamScore_red += hitValue;
        teamScoreLabel_red.textContent = teamScore_red;

        scorePointer = document.getElementById(`player-score-container_red_` + randRed);
        scorePointer.innerHTML =    '<p>' + players_red[randRed].name + '</p>' +
                                    '<div style="display:flex;">' +
                                        '<img src="static/baseicon_green.png" class="baseicon-image">' +
                                        '<p>' + players_red[randRed].score + '</p>' +
                                    '</div>';
    }
    else
    {
        feedContainer.innerHTML += `<label class="feed-message" id="event_` + eventCount + `">` + players_green[randGreen].name + ` hit ` + players_red[randRed].name + '</label>';

        players_green[randGreen].score = players_green[randGreen].score + hitValue; 
        teamScore_green += hitValue;
        teamScoreLabel_green.textContent = teamScore_green;

        scorePointer = document.getElementById(`player-score-container_green_` + randGreen);
        scorePointer.innerHTML =    '<p>' + players_green[randGreen].name + '</p>' +
                                    '<div style="display:flex;">' +
                                        '<img src="static/baseicon_red.png" class="baseicon-image">' +
                                        '<p>' + players_green[randGreen].score + '</p>' +
                                    '</div>';
    }
});

var clearEventFeed_button = document.getElementById('clear-eventfeed_button');
clearEventFeed_button.addEventListener('click', function()
{
    feedContainer.innerHTML = "";
    eventCount = 0;
});

var clearScores_button = document.getElementById('clear-scores_button');
clearScores_button.addEventListener('click', function()
{
    teamChunk_red.innerHTML = "";
    teamChunk_red_overflow.innerHTML = "";
    teamChunk_green.innerHTML = "";
    teamChunk_green_overflow.innerHTML = "";

    initializeScores();
});

var quitGame_button = document.getElementById('quit-game_button')
quitGame_button.addEventListener('click', function()
{
    window.location.href = "/players";
});