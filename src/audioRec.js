const axios = require('axios');
const fs = require('fs');
const logger = require('./utils/logger');

module.exports = async (filePath) => {
  const data = fs.readFileSync(filePath);
  const requestConfig = {
    url: 'http://vop.baidu.com/pro_api',
    method: 'post',
    headers: { 'Content-Type': 'audio/m4a;rate=16000' },
    params: {
      dev_pid: 80001,
      cuid: 'mFHHRheGbRf8tFMGMSEy9dcQoF4nsZZ7',
      token: '24.e3e5e7465bacc1df1c889cba70692b40.2592000.1578449123.282335-17972693',
    },
    data,
  };
  await axios(requestConfig).then((response) => {
    if (response.data.err_no === 0) {
      logger.debug(`Got response ${response.data.result[0]} at audioRes.js`);
      return Promise.resolve(response.data.result[0]);
    }
    logger.error(`Error Code: ${response.data.err_no}, Error Msg: ${response.data.err_msg}`);
  }).catch((error) => {
    logger.error(error.message);
  }).finally(() => null);
};
