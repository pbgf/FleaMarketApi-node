import { Router } from 'express'
import Job from '../DAO/job'
import User from '../DAO/user'
import message from '../common/message'
import HttpStatusCode from '../common/statusCode'
import { guid, serialize } from '../common/tool'
import querystring from 'querystring'
import https from 'https'

const router = Router()

router.route('/').get(function (_req, _res) {

    const options = {
        hostname: 'www.tophub.fun',
        port: 8888,
        path: '/v2/GetAllInfoGzip?id=1053&page=0',
        method: 'Get'
    };
    
    const req = https.request(options, (res) => {
        let dataChunk = ''
        res.setEncoding('utf8');
        res.on('data', (chunk) => {
            dataChunk+=chunk
        });
        res.on('end', () => {
            dataChunk = JSON.parse(dataChunk).Data.data
            _res.json(message(HttpStatusCode.success, dataChunk,'success'))
            console.log('响应中已无数据');
        });
    });
    
    req.on('error', (e) => {
        console.error(`请求遇到问题: ${e.message}`);
    });
    
    // 将数据写入请求主体。
    //req.write(postData);
    req.end();
})

export default router
