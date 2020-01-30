import { User } from '../../models'

export default function (param) {
    return User.destroy({
        where: param
    }).then(function(result){
        console.log(result)
    }).catch(function(error){
        console.error(error)
    })
}
