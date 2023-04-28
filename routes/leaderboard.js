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

router.get('/:page', async function(req, res){
    try{
        let pool = await sql.connect(sqlConfig);
        let request = pool.request();
        request.input('PageNumber', req.params.page);
        let result = await request.execute('PROC_Leaderboard_pagina');
        res.status(200).send(result.recordset);
    }catch(err){
        res.status(500).json({error: err.message});
    }
});

router.get('/country', async function(req, res){
    try{
        let pool = await sql.connect(sqlConfig);
        let request = pool.request();
        let result = await request.execute('PROC_Consultar_Miembros_Pais');
        res.status(200).send(result.recordset);
    }catch(err){
        res.status(500).json({error: err.message});
    }
});


router.get('/progress', async function(req, res){
    try{
        let pool = await sql.connect(sqlConfig);
        let request = pool.request();
        let result = await request.execute('PROC_Consultar_Progreso_Global');
        res.status(200).send(result.recordset);
    }catch(err){
        res.status(500).json({error: err.message});
    }
});
module.exports = router