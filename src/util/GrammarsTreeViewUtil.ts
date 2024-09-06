interface data {
    id: string;
    title: string;
    children?: data[];
    [key: string]: any;
}

/**
 * Checks if the specified data is nestable
 */
function isNestable(value: any) { return (typeof value === 'object' && !Array.isArray(value)) };

/**
 * Transforms the raw data into nestable data to feed to the tree list
 */
export function transformToTree(data: any, title: string = 'response'): data {
    const nonNestableData = Object.fromEntries(Object.entries(data).filter(([key, value]) => !isNestable(value)));
    const id =`${Math.random()}`;
    let result: data = {
        ...nonNestableData,
        id,
        title: `${title}`,
        children: []
    };
    for (const key in data) {
        if (isNestable(data[key])) {
            const nestedChild: any = transformToTree(data[key], key);
            result.children?.push(nestedChild);
        }
    }
    if (!result.children?.length) {
        delete result.children;
    }
    return result;
}

/**
 * Returns the filtered data and the expanded ids based on the filters
 */
export function filterByTitle(data: data, searchTitle: string, expandedIdsParam: Array<string> = []) {
    let result = {};

    let expandedIds = expandedIdsParam;

    if (!searchTitle) return { result: data, expandedIds: [] };
    if (data.title.toLowerCase() && data.title.includes(searchTitle.toLowerCase())) {
        result = { ...data };
    }
    else if (data.children && Array.isArray(data.children)) {
        const filteredChildren = data.children.map(child => filterByTitle(child, searchTitle, [...expandedIds, data.id]))
            .filter(({ result }) => Object.keys(result).length > 0);
        if (filteredChildren.length > 0) {
            result = { ...data, children: filteredChildren.map(({ result }) => result) };
            expandedIds = [...expandedIds, ...filteredChildren.flatMap(({ expandedIds }) => expandedIds)];
        }
    }
    return { result, expandedIds: [...new Set(expandedIds)] };
}