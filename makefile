.DEFAULT_GOAL := min

.PHONY: min
min: js/*.js
	@uglifyjs js/*.js -c -o Snowball.min.js 2> MinOutput.out
	@cat MinOutput.out
