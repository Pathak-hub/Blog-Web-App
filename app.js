var express = require('express');
var app = express();
var PORT = 3000 || process.env.PORT
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var expressSanitizer = require('express-sanitizer')
var methodOverride = require('method-override')
app.use(bodyParser.urlencoded({ extended: true }))
 
app.use(bodyParser.json())
app.use(methodOverride('_method'))
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(expressSanitizer())
mongoose.connect(
    "mongodb+srv://newblog12345:newblog12345@cluster0.kxzck.mongodb.net/test?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }
  );
var blogSchema = new mongoose.Schema({
    title:String,
    image:String,
    body:String,
    created:{type:Date , default:Date.now}
});
var Blog = mongoose.model("Blog", blogSchema)
/*Blog.create({
    title:"short coated black and white puppet",
    image:"https://images.unsplash.com/photo-1566505512236-9723b3ab54fa?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxzZWFyY2h8MTF8fGxlYnJhJTIwZG9nfGVufDB8fDB8&auto=format&fit=crop&w=500&q=60",
    body:"a happy puppy!"
});*/
app.get('/blogs', function(req,res){
    res.render('index')
})
app.get('/new' , function(req,res){
    res.render('new')
})

app.get('/',function(req,res){
    Blog.find({}, function(err,allblogs){
        if(err){
            console.log(err)
        }
        else{
            res.render('index',{blogs:allblogs})
        }
    })
   
})



app.post('/', function(req,res){
    Blog.create(req.body.blog, function(err, newBlog){
        if(err){
            res.render('new')
        }
        else {
            res.render('/');
        }
    })
})
app.get('/:id', function(req,res){
    var id =req.params.id
    if (id.match(/^[0-9a-fA-F]{24}$/)){
   Blog.findById(req.params.id, function(err , foundBlog){
       if(err){
          console.log(err)
       }
       else{
           res.render('show', {blog:foundBlog})
       }
   })}
   else{
       console.log('id is not valid')
   }
} )
app.get('/:id/edit', function(req,res){
Blog.findById(req.params.id, function(err,foundBlog){
if(err){
res.redirect('/')


}
else{
    res.render('edit')
}

})

});
app.put('/:id', function(req,res){
    Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,updatedBlog){
if(err){
    res.redirect('/blogs');
} else{
    res.redirect('/blogs' + req.params.id);
}



    });

});
app.delete('/:id',function(req,res){
  Blog.findByIdAndRemove(req.params.id, function(err){
      if(err){
          res.redirect('/');
      }
      else{
          res.redirect('/');
      }
  })
})

app.listen(PORT, function(){
    console.log(`The server is running at ${PORT}`)
})