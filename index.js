import path from 'path';
import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import postRoutes from './routes/posts.js';
import userRoutes from './routes/user.js';
import productsRoutes from './routes/products.js';
import processRoutes from './routes/process.js';
import transactionRoutes from './routes/transaction.js';

const app = express();
var __dirname = path.resolve(path.dirname(''));

app.use(bodyParser.json({ limit: '30mb', extended: true }))
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }))
app.use(cors());

//Set view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Routers
app.use('/posts', postRoutes);
app.use('/users', userRoutes);
app.use('/products', productsRoutes);
app.use('/process', processRoutes);
app.use('/transaction', transactionRoutes);


app.use('/', function (req, res) {
  res.render('index');
})

//Connect MongoDB
const CONNECTION_URL = 'mongodb+srv://admin:admin@cluster0.kn2tv.mongodb.net/mchain';
// const CONNECTION_URL = 'mongodb://127.0.0.1:27017/mchain';
const PORT = process.env.PORT|| 5000;

mongoose.connect(CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => app.listen(PORT, () => 
  console.log(`Server Running on Port: http://localhost:${PORT}`)
  ))
  .catch((error) => console.log(`${error} did not connect`));

mongoose.set('useFindAndModify', false);
