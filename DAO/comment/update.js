import { Comment } from '../../models'

export default function (entity, param, handler) {
    return Comment.update(entity,{
        where: param
    }).then(function(result){
        handler(result)
    }).catch(function(error){
        handler()
        console.error(error)
    })
}
