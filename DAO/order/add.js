import { Order } from '../../models'

export default function (entity, handler) {
    return Order.create(entity).then(function(result){
        handler(result)
    })
}
