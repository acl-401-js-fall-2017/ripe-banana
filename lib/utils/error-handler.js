module.exports = function createHandler() {
    // eslint-disable-next-line
    return (err, req, res, next) => {
        let code =500;
        let error = { error: 'Internal Server Error' };

        if(err.code) {
            code = err.code;
            error = { error: err.message };
        }
        else if(err.name === 'CastError') {
            code = 400;
            error = { error: err.message };
        }
        else if(err.name === 'ValidationError') {
            code = 400;

            error = {
                error: Object.values(err.errors)
                    .map(values => values.message)
            };
        }
        else {
            console.log(err); // eslint-disable-line
        }

        res.status(code).json(error);
    };
};