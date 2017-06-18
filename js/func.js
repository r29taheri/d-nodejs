var Q = require('q');
var mysql = require('mysql');
var pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'panel'
});

exports.sendPost=function(title, subject, content, tags, date) {
    var deferred = Q.defer();
    var q = (`INSERT INTO posts(title,subject,content,tags,date) VALUES ('${title}','${subject}','${content}','${tags}','${date}')`);
    pool.query(q, function(error, results) {
        deferred.resolve(results.insertId);

    });
    return deferred.promise;
}
exports.receivePost=function(){
    var deferred = Q.defer();
    var q = (`SELECT * FROM posts`);
    pool.query(q, function(error, results) {
        deferred.resolve(results);
    });
    return deferred.promise;
}

exports.selectPost=function(id){
    var deferred = Q.defer();
    var q = (`SELECT * FROM posts WHERE id = '${id}'`);
    pool.query(q, function(error, results) {
        deferred.resolve(results);
    });
    return deferred.promise;
}
exports.updatePost=function(title,subject,content,tags,id){
    var deferred = Q.defer();
    var q=(`UPDATE posts SET title='${title}',subject='${subject}',content='${content}',tags='${tags}' WHERE id='${id}'`)
    pool.query(q, function(error, results) {
        deferred.resolve(results);
    });
    return deferred.promise;
}

exports.deletePost=function(id) {
    var deferred = Q.defer();
    var q = (`DELETE FROM posts WHERE id = '${id}'`);
    pool.query(q, function(error, results) {
        deferred.resolve(results);
    });
    return deferred.promise;

}

exports.GetFormattedDate=function() {
    var todayTime = new Date();
    var month = todayTime .getMonth() + 1;
    var day = todayTime.getDate();
    var year = todayTime.getFullYear();
    var hour = todayTime.getHours();
    var min = todayTime.getMinutes();
    var sec = todayTime .getSeconds();
    var fulldate=year + "-" + month + "-" + day + " " + hour + ":" + min + ":" + sec;
    return fulldate;
}

//cat
exports.addCat=function(subject) {
    var deferred = Q.defer();
    var q = (`INSERT INTO category(subject) VALUES ('${subject}')`);
    pool.query(q, function(error, results) {
        deferred.resolve(results.insertId);

    });
    return deferred.promise;
}

exports.checkCat=function(subject) {
    var deferred = Q.defer();
    var q = (`SELECT * FROM category WHERE subject='${subject}'`);
    pool.query(q, function(error, results) {
        deferred.resolve(results.length);
    });
    return deferred.promise;
}
exports.showCat=function() {
    var deferred = Q.defer();
    var q = (`SELECT * FROM category`);
    pool.query(q, function(error, results) {
        deferred.resolve(results);
    });
    return deferred.promise;
}

//end

exports.checkLogin=function(username,password) {
    var deferred = Q.defer();
    var q = (`SELECT * FROM login WHERE username='${username}' AND password='${password}'`);
    pool.query(q, function(error, results) {
        deferred.resolve(results.length);
    });
    return deferred.promise;
}
exports.undefiendObj=function(){
    return typeof obj == undefined
}