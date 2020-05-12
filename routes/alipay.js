import { Router } from 'express';
import AlipaySdk from 'alipay-sdk';
import AlipayFormData from 'alipay-sdk/lib/form';
import message from '../common/message'
import HttpStatusCode from '../common/statusCode'
import User from '../DAO/user';
import { serialize, guid } from '../common/tool';
import Deposit from '../DAO/deposit';
// req.body :
// {
//   gmt_create: '2020-05-11 21:23:39',
//   charset: 'utf-8',
//   gmt_payment: '2020-05-11 21:23:48',
//   notify_time: '2020-05-11 21:23:49',
//   subject: '商品',
//   sign: 'fUJhtAbbFn15BPeUvvaBV1XGfBHheCUwCppGnhOgYRMmXeIadjRv1VRj/VBIHwIbsFO9Y                                                                                                                                                             BgCx5M+q0h+8AnbQeT0EcGjLmvFKmaSDp1aFZsQXsaJvdbyDM6dG5MBYKDJgCjzPgDD/IXZvjiRNWHPq                                                                                                                                                             fHC86k/E+mbvX30pdQGNVqRMZ+8dw5ywhMgbg0NB0vMgzyFeHa72vr2K+4o6whnP8x3Ek8ZhuP5R2Uvv                                                                                                                                                             ktO73jWmviVQoSUtYepI4W4IqizS+XRcNa8VppdGYWiWZevVv1rhOO2VaP1XkcYMy4PzPOtyWcygoJOb                                                                                                                                                             SNgnuZv2k6hpGb3DJu8x4ddzXQuuoT4jg==',
//   buyer_id: '2088102180886619',
//   body: '商品详情',
//   invoice_amount: '0.01',
//   version: '1.0',
//   notify_id: '2020051100222212349086610506503667',
//   fund_bill_list: '[{"amount":"0.01","fundChannel":"ALIPAYACCOUNT"}]',
//   notify_type: 'trade_status_sync',
//   out_trade_no: '1589203334882',
//   total_amount: '0.01',
//   trade_status: 'TRADE_SUCCESS',
//   trade_no: '2020051122001486610501010579',
//   auth_app_id: '2016102300744635',
//   receipt_amount: '0.01',
//   point_amount: '0.00',
//   app_id: '2016102300744635',
//   buyer_pay_amount: '0.01',
//   sign_type: 'RSA2',
//   seller_id: '2088102180758800'
// }
const router = Router();

router.post('/', async function (req, res) {
    const { trade_status, total_amount, extend_params } = req.body;
    const { user_id, deposit_id } = extend_params
    if(trade_status != 'TRADE_SUCCESS'){
        res.json(message(HttpStatusCode.ServerError,'','err'))
    }
    await new Promise((resolve) => {
        User.query({param: {Id: user_id}}, (result) => {
            if(result[0]){
                result[0].money+=Number(total_amount)
                User.update(serialize(result[0]),{Id: user_id},(_result) => {
                    if(_result){
                        resolve()
                    }
                })
            }
        })
    })
    await new Promise((resolve) => {
        Deposit.query({param: {Id: deposit_id}}, (result) => {
            result[0] = serialize(result[0])
            result[0].state = '1'
            Deposit.update(result[0], {Id: req.query.Id}, (_result) => {
                if(_result){
                    resolve()
                }
            })
        })
    })
    res.json(message(HttpStatusCode.success,'','success'))
})

router.get('/isSucc', function (req, res) {
    Deposit.query({param: {Id: req.query.Id}}, (result) => {
        if(result[0].state == '1'){
            res.json(message(HttpStatusCode.success,1,''))
        }else{
            res.json(message(HttpStatusCode.paramError,0,''))
        }
    })
})

router.get('/getpayurl', function (req, res) {
    (async () => {
        const alipaySdk = new AlipaySdk({
            appId: '2016102300744635',
            gateway: 'https://openapi.alipaydev.com/gateway.do',
            privateKey: 'MIIEowIBAAKCAQEAsM0VjOFT0dLSlaDVI6gfDPxWBK6AmQx2cKagj62cofOsRdSHrQe151Fxncxt7WRegU15CkHtTc8J/egwmdc1+x37rEieX8QJopgs540xFYnoiJ5ZMxEedESmqRttEVd0hLGtr0IqyJkN9MrCr1IHEyu/bcX1H0WUkWYFjy0Tg0vWWYcStKWh+Z5syotf/2rPMkr1AbIjZRP1PwXPGSl9ZN84mXt8AzFjy/ZFq+hSR+G+iyHyx0zlWfyGGMTOlwcK8i1DhorpvN/3xVj4GHTMSsGl6lRBrvA4JCwjtl5Cg+KowvZejlFJ6xWVziUk4heEN/Qnci+K7vb4KU88AMPTkwIDAQABAoIBAQCnOWMvvBROuqwpkFTog+TSoH0vsmm52PrRtBjbrOcgm1yPM+UcONXJs9PV3/z9c1ibzk408IRmevRFbu9BIzhQi1x26Ly7ca13V53paTdK2wTQ640M6x019ZT5EBLKO0DfHTtdMCVNVM7JgVpA/0Hn1RIb3wfpCyPpnmiVspnpLSULOCHQBQhBy3O63WvDx77zRbPSmH824oyNDg8Nu8GMGdX3GvpETeyY4oz5FAvwh01Wbbhlq+C9CRKCOdwR/odtZdY4omVXVe83FHGMmU1edgpUA4Hy4o3nyQo+5wN3VACzC9eYQEXVdlnkFe2d2h4Ld2ofCEpzjcBvXm7hhPgpAoGBAPHn6uVlvFbd8aHNIzD+bdS7+/0CKQYEY+6Ac/9nyGXXn62P8j7pbThuIqeh5NnEm5aylfrIRRw68RRlyg6CCXjGaB0UpGh3HxELBItvLWx9lbKauhnDHuEFRrjcQioU2qeALocCdlcGL3EbVUqmuxEvAhUM3w3R4Xw2hNAko4A1AoGBALsaHQJPrhtPM2aR8Tgja9Jism/b5so2XHsX8kGhHuJqxS6lxTc0xEswK4TIPZ+vxt5dHLOlEEZm70N672zHRpcIPEINJRXeCLwFQG3Ub9XAmC3uNRwg8VK3gR9oQXHZRmyRW6PfZTi5OotsfBD6jT6Zbqwu3TeWYNFUVMjGRo2nAoGACyLbDG5viiwzeHhiG1pLIhT5V79mthEzrIIbVPGpJw8TGcFbrIvAbG2diMwKJgBIDVrxTpczn0YTXRYGhD52QyoXFuehXfHF61nvfp/CnpD1eEBpOtBhtogwpkf1f8xv+HANNEfnvL/bJUDV31bnm7XnSaLLDe7Qi5BS8uYM5NUCgYAR7QuQeB/fP/RVxG/PCB3Bd3FPJEt1XkX4CTBNt2klGkOwF3PQuT6BUakpvKGi1g2Aqn0gfRUVGbGczn939ZO+zqwvS+Ecujwt/3bPzwWz/hLWe7cc7c8RNMGrR6rVhJKpvjeAeNvS1nRUfV1Zpxe3Qq4G0yqgs8is5Z6F6fFCiwKBgB3H2CvaFfsuVq5aav5O4zuEq+hgcTXBHFNE5V2uf0pOu3sq0de76RafJMs3hwiVZiyDN5hXxeyuMFvy/DEm1HAm0yvLJjXeq1DsAOMcsp6keyAOeXDFYd+0IyVxO337Aqif0cltIYSbmuZilW1aVL5mLYfupluGgP+2F/tzNkrs',
        });
        const depositEntity = {
            Id: req.query.deposit_id,
            amount: Number(req.query.amount),
            user: req.query.Id,
            state: '0'
        }
        const formData = new AlipayFormData();
        // 调用 setMethod 并传入 get，会返回可以跳转到支付页面的 url
        formData.setMethod('get');

        formData.addField('notifyUrl', 'http://120.79.46.144:3000/api/alipay/');
        formData.addField('bizContent', {
            outTradeNo: new Date().valueOf().toString(),
            productCode: 'FAST_INSTANT_TRADE_PAY',
            totalAmount: `${req.query.amount}`,
            subject: '充值',
            body: '充值详情',
            extend_params:{
                user_id: req.query.Id,
                deposit_id: req.query.deposit_id
            }
        });

        const result = await alipaySdk.exec(
        'alipay.trade.page.pay',
        {},
        { formData: formData },
        );
        
        await new Promise((resolve) => {
            Deposit.add(depositEntity, (result) => {
                resolve()
            })
        })
        // result 为可以跳转到支付链接的 url
        res.json(message(200,result,'msg'))
    })();
})
export default router
