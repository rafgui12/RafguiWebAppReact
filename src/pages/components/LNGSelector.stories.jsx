import LNGSelector from './LNGSelector';

export default {
    title: 'Shared UI/LNGSelector',
    component: LNGSelector,
    parameters: {
        layout: 'padded',
    },
    decorators: [
        (Story) => (
            <div style={{ position: 'relative', height: '100px', backgroundColor: '#000' }}>
                <Story />
            </div>
        )
    ]
};

export const Default = {};
