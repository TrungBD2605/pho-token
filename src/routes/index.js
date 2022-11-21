const islandRouter = require('./island');
const userRouter = require('./user');
const authRouter = require('./auth');
const marketRouter = require('./market');
const likeRouter = require('./like');
const metadataRouter = require('./nft');
const blacklist = require('./blacklist');
const categoryRouter = require('./category');
//
const route =  (app) => {
    app.use('/island',islandRouter)
    app.use('/user',userRouter)
    app.use('/auth',authRouter)
    app.use('/market',marketRouter)
    app.use('/favorite',likeRouter)
    app.use('/metadata',metadataRouter)
    app.use('/category',categoryRouter)
    app.use('/blacklist',blacklist)
} 
module.exports = route;