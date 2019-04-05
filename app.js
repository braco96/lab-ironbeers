// App principal de Express: configura vistas, estáticos y rutas del ejercicio

const express = require('express');
const hbs = require('hbs');
const path = require('path');
const PunkAPIWrapper = require('punkapi-javascript-wrapper');

const app = express();
const punkAPI = new PunkAPIWrapper();

// 1) Motor de plantillas y carpeta de vistas
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

// 2) Estáticos: servimos /public (CSS, imágenes, etc.)
app.use(express.static(path.join(__dirname, 'public')));

// 3) Parciales de Handlebars para reutilizar vistas (cards de cerveza)
hbs.registerPartials(path.join(__dirname, 'views/partials'));

// 4) Rutas

// Home: muestra portada con enlaces a /beers y /random-beer
app.get('/', (_req, res) => {
  res.render('index');
});

// Listado de cervezas: obtenemos todas desde la API y las pasamos a la vista
app.get('/beers', (_req, res) => {
  punkAPI
    .getBeers()
    .then(beers => res.render('beers', { beers }))
    .catch(error => res.status(500).send(error));
});

// Cerveza aleatoria
app.get('/random-beer', (_req, res) => {
  punkAPI
    .getRandom()
    .then(randomBeer => {
      // La API devuelve array de 1 elemento
      res.render('random-beer', { beer: randomBeer[0] });
    })
    .catch(error => res.status(500).send(error));
});

// Detalle por id (Bonus): reutilizamos la vista y el parcial
app.get('/beers/:id', (req, res) => {
  punkAPI
    .getBeer(req.params.id)
    .then(beer => res.render('beer-details', { beer: beer[0] }))
    .catch(error => res.status(500).send(error));
});

// 5) Arranque del servidor
app.listen(3000, () => console.log('🏃‍ on port 3000'));
