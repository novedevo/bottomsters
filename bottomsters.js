class Bottomsters {
	/**
	 * Constructs a Bottomsters object. The provided displayId will be filled with a square canvas
	 * taking up as much room as possible.
	 * @param {string} displayId - The ID of the DOM element to append the display canvas to
	 */
	constructor(displayId) {
		this.canvas = document.createElement('canvas');

		// Assumes a 5x5 collage where each image is 300x300
		this.canvas.width = 300 * 5;
		this.canvas.height = 300 * 5;

		this.ctx = this.canvas.getContext('2d');

		this.displayDom = document.getElementById(displayId);
		this.resizeDisplay();
		this.displayDom.appendChild(this.canvas);

		window.addEventListener('resize', function () {
			this.resizeDisplay();
		}.bind(this));
	}

	async makeLastFmChart(username, timeframe) {
		let albums = await this.getAlbums(username, timeframe);
		this.drawCollage(albums);
	}

	async getAlbums(username, timeframe) {
		return await fetch(
			`https://3g5e43is58.execute-api.us-west-2.amazonaws.com/prod/lastfm_import/${username}/${timeframe}`
		)
			.then((res) => res.text())
			.then((text) => {
				return JSON.parse(text.substring(0, text.length - 1) + "]");
			});
	}

	drawCollage(albums) {
		for (let i = 0; i < albums.length; ++i) {
			let album = albums[i];

			// Copy the index here so the anonymous function for onload doesn't use `i` as it would
			// have incremented beyond this image.
			let curri = i;
			let btm = this;

			let image = document.createElement("img");
			image.src = album.src;

			// https://stackoverflow.com/a/30517793
			image.crossOrigin = "anonymous";

			image.onload = function () {
				btm.ctx.drawImage(
					image,
					(curri % 5) * 300,
					Math.floor(curri / 5) * 300,
					300,
					300
				);
				console.log(album.title + " " + curri);
			}
		}
	}

	resizeDisplay() {
		let sidelength = Math.min(this.displayDom.clientWidth, this.displayDom.clientHeight);
		this.canvas.style.width = sidelength + 'px';
		this.canvas.style.height = sidelength + 'px';
	}

	download() {
		// https://stackoverflow.com/a/43523297
		let a = document.createElement('a');
		a.text = "Download PNG";
		a.href = this.canvas.toDataURL('image/png');
		a.download = "bottomsters.png";
		a.click();
	}
}