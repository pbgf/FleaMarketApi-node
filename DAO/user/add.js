import { User } from '../../models'

export default function (entity, handler) {
    return User.create(entity).then(function(result){
        handler(result)
    }).catch(function(error){
        console.error(error)
    })
}
