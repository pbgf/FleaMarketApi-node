import { Chat } from '../../models'

export default function (param, handler) {
    return Chat.destroy({
        where: param
    }).then(function(result){
        handler(result)
    }).catch(function(error){
        console.error(error)
    })
}
