const express = require("express");
const sql = require("mssql");
const router = express.Router();
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
// USER
//insert new user
router.post('/', async function(req, res){
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
router.post('/comments', (req, res)=>{
    const comment = {
        comentario: req.body.comentario,
        idUsuario: req.body.idUsuario //TODO ???
    };
    res.send(comment);
});
//validate password
router.post('/passwords', (req, res)=>{
    const password = {
        password: req.body.password
    };
    res.send(password);
});

//alter calificacion
router.put('/scores', (req, res)=>{
    const scores = {
        scores: req.body.scores
    };
    res.send(scores);
});
//alter gamertag
router.put('/gamertags', (req, res)=>{
    const gamertag = {
        gamertag: req.body.gamertag
    }
    res.send(gamertag);
});
//alter password
router.put('/passwords', (req, res)=>{
    const password = {
        user: req.body.user,
        previousPassword: req.body.previousPassword,
        password: req.body.password
    };
    res.send(password);
});
//Partida
//alter score
router.put('/scores', (req, res)=>{
    const scores = {
        user: req.body.user,
        score: req.body.score
    };
    res.send(scores);
});
//alter actual progresss
router.put('/progress', (req, res)=>{
    const progress = {
        user: req.body.user,
        progress: req.body.progress
    };
    res.send(progress);
});

module.exports = router;