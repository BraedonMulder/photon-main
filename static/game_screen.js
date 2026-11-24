console.log(`game-screen.js loaded`);

//---------- DOM ELEMENTS ----------//

var teamChunk_red = document.getElementById('team-chunk_red'),
    teamChunk_red_overflow = document.getElementById('team-chunk_red_overflow'),
    teamChunk_green = document.getElementById('team-chunk_green'),
    teamChunk_green_overflow = document.getElementById('team-chunk_green_overflow'),
    feedContainer = document.getElementById('feed-container');

//---------- GAME TIMER ----------//

var timerText = document.getElementById('timer-text');

var gameTimeRemaining = 360; // 6 minutes

function updateGameTimer()
{
    let minutes = Math.floor(gameTimeRemaining / 60);
    let seconds = gameTimeRemaining % 60;

    if(seconds < 10)
    {
        seconds = '0' + seconds;
    }

    timerText.textContent = 'Time Remaining: ' + minutes + ':' + seconds;

    if(gameTimeRemaining > 0)
    {
        gameTimeRemaining--;
    }
    else
    {
        clearInterval(gameTimer);
        console.log('Game over.');
        finishMusic();

        fetch('/api/end_game',
        {
            method: 'POST' // pop up for when game is over
        });
    
        alert('Game Over! Return to the player entry screen to start a new game.');
    }
}

resumeMusic();

updateGameTimer();

var gameTimer = setInterval(updateGameTimer, 1000);

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

//---------- CREATE HTML ELEMENTS ----------//

let scoreCompare = (a, b) => 
{
    if(a.score < b.score)
    {
        return 1;
    }
    if(a.score > b.score)
    {
        return -1;
    }
    return 0;
}

function drawScores(initialize)
{
    teamScore_red = 0;
    teamScore_green = 0;

    teamChunk_red.innerHTML = "";
    teamChunk_red_overflow.innerHTML = "";
    teamChunk_green.innerHTML = "";
    teamChunk_green_overflow.innerHTML = "";

    if(!initialize)
    {
        players_red.sort(scoreCompare);
        players_green.sort(scoreCompare);
    }

    for(let i = 0; i < players_red.length; i++)
    {
        let currPlayer = players_red[i];

        if(initialize)
        {
            currPlayer.score = 0;
            currPlayer.basecount = 0;
        }
        else
        {
            teamScore_red += currPlayer.score;
        }

        let baseScoreHTML = ``;

        if(currPlayer.basecount)
        {
            baseScoreHTML = '<img src="static/baseicon_green.png" class="baseicon-image_green"></img>' +
                            '<p>' + currPlayer.score + '</p>';
        }
        else
        {
            baseScoreHTML = '<p>' + currPlayer.score + '</p>';
        }

        if(i <= 7) // split for better looking formatting. has no reprecussions past this
        {
            teamChunk_red.innerHTML += '<div class="player-score-container">' + 
                                            '<p>' + currPlayer.name + '</p>' +
                                            `<div style="display:flex;">` + 
                                            baseScoreHTML +
                                            '</div>' +
                                        '</div>';
        }
        else
        {
            teamChunk_red_overflow.innerHTML += '<div class="player-score-container">' + 
                                '<p>' + currPlayer.name + '</p>' +
                                `<div style="display:flex;">` + 
                                baseScoreHTML +
                                '</div>' +
                            '</div>';
        }
    }

    for(let i = 0; i < players_green.length; i++)
    {
        let currPlayer = players_green[i];

        if(initialize)
        {
            currPlayer.score = 0;
            currPlayer.basecount = 0;
        }
        else
        {
            teamScore_green += currPlayer.score;
        }

        let baseScoreHTML = ``;

        if(currPlayer.basecount)
        {
            baseScoreHTML = '<img src="static/baseicon_red.png" class="baseicon-image_red"></img>' +
                            '<p>' + currPlayer.score + '</p>';
        }
        else
        {
            baseScoreHTML = '<p>' + currPlayer.score + '</p>';
        }

        if(i <= 7) // split for better looking formatting. has no reprecussions past this
        {
            teamChunk_green.innerHTML += '<div class="player-score-container">' + 
                                            '<p>' + currPlayer.name + '</p>' +
                                            `<div style="display:flex;">` + 
                                            baseScoreHTML +
                                            '</div>' +
                                        '</div>';
        }
        else
        {
            teamChunk_green_overflow.innerHTML += '<div class="player-score-container">' + 
                                '<p>' + currPlayer.name + '</p>' +
                                `<div style="display:flex;">` + 
                                baseScoreHTML +
                                '</div>' +
                            '</div>';
        }
    }

    teamScoreLabel_red.textContent = teamScore_red;
    teamScoreLabel_green.textContent = teamScore_green;

    // assign blinking attribute
    if(teamScore_red > teamScore_green)
    {
        teamScoreLabel_red.className = "teamscore-leading";
        teamScoreLabel_green.className = "";
    }
    else if(teamScore_red < teamScore_green)
    {
        teamScoreLabel_red.className = "";
        teamScoreLabel_green.className = "teamscore-leading";
    }
    else
    {
        teamScoreLabel_red.className = "";
        teamScoreLabel_green.className = "";
    }
}
drawScores(true);

//---------- EVENTS ---------//

async function pollEvents(){
	try{
		let response = await fetch('api/score_buffer');
		let data = await response.json();

		if(data.events && data.events.length > 0){
			data.events.forEach(item => {
				let attacker = item[0];
				let victim   = item[1];
				console.log(`processed event : attacker = ${attacker}, victim = ${victim}`);
        		parseEvent(attacker, victim);
			});
		}
	}catch(error) {
		console.error("Error fetching events : ", error);
	}
}
setInterval(pollEvents, 1000);

async function parseEvent(attackerID, victimID)
{
    let attacker;
    let victim; 

    if((attackerID % 2)) // attacker on red team (odd ID)
    {
        console.log(`red attacker`);
        attacker = players_red.find(x => x.equipid == attackerID);
        
        if(victimID == 53) // friendly base hit
        {
            return;
        }
    }
    else // attacker on green team (even ID)
    {
        console.log(`green attacker`);
        attacker = players_green.find(x => x.equipid == attackerID);

        if(victimID == 43) // friendly base hit
        {
            return;
        }
    }
    console.log(`attacker info: ` + attacker.id + ` ` + attacker.name + ` ` + attacker.score + ` ` + attacker.basecount);

    if(victimID == 53 || victimID == 43) // enemy base hit
    {
        if(attacker.basecount == 1) // attacker has already hit base
        {
            return;
        }

        // attacker hit base for the first time
        attacker.basecount = 1;
        attacker.score += 100;
        
        if(victimID == 53)
        {
            eventFeedback(attacker, "Red Base");
        }
        else
        {
            eventFeedback(attacker, "Green Base");
        }
        
        return;
    }

    if(victimID % 2) // victim on red team (odd ID)
    {
        victim = players_red.find(x => x.equipid == victimID);
    }
    else // victim on green team (even ID)
    {
        victim = players_green.find(x => x.equipid == victimID);
    }

    if((attackerID % 2) != (victimID % 2)) // enemy hit
    {
        attacker.score += 10;
        eventFeedback(attacker, victim.name);
        
        return;
    }

    // friendly fire: both players lose 10 points
    if(!victim || attackerID == victimID)
    {
        console.log(`friendly fire skipped: attacker=${attackerID}, victim=${victimID}, victim found=${!!victim}`);
        return;
    }

    attacker.score -= 10;
    victim.score -= 10;

    drawScores(false);

    feedContainer.innerHTML += `<label class="feed-message">` + attacker.name + ` hit teammate ` + victim.name + ` (friendly fire, -10 each)</label>`;

    while(feedContainer.children.length > 8)
    {
        feedContainer.firstElementChild.remove();
    }
}

// reflect score/base updates, log events
async function eventFeedback(attacker, victimName)
{
    drawScores(false);

    // create new event in log
    feedContainer.innerHTML += `<label class="feed-message">` + attacker.name + ` hit ` + victimName + '</label>';

    while(feedContainer.children.length > 8)
    {
        feedContainer.firstElementChild.remove();
    }
}

//---------- RETURN TO ENTRY SCREEN ----------//
//---------- Control + Backspace ----------//

document.addEventListener('keydown', function(event)
{
    if(event.key == 'Backspace' && event.ctrlKey)
    {
        event.preventDefault();

        window.location.href = "/players";
    }
});
