$(document).ready(() => {
	$('#login').submit(e => {
		$.post('/api/login', { password: $('#login').serializeArray()[0].value }).done(res => {
			if (res.code === 200) return window.location.href = '/admin';
			else return $('#login-res').text(`Errorcode ${res.code}: ${res.message}`).fadeIn().fadeOut(2000);
		});
		e.preventDefault();
	});
});