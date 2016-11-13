const rp = require('request-promise');

const user = process.env.ELASTIC_USER || require('../config').user;
const pass = process.env.ELASTIC_PASSWORD || require('../config').password;

const URL = 'http://1b4f84fecd657bad91626e9aa8f74e59.us-west-1.aws.found.io:9200';

module.exports = {
  create: (title, text) => {
    const options = {
      method: 'POST',
      uri: `${URL}/1/archive`,
      auth: {
        user,
        pass,
      },
      body: {
        title,
        text,
      },
      json: true,
    };

    rp(options)
      .catch((err) => {
        console.error(err);
      });
  },
  search: (qs, callback) => {
    const options = {
      method: 'GET',
      uri: `${URL}/1/archive/_search`,
      auth: {
        user,
        pass,
      },
      body: {
        query: {
          match: {
            text: qs,
          },
        },
      },
      json: true,
    };

    rp(options)
      .then((data) => {
        callback(data);
      })
      .catch((err) => {
        console.error(err);
      });
  },
};
