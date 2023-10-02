const mongoose = require('mongoose')

const ConnectDB = async () => {
    try {
        await mongoose.connect('mongodb+srv://heroappman:63ko69NRhaRmQVdN@cluster-mi-banana.qtlcdaf.mongodb.net/Mi-Banana-database?retryWrites=true&w=majority')
    } catch (error) {
       console.log(error) 
    }
}

module.exports = ConnectDB