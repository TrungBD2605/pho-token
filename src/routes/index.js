const islandRouter = require('./island');
const userRouter = require('./user');
const authRouter = require('./auth');
const marketRouter = require('./market');
const likeRouter = require('./like');
const metadataRouter = require('./nft');

//
const route =  (app) => {
    app.use('/island',islandRouter)
    app.use('/user',userRouter)
    app.use('/auth',authRouter)
    app.use('/market',marketRouter)
    app.use('/favorite',likeRouter)
    app.use('/metadata',metadataRouter)
} 
module.exports = route;