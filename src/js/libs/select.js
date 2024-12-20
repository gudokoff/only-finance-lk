import selectize from "@selectize/selectize";

$("select").selectize({
	respect_word_boundaries: false,
	persist: false,
	openOnFocus: false,

	onInitialize: function () {
		var that = this;

		this.$control.on("click", function () {
			that.ignoreFocusOpen = true;
			setTimeout(function () {
				that.ignoreFocusOpen = false;
			}, 50);
		});
	},

	onFocus: function () {
		if (!this.ignoreFocusOpen) {
			this.open();
		}
	}
});