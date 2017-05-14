# SpartaKino
Node.js / Express.js based movie theater ticket service. Runs on port 3000!

## Project structure
- index.js is the main file which is run when project is run.
- /routes folder contains all the router that are used for different paths. These router are setup for use in index.js.
- /views folder contains the .pug files that create most of the html for the web pages. This project uses the Pug (formaly known as Jade) templating engine to render web pages.
- Files in the /public folder are served as static files so the can be accessed by anyone. This folder contains images, javascript and stylesheets for the webpages.
- This project uses SASS as a css pre processor. Sass style files are located in /public/style/ and are turned into css when needed.
- This project uses JQuery for DOM management and ajax calls. Javascript files are located in /public/js/.
- All the data (except from images) are stored in a MongoDB database located at mongodb://spartakino.dy.fi/spartakino. This project uses Mongoose as a MongoDB api. data.manager.js file contains schema declaration and modelling.
- helper_functions.js file contains functions used across files.

## Installation
- Download this repository
- Install node.js
- Install needed modules with npm. Command: npm install
- Run index.js with command node index.js

## Good to know
There might be a lot of bugs especially with the database, and if there is a database problem you need to contact us for fixing it.
If you want to put the project into debugging mode, set the variable DEBUGGING on top of the index.js file to true.
### Work distribution
The work for this project was done by:
- Mikael Janhonen (75%)
- Adrian Borzyszkowski (20%)
- Juho Kronbäck (5%)