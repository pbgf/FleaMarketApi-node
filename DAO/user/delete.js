import { User } from '../../models'

export default function (param, handler) {
    return User.destroy({
        where: param
    }).then(function(result){
        handler(result)
    }).catch(function(error){
        console.error(error)
    })
}
