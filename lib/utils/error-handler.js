module.exports = function createErrorHandler() {
    //eslint-disable-next-line
    return (err, req, res, next) => {
        
        let code = 500;
        let error = { error: 'INTERNAL SERVER ERROR' };

        if (error.code) {
            code = error.code;
            error = error.err;
        }

        else if (err.name === 'CastError') {
            code = 400;
            error = { error: err.message };
        }

        else if (err.name === 'ValidationError') {
            code = 400;
            error = { error: Object.values(err.errors).map( value => value.message )};
        }

        else {
            console.log(error);
        }

        res.status(code).json(error);

    };
};