chrome.app.runtime.onLaunched.addListener(function() {
	chrome.app.window.create('../app.html', {
		'width' : 850,
		'height' : 1000
	});
});