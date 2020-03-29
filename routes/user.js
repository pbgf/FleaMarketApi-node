import { Router } from 'express'
import User from '../DAO/user/'
import message from '../common/message'
import HttpStatusCode from '../common/statusCode'
import { guid } from '../common/tool'
import formDataParse from '../common/formDataParse'
import path from 'path'
import fs from 'fs'

const router = Router()

export const insert = (formData) => (entity,file) => {
    formData.forEach(item => {
        if(item.filename){
            file.filename = item.filename
            file.content = item.content
            file.mimeType = item['Content-Type'].split('/')[1]
            //entity['icon'] = file.filename+'.'+file.mimeType
        }else{
            entity[item.name] = item.content.replace('\r\n','')
        }
    })
}

export const saveFile = async (file) => {
    const filePath = path.join(__dirname, '..','/uploads/'+file.filename+'.'+file.mimeType)
    await new Promise((resolve,reject)=>{
        fs.writeFile(filePath, file.content, 'binary', function(err){
            resolve()
            if(err){
                console.log(err)
                reject('上传图片失败')
            }
        })
    })
}

router.route('/').get((req, res) => {
    //console.log(req)
    const handler = (result) => {
        if(result){
            res.json(message(HttpStatusCode.success,result,'success'))
        }
    }
    User.query({param:req.query}, handler)
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
    //User.dele(param)
    res.json(message(HttpStatusCode.success,'','success'))
})

router.route('/admin').get(function (req, res) {
    User.query({param:req.query, isLike: true}, async (result) => {
        res.json(message(HttpStatusCode.success,result,'success'))
    })
}).post(function (req,res) {
    let user = {
        Id: guid()
    }
    user.user_name = req.body.user_name
    user.password = req.body.password
    user.telephone = req.body.telephone
    user.qq = req.body.qq
    user.sex = req.body.sex
    User.add(user, (result) => {
        if(result){
            res.json(message(HttpStatusCode.success,result,'success'))
        }
    })
}).put(function (req, res) {
    const param = {
        Id: req.body.Id
    }
    User.update(req.body, param, (result) => {
        res.json(message(HttpStatusCode.success,result,'success'))
    })
}).delete(function (req, res) {
    const Id = req.body.Id
    User.dele({Id}, (result) => {
        res.json(message(HttpStatusCode.success,result,'success'))
    })
})

router.route('/login').post((req,res) => {
    const query = {
        telephone: req.body.telePhone_val,
        pass_word: req.body.passwd_val
    }
    const handler = (result) => {
        if(result.length){
            res.json(message(HttpStatusCode.success,result,'登录成功'))
        }else{
            res.json(message(HttpStatusCode.paramError,result,'登录失败，请检查用户名和密码是否正确'))
        }
    }
    User.query({param:query},handler)
})
router.route('/updateUser').post((req,res) => {
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
        insert(formData)(user,file)
        if(file.filename){
            user['icon'] = file.filename+'.'+file.mimeType
            await saveFile(file).catch((err) => {
                res.json(message(HttpStatusCode.paramError,'',err))
            })
        }
        User.update(user,{Id:user.Id}, (result) => {
            if(result){
                res.json(message(HttpStatusCode.success,result,'更新成功'))
            }
        })
    })
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
        insert(formData)(user,file)
        // formData.forEach(item => {
        //     if(item.filename){
        //         file.filename = item.filename
        //         file.content = item.content
        //         file.mimeType = item['Content-Type'].split('/')[1]
        //     }else{
        //         user[item.name] = item.content.replace('\r\n','')
        //     }
        // })
        user['icon'] = file.filename+'.'+file.mimeType
        await saveFile(file)
        const handler = (result) => {
            if(result){
                res.json(message(HttpStatusCode.success,result,'注册成功'))
            }
        }
        await new Promise((resolve,reject) => {
            User.query({param:{
                user_name: user.user_name
            }},(result) => {
                if(result.length){
                    reject()
                }else{
                    resolve()
                }
            })
        }).then(() => {
            User.add(user, handler)
        }).catch(() => {
            res.json(message(HttpStatusCode.paramError,'','用户名已存在'))
        })
    })
})

export default router
