import { Message } from '../../models'

export default async function ({param, limit, offset}, handler) {
    return Message.findAll({
        where: param? param : {},
        limit: limit,
        offset: offset
    }).then(function(result){
        handler(result)
    }).catch(function(error){
        console.error(error)
    })
}
