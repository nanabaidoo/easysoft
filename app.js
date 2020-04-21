const express = require('express');
const employeelist = require('./employeelist.json')
const { MongoClient } = require('mongodb')
const app = express();

const url = 'mongodb://localhost:27017';
const client = new MongoClient(url, {useUnifiedTopology: true });
let companyDb;
let companyTodo;

const liveConnect = async () => {
    await client.connect();
    companyDb = await client.db('employeedb');
    companyTodo = await companyDb.collection('todo');
}
liveConnect();


const createTodo = async (data) => {
    try {
        const result = await companyTodo.insertOne(data);
        return result;

    } catch (error) {
        console.log(error)
    }
}

const getAll = async () => {
    try {
        const result = await companyTodo.find({}).toArray();
        return result;
    } catch (error) {
        console.log(error)
    }
} 


app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


app.get('/', (req, res) => {
    res.render('home', { employeelist });
})

app.get('/todoList', async (req, res)=>{
    const todolist = await getAll();
    res.render('todo', {
        todolist
    })
});

app.get('/employeeList', async (req, res)=>{
    res.render('employeeList', {
        employeelist
    })
});

app.get('/manager', async (req, res)=>{
    const todolist = await getAll();
    res.render('admin', {
        employeelist,
        todolist
    });
});
app.post('/newTodo', async(req, res)=>{
    const data = {
        activity: req.body.activity,
        status: req.body.status
    }
    const result = await createTodo(data);
    res.redirect('/manager');
})

app.listen(3000, ()=>{
    console.log('App is listening on port 30000....')
})