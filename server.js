const express = require('express');
const bodyparser = require('body-parser');
const app = express();
app.set('view engine', 'ejs')

const ObjectId = require('mongodb').ObjectID
const MongoClient = require('mongodb').MongoClient
const uri = "mongodb+srv://jonathan:21051997@cluster0-xg499.gcp.mongodb.net/test?retryWrites=true&w=majority";

MongoClient.connect(uri,(err,client)=>{
    if(err) return console.log(err)
    db = client.db('cluster0')
    
    app.listen(3000, ()=>{
        console.log('Servidor rodando na porta 3000');
    });
});

app.use(bodyparser.urlencoded({extended:true}));

app.get('/', (req, res)=>{
    res.render('index.ejs');
});

app.get('/', (req,res)=>{
    var cursor = db.collection('data').find()
});

app.get('/show', (req,res)=>{
    db.collection('data').find().toArray((err,results)=> {
        if (err) return console.log(err)
        res.render('show.ejs', {data: results})
    })
})

app.post('/show', (req,res)=>{
    db.collection('data').insertOne(req.body, (err,result)=>{
        if (err) return console.log(err)
        console.log(req.body)
        console.log('Salvo do banco de dados')
        res.redirect("/show")
    });
});

app.route('/edit/:id')
.get((req,res) => {
    var id = req.params.id

    db.collection('data').find(ObjectId(id)).toArray((err,result) => {
        if (err) return res.send(err)
        res.render('edit.ejs', {data: result})
    })
})
.post((req,res) => {
    var id = req.params.id
    var name = req.body.name
    var surname = req.body.surname
    var birthday = req.body.birthday
    var rg = req.body.rg
    var cpf = req.body.cpf
    var cnh = req.body.cnh
    var cep = req.body.cep
    var address = req.body.address
    var risk_group = req.body.risk_group
    var pedido = req.body.pedido

    db.collection('data').updateOne({_id: ObjectId(id)},{
        $set: {
            name: name,
            surname: surname,
            birthday : birthday,
            rg :rg,
            cpf :cpf,
            cnh : cnh,
            cep : cep,
            address : address,
            risk_group : risk_group,
            pedido : pedido
        }
    }, (err, result) => {
        if (err) return res.send(err)
        res.redirect('/show')
        console.log('Atualizado no Banco de dados')
    })
})

app.route('/delete/:id')
.get((req, res) => {
  var id = req.params.id
 
  db.collection('data').deleteOne({_id: ObjectId(id)}, (err, result) => {
    if (err) return res.send(500, err)
    console.log('Deletado do Banco de Dados!')
    res.redirect('/show')
  })
})