import { Chat } from '../../models'

export default function (entity, param, handler) {
    return Chat.update(entity,{
        where: param
    }).then(function(result){
        handler(result)
    }).catch(function(error){
        console.error(error)
    })
}
