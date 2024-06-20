const mongoose = require('mongoose')

if (process.argv.length==5) {
    const password = process.argv[2]
    const name1 = process.argv[3]
    const number1 = process.argv[4]

    const url = `mongodb+srv://tylereck81:${password}@cluster0.7swfldn.mongodb.net/Phonebook?retryWrites=true&w=majority&appName=Cluster0`
    mongoose.set('strictQuery',false)
    mongoose.connect(url)

    const contactSchema = new mongoose.Schema({
        name: String,
        number: String,
    })

    const Contact = mongoose.model('Contact', contactSchema)

    const c = new Contact({
        name: name1,
        number: number1,
    })

    c.save().then(result => {
        console.log(`added ${name1} number ${number1} to phonebook`)
        mongoose.connection.close()
    })

}
else if(process.argv.length ==3){ 

    const password = process.argv[2]
    const name1 = process.argv[3]
    const number1 = process.argv[4]

    const url = `mongodb+srv://tylereck81:${password}@cluster0.7swfldn.mongodb.net/Phonebook?retryWrites=true&w=majority&appName=Cluster0`
    mongoose.set('strictQuery',false)
    mongoose.connect(url)

    const contactSchema = new mongoose.Schema({
        name: String,
        number: String,
    })

    const Contact = mongoose.model('Contact', contactSchema)

    console.log("phonebook:")
    Contact.find({}).then(result=>{ 
        result.forEach(contact =>{ 
            console.log(contact.name+" "+contact.number)
        })
        mongoose.connection.close()
    })
    
}
else{ 
    console.log('invalid number of arguments')
    process.exit(1)

}
