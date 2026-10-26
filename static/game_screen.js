console.log(`game-screen.js loaded`);

//---------- DOM ELEMENTS ----------//

var teamChunk_red = document.getElementById('team-chunk_red'),
    teamChunk_red_overflow = document.getElementById('team-chunk_red_overflow'),
    teamChunk_green = document.getElementById('team-chunk_green'),
    teamChunk_green_overflow = document.getElementById('team-chunk_green_overflow'),
    feedContainer = document.getElementById('feed-container');

//---------- NAME/SCORE ARRAYS ----------//

const players_red = JSON.parse(sessionStorage.getItem("players_red"));
const players_green = JSON.parse(sessionStorage.getItem("players_green"));

// DEBUG ENTRIES
// const players_red = [{name: 'apple'},{name: 'orange'},{name: 'lemon'},{name: 'kiwi'},{name: 'lime'},{name: 'cherry'},{name: 'banana'},{name: 'coconut'},{name: 'blueberry'},{name: 'raspberry'},{name: 'strawberry'},{name: 'watermelon'}];
// const players_green = [{name: 'tomato'},{name: 'carrot'},{name: 'cucumber'},{name: 'avocado'},{name: 'corn'},{name: 'squash'},{name: 'onion'},{name: 'lettuce'},{name: 'eggplant'},{name: 'pepper'},{name: 'asparagus'},{name: 'broccoli'}];

var scores_red = [];
var scores_green = [];
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
        scores_red[i] = 0;

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
        scores_green[i] = 0;

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

var fakeEvent_button = document.getElementById('fake-event_button');
var eventCount = 0;

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

        scores_red[randRed] = scores_red[randRed] + hitValue;
        teamScore_red += hitValue;
        teamScoreLabel_red.textContent = teamScore_red;

        scorePointer = document.getElementById(`player-score-container_red_` + randRed);
        scorePointer.innerHTML =    '<p>' + players_red[randRed].name + '</p>' +
                                        '<p>' + scores_red[randRed] + '</p>' +
                                    '</div>';
    }
    else
    {
        feedContainer.innerHTML += `<label class="feed-message" id="event_` + eventCount + `">` + players_green[randGreen].name + ` hit ` + players_red[randRed].name + '</label>';

        scores_green[randGreen] = scores_green[randGreen] + hitValue; 
        teamScore_green += hitValue;
        teamScoreLabel_green.textContent = teamScore_green;

        scorePointer = document.getElementById(`player-score-container_green_` + randGreen);
        scorePointer.innerHTML =    '<p>' + players_green[randGreen].name + '</p>' +
                                        '<p>' + scores_green[randGreen] + '</p>' +
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

quitGame_button.addEventListener('click', function()
{
    window.location.href = "/players";
});