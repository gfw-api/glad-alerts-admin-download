const Router = require('koa-router');
const AWS = require('aws-sdk');
const PassThrough = require('stream').PassThrough;


const router = new Router({
    prefix: '/service',
});

class Service {

    static sayHi(ctx) {

      // https://stackoverflow.com/a/27993593/
      var s3 = new AWS.S3()
      var params = {Bucket: 'gfw2-data',
                    Key: 'alerts-tsv/temp/glad-by-state/BRA/BRA_14.csv'};

      // var resp = new Promise((resolve, reject) => {
      //
      //   s3.getObject(params)
      //     .createReadStream()
      //     .on('end', () => {
      //       return resolve(); })
      //     .on('error', (error) => {
      //       console.log(error)
      //       return reject(error); })
      //     .pipe(PassThrough())});

        //ctx.body = ctx.req.pipe(resp)

        // kind of works, but waits for a long time before download
        // in browser starts
        var resp = s3.getObject(params)
          .createReadStream()
          .pipe(PassThrough());

        ctx.body = resp;
    }

}

router.get('/hi', Service.sayHi);

module.exports = router;
