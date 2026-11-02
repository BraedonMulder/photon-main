function sleep(ms){
	return new Promise(function(resolve){
		setTimeout(resolve, ms);
	});
}
//change the value let i = 30 to something else for when you want to debug.
async function runCountdown(){
	const img = document.createElement('img');
	//img.src = 'static/countdown_images/countdown0.jpg'
	document.body.appendChild(img);
	for(let i = 30; i>= 0; i--){
		new Image().src = 'static/countdown_images/countdown' + i + '.jpg';
	}
	for(let i = 30; i>= 0; i--){
		img.src = 'static/countdown_images/countdown' + i + '.jpg';
		img.alt = 'Countdown ' + i;
		await sleep(1000);
	}
	window.location.href = "/gamescreen";
}
runCountdown();
