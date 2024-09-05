import { transformToTree, filterByTitle } from "../util/GrammarsTreeViewUtil.ts";

describe('GrammarsTreeViewUtil', () => {
    const rawData = {
        key1: 'title',
        key2: {
            key3: {
                examples: ['test']
            }
        },
        key4: {
            examples: ['test2']
        }
    };

    const nestedData = {
        key1: 'title',
        id: 1,
        title: 'response',
        children: [
            {
                id: 3,
                title: 'key2',
                children: [{
                    id: 4,
                    title: 'key3',
                    examples: ['test']
                }]
            },
            {
                id: 5,
                title: 'key4',
                examples: ['test2']
            }
        ]
    };

    it('Transforms data to nestable data', () => {
        expect(transformToTree(rawData)).toStrictEqual(nestedData)
    });

    it('Filters the data and returns the expanded ids based on the search value', () => {
        const expected = {
            expandedIds: [1],
            result: {
                key1: 'title',
                id: 1,
                title: 'response',
                children: [
                    {
                        id: 5,
                        title: 'key4',
                        examples: ['test2']
                    }
                ]
            }
        }
        expect(filterByTitle(nestedData, 'key4')).toStrictEqual(expected);
    });
});