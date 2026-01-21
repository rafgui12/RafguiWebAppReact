import MobileFilterPanel from './MobileFilterPanel';

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
    title: 'Blog/MobileFilterPanel',
    component: MobileFilterPanel,
    parameters: {
        layout: 'fullscreen',
        viewport: {
            defaultViewport: 'mobile1',
        },
        backgrounds: { default: 'dark' }
    },
    args: {
        posts: mockPosts,
        onFilterChange: (type, value) => console.log('Filter changed:', type, value),
        onClose: () => console.log('Close clicked'),
        t: (key) => `[${key}]` // Mock translation function
    }
};

export const Default = {};
