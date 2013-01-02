chrome.app.runtime.onLaunched.addListener(function() {
	chrome.app.window.create('../app.html', {
		'width' : 700,
		'height' : 1000
	});
});