import { Job } from '../../models'

export default async function ({param, limit=10, offset}, handler) {
    return Job.findAll({
        where: param? param : {},
        limit: limit,
        offset: offset
    }).then(function(result){
        handler(result)
    }).catch(function(error){
        console.error(error)
    })
}
