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
    Job.query({param:req.query}, async (result) => {
        res.json(message(HttpStatusCode.success,result,'success'))
    })
}).post(function (req, res) {
    Job.query({param:{job_name:req.body.query, job_detail:req.body.query}, limit: req.body.limit, offset: req.body.offset, isLike: true}, async (result) => {
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
