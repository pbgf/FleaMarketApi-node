import { Router } from 'express'
import User from '../DAO/user/'
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

router.route('/').get((req, res) => {
    const handler = (result) => {
        if(result){
            res.json(result)
        }
    }
    User.query({param:req.query},handler)
}).post((req, res) => {
    const user = {}
    user.name = req.body.name // set the bears name (comes from the request)

    const handler = (result) => {
        if(result){
            res.json(message(HttpStatusCode.success,result,'success'))
        }
    }
    User.add(user, handler)
}).put((req, res) => {
    const entity = req.body
    User.update(entity)
}).delete((req, res) => {
    const param = req.body.param
    User.dele(param)
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

router.route('/register').post((req,res) => {
    let data = ''
    req.setEncoding("binary")
    req.on('data', function(chunk){
        data += chunk
    })
    req.on('end', async function(){
        const formData = formDataParse(data,['filename','Content-Type'])
        //console.log(formData)
        const file = {
            filename:'',
            content:'',
            mimeType:''
        }
        const user = {}
        user.Id = guid()
        formData.forEach(item => {
            if(item.filename){
                file.filename = item.filename
                file.content = item.content
                file.mimeType = item['Content-Type'].split('/')[1]
                user['icon'] = file.filename+'.'+file.mimeType
            }else{
                user[item.name] = item.content.replace('\r\n','')
            }
        })
        
        const filePath = path.join(__dirname, '..','/uploads/'+file.filename+'.'+file.mimeType)
        await new Promise((resolve)=>{
            fs.writeFile(filePath, data, 'binary', function(err){
                resolve()
                if(err){
                    res.json(message(HttpStatusCode.ServerError,'','上传图片失败'))
                }
            })
        })
        const handler = (result) => {
            if(result){
                res.json(message(HttpStatusCode.success,result,'注册成功'))
            }
        }
        await new Promise((resolve,reject) => {
            User.query({param:user.user_name},(result) => {
                if(result.length){
                    reject()
                }else{
                    resolve()
                }
            })
        }).then(() => {
            User.add(user, handler)
        }).catch(() => {
            res.json(message(HttpStatusCode.paramError,'','用户名重复'))
        })
    })
})

export default router
