$(document).ready(() => {
	// background

	const backgroundCookie = (document.cookie.split(';').find(cookie => cookie.trim().startsWith('background')) || '').trim();
	const background = backgroundCookie.substr(backgroundCookie.indexOf('=') + 1);
	const randomBg = ['bg1.jpg', 'bg2.jpg', 'bg3.jpg', 'bg4.jpg', 'bg5.jpg', 'bg6.jpg'][Math.round(Math.random() * 5)];

	if (background === 'rotate' || !background) {
		// falsy check for if no selection has been made, and thus is on standard
		$('body').css('background-image', `url(/images/backgrounds/${randomBg})`);
	}
	else {
		$('body').css('background-image', `url(/images/backgrounds/${background}.jpg)`);
	}

	$('#bg-select').val(background || 'rotate');

	$('#bg-select').change(function() {
		/* eslint-disable no-invalid-this */
		if (this.value !== 'rotate') $('body').css('background-image', `url(/images/backgrounds/${this.value}.jpg)`);
		return document.cookie = `background=${this.value}`;
		/* eslint-enable no-invalid-this */
	});

	// actual functionality

	$.get('/sounds').done(sounds => {
		sounds = sounds.sort((a, b) => a.source.localeCompare(b.source));
		// sort season 1 before season 2 etc

		$.get('/conInfo').done(con => {
			const domainOrIP = document.URL.split('/')[2].split(':')[0];
			const host = con.ssl ? `wss://${domainOrIP}` : `ws://${domainOrIP}:${con.port}`;

			const ws = new WebSocket(host);
			const howlerList = {};

			$('#container').append('<div id="backlink-top"><a class="backlink" href="/">Back</a></div>');
			$('#container').append('<a href="rankings" id="rankings">Rankings</a>');

			// Create buttons and make them play corresponding sounds
			for (const sound of sounds) {
				const source = $(`div.buttons-wrap.source-${sound.source.replace(/\s/g, '-').toLowerCase()}`);

				howlerList[sound.filename] = new Howl({
					src: [`/sounds/${sound.filename}.ogg`, `/sounds/${sound.filename}.mp3`],
				});

				if (sound.filename === 'realname') continue;
				// don't create button for this one

				if (source.length) {
					source.append(`<button id=${sound.filename}>${sound.displayname}</button>`);
				}
				else {
					$('#container').append(`<h1 class="titles">${sound.source}:</h1>`);
					$(`<div class="buttons-wrap source-${sound.source.replace(/\s/g, '-').toLowerCase()}">`)
						.appendTo('#container')
						.append(`<button id=${sound.filename}>${sound.displayname}</button>`);
					// use appendTo to get reference to newly-created wrapper in return value which is then appended to
				}

				if (sound.filename === 'name') {
					$('#name').click(() => {
						const rsound = Math.floor(Math.random() * 100) + 1;

						if (rsound === 42) {
							howlerList.realname.play();
							ws.send(JSON.stringify({ type: 'sbClick', sound: sounds.find(s => s.filename === 'realname') }));
						}
						else {
							howlerList.name.play();
							ws.send(JSON.stringify({ type: 'sbClick', sound: sounds.find(s => s.filename === 'name') }));
						}
					});

					continue;
					// create button but don't use standard click function
				}

				$(`#${sound.filename}`).click(() => {
					howlerList[sound.filename].play();

					ws.send(JSON.stringify({ type: 'sbClick', sound: sounds.find(s => s.filename === sound.filename) }));
				});

				$(`#${sound.filename}`).keypress(key => {
					if (key.which === 13) return key.preventDefault();
					// don't trigger the button on 'enter' keypress
				});
			}

			$('#container').append('<div id="backlink-bottom"><a class="backlink" href="/">Back</a></div>');
			$('#loading').remove();
		});
	});
});