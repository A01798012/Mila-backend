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

router.get('/country', async function(req, res){
    try{
        let pool = await sql.connect(sqlConfig);
        let request = pool.request();
        let result = await request.execute('PROC_Consultar_Miembros_Pais');
        const table = result.recordset;
        res.status(200).send({ table });
        console.log('Countries successfully sent')
    }catch(err){
        res.status(500).json({error: err.message});
    }
});

router.get('/comments', async function(req, res){
    try{
        let pool = await sql.connect(sqlConfig);
        let request = pool.request();
        let result = await request.execute('PROC_Obtener_Comentario');
        const table = result.recordset;
        console.log('Comments retrieved');
        res.status(200).send({ table });
    }catch(err){
        res.status(500).json({error: err.message});
        console.log(err.message);
    }
});


router.get('/progress', async function(req, res){
    try{
        let pool = await sql.connect(sqlConfig);
        let request = pool.request();
        let result = await request.execute('PROC_Consultar_Progreso_Global');
        console.log(result.recordset[0]['Cantidad']);
        const table = result.recordset;
        res.status(200).send({ table });
        console.log('Progreso enviado');
    }catch(err){
        res.status(500).json({error: err.message});
    }
});

router.get('/:page', async function(req, res){
    try{
        let pool = await sql.connect(sqlConfig);
        let request = pool.request();
        request.input('PageNumber', req.params.page);
        let result = await request.execute('PROC_Leaderboard_pagina');
        const table = result.recordset;
        res.status(200).send({ table });
        console.log(`Pagina ${req.params.page} enviada`);
    }catch(err){
        res.status(500).json({error: err.message});
    }
});



module.exports = router