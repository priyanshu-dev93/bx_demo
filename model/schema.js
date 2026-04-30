// const mongoose = require("mongoose") ;

// const listingSchema = new mongoose.Schema({
//     title:{
//         type: String ,
//         required: true ,
//     },
//     description: String ,

//     image: {
//         filename: String ,
//         url: {
//             type: String ,
//             default: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e" ,
//             set: (v) => v === "" ? "https://images.unsplash.com/photo-1507525428034-b723cf961d3e" : v ,
//         }
//     },
//     price: Number ,
//     location: String ,
//     country: String,
// }) ;

// const Listing = mongoose.model("Listing" ,listingSchema) ;

// module.exports = Listing ;


const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DEFAULT_IMG = "https://images.unsplash.com/photo-1507525428034-b723cf961d3e";

const listingSchema = new Schema({
  
    title: {
      type: String, 
      required: true 
    },
    description: String,

    // Mixed so old object shape or string both accepted
    image: {
      type: Schema.Types.Mixed,
      default: DEFAULT_IMG,
      set: (v) => {
        // if empty or falsy => default
        if (!v || (typeof v === "string" && v.trim() === "")) return DEFAULT_IMG;
        // if old object shape { url: "...", filename: "..." }
        if (typeof v === "object" && v.url) return v.url;
        // otherwise assume string URL
        return v;
      },
    },

    price: Number ,
    location: String ,
    country: String,

  },


  {
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
  }
);

// Virtual that always returns the final image URL
listingSchema.virtual("imageUrl").get(function () {
  if (typeof this.image === "string" && this.image.trim() !== "") return this.image;
  if (this.image && typeof this.image === "object" && this.image.url) return this.image.url;
  return DEFAULT_IMG ;
});

// schema ko medel banaya hai jisse ki CRUD prerform ho paye
const Listing = mongoose.model("Listing", listingSchema) ;
// Isse ye Listing model dusre files me import (require) kiya jaa sakta hai.
module.exports = Listing ;