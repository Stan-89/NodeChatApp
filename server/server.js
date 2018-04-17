//This file is the root of our node application.

//The path module comes with node
const path = require('path');
//We are going to need express since we're making a web app
//Recall: express allows us to be a web app instead of just console
const express = require('express');

//Here, we're going to use path: we join the current dir, and go up once, then public
//Now, our variable publicPath will be the path to the public files.
//Instead of always going here, then up, then there. Just do it once and save it
const publicPath = path.join(__dirname, '../public');
//Our environment port or 3000 if none set
const port = process.env.PORT || 3000;
//We need our app since it's an express one.
var app = express();

//Recall: app.use(express.static('dirname')) to be able to serve up
//static files such as .html
app.use(express.static(publicPath));

//Since the port is in a var, listen on it.
app.listen(port, () => {
  console.log(`Server is up on ${port}`);
});
