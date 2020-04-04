const axios = require('axios');
const fs = require('fs');
const logger = require('../utils/logger');

module.exports = async (filePath) => {
  const data = fs.readFileSync(filePath);
  const requestConfig = {
    url: 'http://vop.baidu.com/pro_api',
    method: 'post',
    headers: { 'Content-Type': 'audio/m4a;rate=16000' },
    params: {
      dev_pid: 80001,
      cuid: 'mFHHRheGbRf8tFMGMSEy9dcQoF4nsZZ7',
      token: '24.049dacdd766ff60c1cdfae80eb7e384b.2592000.1588560068.282335-17972693', // 可以用到20号，以后再写获取token部分
    },
    data,
  };
  const response = await axios(requestConfig); // 改成then的形式
  if (response.data.err_no === 0) {
    return Promise.resolve({
      result : 'success',
      code: 0,
      data: response.data.result[0]
    });
  }
  logger.error(`Error Code: ${response.data.err_no}, Error Msg: ${response.data.err_msg}`);
  return Promise.reject({
    result: 'fail',
    code: response.data.err_no,
    msg: response.data.err_msg
  });
};
