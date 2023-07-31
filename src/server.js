import express from 'express';
import morgan from 'morgan';
import { errorHandler } from './middlewares/errorHandler.js';
import productsRouter from './routes/productsRouter.js';
import cartRouter from './routes/cartRouter.js';
import handlebars from 'express-handlebars';
import viewsRouter from './routes/views.router.js';
import { __dirname } from "./utils.js";
import { Server } from 'socket.io';
import ProductManager from './managers/productManager.js';

import { getAll } from './controllers/product.controllers.js';

import './daos/mongodb/connection.js';

const productManager = new ProductManager(__dirname + '/db/products.json');

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));
app.use(morgan('dev'));
app.use(errorHandler);

app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');

app.use('/api/products', productsRouter);
app.use('/api/carts', cartRouter);

app.use('/', viewsRouter);

const PORT = 8080;

const httpServer = app.listen(PORT, ()=> {
    console.log(`server ok en puerto ${PORT}`)
});

const socketServer = new Server(httpServer);

socketServer.on('connection', async (socket) => {

    console.log(`Cliente conectado: ${socket.id}`)

    socket.emit('allProducts', await productManager.getProducts());

    socket.on('disconnect', () =>{
        console.log(`Cliente Desconectado: ${socket.id}`)
    })

    socket.on('newProduct', async (prod) => {
        const add = await productManager.addProduct(prod);
        socketServer.emit('allProducts', await productManager.getProducts());
    })

    socket.on('deleteProd', async (id) => {

        const del = await productManager.deleteProduct(id);
        socketServer.emit('allProducts', await productManager.getProducts());
    })


});