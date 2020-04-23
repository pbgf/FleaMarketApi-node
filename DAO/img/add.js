import { Img } from '../../models'

export default function (entity, handler) {
    return Img.create(entity).then(function(result){
        handler(result)
    }).catch(function(error){
        console.error(error)
    })
}
