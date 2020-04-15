import { Router } from 'express'
import SecondHand from '../DAO/secondHand'
import User from '../DAO/user'
import message from '../common/message'
import HttpStatusCode from '../common/statusCode'
import { guid, serialize } from '../common/tool'
import formDataParse from '../common/formDataParse'
import path from 'path'
import fs from 'fs'

const router = Router()

router.route('/').get(function (req, res) {
    let list = []
    SecondHand.query({param:req.query}, async (result) => {
        // for(let i=0;i<result.length;i++){
        //     let item = {}
        //     item = serialize(result[i])
        //     await new Promise((resolve) => {
        //         User.query({param:{Id: result[i].publish_user}},(_result) => {
        //             item.user_name = _result[0].user_name
        //             resolve()
        //         })
        //     })
        //     list.push(item)
        // }
        res.json(message(HttpStatusCode.success,result,'success'))
    })
}).post(function (req, res) {
    let list = []
    if(req.body.query == 'all'){
        req.body.query = ''
    }
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
    SecondHand.query({param:req.query, isLike: true}, async (result) => {
        res.json(message(HttpStatusCode.success,result,'success'))
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
    let secondHand = {
        Id: guid()
    }
    secondHand.title = req.body.title
    secondHand.detail = req.body.detail
    secondHand.price = req.body.price
    secondHand.publish_time = new Date().toLocaleDateString()
    secondHand.publish_user = req.body.publish_user
    SecondHand.add(secondHand, (result) => {
        if(result){
            res.json(message(HttpStatusCode.success,result,'success'))
        }
    })
})

export default router
