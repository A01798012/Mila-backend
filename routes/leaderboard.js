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
// Recover statistics of countries to display in graphs.
router.get('/country', async function(req, res){
    try{
        let pool = await sql.connect(sqlConfig);
        let request = pool.request();
        let result = await request.execute('PROC_Consultar_Miembros_Pais');
        const table = result.recordset;
        res.status(200).send({ table });
        console.log('\x1b[32mCountries successfully sent\x1b[0m');
        //console.log(`\x1b[32m${user.gamertag} added correctly to the database\x1b[0m`);

    }catch(err){
        res.status(500).json({error: err.message});
    }
});
// Recover last five comments made by users.
router.get('/comments', async function(req, res){
    try{
        let pool = await sql.connect(sqlConfig);
        let request = pool.request();
        let result = await request.execute('PROC_Obtener_Comentario');
        const table = result.recordset;
        console.log('\x1b[32mComments retrieved\x1b[0m');
        res.status(200).send({ table });
    }catch(err){
        res.status(500).json({error: err.message});
        console.log(err.message);
    }
});

// Get the %progress of every user.
router.get('/progress', async function(req, res){
    try{
        let pool = await sql.connect(sqlConfig);
        let request = pool.request();
        let result = await request.execute('PROC_Consultar_Progreso_Global');
        const table = result.recordset;
        res.status(200).send({ table });
        console.log('\x1b[32mProgreso enviado\x1b[0m');
    }catch(err){
        res.status(500).json({error: err.message});
    }
});
// Get the leaderboard to display it on the webpage
router.get('/:page', async function(req, res){
    try{
        let pool = await sql.connect(sqlConfig);
        let request = pool.request();
        request.input('PageNumber', req.params.page);
        let result = await request.execute('PROC_Leaderboard_pagina');
        const table = result.recordset;
        res.status(200).send({ table });
        //console.log(table);
        console.log(`\x1b[32mSuccessfuly sent page ${req.params.page}\x1b[0m`)

    }catch(err){
        res.status(500).json({error: err.message});
    }
});



module.exports = router
