const https = require('https');
const port = 443;


const server = https.createServer(function (req, res) {
    
})


server.listen(port, function(error){
    if (error) {
        console.log('Something went wrong', error);
    }else{
        console.log('Server is listening on port ', port);
    }
});