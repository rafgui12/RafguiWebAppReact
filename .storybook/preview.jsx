/** @type { import('@storybook/react-vite').Preview } */
import { MemoryRouter } from 'react-router';
import { LanguageProvider } from '../src/context/LanguageContext';
import '../src/index.css'; // Import global styles

const preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: 'dark',
      values: [
        {
          name: 'dark',
          value: '#1a1a1a', // Adjust this color to match your app's dark theme
        },
        {
          name: 'light',
          value: '#ffffff',
        },
      ],
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: "todo"
    }
  },
  decorators: [
    (Story) => (
      <MemoryRouter>
        <LanguageProvider>
          <Story />
        </LanguageProvider>
      </MemoryRouter>
    ),
  ],
};

export default preview;