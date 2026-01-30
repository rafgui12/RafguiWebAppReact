import BlogSidebar from './BlogSidebar';

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
        categories: ['Design'],
        createdAt: '2022-05-15',
        author: 'Author 2'
    }
];

export default {
    title: 'Blog/BlogSidebar',
    component: BlogSidebar,
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
