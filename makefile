# Generate static index (POC)
index:
	echo "Create index"

# Build step
build:
	./node_modules/.bin/lessc --yui-compress ./public/css/stylesheet.less > ./public/css/stylesheet.css
	./node_modules/.bin/browserify ./public/js/index.js > ./public/js/bundle.js
	./node_modules/.bin/uglifyjs ./public/js/bundle.js > ./public/js/bundle.min.js

# Iterate over all tests (used by npm test)
test:
	./node_modules/.bin/lessc -l public/css/stylesheet.less
	tap test/governance/*.js
	tap test/unit/*.js

# Run only governance tests (useful for git pre-commit hook)
lint:
	./node_modules/.bin/lessc -l public/css/stylesheet.less
	node test/governance/lint.js

.PHONY: index build test lint