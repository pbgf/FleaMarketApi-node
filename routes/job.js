import { Router } from 'express'
import Job from '../DAO/job'
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
    Job.query({param:req.query}, async (result) => {
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
}).post(function (req, res) {
    let list = []
    if(req.body.query == 'all'){
        req.body.query = ''
    }
    Job.query({param:{job_name:req.body.query, job_detail:req.body.query}, limit: req.body.limit, offset: req.body.offset, isLike: true}, async (result) => {
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
    Job.dele({Id}, (result) => {
        res.json(message(HttpStatusCode.success,result,'success'))
    })
})

router.post('/byUserId', function (req, res) {
    Job.query({param:{publish_user:req.body.query}, isLike: true}, async (result) => {
        res.json(message(HttpStatusCode.success,result,'success'))
    })
})

router.route('/admin').get(function (req, res) {
    let list = []
    Job.query({param:req.query, isLike: true}, async (result) => {
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
}).post(function (req,res) {
    let job = {
        Id: guid()
    }
    job.job_name = req.body.job_name
    job.job_pay = req.body.job_pay
    job.job_detail = req.body.job_detail
    job.publish_time = new Date().toLocaleDateString()
    User.query({param: {user_name:'admin'}},(_result) => {
        job.publish_user = _result[0].Id
        Job.add(job, (result) => {
            if(result){
                res.json(message(HttpStatusCode.success,result,'success'))
            }
        })
    })
    
    // User.query({param: {user_name: 'admin'}},(_result) => {
    //     job.publish_user = _result[0].Id
    //     Job.add(job, (result) => {
    //         if(result){
    //             res.json(message(HttpStatusCode.success,result,'success'))
    //         }
    //     })
    // })
}).put(function (req, res) {
    const param = {
        Id: req.body.Id
    }
    Job.update(req.body, param, (result) => {
        res.json(message(HttpStatusCode.success,result,'success'))
    })
}).delete(function (req, res) {
    const Id = req.body.Id
    Job.dele({Id}, (result) => {
        res.json(message(HttpStatusCode.success,result,'success'))
    })
})

router.post('/publishJob', function (req, res) { 
    let job = {
        Id: guid()
    }
    job.job_name = req.body.job_name
    job.job_detail = req.body.job_detail
    job.job_pay = req.body.job_pay + '/月'
    job.publish_time = new Date().toLocaleDateString()
    job.publish_user = req.body.publish_user
    Job.add(job, (result) => {
        if(result){
            res.json(message(HttpStatusCode.success,result,'success'))
        }
    })
})

export default router
