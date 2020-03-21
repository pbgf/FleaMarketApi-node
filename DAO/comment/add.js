import { Comment } from '../../models'

export default function (entity, handler) {
    return Comment.create(entity).then(function(result){
        handler(result)
    }).catch(function(error){
        console.error(error)
    })
}
