import { User } from '../../models'

export default function (entity, param) {
    return User.update(entity,{
        where: param
    }).then(function(result){
        console.log(result)
    }).catch(function(error){
        console.error(error)
    })
}
