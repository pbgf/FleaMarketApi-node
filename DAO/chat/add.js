import { Chat } from '../../models'

export default function (entity, handler) {
    return Chat.create(entity).then(function(result){
        handler(result)
    }).catch(function(error){
        console.error(error)
    })
}
