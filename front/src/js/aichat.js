function setEndOfContenteditable(contentEditableElement) {
	var range, selection;
	if (document.createRange)//Firefox, Chrome, Opera, Safari, IE 9+
	{
		range = document.createRange();//Create a range (a range is a like the selection but invisible)
		range.selectNodeContents(contentEditableElement);//Select the entire contents of the element with the range
		range.collapse(false);//collapse the range to the end point. false means collapse to end rather than the start
		selection = window.getSelection();//get the selection object (allows you to change selection)
		selection.removeAllRanges();//remove any selections already made
		selection.addRange(range);//make the range you have just created the visible selection
	}
	else if (document.selection)//IE 8 and lower
	{
		range = document.body.createTextRange();//Create a range (a range is a like the selection but invisible)
		range.moveToElementText(contentEditableElement);//Select the entire contents of the element with the range
		range.collapse(false);//collapse the range to the end point. false means collapse to end rather than the start
		range.select();//Select the range (make it the visible selection
	}
}


let maxCharacters = 1000;

$('.js-prompt-textarea').each(function () {
	let textarea = $(this);
	let msg = textarea.closest(".c-aichat__msg");
	let count = msg.find(".js-char-count");

	count.text(textarea.text().length);
})

$(document).on("input propertychange keyup keydown", '.js-prompt-textarea', function (e) {

	let textarea = $(this);
	let msg = textarea.closest(".c-aichat__msg");
	let count = msg.find(".js-char-count");

	var characters = $.trim($(this).text()).replace(/(<([^>]+)>)/ig, "").length;

	if (characters >= (maxCharacters)) {
		if (e.keyCode != 8) {
			e.preventDefault();
		}
		$(this).html($(this).text().substring(0, maxCharacters))

		setEndOfContenteditable($(this)[0]);

		count.addClass('over');
	} else {
		count.removeClass('over');
	}
	count.text(characters);
});

$(document).on("click", "[data-tab-id]", function (e) {
	e.preventDefault();

	let btn = $(this);
	let tabId = btn.attr('data-tab-id');
	let body = $(`[data-tab-body="${tabId}"]`);

	btn.siblings().removeClass("is-active");
	btn.addClass("is-active");

	body.siblings().removeClass("is-active");
	body.addClass("is-active");
});