const express = require("express");
const router = express.Router();
const db = require("../db");
const auth = require("../middleware/auth");


// PUBLIC MEDICINES
router.get("/public", (req, res) => {

const category = req.query.category;

if(category){

db.query(
"SELECT * FROM medicines WHERE LOWER(category) = LOWER(?)",
[category],
(err,result)=>{

if(err){
return res.status(500).json(err);
}

res.json(result);

});

}else{

db.query(
"SELECT * FROM medicines",
(err,result)=>{

if(err){
return res.status(500).json(err);
}

res.json(result);

});

}

});



// ADMIN MEDICINES
router.get("/admin", auth, (req, res) => {

db.query(
"SELECT * FROM medicines",
(err,result)=>{

if(err){
return res.status(500).json(err);
}

res.json(result);

});

});


module.exports = router;