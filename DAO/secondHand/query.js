import { SecondHand } from '../../models'
import Sequelize from "sequelize"
const Op = Sequelize.Op;
export default async function ({param, limit, offset, isLike, isSale=true}, handler) {
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
    return SecondHand.findAll({

        where: isLike?{
            [Op.or]:querys.slice(0,querys.length-1),
            [Op.and]:isSale?[{
                state:0
            }]:[]
        }:param? param : {},
        limit: limit,
        offset: offset
    }).then(function(result){
        handler(result)
    }).catch(function(error){
        console.error(error)
    })
}
