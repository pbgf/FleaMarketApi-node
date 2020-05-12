import { Deposit } from '../../models'

export default function (entity, handler) {
    return Deposit.create(entity).then(function(result){
        handler(result)
    }).catch(function(error){
        console.error(error)
    })
}
