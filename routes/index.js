import { Router } from 'express'
import User from'./user'
import Comment from './comment'
import Chat from './chat'
import Job from './job'
import multer from 'multer'
import path from 'path'

const router = Router()

router.use('/users', User)
router.use('/comments', Comment)
router.use('/chats', Chat)
router.use('/jobs', Job)

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
