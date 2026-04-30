const express = require("express");
const app = express();
const path = require("path");

const ejsMate = require('ejs-mate' ) ;
app.engine("ejs" ,ejsMate) ;
app.set("view engine","ejs") ;

app.set("views", path.join(__dirname,"views")) ;
app.use(express.urlencoded({extended:true})) ;

const mongoose = require("mongoose") ;

const Listing = require("./model/schema.js") ;


main()
    .then(() => {
        console.log("connected to DB!") ;
    })
    .catch((err) => {
        console.log(err) ;
    }) ;

async function main() {
   await mongoose.connect("mongodb://localhost:27017/bxDemo");
}

app.get("/" ,(req,res) =>{
    res.send("this is my first page!! ") ;
    console.log(" this is in terminal! ") ;
})

// Index Route
app.get("/listings", async (req,res) =>{
  try {
    // res.send("this is my listings") ;
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
  } catch (err) {
    console.error("Error in /listings:", err);
    res.status(500).send("Error in /listings route");
  }
});


// new route
app.get("/listings/new" ,(req,res) => {
    res.render("listings/new.ejs") ;
})

app.post("/listings" ,async(req,res) =>{
    let newListings = new Listing(req.body.listing) ;
    newListings.save() ;
    res.redirect("/listings") ;
})
 
// show listnigs
app.get("/listings/:id", async(req,res) =>{
    let {id} = req.params ;
    const listings = await Listing.findById(id) ;
    res.render("listings/show.ejs" ,{listings}) ; 

})

app.post("/listings/:id/edit", async(req,res) => {
    let {id} = req.params ;
    const listings = await Listing.findById(id) ;
    res.render("listings/edit.ejs", {listings}) ; 
})

app.listen(8080 ,() =>{
    console.log("server is listening on 8080 : ") ;
})