import { Router } from 'express'
import Comment from '../DAO/comment/'
import Chat from '../DAO/chat'
import User from '../DAO/user/'
import Message from '../DAO/message/'
import message from '../common/message'
import HttpStatusCode from '../common/statusCode'
import { guid, serialize } from '../common/tool'
import formDataParse from '../common/formDataParse'
import path from 'path'
import fs from 'fs'

const router = Router()

router.route('/publishComment').post(async function (req, res) {
    let comment = {
        Id: guid()
    }
    comment.chat_id = req.body.chat_id
    
    comment.content = req.body.content
    if(req.body.reply_user){
        //这里 添加message
        comment.reply_user_name = req.body.reply_user_name
        comment.content = `回复  ${req.body.reply_user_name}: ${comment.content}`
        Message.add({
            Id: guid(),
            publish_user_name: req.body.publish_user_name,
            reply_user_name: req.body.reply_user_name,
            message_user_id: req.body.reply_user,
            chat_id: req.body.chat_id,
            comment_id: comment.Id,
            type: 1
        }, (result) => {
            if(!result){
                res.json(message(HttpStatusCode.ServerError,'','error'))
            }
        })
    }
    comment.like_cnt = 0
    comment.publish_time = new Date().toLocaleDateString()
    comment.publish_user = req.body.publish_user
    await new Promise((resolve) => {
        Comment.add(comment, (result) => {
            if(result){
                res.json(message(HttpStatusCode.success,result,'success'))
                resolve()
            }
        })
    })
    Comment.query({param:{chat_id:comment.chat_id}}, (result) => {
        //result[0].comment_cnt = Number(result[0].comment_cnt) + 1
        Chat.update({
            comment_cnt:result.length
        },{Id:comment.chat_id}, (_result) => {
            if(!_result){
                res.json(message(HttpStatusCode.ServerError,'','error'))
            }
        })
    })
})

async function updateLikeCnt (req, res, cnt) {
    await new Promise((resolve) => {
        Comment.update({
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
                like_cnt: Number(result[0].like_cnt)+cnt
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
router.get('/byCommunication/:id', function (req, res) {
    const chat_id = req.params.id
    // const handler = (item, resolve) => {
    //     const url = item.img
    //     item.img = {}
    //     item.img.url = url
    //     item.img.width = item.img_width
    //     item.img.height = item.img_height 
    //     User.query({param: {user_name:item.publish_user_name}}, (result) => {
    //         item.user = {}
    //         item.user.user_name = result[0].user_name
    //         item.user.icon = result[0].icon
    //         resolve()
    //     })
    // }
    Comment.query({param:{chat_id}}, async (result) => {
        for(let i=0;i<result.length;i++){
            result[i] = serialize(result[i])
            await new Promise((resolve) => {
                User.query({param: {Id:result[i].publish_user}}, (_result) => {
                    if(_result.length){
                        result[i].user = {}
                        result[i].user.user_name = _result[0].user_name
                        result[i].user.Id = _result[0].Id
                        result[i].user.icon = _result[0].icon
                        resolve()
                    }
                })
            })
        }
        res.json(message(HttpStatusCode.success,result,'success'))
    })
})

export default router
