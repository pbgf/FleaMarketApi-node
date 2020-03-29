import express from 'express'
import routes from './routes'
let app = express()

app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With,Content-Type");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    next();
})

app.use('/api', routes)
// User.findAll({
//     limit: 10,
//     offset: 0,
// }).then(function(result) {
//     // success
//     console.log(result)
// }).catch(function(error) {
//     // error
//     console.log(error)
// });

app.get('/', (req,res) => {
    
    //res.send('<h1>hello world</h1>')
    res.send('hello')
})
app.listen(3000,() => {
    console.log('Example app listening on port 3000!')
})
