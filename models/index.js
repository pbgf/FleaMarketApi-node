import Sequelize from "sequelize"
const mysqlConfig ={
    host: '120.79.46.144',  //  接数据库的主机
    port: '3306',       //  接数据库的端口
    protocol: 'tcp',    //  连接数据库使用的协议
    dialect: 'mysql',   //  使用mysql
};
const sequelize = new Sequelize('FleaMarket', 'root', 'z681121110', mysqlConfig);
export const User = sequelize.import(__dirname + "/user")
export const Comment = sequelize.import(__dirname + "/comment")
export const Message = sequelize.import(__dirname + "/message")
export const Chat = sequelize.import(__dirname + "/chat")
export const Job = sequelize.import(__dirname + "/job")
export const SecondHand = sequelize.import(__dirname + "/secondHand")
export const Img = sequelize.import(__dirname + "/img")