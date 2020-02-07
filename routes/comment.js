import { Router } from 'express'
import Comment from '../DAO/comment/'
import bodyParser from 'body-parser'
import message from '../common/message'
import HttpStatusCode from '../common/statusCode'
import { guid } from '../common/tool'
import formDataParse from '../common/formDataParse'
import path from 'path'
import fs from 'fs'

const router = Router()
router.use(bodyParser.json())
router.use(bodyParser.urlencoded({ extended: true }))
router.use(bodyParser.raw())

router.get('/byCommunication/:id', function (req, res) {
    const id = req.params.id
    Comment.query(id).then((result) => {
        res.json(message(HttpStatusCode.success,'','success'))
    })
})


router.route('/login').post((req,res) => {
    console.log(req.body)
    const query = {
        telephone: req.body.telePhone_val,
        pass_word: req.body.passwd_val
    }
    const handler = (result) => {
        console.log(result)
        if(result.length){
            res.json(message(HttpStatusCode.success,result,'登录成功'))
        }else{
            res.json(message(HttpStatusCode.paramError,result,'登录失败，请检查用户名和密码是否正确'))
        }
    }
    User.query({param:query},handler)
})



export default router
