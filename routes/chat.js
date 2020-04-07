import { Router } from 'express'
import Chat from '../DAO/chat'
import User from '../DAO/user/'
import message from '../common/message'
import HttpStatusCode from '../common/statusCode'
import { guid, serialize } from '../common/tool'
import formDataParse from '../common/formDataParse'
import path from 'path'
import fs from 'fs'

const router = Router()

const handler = (res) => async (result) => {
    result = serialize(result)
    for(let i=0;i<result.length;i++){
        const url = result[i].img
        result[i].img = {}
        result[i].img.url = url
        result[i].img.width = result[i].img_width
        result[i].img.height = result[i].img_height
        await new Promise((resolve,reject) => {
            User.query({param:{Id:result[i].publish_user}},(_result) => {
                if(_result.length){
                    result[i].user = {}
                    result[i].user.Id = _result[0].Id
                    result[i].user.user_name = _result[0].user_name
                    result[i].user.icon = _result[0].icon
                    resolve()
                }else{
                    reject()
                }
            })
        }).catch((err) => {
            console.log(err)
        })
    }
    res.json(message(HttpStatusCode.success,result,'success'))
}

router.route('/').get(function (req, res) {
    Chat.query({param:req.query}, handler(res))
}).post(function (req, res){
    Chat
    .query({limit: req.body.limit, offset: req.body.offset, order: req.body.order}, handler(res))
    .catch(err => {
        console.log(err)
    })
}).delete(function (req, res) {
    const Id = req.body.Id
    Chat.dele({Id}, (result) => {
        res.json(message(HttpStatusCode.success,result,'success'))
    })
})

router.route('/admin').get(function (req, res) {
    let list = []
    Chat.query({param:req.query, isLike: true}, async (result) => {
        for(let i=0;i<result.length;i++){
            list.push(new Promise((resolve) => {
                User.query({param: {Id: result[i].publish_user}}, (_result) => {
                    result[i].publish_user = _result[0].user_name
                    resolve()
                })
            }))
        }
        Promise.all(list).then(() => {
            res.json(message(HttpStatusCode.success, result ,'success'))
        }).catch((err) => {
            res.json(message(HttpStatusCode.success, {} ,err))
        })
        
    })
}).post(function (req,res) {
    let chat = {
        Id: guid()
    }
    chat.title = req.body.title
    chat.text = req.body.text
    chat.publish_time = new Date().toLocaleDateString()
    User.query({param: {user_name: 'admin'}},(result) => {
        chat.publish_user = result[0].Id
        Chat.add(chat, (_result) => {
            if(_result){
                res.json(message(HttpStatusCode.success,_result,'success'))
            }
        })
    })
    //chat.publish_user = req.body.publish_user
}).put(function (req, res) {
    const param = {
        Id: req.body.Id
    }
    Chat.update(req.body, param, (result) => {
        res.json(message(HttpStatusCode.success,result,'success'))
    })
}).delete(function (req, res) {
    const Id = req.body.Id
    Chat.dele({Id}, (result) => {
        res.json(message(HttpStatusCode.success,result,'success'))
    })
})

// router.post('/updateLikeCnt', function (req, res) {
//     Chat.update({
//         like_cnt:req.body.like_cnt
//     },{Id:req.body.Id},(result) => {
//         if(result){
//             res.json(message(HttpStatusCode.success,result,'success'))
//         }
//     })
// })
async function updateLikeCnt (req, res, cnt) {
    await new Promise((resolve) => {
        Chat.update({
            like_cnt:req.body.like_cnt
        },{Id:req.body.Id},(result) => {
            resolve()
            if(!result){
                res.json(message(HttpStatusCode.ServerError,'','error'))
            }
        })
    })
    await new Promise((resolve) => {
        User.query({param: {Id: req.body.user_id}}, (result) => {
            User.update({
                like_cnt: Number(result[0].like_cnt) + cnt
            }, {Id:req.body.user_id}, (result) => {
                resolve()
                if(result) {
                    res.json(message(HttpStatusCode.success,result,'success'))
                }
            })
        })
    }) 
}
router.post('/addLikeCnt', async function (req, res) {
    updateLikeCnt(req, res, 1)
})
router.post('/minusLikeCnt', async function (req, res) {
    updateLikeCnt(req, res, -1)
})

router.post('/byUserId', function (req, res) {
    Chat.query({param:{publish_user:req.body.query}, isLike: true}, async (result) => {
        res.json(message(HttpStatusCode.success,result,'success'))
    })
})
// router.post('/updateLikeCnt', async function (req, res) {
//     await new Promise((resolve) => {
//         Chat.update({
//             like_cnt:req.body.like_cnt
//         },{Id:req.body.Id},(result) => {
//             resolve()
//             if(!result){
//                 res.json(message(HttpStatusCode.ServerError,'','error'))
//             }
//         })
//     })
    
// })

router.post('/publishChat', function (req, res) {
    let data = ''
    req.setEncoding("binary")
    req.on('data', function(chunk){
        data += chunk
    })
    req.on('end', async function(){
        const formData = formDataParse(data,['filename','Content-Type'])
        const file = {
            filename:'',
            content:'',
            mimeType:''
        }
        const chat = {
            Id: guid(),
            publish_time: new Date().toLocaleDateString(),
            like_cnt:0,
            comment_cnt:0
        }
        formData.forEach(item => {
            if(item.filename){
                file.filename = item.filename
                file.content = item.content
                file.mimeType = item['Content-Type'].split('/')[1]
                chat.img = file.filename+'.'+file.mimeType
            }else{
                let result = Buffer.from(item.content.replace('\r\n',''), 'binary')
                chat[item.name] = result.toString('utf8')
            }
        })
        if(file.filename){
            const filePath = path.join(__dirname, '..','/uploads/'+file.filename+'.'+file.mimeType)
            await new Promise((resolve)=>{
                fs.writeFile(filePath, file.content, 'binary', function(err){
                    resolve()
                    if(err){
                        res.json(message(HttpStatusCode.ServerError,'','图片保存失败'))
                    }
                })
            })
        }
        const handler = (result) => {
            if(result){
                res.json(message(HttpStatusCode.success,result,'发布成功'))
            }
        }
        Chat.add(chat, handler)
    })
})
export default router
