import { Router } from 'express'
import Order from '../DAO/order'
import User from '../DAO/user'
import SecondHand from '../DAO/secondHand'
import Img from '../DAO/img'
import message from '../common/message'
import HttpStatusCode from '../common/statusCode'
import { guid, serialize } from '../common/tool'
import formDataParse from '../common/formDataParse'
import path from 'path'
import fs from 'fs'
import Chat from '../DAO/chat'

const router = Router()

router.route('/').get(function (req, res) {
    Order.query({param:req.query}, async (result) => {
        res.json(message(HttpStatusCode.success,result,'success'))
    })
}).post(function (req, res) {
    Order.query({limit: req.body.limit, offset: req.body.offset, isLike: true}, async (result) => {
        
        
        
        res.json(message(HttpStatusCode.success,result,'success'))
    })
})
router.post('/createOrder',function (req,res) {
    const entity = {
        Id: guid(),
        create_time: new Date().toLocaleDateString()
    }
    Order.add(Object.assign(entity,req.body), (result) => {
        //console.log(result)
        if(result){
            res.json(message(HttpStatusCode.success,result,'success'))
        }else{
            throw new Error('添加失败')
        }
    }).catch((err) => {
        res.json(message(HttpStatusCode.ServerError,err,'err'))
    })
})
async function getorders (req,res,result) {
    for(let i=0;i<result.length;i++){
        let tasks = []
        result[i] = serialize(result[i])
        tasks.push(new Promise((resolve) => {
            User.query({param: {Id:result[i].create_user}}, (_result) => {
                result[i].user = _result[0]
                resolve()
            })
        }).catch(err => {
            throw new Error(err)
        }))
        tasks.push(new Promise((resolve) => {
            User.query({param: {Id:result[i].merchant}}, (_result) => {
                result[i].merchant_user = _result[0]
                resolve()
            })
        }).catch(err => {
            throw new Error(err)
        }))
        tasks.push(new Promise((resolve) => {
            SecondHand.query({param: {Id:result[i].s_id}},async (_result) => {
                await new Promise((_resolve) => {
                    Img.query({param: {parent_id: _result[0].Id}}, (imgs) => {
                        _result[0] = serialize(_result[0])
                        _result[0].imgList = imgs
                        _resolve()
                    })
                })
                result[i].secondHand = _result[0]
                resolve()
            })
        }).catch(err => {
            throw new Error(err)
        }))
        await Promise.all(tasks).then(() => {
            res.json(message(HttpStatusCode.success,result,'success'))
        }).catch(err => {
            res.json(message(HttpStatusCode.ServerError,err,'err'))
        })
    }
    if(result.length === 0){
        res.json(message(HttpStatusCode.success,result,'空'))
    }
}
router.get('/getById', function(req,res) {
    Order.query({
        param: req.query, 
        limit: req.body.limit, 
        offset: req.body.offset, 
        isLike: true
    },async function (result) {
        getorders(req,res,result)
    })
})
router.post('/getBuy',function(req, res) {
    Order.query({
        param: {create_user:req.body.id}, 
        limit: req.body.limit, 
        offset: req.body.offset, 
        isLike: true
    },async function (result) {
        getorders(req,res,result)
    })
})

router.post('/getSale', function(req, res) {
    Order.query({
        param: {merchant:req.body.id}, 
        limit: req.body.limit, 
        offset: req.body.offset, 
        isLike: true
    }, async function (result) {
        getorders(req,res,result)
    })
})

router.put('/updateState', function (req,res) {
    Order.query({
        param: {Id:req.body.orderId}, 
    },async function (result) {
        if(result.length>0){
            let entity = serialize(result[0])
            entity.state = Number(entity.state)+1
            if(entity.state === 4){
                await new Promise((resolve) => {
                    console.log(entity.merchant)
                    User.query({param: {Id: entity.merchant}}, (_result) => {
                        console.log(_result[0].money,entity.money)
                        _result[0].money += entity.money
                        console.log(_result[0].money,entity.money)
                        User.update(serialize(_result[0]), {Id: _result[0].Id}, (res) => {
                            if(res.length){
                                resolve()
                            }
                        })
                    })
                })
            }
            Order.update(entity,{Id:req.body.orderId}, (_result) => {
                if(_result.length>0){
                    res.json(message(HttpStatusCode.success,_result,'状态更新成功'))
                }else{
                    res.json(message(HttpStatusCode.ServerError, '订单不存在', '订单不存在'))
                }
            }).catch(err => {
                res.json(message(HttpStatusCode.ServerError,err,'err'))
            })
        }else{
            res.json(message(HttpStatusCode.ServerError, '订单不存在', '订单不存在'))
        }
    })
})
export default router
