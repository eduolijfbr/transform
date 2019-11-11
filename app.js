var app = require("express")();
var express = require('express');
var app = express();
const fs = require('fs');
const port = 3000;
var origin = {};

app.set('view engine', 'ejs');

const pg = require('pg');
const pool = new pg.Pool({
	user: 'postgres',
	host: 'localhost',
	database: 'base',
	password: 'xxxx',
	port: '1234'
});

app.get('/', (request, response) => {
		response.render('conexao');
})

app.get('/listar', (request, response) => {
	pool.query('select f_table_name as tabela, f_geometry_column as geometria, srid, type as tipo from geometry_columns where f_table_schema = \'public\' order by f_table_name;', (error, results) => {
		if (error) {
			throw error
		}		
		origin = results.rows;
		response.render('listar', {list: origin});
	})
})


app.get('/info/:tabela/:geometria/:srid/:tipo', function(req, res){

	var tabela = req.params.tabela;
	var geometria = req.params.geometria;
	var srid = parseInt(req.params.srid);
	var tipo = req.params.tipo;
	
	//console.log(tabela, geometria, srid, tipo);

	var string_text = "SELECT table_name as tabela, column_name as nome, udt_name as tipo FROM information_schema.columns WHERE table_name = '"+tabela+"';";
	//console.log(string_text);

	pool.query(string_text, (error, results) => {
		if (error) {			
			throw error
		}
		origin = results.rows;
		res.render('info', {list: origin});
	})

});

app.listen(port, function(){
	console.log(`Servidor rodando na porta ${port}.`);
});

