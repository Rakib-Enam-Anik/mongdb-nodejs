const express = require("express");
const mongoose = require("mongoose");

const app = express();

const port = 3002;

app.use(express.json());
app.use(express.urlencoded({extended: true}));

// create product schema
const productsSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    price : {
        type: Number,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});
// create product model
const Product = mongoose.model("Products", productsSchema);

const connectDB = async () => {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/testProductDB');
        console.log("db is connected");
    } catch (error) {
        console.log("db is not connected");
    console.log(error);
    process.exit(1);
    }
};




app.listen(port, async  ()=>{
    console.log(`server is running at http://localhost:${port}`);
    await connectDB();

});

app.get("/",(req,res) => {
    res.send("welcome to home page");
});

// CRUD - Create, Read, Update, Delete

//create
app.post("/products", async (req, res) => {
    try {
        
        const newProduct = new Product ({
            title : req.body.title,
            price : req.body.price,
            description : req.body.description,
    

    });

       const productData = await newProduct.save();

        res.status(201).send({productData});

    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

app.get("/products", async (req, res) => {
    try {
        const products = await Product.find().limit(2);
        if(products){
            res.status(200).send({ 
                success : true,
                message : "return all product",
                data : product});
         }else{
            res.status(404).send({
                success: false,
                message: "products not fond",
            });
         }
    } catch (error){
        res.status(500).send({ message: error.message });
    }
});

//products/111484848
app.get("/products/:id", async (req, res) => {
    try {

        const id = req.params.id;
        const products = await Product.findOne({_id: id});
        if(products){
            res.status(200).send({
                success : true,
                message : "return single product",
                data : product
            });
         }else{
            res.status(404).send({
                success: false,
                message: "product not fond",
            });
         }
    } catch (error){
        res.status(500).send({ message: error.message });
    }
});




//Database -> collections -> document

//POST: /products-> create a pproduct
//GET: /products -> Return all products
//GET: /products -> return a specific product

//put: /products/:id ->update a product based on id
//Delete: /products/:id-> delete a product based on id
