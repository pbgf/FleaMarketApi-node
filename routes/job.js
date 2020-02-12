import { Router } from 'express'
import Job from '../DAO/job'
import User from '../DAO/user'
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
    Job.query({param:req.query}, async (result) => {
        res.json(message(HttpStatusCode.success,result,'success'))
    })
})

export default router
