// parent keys couse circular references in object
import _ from 'lodash';

export const removeParentKeys = (obj?: Record<string, any>) => {
    if ( !obj || typeof obj !== "object") return obj;

    const stringified = JSON.stringify(obj, (key, value) => 
        key === 'parent' ? undefined : value
    );

    const parsed = JSON.parse(stringified);

    return parsed;
}
