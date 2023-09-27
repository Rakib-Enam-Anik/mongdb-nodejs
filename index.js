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
        required: [ true, "product title is required"],
        minlength: [3, "minimum length of the product title should be 3"],
        maxlength: [10, "maximum length of the product title shoild be 10"],
        trim : true, //iphone
        validate: {
            validator: function (v){
                return v.length === 10
            },
            message: (props) => `${props.value} is not a valid title`,
        }
      
    },
    price : {
        type: Number,
        min: [200, "maximum price of the product should be 200"],
        max: [2000, "maximum price of the product should be 2000"],
        required: true,
    },
    email : {
        type: String,
        required: true,
    },
    rating : {
        type: Number,
        required: true,
    },
    phone : {
        type: String,
        required: [true, "phone number is required"],
        validate: {
            validator: function(v){
                const phoneRegex = /\d{3}-\d{3}-\d{4}/;
                return phoneRegex.test(v);
               
            },
            message: (props) => `${props.value} is not a valid phone number`
        }
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
            rating : req.body.rating,
            phone : req.body.phone,
            description : req.body.description,
    

    });

       const productData = await newProduct.save();

        res.status(201).send({productData});

    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});


price = 500


app.get("/products", async (req, res) => {
    try {
         const price = req.query.price;
         const rating = req.query.rating;

        let products
        if(price && rating){
             products = await Product.find({$and:[{ price:  { $gt: price }}, { ratigs: { $gt: rating }}],
            }).sort({price : 1}).select({title:1});
        }else{
             products = await Product.find().sort({price : 1});
        }
        
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

//Create
app.get("/products", async (req, res) => {
    try { 
        const newProduct = new Product({
            title: req.body.title,
             price: req.body.price,
             rating: req.body.rating,
            description: req.body.price,

        })
       
        if(price){
            const products = await Product.find({$and:[{ price:  { $gt: price }}, { ratigs: { $gt: 4}}]});
        }else{
            const products = await Product.find();
        }
        
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

app.delete("/products/id:", async (req,res)=>{
    try{
        const id = req.params.id;
        const product = await Product.deleteOne({_id: id})
        if(products){
            res.status(200).send({
                success : true,
                message : "deleted single product",
                data : product
            });
         }else{
            res.status(404).send({
                success: false,
                message: "Product was not deleted",
            });
         }
    } 
     catch (error){
        res.status(500).send({ message: error.message });
    }
})

app.put("/products/:id", async (req, res) =>{
    try {
        const id = req.params.id;
        const updateProduct = await Product.updateOne(
            {_id: id},
            {
                $set: {
                    title: req.body.title,
                    price: req.body.price,
                    description: req.body.description,
                    rating:req.body.rating,
                },
            },
            { new: true}
        );
        if(updatedproduct){
            res.status(200).send({
                success : true,
                message : "was updated product",
                data : product
            });
         }else{
            res.status(404).send({
                success: false,
                message: "Product was not updated",
            });
         }
    } 
     catch (error){
        res.status(500).send({ message: error.message });
    }
})
    



//Database -> collections -> document

//POST: /products-> create a pproduct
//GET: /products -> Return all products
//GET: /products -> return a specific product

//put: /products/:id ->update a product based on id
//Delete: /products/:id-> delete a product based on id
