$(document).ready(() => {
	const formatNumber = number => number.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1.');

	const updateRanking = sounds => {
		sounds = sounds.sort((a, b) => b.count - a.count);

		$('#rankings').children().detach();

		if (sounds.length === 0) $('#rankings').append('<h1 id="warning">No sounds available.</h1>');

		for (const sound of sounds) {
			if (sound.filename === 'realname') continue;

			$('#rankings').append(`<li id=${sound.filename}>${sound.displayname}: ${formatNumber(sound.count)} clicks</li>`);
		}

		if ($('#loading')) $('#loading').remove();
	};

	$.get('/conInfo').done(con => {
		const domainOrIP = document.URL.split('/')[2].split(':')[0];
		const host = con.ssl ? `wss://${domainOrIP}` : `ws://${domainOrIP}:${con.port}`;

		const ws = new WebSocket(host);

		ws.addEventListener('open', event => {
			ws.addEventListener('message', message => {
				let data;

				try {
					data = JSON.parse(message.data);
				}
				catch (e) {
					data = {};
				}

				if (!['counterUpdate', 'soundUpdate'].includes(data.type)) return;

				if (data.values.sounds) return updateRanking(data.values.sounds);
				// no need to differentiate soundUpdate and counterUpdate because list gets rebuilt each update either way,
				// so it'll automatically include both new numbers and entirely new sounds
			});
		});
	});

	$.get('/sounds').done(sounds => updateRanking(sounds));
});