var mongodb = require('./db');

function User(user){
	this.name = user.name;
	this.password = user.password;

}

module.exports = User;

User.prototype.save = function(callback){
//要存入数据库的用户文档
	var user = {
		name:this.name,
		password:this.password
	};

	//打开数据库
	mongodb.open(function(err,db){
		if(err){
			return callback(err);
		}
		//读取 users集合
		db.collection('users', function(err, collection){
			if(err){
				mongodb.close();
				return callback(err);
			}
			//将用户数据插入 users 集合
			collection.insert(user,{safe: true},function(err,user){
				mongodb.close();
				callback(err,user);//成功，返回插入的信息
			});
		});
	});
}