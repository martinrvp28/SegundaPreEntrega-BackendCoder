import { Router } from "express";
import ProductManager from "../managers/productManager.js";
import * as controller from "../controllers/product.controllers.js";
const router = Router();
import { __dirname } from "../utils.js";

const productManager = new ProductManager(__dirname + '/db/products.json');

router.get('/', async (req,res) => {

    try {
        const products = await service.getAll();
        res.render('home', {products})
    } catch (error) {
        console.log(error.message);
    }
    
});

router.get('/realtimeproducts', (req,res) => {

    res.render('realTimeProducts')


});

export default router;