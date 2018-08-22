const Router = require('koa-router');
const AWS = require('aws-sdk');
const PassThrough = require('stream').PassThrough;

const {chain}  = require('stream-chain');

const parser = require('stream-csv-as-json');
const {streamValues} = require('stream-json/streamers/StreamValues');


const router = new Router({
    prefix: '/service',
});

class Service {

    static sayHi(ctx) {

      // https://stackoverflow.com/a/27993593/
      var s3 = new AWS.S3({
        httpOptions: {timeout: 1800000} // timeout after half an hour
      })
      var params = {Bucket: 'gfw2-data',
                    Key: 'alerts-tsv/temp/glad-by-state/BRA/BRA_14.csv'};

      const pipeline = chain([
        s3.getObject(params).createReadStream(),
        parser(),
        streamValues(),
        data => {
          const value = data.value;

          // this terminates the connection early because it takes a long time
          // to find this data
          return value && value[7] === '94' ? value.join(',') : null;

          // this works but downloads the whole file
          // return value.join(',');

        }])
        .pipe(PassThrough())

        ctx.body = pipeline;
    }

}

router.get('/hi', Service.sayHi);

module.exports = router;
