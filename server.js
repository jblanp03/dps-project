const http = require('./app')
const port = 8080;
const server = http.listen(port, () => {
    console.log('server is running on port', port);
});

module.exports = {http, server};