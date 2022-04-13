//jshint esversion:8
const express=require("express");
const app=express();
const bodyParser = require("body-parser");
const path = require("path");
const mongoose = require("mongoose");
const port = 3000;
const https = require("https");
const { log } = require("console");


const mempoolJS =require( "@mempool/mempool.js");




app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("views"));

let latest_Block_hash="";
let latest_block_height=0;
let blockTxids=[];

app.get("/", function (req, res) {
  res.sendFile(__dirname+"/index.html");
});


app.post("/", function (req, res) {
  
  const url = "https://api.blockcypher.com/v1/btc/main";
  
  if (req.body.input_block_hash) {
    init(req.body.input_block_hash);
  }else{
    https.get(url, function (response) {
        response.on("data", function (data) {
         latest_Block_hash = JSON.parse(data).hash;
         latest_block_height=JSON.parse(data).height;
          log(latest_Block_hash);
          console.log(latest_block_height);
          init();
          res.write(blockTxids.toString());
          res.send();
        });
      });
  }


 


});


const init = async (hash = latest_Block_hash) => {
  const {
    bitcoin: { blocks },
  } = mempoolJS({
    hostname: "mempool.space",
  });

  blockTxids = await blocks.getBlockTxids({ hash });
  console.log(blockTxids);
};



app.listen(port, function () {
  console.log("Server started listening at port 3000.");
});