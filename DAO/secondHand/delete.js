import { SecondHand } from '../../models'

export default function (param, handler) {
    console.log(param)
    return SecondHand.destroy({
        where: param
    }).then(function(result){
        handler(result)
    }).catch(function(error){
        console.error(error)
    })
}
