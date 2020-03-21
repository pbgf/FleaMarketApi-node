import { Router } from 'express'
import Message from '../DAO/message'
import Comment from '../DAO/comment'
import message from '../common/message'
import HttpStatusCode from '../common/statusCode'
import { guid, serialize } from '../common/tool'
import formDataParse from '../common/formDataParse'
import path from 'path'
import fs from 'fs'

const router = Router()

router.route('/').get(function (req, res) {
    Message.query({param:req.query}, async (result) => {
        res.json(message(HttpStatusCode.success,result,'success'))
    })
}).post(function (req, res) {
    Message.query({param:{message_user_id:req.body.message_user_id}, limit: req.body.limit, offset: req.body.offset, isLike: true}, async (result) => {
        await new Promise((resolve) => {
            Comment.query({param: {Id: result[0].comment_id}}, (_result) => {
                if(!_result){
                    res.json(message(HttpStatusCode.ServerError,_result,'error'))
                }
                result[0].comment = _result[0]
            })
        })
        res.json(message(HttpStatusCode.success,result,'success'))
    })
})

export default router
