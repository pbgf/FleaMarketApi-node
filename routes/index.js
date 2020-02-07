import { Router } from 'express'
import User from'./user'
import multer from 'multer'
import fs from 'fs'
import { guid } from '../common/tool'
import message from '../common/message'
import HttpStatusCode from '../common/statusCode'
import path from 'path'
import formDataParse from '../common/formDataParse'

const upload = multer({ dest: 'uploads/'}) // 文件储存路径
const router = Router()

router.use('/users', User)

router.post('/upload',  function(req, res){
    let data = ''
    let mimeType
    req.setEncoding("binary")
    req.on('data', function(chunk){
        data += chunk
    })
    req.on('end', async function(){
        formDataParse(data)
        const filePath = path.join(__dirname, '..','/uploads/'+guid()+'.'+mimeType)
        await new Promise((resolve)=>{
            fs.writeFile(filePath, data, 'binary', function(err){
                resolve()
                if(!err){
                    res.json(message(HttpStatusCode.success,'','上传成功'))
                }
            })
        })
    })
})

export default router
