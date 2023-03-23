const express = require('express');

let app = express();
let port = 8000;


app.use(express.static('public'));

app.use('*', function(req, res, next) {
    res.redirect('/');
});


app.listen(port, () => {console.log('Servidor arrancado en el puerto: ' + port)});