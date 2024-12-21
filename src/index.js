const express = require('express');
const app =  express();
const bodyParser = require('body-parser');
const {PORT,FLIGHT_SERVICE_PATH} = require('./config/serverConfig');    
const db = require('./models/index');
const apiRoutes = require('./routes/index');
// const db = require('./models/index');
const setUpAndStartServer = ()=>{
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended:true}));
    console.log(FLIGHT_SERVICE_PATH);
    app.use('/api',apiRoutes);
    app.listen(PORT,()=>{
        console.log(`Server started at port ${PORT}`);
    })
}
setUpAndStartServer();