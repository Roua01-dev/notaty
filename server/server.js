const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const serverless=require('serverless-http');
const app = express();
const Database = require("./Database");
const db = new Database();

const serverlessApp = serverless(app);

// Export the serverless app
module.exports.handler = async (event, context) => {
  // Forward the event and context to the serverless app
  return await serverlessApp(event, context);
};
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//create POST API to be able to create a new note
app.post("/notes", (req, res) => {
  const body = req.body;
  console.log("body:", body);
  //data raj3tli men mongodb
  db.addNote(body).then(data=>{
    res.send(data);
  }).catch(err=>{
    res.status(500).send(err)
  })

});


app.get("/notes", (req, res) => {
    const{title}=req.query;
    if (title){
        db.getNotesByTitle()
        .then(data=>{
            res.send(data);
        })
        .catch(err=>{
            res.status(500).send(err);
        })


    }else{
        db.getNotes()
        .then(data=>{
            res.send(data);
        })
        .catch(err=>{
            res.status(500).send(err);
        })
    }
  
});

app.get('/notes/:id',(req,res)=>{
    const {id}= req.params; 
    db.getNoteById(id)
    .then(data=>{
     if(!data){
         res.status(404).send("Note Id not exist"+id);
     }else{
     res.send(data);
 }
    }).catch(err=>{
     res.status(500).send(err);
    })
 
 })
 app.put('/notes',(req,res)=>{

    db.updateNote(req.body)
    .then(data=>{
     if(!data){
         res.status(404).send("Note Id not exist"+id);
     }else{
     res.send(data);
 }
    }).catch(err=>{
     res.status(500).send(err);
    })
 
 })
 app.delete('/notes/:id',(req,res)=>{
    const {id}= req.params; 

    db.deleteNote(id)
    .then(data=>{
     if(!data){
         res.status(404).send("Note Id not exist"+id);
     }else{
     res.send(data);
 }
    }).catch(err=>{
     res.status(500).send(err);
    })
 
 })


const port = process.env.PORT||3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  db.connect();
});
