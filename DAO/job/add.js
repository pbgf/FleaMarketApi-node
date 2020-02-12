import { Job } from '../../models'

export default function (entity, handler) {
    return Job.create(entity).then(function(result){
        handler(result)
    }).catch(function(error){
        console.error(error)
    })
}
