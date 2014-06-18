# YBY Client

This a default YBY client. Built on Angular.js, it's an application that connects to a Yby server.

## Installing

Install Node.js, setup a [Yby server](http://github.com/oeco/yby) and clone this repository.

Copy `app/config.example.js` to `app/config.js` and set configuration options.

Install dependencies:

    npm install

Compile using grunt:

	grunt

You should run this command every time `config.js` is changed, to compile the libraries.

Then, start the server:

    npm start

Your application should be running at [http://localhost:8000](http://localhost:8000).
