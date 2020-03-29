import { Job } from '../../models'

export default function (entity, param, handler) {
    return Job.update(entity,{
        where: param
    }).then(function(result){
        handler(result)
    }).catch(function(error){
        console.error(error)
    })
}
