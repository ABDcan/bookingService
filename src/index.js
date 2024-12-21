const express = require('express');
const app =  express();
const bodyParser = require('body-parser');
const {PORT} = require('./config/serverConfig');    
const apiRoutes = require('./routes/index');
const db = require('./models/index');
const setUpAndStartServer = ()=>{
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended:true}));
    app.use('/api',apiRoutes);
    app.listen(3002,()=>{
        console.log(`Server started at port ${PORT}`);
    })
    db.sequelize.sync({alter:true});
}
setUpAndStartServer();