# How To Contribute

## Installation

* `git clone <repository-url>`
* `cd my-addon`
* `npm install`

## Styling changes

Whenever changes are made to a `.less` or `.scss` file,
the changes need to be made in both of these files,
and we need to apply the changes to the CSS file as well.
Run the following command to update the CSS found in `vendor`:

```sh
yarn run compile-css
```

Do not make changes by hand to `ember-power-calendar.css`. 

## Linting

* `npm run lint:hbs`
* `npm run lint:js`
* `npm run lint:js -- --fix`

## Running tests

* `ember test` – Runs the test suite on the current Ember version
* `ember test --server` – Runs the test suite in "watch mode"
* `ember try:each` – Runs the test suite against multiple Ember versions

## Running the dummy application

* `ember serve`
* Visit the dummy application at [http://localhost:4200](http://localhost:4200).

For more information on using ember-cli, visit [https://ember-cli.com/](https://ember-cli.com/).