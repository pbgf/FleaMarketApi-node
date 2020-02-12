import { Router } from 'express'
import Comment from '../DAO/comment/'
import User from '../DAO/user/'
import bodyParser from 'body-parser'
import message from '../common/message'
import HttpStatusCode from '../common/statusCode'
import { guid, serialize } from '../common/tool'
import formDataParse from '../common/formDataParse'
import path from 'path'
import fs from 'fs'

const router = Router()
router.use(bodyParser.json())
router.use(bodyParser.urlencoded({ extended: true }))
router.use(bodyParser.raw())

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
                User.query({param: {user_name:result[i].publish_user_name}}, (_result) => {
                    result[i].user = {}
                    result[i].user.user_name = _result[0].user_name
                    result[i].user.icon = _result[0].icon
                    resolve()
                })
            })
        }
        res.json(message(HttpStatusCode.success,result,'success'))
    })
})

export default router