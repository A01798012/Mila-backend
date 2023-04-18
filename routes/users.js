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
    try{
        let pool = await sql.connect(sqlConfig);
        let request = pool.request();
        request.input('NombreUsuario', user.nombreUsuario);
        request.input('PrimerApellido', user.primerApellido);
        request.input('GamerTag', user.gamertag);
        request.input('Password', user.password);
        request.input('Fecha', user.fecha);
        request.input('EmailTutor', user.emailTutor);
        let result = await request.execute('PROC_Insertar_Usuario');
        res.status(201).send(result);
    }catch(err){
        if(err instanceof sql.RequestError){
            console.log('Request Error:', err.message);
            res.status(500).json({error: "Usuario ya registrado"});
        }else{
            console.log('Unknown error', err.message);
            res.status(500).json({error: "No se puede registrar al usuario en estos momentos"});
        }
    }
});
//TODO:insert comment
router.post('/comments', (req, res)=>{
    const comment = {
        comentario: req.body.comentario,
        idUsuario: req.body.idUsuario //TODO ???
    };
    res.send(comment);
});
//TODO: corregir stored procedure en sql
//validate password
router.post('/passwords', async function (req, res){
    const user = {
        gamertag: req.body.gamertag,
        password: req.body.password
    };
    let pool = await sql.connect(sqlConfig);
    let request = pool.request();
    request.input('Gamertag', user.gamertag);
    request.input('Password', user.password);
    request.input('Succes', 0);
    let result = await request.execute('PROC_Login_Usuario');
    res.send(result);
});

// TODO: acabar esto
//Alter scores
router.put('/scores', async function(req, res){
    const scores = {
        gamertag: req.body.gamertag,
        scores: req.body.scores
    };
    let pool = await sql.connect(sqlConfig);
    let request = pool.request();

    let result = await request.execute('')
    res.send(scores);
});
//alter gamertag
router.put('/gamertags', async function(req, res){
    const gamertag = {
        prevGamertag: req.body.prevGamertag,
        gamertag: req.body.gamertag
    }
    try{
        const pool = await sql.connect(sqlConfig);
        const request = pool.request();
        request.input('PrevGametag', gamertag.prevGamertag);
        request.input('Gametag', gamertag.gamertag);
        let result = await request.execute('PROC_Actualizar_Gametag');
        res.send(result);
    }catch(err){
        if(err instanceof sql.RequestError){
            console.log('Request Error', err.message);
            res.status(500).json({error: "Gamertag no encontrado"});
        }else{
            console.log('Unknown error', err.message);
            res.status(500).json({error: "No se puede cambiar el gamertag en estos momentos"});
        }
    }
});
//TODO: corregir el stored procedure en sql
//alter password
router.put('/passwords', async function(req, res){
    const user = {
        gamertag: req.body.gamertag,
        previousPassword: req.body.previousPassword,
        newPassword: req.body.newPassword
    };
    let pool = await sql.connect(sqlConfig);
    let request = pool.request();
    request.input('GamerTag', user.gamertag);
    request.input('Password', user.previousPassword);
    request.input('nuevaPassword', user.newPassword);
    request.input('Succes', 1);

    let result = await request.execute('PROC_CambiarPass_Usuario');
    res.send(result);
});
//Partida
//TODO:
//alter score
router.put('/scores', (req, res)=>{
    const scores = {
        user: req.body.user,
        score: req.body.score
    };
    res.send(scores);
});
//TODO:
//alter actual progresss
router.put('/progress', (req, res)=>{
    const progress = {
        user: req.body.user,
        progress: req.body.progress
    };
    res.send(progress);
});

module.exports = router;