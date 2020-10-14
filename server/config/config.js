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
    urlDB = 'mongodb+srv://pablom555:Latella11@dbcluster.jmmze.mongodb.net/cafe?retryWrites=true&w=majority';
}

process.env.URLDB = urlDB; 
