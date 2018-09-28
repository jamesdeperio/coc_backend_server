goto file directory
npm init
npm install --save
sudo npm install -g nodemon --save --unsafe-perms
npm install body-parser --save
npm install express-ws --save
npm install express-fileupload --save
npm install express --save
npm install mysql --save


to run:
nodemon server.js
////
usage: using shopAPI
use chrome ws extension to test
websocket url:
ws://localhost/api/shop

Use postman 

http url:
Insert a row
@POST
Params:
name
description
price
attachment (optional)
http://localhost/api/shop

Update a row
@PUT
Params:
id
name
description
price
attachment (optional)
http://localhost/api/shop

delete a row
@DELETE
Params:
id
http://localhost/api/shop

select all row
@GET
http://localhost/api/shop

search a row
@GET
Params:name
http://localhost/api/shop/[place your query here]
