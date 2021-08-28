const mongoose = require('mongoose');
const Grid = require('gridfs-stream');

// const conn = mongoose.createConnection(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
// conn.once('open', () => {
//   // Init stream
//   gfs = Grid(conn.db, mongoose.mongo);
//   gfs.collection('videos');

//   module.exports =  gfs;
// });
mongoose.connection.on('open', () => {
    gfs = Grid(mongoose.connection.db, mongoose.mongo);
    gfs.collection('videos');
    console.log(gfs.files)
    module.exports = gfs;
})