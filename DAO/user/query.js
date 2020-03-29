import { User } from '../../models'
import Sequelize from "sequelize"
const Op = Sequelize.Op;

export default async function ({param, limit, offset, isLike}, handler) {
    let querys = []
    if(isLike){
        Object.keys(param).forEach((key) => {
            querys.push({
                [key]:{
                    [Op.like]:`%${param[key]}%`
                }
            })
        })
    }
    return User.findAll({
        where: isLike?{
            [Op.or]:querys
        }:param? param : {},
        limit: limit,
        offset: offset
    }).then(function(result){
        handler(result)
    }).catch(function(error){
        console.error(error)
    })
}
