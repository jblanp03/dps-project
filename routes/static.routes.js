module.exports = (app, express) => {
    app.use('/', express.static('dist'))
}