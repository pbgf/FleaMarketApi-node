import { User } from '../../models'

export default function (entity) {
    return User.create(entity).then(function(result){
        console.log(result)
    }).catch(function(error){
        console.error(error)
    })
}
