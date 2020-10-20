/*
* Port
*/ 
process.env.PORT = process.env.PORT || 3000;

/*
* Token expire in
*
* 60 second
* 60 minute
* 24 hours
* 30 days
*/
process.env.EXPIRE_TOKEN = 60 * 60 * 24 * 30;

/*
* Autentification seed
*/
process.env.SEED = process.env.SEED || 'this-seed-dev';

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

/*
* Google Client Id
*/
process.env.CLIENT_ID = process.env.CLIENT_ID || '162869836804-ii4vhfdk4ogg3adno59usiftnrn406ob.apps.googleusercontent.com';
