import * as assert from "assert";
import {removeParentKeys} from '../src/removeParentKeys';

describe("removeParentKeys", () => {
  it("should deep remove 'parent' keys from object", () => {
    const options = {
        a: {
            b: {
                c: {}
            }
        },
        d: {}
    } as Record<string, any>;
    options.a.parent = options;
    options.a.b.parent = options;
    options.a.b.c.parent = options;
    options.d.parent = options;

    const expectedResult = {
        a: {
            b: {
                c: {}
            }
        },
        d: {}
    };

    assert.deepEqual(removeParentKeys(options), expectedResult);
  });

  it("should return undefine when passed undefine", () => {
    const options = undefined;
    const expectedResult = undefined;

    assert.deepEqual(removeParentKeys(options), expectedResult);
  });

  it("should return argument if non-object is passed", () => {
    const options = 'test';
    const expectedResult = 'test';

    assert.deepEqual(removeParentKeys(options as any), expectedResult);
  });
});
