import { Router } from 'express'
import User from '../DAO/user/'
import bodyParser from 'body-parser'
import message from '../common/message'
import HttpStatusCode from '../common/statusCode'

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
    const entity = req.entity
    User.update(entity)
}).delete((req, res) => {
    const param = req.param
    User.dele(param)
})

export default router
