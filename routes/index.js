import { Router } from 'express'
import User from'./user'
import Comment from './comment'
import Chat from './chat'
import Job from './job'
import Message from './message'
import SecondHand from './secondHand'
import News from './news'
import Orders from './order'
import bodyParser from 'body-parser'
import { serialize } from '../common/tool'
import multer from 'multer'
import path from 'path'
import AlipaySdk from 'alipay-sdk';
import AlipayFormData from 'alipay-sdk/lib/form';
import message from '../common/message'

(async () => {
  const alipaySdk = new AlipaySdk({
    appId: '2016102300744635',
    gateway: 'https://openapi.alipaydev.com/gateway.do',
    privateKey: 'MIIEowIBAAKCAQEAsM0VjOFT0dLSlaDVI6gfDPxWBK6AmQx2cKagj62cofOsRdSHrQe151Fxncxt7WRegU15CkHtTc8J/egwmdc1+x37rEieX8QJopgs540xFYnoiJ5ZMxEedESmqRttEVd0hLGtr0IqyJkN9MrCr1IHEyu/bcX1H0WUkWYFjy0Tg0vWWYcStKWh+Z5syotf/2rPMkr1AbIjZRP1PwXPGSl9ZN84mXt8AzFjy/ZFq+hSR+G+iyHyx0zlWfyGGMTOlwcK8i1DhorpvN/3xVj4GHTMSsGl6lRBrvA4JCwjtl5Cg+KowvZejlFJ6xWVziUk4heEN/Qnci+K7vb4KU88AMPTkwIDAQABAoIBAQCnOWMvvBROuqwpkFTog+TSoH0vsmm52PrRtBjbrOcgm1yPM+UcONXJs9PV3/z9c1ibzk408IRmevRFbu9BIzhQi1x26Ly7ca13V53paTdK2wTQ640M6x019ZT5EBLKO0DfHTtdMCVNVM7JgVpA/0Hn1RIb3wfpCyPpnmiVspnpLSULOCHQBQhBy3O63WvDx77zRbPSmH824oyNDg8Nu8GMGdX3GvpETeyY4oz5FAvwh01Wbbhlq+C9CRKCOdwR/odtZdY4omVXVe83FHGMmU1edgpUA4Hy4o3nyQo+5wN3VACzC9eYQEXVdlnkFe2d2h4Ld2ofCEpzjcBvXm7hhPgpAoGBAPHn6uVlvFbd8aHNIzD+bdS7+/0CKQYEY+6Ac/9nyGXXn62P8j7pbThuIqeh5NnEm5aylfrIRRw68RRlyg6CCXjGaB0UpGh3HxELBItvLWx9lbKauhnDHuEFRrjcQioU2qeALocCdlcGL3EbVUqmuxEvAhUM3w3R4Xw2hNAko4A1AoGBALsaHQJPrhtPM2aR8Tgja9Jism/b5so2XHsX8kGhHuJqxS6lxTc0xEswK4TIPZ+vxt5dHLOlEEZm70N672zHRpcIPEINJRXeCLwFQG3Ub9XAmC3uNRwg8VK3gR9oQXHZRmyRW6PfZTi5OotsfBD6jT6Zbqwu3TeWYNFUVMjGRo2nAoGACyLbDG5viiwzeHhiG1pLIhT5V79mthEzrIIbVPGpJw8TGcFbrIvAbG2diMwKJgBIDVrxTpczn0YTXRYGhD52QyoXFuehXfHF61nvfp/CnpD1eEBpOtBhtogwpkf1f8xv+HANNEfnvL/bJUDV31bnm7XnSaLLDe7Qi5BS8uYM5NUCgYAR7QuQeB/fP/RVxG/PCB3Bd3FPJEt1XkX4CTBNt2klGkOwF3PQuT6BUakpvKGi1g2Aqn0gfRUVGbGczn939ZO+zqwvS+Ecujwt/3bPzwWz/hLWe7cc7c8RNMGrR6rVhJKpvjeAeNvS1nRUfV1Zpxe3Qq4G0yqgs8is5Z6F6fFCiwKBgB3H2CvaFfsuVq5aav5O4zuEq+hgcTXBHFNE5V2uf0pOu3sq0de76RafJMs3hwiVZiyDN5hXxeyuMFvy/DEm1HAm0yvLJjXeq1DsAOMcsp6keyAOeXDFYd+0IyVxO337Aqif0cltIYSbmuZilW1aVL5mLYfupluGgP+2F/tzNkrs',
  });

  const formData = new AlipayFormData();
  // 调用 setMethod 并传入 get，会返回可以跳转到支付页面的 url
  formData.setMethod('get');

  formData.addField('notifyUrl', 'http://120.79.46.144/api/alipay');
  formData.addField('bizContent', {
    outTradeNo: 'out_trade_no1514131',
    productCode: 'FAST_INSTANT_TRADE_PAY',
    totalAmount: '0.01',
    subject: '商品',
    body: '商品详情',
  });

  const result = await alipaySdk.exec(
    'alipay.trade.page.pay',
    {},
    { formData: formData },
  );
  // result 为可以跳转到支付链接的 url
  console.log(result);
})();



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
router.use('/news', News)
router.use('/orders', Orders)

router.post('/alipay', function (req, res) {
  console.log(serialize(req))
  res.json(message(200,'','success'))
})

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
