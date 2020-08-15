const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path');

const app = express();

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render('index', {
    contas: req.cookies.contas
  });
});

app.post('/calc', (req, res) => {
  const OP = {
    '+': (n1, n2) => n1 + n2,
    '-': (n1, n2) => n1 - n2,
    '*': (n1, n2) => n1 * n2,
    '/': (n1, n2) => n1 / n2
  }

  let { num1, num2, op } = req.body;
  num1 = parseInt(num1);
  num2 = parseInt(num2);

  const total = OP[op](num1, num2);
  const contas = req.cookies.contas || [];
  contas.push({ num1, num2, op, total });

  // cookies lifetime:
  // expires: get a date
  // maxAge: get a ms
  res.cookie('contas', contas, { maxAge: 5000 });
  res.redirect('/');
});

const port = process.env.PORT || 3001;
app.listen(port, () => console.log('server started at http://localhost:3001'));
