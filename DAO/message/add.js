import { Message } from '../../models'

export default function (entity, handler) {
    return Message.create(entity).then(function(result){
        handler(result)
    }).catch(function(error){
        console.error(error)
    })
}
