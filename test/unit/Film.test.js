/* eslint-disable */

const {assert} = require('chai')
const Studio = require('../../lib/models/Studio');
const Actor = require('../../lib/models/Actor');

describe('Film model', () => {
    
    before(() => {
        const instStudio = new Studio({name: 'paramount'});
        const instActor = new Actor({name: 'jack'});
        const instActor2 = new Actor({name: 'jill'});
    });
    
    let rawData = null;

    beforeEach(() => rawData = {
        title: 'Halloween',
        studio: instStudio._id,
        cast: [
            instActor._id,
            instActor2._id
        ]
    });

});