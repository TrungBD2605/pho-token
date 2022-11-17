var Metadata = require("../models/Metadata");

class MetadataController {

    getMetadataById(req,res){
        function isNumeric(val) {
            return /^-?\d+$/.test(val);
        }
        if(isNumeric(req.params.id)){
            Metadata.findOne({ 'key': req.params.id },(err, metadata) => {
                if(err){
                    res.json({result:false, msg:"err"});
                }else{
                    if(metadata){
                        res.json(metadata)
                    }else{
                        res.json({})
                    }
                }
            })
            
        }else{
            res.json({});
        }
    }
}
module.exports = new MetadataController();