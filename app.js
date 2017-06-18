var express = require('express');
var app = express();
var swig = require('swig');
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
var myFuncs=require('./js/func');
//DB
var mysql = require('mysql');
var pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'panel'
});
var Q = require('q');

var session=require('express-session');
app.use(session({
    name:'a_id',
    secret:'app1000',
    resave:false,
    saveUnitialized:true
}));

var postId;
app.listen(3500, function() {
    console.log('Port 3500 is run');
});

app.use(express.static('templates/assets'));
app.engine('html', swig.renderFile);
app.set('view engine', 'html');
app.set('views', __dirname + '/templates');

app.get('/', function(req, res) {

        res.redirect('dashboard')


});

app.get('/dashboard', function(req, res) {
    var session=req.session;
if(session.user_id){
        res.render('dashboard')

}else{
    res.redirect('login')
}
});
app.get('/sendPost', function(req, res) {

        myFuncs.showCat().then(function(r) {
        res.render('sendPost', { 'cat': r });
    })

    // res.render('sendPost', {})

});
app.get('/logout', function(req, res) {
    var session=req.session;
    if(session.user_id){
        delete session.user_id;
        res.redirect('login');
    }else{
        res.redirect('login');
   }
 });

app.post('/sendPost', function(req, res) {
    var data = {}
    if (req.body.sendPostBtn) {
        var fullDate=myFuncs.GetFormattedDate();
        myFuncs.sendPost(req.body.title, req.body.subjectChose, req.body.content, req.body.tags, fullDate).then(function() {
            data['status'] = 'Post is send';
            res.render('sendPost', data);
        })

    }
});

app.get('/showPost', function(req, res) {
    if (req.query.del) {
        myFuncs.deletePost(req.query.del).then(function() {
            res.redirect('/showPost?msg=ok');
        })
    }
    if (req.query.edit) {
        postId=req.query.edit;
            res.redirect(`/editPost?msg='${postId}'`);
    }
    myFuncs.receivePost().then(function(r) {
        res.render('showPost', { 'post': r });
    })

});

app.get('/editPost', function(req, res) {
    myFuncs.selectPost(postId).then(function(r) {
        res.render('editPost', { 'post': r });
        console.log(postId);
    })

});
app.post('/editPost', function(req, res) {
    var data = {}
    if (req.body.sendPostBtn) {
        myFuncs.updatePost(req.body.title, req.body.subject, req.body.content, req.body.tags,postId).then(function() {
            // data['status'] = 'Post is update';
            res.render('successUpdate', {});
        })

    }
});

app.get('/category', function(req, res) {
        myFuncs.showCat().then(function(r) {
        res.render('category', { 'cat': r });
    })

});

app.post('/category', function(req, res) {
    var data = {}
    if (req.body.addCatBtn) {
        myFuncs.checkCat(req.body.cat).then(function(r) {
            if (r == 0) {
                myFuncs.addCat(req.body.cat).then(function() {
                    data['status'] = 'Category is add';
                    res.render('category', data);

                })
            } else {
                data['status'] = 'category repetitive';
                res.render('category', data);
            }
        });

    }
});

app.get('/login', function(req, res) {
        res.render('login');

});

app.post('/login', function(req, res) {
    var data = {}
    if (req.body.loginBtn) {

        myFuncs.checkLogin(req.body.username,req.body.password).then(function(r) {

        // console.log(r);

        // data['login']=r;
        // console.log(data);
        if(r){
            console.log(r);
            var session=req.session;
            session.user_id='test';
            // console.log(session.user_id);
            res.redirect(`/dashboard`);
        }else{
            data['status']='username incorrect';
            res.render('login', data);
        }
    })
}
});
app.use(function(req,res,next){
    res.status('404').render('404');
});