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
        segundoApellido: req.body.segundoApellido,
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
        request.input('SegundoApellido', user.segundoApellido);
        request.input('GamerTag', user.gamertag);
        request.input('Password', user.password);
        request.input('Fecha', user.fecha);
        request.input('EmailTutor', user.emailTutor);
        let result = await request.execute('PROC_Insertar_Usuario');
        res.status(201).send(result);
        console.log(`\x1b[32m${user.gamertag} added correctly to the database\x1b[0m`);
    }catch(err){
        if(err instanceof sql.RequestError){
            console.log('Request Error:', err.message);
            res.status(500).json({error: `El gamertag \"${user.gamertag}\" ya esta ocupado`});
            //console.log('\x1b[33m Welcome to the app! \x1b[0m');
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
        console.log(`\x1b[35m${comment.gamertag} agrego el comentario: ${comment.comentario}\x1b[0m`);
        res.status(201).json({valid: 1});
    }catch(err){
        console.log('Error', err.message);
        res.status(500).json({error: "No se pueden insertar comentarios por en estos momentos", valid: 0});
    }
});
//TODO: corregir stored procedure en sql
//validate password
router.post('/login', async function (req, res){
    const user = {
        gamertag: req.body.gamertag,
        password: req.body.password
    };
    //console.log(req.body);
    try{
        let pool = await sql.connect(sqlConfig);
        let request = pool.request();
        request.input('Gamertag', user.gamertag);
        request.input('Password', user.password);
        let result = await request.execute('PROC_Login_Usuario');

        console.log(`Access ${result.returnValue} to "${user.gamertag}"`);
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
    console.log(req.body);
    try{
        let pool = await sql.connect(sqlConfig);
        let request = pool.request();
        request.input('GamerTag', user.gamertag);
        request.input('Puntaje', user.score);
        let result = await request.execute('PROC_Insertar_Puntaje');
        console.log('Score successfully registered')
        res.status(201).json({message: "Successfully inserted score"});
    }catch(err){
        if(err instanceof sql.RequestError){
            console.log('Request Error', err.message);
            res.status(500).send(err.message);
        }else{
            console.log(err.message);
            res.status(500).send(err.message);
        }
        
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
        console.log('Gamertag altered correctly');
        res.status(200).json({valid: 1});
    }catch(err){
        if(err instanceof sql.RequestError){
            console.log('Request Error', err.message);
            res.status(500).json({valid: 0});
        }else{
            console.log('Unknown error', err.message);
            res.status(500).json({error: "No se puede cambiar el gamertag en estos momentos"});
        }
    }
});

router.put('/progress', async function(req, res){
    const user = {
        gamertag: req.body.gamertag,
        progreso: req.body.progreso
    }
    try{
        const pool = await sql.connect(sqlConfig);
        const request = pool.request();
        request.input('Gamertag', user.gamertag);
        request.input('Progreso', user.progreso);
        let result = await request.execute('PROC_Udate_Progress');
        console.log(`\x1b[32mProgress of "${user.gamertag}"updated to ${user.progreso}\x1b[0m`);
        res.status(200).json({message: `Progress of "${user.gamertag}"updated to ${user.progreso}`});
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
router.put('/calificacion', async function(req, res){
    const user = {
        gamertag: req.body.gamertag,
        calificacion: req.body.calificacion
    }
    console.log(req.body);
    try{
        const pool = await sql.connect(sqlConfig);
        const request = pool.request();
        request.input('Gamertag', user.gamertag);
        request.input('Calificacion', user.calificacion);
        let result = await request.execute('PROC_Udate_Calificacion');
        
        console.log(`\x1b[32mCalificacion of "${user.gamertag}"updated to ${user.calificacion}\x1b[0m`);
        res.status(200).json({message: `Calificacion of "${user.gamertag}"updated to ${user.calificacion}`, valid: 1});
    }catch(err){
        if(err instanceof sql.RequestError){
            console.log('Request Error', err.message);
            res.status(500).json({error: "Gamertag no encontrado", valid: 0});
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

        let result = await request.execute('PROC_CambiarPass_Usuario');
        console.log('Password altered correctly');
        res.status(200).json({valid: 1});
    }catch(err){
        if(err instanceof sql.RequestError){
            console.log('Request Error', err.message);
            res.status(500).json({error: "No se puede cambiar la constraseña en este momento.", valid: 0});
        }else{
            console.log('Request Error', err.message);
            res.status(500).json({error: "No se puede cambiar la contraseña en este momento. Intente más tard"});

        }
    }
});
//Partida
//TODO: retrieve score from certain user
router.get('/scores/:gamertag', async function(req, res){ //Regresa las puntuaciones de cierto usuario
    try{
        let pool = await sql.connect(sqlConfig);
        let request = pool.request();
        request.input('Gamertag', req.params.gamertag);
        let result = await request.execute('PROC_Obtener_Scores_Usuario')
        const table = result.recordset;
        res.status(200).send({ table });
        console.log(result.recordset);
    }catch(err){
        res.status(500).json({error: "error"});
    }
});
router.get('/progreso/:gamertag', async function(req, res){ //Regresa el progreso en % que se lleva del juego
    try{
        let pool = await sql.connect(sqlConfig);
        let request = pool.request();
        request.input('Gamertag', req.params.gamertag);
        let result = await request.execute('PROC_Consultar_Progreso_Usuario');
        const table = result.recordset;
        res.status(200).send({ table });
        console.log('Progreso enviado correctamente');
    } catch(err){
        console.log('Error', err.message);
        res.status(500).send({error: err.message});
    }
});

router.get('/partidas/:gamertag', async function(req, res){ // Regresa el numero de partidas jugadas
    try{
        let pool = await sql.connect(sqlConfig);
        let request = pool.request();
        request.input('Gamertag', req.params.gamertag);
        let result = await request.execute('PROC_Partidas_Jugadas'); //
        const table = result.recordset;
        res.status(200).send({ table });
        console.log('Partidas enviadas correctamente');
    } catch(err){
        console.log('Error', err.message);
        res.status(500).send({error: err.message});
    }
});

router.get('/maximoPuntaje/:gamertag', async function(req, res){ // Regresa el puntaje maximo de un jugador
    try{
        let pool = await sql.connect(sqlConfig);
        let request = pool.request();
        request.input('Gamertag', req.params.gamertag);
        let result = await request.execute('PROC_Obtener_Puntaje_Maximo'); //
        const table = result.recordset;
        res.status(200).send({ table });
        console.log('Puntaje maximo correctamente');
    } catch(err){
        console.log('Error', err.message);
        res.status(500).send({error: err.message});
    }
});

module.exports = router;



