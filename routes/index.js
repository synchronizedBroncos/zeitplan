var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Zeitplan' });
});

/* Abe's first http get method. */
router.get('/abe', function(req, res, next) {
  res.send('This is Abe\'s first HTTP get method!');
});

/* Alex's first http get method. */
router.get('/alex', function(req, res, next){
   res.send('SYNCRHONIZED');
 });

/* Christian's first http get method. */
router.get('/chris', function(req, res, next) {
	res.send('Hi my name is Christian and let\'s gooooooo');
});

<<<<<<< HEAD
/* Jason's first http get method. */
router.get('/jason', function(req, res, next) {
	res.send('I am groot');
=======
/* Amir's first http get method. */
router.get('/amir', function(req, res, next) {
	res.send('Hi my name is Amir and IM READY');
>>>>>>> c7df3f19d980d280d40a5e6389f1265998b07534
});

module.exports = router;
