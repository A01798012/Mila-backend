const express = require("express");
const sql = require("mssql");
//const { use } = require("./users");
const router = express.Router();
const sqlConfig = {
    user: 'sa',
    password: process.env.MSSQL_PASSWORD,
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
        console.log('Success')
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
router.post('/comments', async function (req, res){
    const comment = {
        comentario: req.body.comentario,
        gamertag: req.body.gamertag//TODO ???
    };
    try{
        let pool = await sql.connect(sqlConfig);
        let request = pool.request();
        request.input('GamerTag', comment.gamertag);
        request.input('Comentario', comment.comentario);
        let result = await request.execute('PROC_Insertar_Comentario');
        res.status(201).send(result);
    }catch(err){
        console.log('Error', err.message);
        res.status(500).json({error: "No se pueden insertar comentarios por en estos momentos"});
    }
});
//TODO: corregir stored procedure en sql
//validate password
router.post('/login', async function (req, res){
    const user = {
        gamertag: req.body.gamertag,
        password: req.body.password
    };
    try{
        let pool = await sql.connect(sqlConfig);
        let request = pool.request();
        request.input('Gamertag', user.gamertag);
        request.input('Password', user.password);
        let result = await request.execute('PROC_Login_Usuario');
        console.log(result.returnValue);
        res.status(200).json({valid: result.returnValue});
    }catch(err){
        if(err instanceof sql.RequestError){
            console.log('Request Error', err.message);
            res.status(500).json({error: "No se puede iniciar sesion en este momento. Intente más tard"});
        }else{
            console.log('Request Error', err.message);
            res.status(500).json({error: "No se puede iniciar sesion en este momento. Intente más tard"});
        }
    }
});

// TODO: acabar esto pero ahora va a ser post pq por cada partida va a ser una insercion a la bd
//Alter scores

router.post('/scores', async function(req, res){
    const user = {
        gamertag: req.body.gamertag,
        score: req.body.score,
    };
    try{
        let pool = await sql.connect(sqlConfig);
        let request = pool.request();
        request.input('GamerTag', user.gamertag);
        request.input('Puntaje', user.score);
        let result = await request.execute('PROC_Insertar_Puntaje');
        res.status(201).send(result);
    }catch(err){
        console.log(err.message);
        res.status(500).send(err.message);
    }

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
    try{
        let pool = await sql.connect(sqlConfig);
        let request = pool.request();
        request.input('GamerTag', user.gamertag);
        request.input('Password', user.previousPassword);
        request.input('nuevaPassword', user.newPassword);
        request.input('Succes', 1);

        let result = await request.execute('PROC_CambiarPass_Usuario');
        res.send(result);
    }catch(err){
        if(err instanceof sql.RequestError){
            console.log('Request Error', err.message);
            res.status(500).json({error: "No se puede cambiar la constraseña en este momento."});
        }else{
            console.log('Request Error', err.message);
            res.status(500).json({error: "No se puede cambiar la contraseña en este momento. Intente más tard"});

        }
    }
});
//Partida


//TODO: retrieve all scores from all users
router.get('/scores', async function(req, res){
    try{
        let pool = await sql.connect(sqlConfig);
        let request = pool.request();
        let result = await request.execute('PROC_Obtener_Scores')
        res.status(200).json({result: "hola"});
    }catch(err){
        res.status(500).json({error: "error"});
    }
});
//TODO: retrieve score from certain user
router.get('/scores/:gamertag', async function(req, res){

});
//TODO: retrive progress from all users
router.get('/progress', async function(req, res){

});
module.exports = router;

