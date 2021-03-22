const mongoose = require('mongoose');

mongoose.connect(process.env.DATABASE_URI,{
    useNewUrlParser:true,
    useUnifiedTopology:true,
    useFindAndModify:true,
    useCreateIndex:true
}).then(()=>{
    console.log('mongodb is connected')
}).catch((err)=>console.log(err.message))

mongoose.connection.on('connected',() => {
    console.log('Mongoose is connected to Database')
})

mongoose.connection.on('error',(err) => {
    console.log('Mongoose Error: '+ err.message)
})

mongoose.connection.on('disconnected',() => {
    console.log('Mongoose connection to Database is disconnected')
})

