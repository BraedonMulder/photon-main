//---------- GAME MUSIC ----------//

// Each track has its own "5, 4, 3, 2, 1" countdown that starts 10 seconds in.
// The countdown screen loads a random track right away, then starts playing it
// when the countdown shows 15, so the track says "5" when the screen shows 5.
// The game screen (a new page) picks the same track back up where it left off.

var gameMusic = new Audio();

// countdown screen: ask the server for a random track and load it (does not play yet)
async function loadRandomMusic()
{
    try
    {
        let response = await fetch('/api/random_track');
        let data = await response.json();

        if(!data.success)
        {
            return;
        }

        sessionStorage.setItem('music_track', data.track);
        sessionStorage.setItem('music_time', 0);

        gameMusic.src = data.track;
        gameMusic.preload = 'auto';
        gameMusic.load();
    }
    catch(error)
    {
        console.log('Could not load music:', error);
    }
}

// countdown screen: start the loaded track from the beginning
async function playMusic()
{
    try
    {
        gameMusic.currentTime = 0;
        await gameMusic.play();
    }
    catch(error)
    {
        console.log('Could not start music:', error);
    }
}

// countdown screen: remember how far into the track we are before leaving the page
function saveMusicPosition()
{
    sessionStorage.setItem('music_time', gameMusic.currentTime);
}

// game screen: continue the same track from where the countdown stopped
async function resumeMusic()
{
    let track = sessionStorage.getItem('music_track');

    if(track == null)
    {
        return;
    }

    gameMusic.src = track;
    gameMusic.currentTime = Number(sessionStorage.getItem('music_time')) || 0;

    try
    {
        await gameMusic.play();
    }
    catch(error)
    {
        console.log('Could not resume music:', error);
    }
}

// game screen: when the game ends, let the track play out to its own ending
// (each track keeps going for a few seconds after 0:00 and then fades out)
function finishMusic()
{
    sessionStorage.removeItem('music_track');
    sessionStorage.removeItem('music_time');
}
