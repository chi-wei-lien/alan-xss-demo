require('dotenv').config()

const express = require('express')
const session = require('express-session');
const app = express()
var mysql = require('mysql');

app.set('views', './views');
app.set('view engine', 'pug');

app.use(express.static(__dirname + '/public'));

app.use(session({
	secret: process.env.MY_SECRET,
  cookie: {
    // this is why you should never set this to false
    httpOnly: false,
  }
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: process.env.DB_PASS,
    database: "xss"
  });

con.connect(function(err) {
  if (err) throw err;
  console.log("MySQL Connected!");
});

app.get('/', async (req, res) => {
  res.render('index');
});

app.get('/dashboard', async (req, res) => {
  con.query("SELECT * FROM Comments", await function (err, result, fields) {
    if (err) throw err;
    console.log(result);
    res.render('dashboard', {cards: result});
  });
});

app.post('/', async (req, res) => {
  var sql = "INSERT INTO Comments VALUES (" + mysql.escape(req.body.comment) + ")";
  con.query(sql, await function (err, result, fields) {
    if (err) throw err;
    res.redirect('/');		
  });

});

app.get('/error', async (req, res) => {
  res.render('error');
});

const port = process.env.PORT;

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })