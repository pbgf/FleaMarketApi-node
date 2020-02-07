/**
 * 
 * @param {*} text 
 * @param {*} config 
 * {
 *    fields: [
 *          [[...String]每一项要筛选出来的字段]
 *    ], 要筛选出来的项
 * 
 * }
 */

const defaultConfig = ['name']
export default function (message, config = []) {
    let results = []
    let boundary = message.split('\n')[0]
    boundary = /.*\b/.exec(boundary)[0]
    let tempList = message.split(boundary).slice(1,-1)
    config = config.concat(defaultConfig)
    tempList.forEach((item,index) => {
        let header = item.split('\r\n\r\n')[0]
        let content = item.split('\r\n\r\n').slice(1).join('\r\n\r\n')
        let obj = {}
        obj['content'] = content
        config.forEach(field => {
            let patt = new RegExp(`${field}[:|=]\\s?"?(\\S*\\b)`,'g')
            if(patt.exec(header)){
                obj[field] = RegExp.$1
            }
        })
        results.push(obj)
    })
    return results
}
