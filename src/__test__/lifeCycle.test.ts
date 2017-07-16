import {init as initLifeCycle} from '../core/lifeCycle'
import {expect} from 'chai';
import 'mocha';

describe('Init life Cycle', () => {
    it('life cycle count should be 6', () => {
        const result = initLifeCycle();
        let len = Object.keys(result).length;
        expect(len).to.equal(6);
    });
});
