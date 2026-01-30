import FilterContents from './FilterContents';

const mockPosts = [
    {
        id: 1,
        title: 'Post 1',
        categories: ['Tech', 'React'],
        createdAt: '2023-01-01',
        author: 'Rafgui'
    },
    {
        id: 2,
        title: 'Post 2',
        categories: ['Design', 'UX'],
        createdAt: '2022-05-15',
        author: 'John Doe'
    },
    {
        id: 3,
        title: 'Post 3',
        categories: ['Tech'],
        createdAt: '2023-08-20',
        author: 'Rafgui'
    }
];

export default {
    title: 'Blog/FilterContents',
    component: FilterContents,
    parameters: {
        layout: 'padded',
        backgrounds: { default: 'dark' }
    },
    args: {
        posts: mockPosts,
        onFilterChange: (type, value) => console.log('Filter changed:', type, value),
    }
};

export const Default = {};
