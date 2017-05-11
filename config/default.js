/*
  config-lite是一个轻量的读取配置文件的模块。
  config-lite从当前执行进程目录下的config目录加载不同的配置文件，
  如果不设置NODE_ENV,默认读取default配置文件；
  如果设置NODE_ENV,程序以NODE_ENV=test node app启动，则加载config/test文件
  程序以NODE_ENV=production node app启动，则加载config/production文件
*/
module.exports = {
	port:3000,
	session:{
		secret:'myblog',
		key:'myblog',
		maxAge:2592000000
	},
	mongodb:'mongodb://localhost:27017/myblog'
};