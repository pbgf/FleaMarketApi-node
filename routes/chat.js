import { Router } from 'express'
import Chat from '../DAO/chat'
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

router.get('/', function (req, res) {
    Chat.query({param:req.query}, async (result) => {
        result = serialize(result)
        for(let i=0;i<result.length;i++){
            const url = result[i].img
            result[i].img = {}
            result[i].img.url = url
            result[i].img.width = result[i].img_width
            result[i].img.height = result[i].img_height
            await new Promise((resolve) => {
                User.query({param:{user_name:result[i].publish_user}},(_result) => {
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
