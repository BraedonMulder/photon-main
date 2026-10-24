function sleep(ms){
	return new Promise(function(resolve){
		setTimeout(resolve, ms);
	});
}

async function runCountdown(){
	const img = document.createElement('img');
	//img.src = 'static/countdown_images/countdown0.jpg'
	document.body.appendChild(img);
	for(let i = 5; i>= 0; i--){
		new Image().src = 'static/countdown_images/countdown' + i + '.jpg';
	}
	for(let i = 5; i>= 0; i--){
		img.src = 'static/countdown_images/countdown' + i + '.jpg';
		img.alt = 'Countdown ' + i;
		await sleep(1000);
	}
	window.location.href = "/gamescreen";
}
runCountdown();
