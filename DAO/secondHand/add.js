import { SecondHand } from '../../models'

export default function (entity, handler) {
    return SecondHand.create(entity).then(function(result){
        handler(result)
    }).catch(function(error){
        console.error(error)
    })
}
