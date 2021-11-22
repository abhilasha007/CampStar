module.exports = func => {
    return (req, res, next) => {
        func(req, res, next).catch(next);
    }
}

// alternate for try catch
// ( .. ,async() =>{ try{..}catch{next(e)} })  ==>  ( .., catchAsync(async() => {...}) )