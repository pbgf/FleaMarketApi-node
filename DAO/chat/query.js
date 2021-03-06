import { Chat } from '../../models'
import Sequelize from "sequelize"
const Op = Sequelize.Op;

export default async function ({param, limit, offset, isLike, order}, handler) {
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
    return Chat.findAll({
        where: isLike?{
            [Op.or]:querys
        }:param? param : {},
        limit: limit,
        offset: offset,
        order: [
            [order || 'publish_time', 'DESC']
        ]
    }).then(function(result){
        handler(result)
    }).catch(function(error){
        console.error(error)
    })
}
