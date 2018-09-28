module.exports = {
  foo:function(router, connection,mc,socketControl) {
    /////SHOP/////
    // POST
    // insert with or without attachment (form-data will do) - support multi-part
    // localhost:3000/api/shop
     router.post('/shop', (req, res) => {
          console.log('request insert', req.body);
          let name = req.body.name;
          let description = req.body.description;
          let price = req.body.price;
          if (!req.files) {
            console.log(`no file to be uploaded`);
            mc.query(`INSERT INTO tbl_shop (name,description,price) VALUES ('${name}','${description}','${price}')`, function (error, results, fields) {
                if (error) return res.send({ error: true, data: error, message: 'Insertion failed' });
                var jsonString={ error: false, data: results, message: 'New row was inserted.' };
                socketControl.sendToConnectedSocket("shop",jsonString);
                return res.send(jsonString);
            });
          }else {
            let attachment = req.files.attachment;
            attachment.mv(`uploaded_files/${attachment.name}`, function(err) {
               if (err) {
                 console.log(`error saving ${attachment.name}`);
                 return res.status(500).send(err);
               }
               console.log(`File uploaded file name: ${attachment.name}`);
               mc.query(`INSERT INTO tbl_shop (name,description,price,imagepath) VALUES ('${name}','${description}','${price}','uploaded_files/${attachment.name}')`, function (error, results, fields) {
                   if (error) return res.send({ error: true, data: error, message: 'Insertion failed.' });
                   var jsonString={ error: false, data: results, message: 'New row was inserted.'};
                   socketControl.sendToConnectedSocket("shop",jsonString);
                   return res.send(jsonString);
               });
           });
          }
     });

    // DELETE
    // delete shop item row
    // localhost:3000/api/shop/
       router.delete('/shop', (req, res) => {
            console.log('request delete', req.body);
            let id = req.body.id;
            mc.query(`DELETE FROM tbl_shop WHERE id = ${id}`, function (error, results, fields) {
                if (error) return res.send({ error: true, data: error, message: 'Deletion failed' });
                var jsonString={ error: false, data: results, message: `Row with ${id} = id was deleted.` };
                socketControl.sendToConnectedSocket("shop",jsonString);
                return res.send(jsonString);
            });
        });

    // PUT
    // update shop item record with or without attachment (form-data will do)  - support multi-part
    // localhost:3000/api/shop/
       router.put('/shop', (req, res) => {
            console.log('request update', req.body);
            let id = req.body.id;
            let name = req.body.name;
            let description = req.body.description;
            let price = req.body.price;
            if (!req.files) {
              mc.query(`UPDATE tbl_shop SET name = '${name}',description = '${description}',price = ${price} WHERE id = ${id}`, function (error, results, fields) {
                  if (error) return res.send({ error: true, data: error, message: 'Unable to updated record.' });
                  return res.send({ error: false, data: results, message: `Row with ${id} = id has been updated.` });
              });
            }else {
              let attachment = req.files.attachment;
              attachment.mv(`uploaded_files/${attachment.name}`, function(err) {
                 if (err) {
                   console.log(`error saving ${attachment.name}`);
                   return res.status(500).send(err);
                 }
                 console.log(`File uploaded file name: ${attachment.name}`);
                 mc.query(`UPDATE tbl_shop SET imagepath='uploaded_files/${attachment.name}', name = '${name}',description = '${description}',price = ${price} WHERE id = ${id}`, function (error, results, fields) {
                     if (error) return res.send({ error: true, data: error, message: 'Unable to update record.' });
                     var jsonString={ error: false, data: results, message: `Row with ${id} = id has been updated.`};
                     socketControl.sendToConnectedSocket("shop",jsonString);
                     return res.send(jsonString);
                 });
             });
            }
        });

    // GET
    // get shop item list
    // localhost:3000/api/shop
      router.get('/shop', (req, res) => {
          console.log('request select', req.body);
          mc.query("SELECT * FROM tbl_shop", function (error, results, fields) {
              if (error) res.send({ error: true, data: error, message: 'Unable to fetch rows.' });
              return res.send({ error: false, data: results, message: 'Items has been fetched.' });
          });
      });
      // GET
      // search by name parameter
      // localhost:3000/api/shop/[item name to be search]
      router.get('/shop/:name', (req, res) => {
            console.log('request search', req.params.name);
            let keyword = req.params.name;
            mc.query(`SELECT * FROM tbl_shop WHERE name LIKE '%${keyword}%'`, function (error, results, fields) {
                if (error) res.send({ error: true, data: error, message: 'Unable to searh a row.' });
                return res.send({ error: false, data: results, message: 'Filtered item has been fetched.' });
            });
      });

      // websocket channel named as shop
      // listen to ws://localhost:3000/api/shop/
    router.ws('/shop', (ws, req) => {
      connection.push({ api: "shop" , connectedSocket : ws });
      ws.on('message', function(msg) {
           console.log(`websocket received: ${msg}`); //log every item sent to check if working
       });
       ws.on('close', function() {
            console.log(`1 socket close`);
            socketControl.removeSocket("shop",ws);
        });
    });

  }
};
