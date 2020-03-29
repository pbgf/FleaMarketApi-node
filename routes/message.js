import { Router } from 'express'
import Message from '../DAO/message'
import Comment from '../DAO/comment'
import message from '../common/message'
import HttpStatusCode from '../common/statusCode'
import { guid, serialize } from '../common/tool'
import formDataParse from '../common/formDataParse'
import path from 'path'
import fs from 'fs'
import Chat from '../DAO/chat'

const router = Router()

router.route('/').get(function (req, res) {
    Message.query({param:req.query}, async (result) => {
        res.json(message(HttpStatusCode.success,result,'success'))
    })
}).post(function (req, res) {
    Message.query({param:{message_user_id:req.body.query}, limit: req.body.limit, offset: req.body.offset, isLike: true}, async (result) => {
        let list = []
        for(let i=0;i<result.length;i++){
            let item = {}
            await new Promise((resolve) => {
                let tasks = []
                tasks.push(Comment.query({param: {Id: result[i].comment_id}}, (_result) => {
                    if(!_result){
                        res.json(message(HttpStatusCode.ServerError,_result,'error'))
                    }
                    Object.assign(item, serialize(result[i]))
                    item.comment = _result[0]
                }))
                tasks.push(Chat.query({param: {Id: result[i].chat_id}}, (_result) => {
                    if(!_result){
                        res.json(message(HttpStatusCode.ServerError,_result,'error'))
                    }
                    item.chat = _result[0]
                }))
                Promise.all(tasks).then(() => {
                    resolve()
                }).catch((err) => {
                    console.log(err)
                })
            })
            list.push(item)
        }
        
        res.json(message(HttpStatusCode.success,list,'success'))
    })
})

export default router
