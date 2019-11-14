// подключение express
const express = require("express");
// создаем объект приложения
const app = express();
//parser
const bodyParser = require('body-parser');
// Load the MySQL pool connection
const pool = require('./config');
const testdata = require('./testData');
// Use Node.js body parsing middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true,
}));
// определяем обработчик для маршрута "/"
app.use("/myfiles", express.static(__dirname + "/public")); //in public there is an about.html


// Display all users
app.get('/users', (request, response) => {
    pool.query('SELECT id, name,number FROM phonebook', (error, result) => {
        if (error) throw error;
        response.send(result);
    });
});

app.get('/users/:id', (request, response)=>{
	const id=request.params.id;
	pool.query('SELECT * FROM phonebook WHERE id = ?', id, (error,result) => {
		if (error) throw error;
        response.send(result);
	})
});
app.post('/users', (request, response)=>{
	pool.query('INSERT INTO phonebook SET ?', request.body, (error,result)=>{
		if (error) throw error;
		// response.status(201).send('User added with ID :'+result.insertId);
		response.redirect("/");
	});
});

app.get('/delete',(request,response)=>{ //delete all rows
	pool.query('DELETE FROM phonebook', (error,result)=>{
		if (error) throw error;
		response.redirect("/");
	});
});

app.get('/fill',(request,response)=>{ //fill test data
	pool.query('INSERT INTO phonebook (name, number) VALUES ?', [testdata], (error,result)=>{
		if (error) throw error;
		response.redirect("/");
	});
});


app.get("/", function(request, response){
    response.sendFile(__dirname+"/index.html");
});
// начинаем прослушивать подключения на 3000 порту
app.listen(3000);