/*
* Port
*/ 
process.env.PORT = process.env.PORT || 3000;

/*
* Enviroment
*/
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

/*
* Data BAse
*/
let urlDB

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';    
} else {
    urlDB = process.env.MONGO_ATLAS_URI;
}

process.env.URLDB = urlDB; 
