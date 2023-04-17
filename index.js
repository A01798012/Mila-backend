const express = require("express");
const sql = require("mssql");
const app = express();
app.use(express.json());
// TUTOR
//insert new tutor

const sqlConfig = {
    user: 'sa',
    password: process.env.db_pswd,
    server: 'localhost',
    database: 'JuegoCrackTheCode',
    port: 1433,
    options:{
        encrypt: true,
        trustServerCertificate: true
    }
};
//insert tutor
app.post('/api/tutors', async function (req, res) {
    const tutor = {
        nombreTutor: req.body.nombreTutor,
        primerApellido: req.body.primerApellido,
        email: req.body.email,
        password: req.body.password,
        telefono: req.body.telefono,
        codTel: req.body.codTel
    };
    let pool = await sql.connect(sqlConfig);
    let request = pool.request();
//    request.input(tutor.nombreTutor, tutor.primerApellido, tutor.email, tutor.password, tutor.telefono, tutor.codTel);
    request.input('NombreTutor', tutor.nombreTutor);
    request.input('PrimerApellido', tutor.primerApellido);
    request.input('Email', tutor.email);
    request.input('Password', tutor.password);
    request.input('Telefono', sql.Int, tutor.telefono);
    request.input('CodTel', sql.Int , tutor.codTel);
    let result = await request.execute('PROC_Insertar_Tutor');
    res.send(result);
});
//alter password
app.put('/api/tutors/passwords', (req, res)=>{
    const password ={
        password: req.body.password
    };
    res.send(password.password);
});

//:

// USER
//insert new user
app.post('/api/users', async function(req, res){
    const user = {
        nombreUsuario: req.body.nombreUsuario,
        primerApellido: req.body.primerApellido,
        gamertag: req.body.gamertag,
        password: req.body.password,
        fecha: req.body.fecha,
        emailTutor: req.body.emailTutor
    };
    let pool = await sql.connect(sqlConfig);
    let request = pool.request();
    request.input('NombreUsuario', user.nombreUsuario);
    request.input('PrimerApellido', user.primerApellido);
    request.input('GamerTag', user.gamertag);
    request.input('Password', user.password);
    request.input('Fecha', user.fecha);
    request.input('EmailTutor', user.emailTutor);
    let result = await request.execute('PROC_Insertar_Usuario');
    res.send(result);
});
//insert comment
app.post('/api/users/comments', (req, res)=>{
    const comment = {
        comentario: req.body.comentario,
        idUsuario: req.body.idUsuario //TODO ???
    };
    res.send(comment);
});
//validate password
app.post('/api/users/passwords', (req, res)=>{
    const password = {
        password: req.body.password
    };
    res.send(password);
});

//alter calificacion
app.put('/api/users/scores', (req, res)=>{
    const scores = {
        scores: req.body.scores
    };
    res.send(scores);
});
//alter gamertag
app.put('/api/users/gamertags', (req, res)=>{
    const gamertag = {
        gamertag: req.body.gamertag
    }
    res.send(gamertag);
});
//alter password
app.put('/api/users/passwords', (req, res)=>{
    const password = {
        user: req.body.user,
        previousPassword: req.body.previousPassword,
        password: req.body.password
    };
    res.send(password);
});
//Partida
//alter score
app.put('/api/users/scores', (req, res)=>{
    const scores = {
        user: req.body.user,
        score: req.body.score
    };
    res.send(scores);
});
//alter actual progresss
app.put('/api/progress', (req, res)=>{
    const progress = {
        user: req.body.user,
        progress: req.body.progress
    };
    res.send(progress);
});
const port = 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
