import { Router } from 'express'
import SecondHand from '../DAO/secondHand'
import User from '../DAO/user'
import Img from '../DAO/img'
import message from '../common/message'
import HttpStatusCode from '../common/statusCode'
import { guid, serialize } from '../common/tool'
import { insert, saveFile } from './user'
import formDataParse from '../common/formDataParse'
import path from 'path'
import fs from 'fs'

const router = Router()

router.route('/').get(function (req, res) {
    let list = []
    SecondHand.query({param:req.query}, async (result) => {
        for(let i=0;i<result.length;i++){
            let item = {}
            let tasks = []
            item = serialize(result[i])
            tasks.push(new Promise((resolve) => {
                User.query({param:{Id: result[i].publish_user}},(_result) => {
                    item.user_name = _result[0].user_name
                    resolve()
                })
            }))
            tasks.push(new Promise((resolve) => {
                Img.query({param: {parent_id: result[i].Id}}, (_result) => {
                    item.imgList = _result.map(img => ({
                        url: img.url,
                        width: img.img_width,
                        height: img_height
                    }))
                })
            }))
            await Promise.all(tasks).catch(err => {
                res.json(message(HttpStatusCode.ServerError,{},'err'))
            })
            list.push(item)
        }
        res.json(message(HttpStatusCode.success,list,'success'))
    })
}).post(function (req, res) {
    let list = []
    SecondHand.query({param:{title:req.body.query, detail:req.body.query}, limit: req.body.limit, offset: req.body.offset, isLike: true}, async (result) => {
        for(let i=0;i<result.length;i++){
            let item = {}
            item = serialize(result[i])
            await new Promise((resolve) => {
                User.query({param:{Id: result[i].publish_user}},(_result) => {
                    item.user_name = _result[0].user_name
                    resolve()
                })
            })
            list.push(item)
        }
        res.json(message(HttpStatusCode.success,list,'success'))
    })
}).delete(function (req, res) {
    const Id = req.body.Id
    SecondHand.dele({Id}, (result) => {
        res.json(message(HttpStatusCode.success,result,'success'))
    })
})

router.post('/byUserId', function (req, res) {
    SecondHand.query({param:{publish_user:req.body.query}, isLike: true}, async (result) => {
        res.json(message(HttpStatusCode.success,result,'success'))
    })
})

router.route('/admin').get(function (req, res) {
    let list = []
    SecondHand.query({param:req.query, isLike: true}, async (result) => {
        for(let i=0;i<result.length;i++){
            let item = {}
            item=serialize(result[i])
            await new Promise((resolve) => {
                User.query({param:{Id: result[i].publish_user}},(_result) => {
                    item.user_name = _result[0].user_name
                    resolve()
                })
            })
            list.push(item)
        }
        res.json(message(HttpStatusCode.success,list,'success'))
    })
}).post(function (req,res) {
    let secondHand = {
        Id: guid()
    }
    secondHand.title = req.body.title
    secondHand.detail = req.body.detail
    secondHand.price = req.body.price
    secondHand.publish_time = new Date().toLocaleDateString()
    // secondHand.publish_user = req.body.publish_user
    User.query({param: {user_name:'admin'}},(_result) => {
        secondHand.publish_user = _result[0].Id
        SecondHand.add(secondHand, (result) => {
            if(result){
                res.json(message(HttpStatusCode.success,result,'success'))
            }
        })
    })
}).put(function (req, res) {
    const param = {
        Id: req.body.Id
    }
    SecondHand.update(req.body, param, (result) => {
        res.json(message(HttpStatusCode.success,result,'success'))
    })
}).delete(function (req, res) {
    const Id = req.body.Id
    SecondHand.dele({Id}, (result) => {
        res.json(message(HttpStatusCode.success,result,'success'))
    })
})

router.post('/publishSecondHand', function (req, res) { 
    let data = ''
    req.setEncoding("binary")
    req.on('data', function(chunk){
        data += chunk
    })
    req.on('end', async function(){
        const formData = formDataParse(data,['filename','Content-Type'])
        const secondHand = {}
        secondHand.Id = guid()
        secondHand.publish_time = new Date().toLocaleDateString()
        const file = {
            filename:'',
            content:'',
            mimeType:''
        }
        const img = {
            Id: guid(),
            parent_id: secondHand.Id
        }
        for(let i=0;i<formData.length;i++){
            let item = formData[i]
            if(item.filename){
                file.filename = item.filename
                file.content = item.content
                file.mimeType = item['Content-Type'].split('/')[1]
                img.url = file.filename+'.'+file.mimeType
            }else if(item.name.includes('img_width')){
                img.img_width = Buffer.from(item.content.replace('\r\n',''), 'binary').toString()
            }else if(item.name.includes('img_height')){
                img.img_height = Buffer.from(item.content.replace('\r\n',''), 'binary').toString()
                await new Promise((resolve) => {
                    Img.add(img, () => {
                        resolve()
                    })
                }).catch((err) => {
                    res.json(message(HttpStatusCode.ServerError,{},'发生了错误'))
                })
                await saveFile(file).catch((err) => {
                    res.json(message(HttpStatusCode.ServerError,{},'发生了错误'))
                })
                img.Id = guid()
            }else{
                let result = Buffer.from(item.content.replace('\r\n',''), 'binary')
                secondHand[item.name] = result.toString('utf8')
            }
        }
        //secondHand['img'] = file.filename+'.'+file.mimeType
        
        const handler = (result) => {
            if(result){
                res.json(message(HttpStatusCode.success,result,'发布成功'))
            }
        }
        SecondHand.add(secondHand, handler)
    })
    // let secondHand = {
    //     Id: guid()
    // }
    // secondHand.title = req.body.title
    // secondHand.detail = req.body.detail
    // secondHand.price = req.body.price
    // secondHand.publish_time = new Date().toLocaleDateString()
    // secondHand.publish_user = req.body.publish_user
    
})

export default router
