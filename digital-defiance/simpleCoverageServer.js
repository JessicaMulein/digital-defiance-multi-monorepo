// save
var host = '127.0.0.1';
var port = 1337;
var express = require('express');

var app = express();
app.use(
  '/',
  express.static(
    '/workspaces/nx-monorepo/digital-defiance/coverage/libs/brightchain-quorum'
  )
);
app.listen(port, host);
