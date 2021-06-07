var MongoClient=require('mongodb').MongoClient;
var url="mongodb://localhost:27017";
var express=require("express");
var cors = require('cors')


var app=express();
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));
app.use(cors());

var users;
var blogs;
var follow;

app.listen(8080,()=>{
MongoClient.connect(url,{useNewUrlParser: true},(err,client)=>{
    if(err) return console.log(err);
    var dbName="Networking";
    db=client.db(dbName);
    users=db.collection("users");
    blogs=db.collection("blogs");
    follow=db.collection("follow");

    console.log(`connected database: ${url}`);
    console.log(`Database: ${dbName}`);
});

});

app.get("/users",(request,response)=>{
    users.find({}).toArray((error,result)=>{
        if(error){return response.send("An error occured");}
        response.send(result);
    });

});


app.get("/usersByName",(request,response)=>{
    users.find({"name":request.query.user}).toArray((error,result)=>{
        if(error){return response.send("An error occured");}
        response.send(result);
    });
});


app.post("/users",(request, response) => {
    users.insertOne(request.body, (error, result) => {
        if(error) {
            return response.send(error);
        }
        response.send(result.result);
    });
});


app.get("/blogs",(request,response)=>{
    blogs.find({"user":request.query.user}).toArray((error,result)=>{
        if(error){return response.send("An error occured");}
        response.send(result);
    });

});

app.post("/blogs",(request, response) => {
    var data={"user":request.body.user};
    var newdata={$set: {blogs: request.body.blogs}};
    blogs.updateOne(data,newdata, (error, result) => {
        if(error) {
            return response.send(error);
        }
        response.send(result);
    });
});

app.post("/newUserBlog",(request, response) => {
    var data={"user":request.query.user,"blogs":[]};
    blogs.insertOne(data,(error, result) => {
        if(error) {
            return response.send(error);
        }
        response.send(result);
    });
});


app.post("/addfollow",(request,response)=>{
    var data={"user":request.body.user,"following":[],"followedby":[]};
    follow.insertOne(data,(error,result)=>{
        if(error){return response.send(error);}
        response.send(result);
    })
})

app.post("/changepass",(request,response)=>{
    var data={"name":request.body.user};
    var newdata={$set:{pass:request.body.pass}};
    users.updateOne(data,newdata, (error, result) => {
        if(error) {
            return response.send(error);
        }
        response.send(result);
    });

})

app.post("/changename",(request,response)=>{
    var data={"name":request.body.user};
    var newdata={$set:{"display_name":request.body.display_name}};
    users.updateOne(data,newdata, (error, result) => {
        if(error) {
            return response.send(error);
        }
        response.send(result);
    });
})


app.get("/getfollow",(request,response)=>{
    console.log(request.query.user);
    follow.find({"user":request.query.user}).toArray((error,result)=>{
        if(error){return response.send(error);}
        response.send(result);
    });
})



app.post("/addfollowing",(request,response)=>{
    var data={"user":request.body.thisuser};
    var newdata={$push: {"following":request.body.thatuser}}; 

    console.log(request.body.thisuser+" "+request.body.thatuser);
    follow.updateOne(data,newdata, (error, result) => {
        if(!error) {
            return response.send(result.result);
        }
        response.send(result);
    });
})


app.post("/addfollowedby",(request,response)=>{
    var data={"user":request.body.thatuser};
    var newdata={$push: {"followedby":request.body.thisuser}}; 

    console.log(request.body.thisuser+" "+request.body.thatuser);
    follow.updateOne(data,newdata, (error, result) => {
        if(!error) {
            return response.send(result);
        }
        
    });
})

app.post("/removefollowing",(request,response)=>{
    var data={"user":request.body.thisuser};
    var newdata={$pull: {"following":request.body.thatuser}};

    console.log(request.body.thisuser+" "+request.body.thatuser);
    follow.updateOne(data,newdata, (error, result) => {
        if(error) {
            return response.send("An error occured");
        }
        response.send(result);
    });
})

app.post("/removefollowedby",(request,response)=>{
    var data={"user":request.body.thatuser};
    var newdata={$pull: {"followedby":request.body.thisuser}}; 

    console.log(request.body.thisuser+" "+request.body.thatuser);
    follow.updateOne(data,newdata, (error, result) => {
        if(error) {
            return response.send(result);
        }
        response.send(result);
    });
})




const multer=require('multer');

var storage = multer.diskStorage({

    // Setting directory on disk to save uploaded files
    destination: function (req, file, cb) {
        cb(null, 'images')
    },

    // Setting name of file saved
    filename: function (req, file, cb) {

        cb(null, Date.now() + file.originalname)
    }
})

var upload = multer({
    storage: storage,
    limits: {
        // Setting Image Size Limit to 2MBs
        fileSize: 2000000
    },
    fileFilter(req, file, cb) {
        //Success 
        cb(undefined, true)
    }
})

app.post('/uploadfile', upload.single('uploadedImage'), (req, res) => {
    const file = req.file;
    //console.log(req);
    console.log(req.file.filename+" is file name");
    if (!file) {
        const error = new Error('Please upload a file')
        return res.send(error);
    }
    console.log("HI the users is ",req.query.user);

    users.find({"name":req.query.user}).toArray((error,result)=>{
        if(error){return res.send(error);}
        console.log("RESULT IS ",result);
        if(result[0].image!=="defaulticon.png"){
            const fs = require('fs')
            const path = 'images/'+result[0].image;
            fs.unlink(path, (err) => {
                if (err) {console.error(err)}})
        }
        var data={"name":req.query.user};
        var newdata={$set:{"image":req.file.filename}}
        console.log(data+" is the data");
        users.updateOne(data,newdata, (error, result) => {
            if(error) {
                return res.send(result);
            }
            res.send(result);
        });
    });
});
