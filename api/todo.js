// api/todo.js

// Import your Express app setup
const app = require('./app'); // Update the path as needed

exports.handler = async (event, context) => {
  return new Promise((resolve, reject) => {
    const callback = (error, body) => {
      if (error) {
        reject(error);
      }
      resolve({
        statusCode: 200,
        body: JSON.stringify(body),
        headers: {
          'Content-Type': 'application/json',
        },
      });
    };

    // Pass the event, context, and a callback to your Express app
    app(event, context, callback);
  });
};
