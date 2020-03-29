import { Job } from '../../models'

export default function (param, handler) {
    return Job.destroy({
        where: param
    }).then(function(result){
        handler(result)
    }).catch(function(error){
        console.error(error)
    })
}
