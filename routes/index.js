import { Router } from 'express'
import User from'./user'
import Comment from './comment'
import Chat from './chat'
import Job from './job'
import Message from './message'
import SecondHand from './secondHand'
import bodyParser from 'body-parser'
import multer from 'multer'
import path from 'path'

const router = Router()
router.use(bodyParser.json())
router.use(bodyParser.urlencoded({ extended: true }))
router.use(bodyParser.raw())

router.use('/users', User)
router.use('/comments', Comment)
router.use('/chats', Chat)
router.use('/jobs', Job)
router.use('/messages', Message)
router.use('/secondHand', SecondHand)

router.get('/file/:name', function (req, res, next) {

    var options = {
      root: path.join(__dirname, '..', '/uploads'),
    //   dotfiles: 'deny',
    //   headers: {
    //       'x-timestamp': Date.now(),
    //       'x-sent': true
    //   }
    };
  
    var fileName = req.params.name;
    res.sendFile(fileName, options, function (err) {
      if (err) {
        next(err);
      } else {
        console.log('Sent:', fileName);
      }
    });
  
});

export default router
