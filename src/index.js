const app = require('./app.js');
const { PORT } = require('./config.js');

const server = app.listen(PORT, () => console.log(`server listen on port ${PORT}`));

module.exports = { server };

require('./socket.config.js');
