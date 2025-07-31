# Emoji Rain Parallax

A performant React component for creating beautiful emoji rain animations with parallax effects.

## Installation
```bash
npm install emoji-storm
```

## Usage
```tsx
import React from 'react';
import { EmojiStorm } from 'emoji-storm';

const App = () => {
  const items = [
    '🌟',
    { type: 'image', value: 'https://example.com/image1.png' },
    { type: 'image', value: 'https://example.com/image2.png' },
    '💫',
    '✨',
  ];

  return <EmojiStorm items={items} />;
};

export default App;
```

## Demo
To run the demo locally:

### Clone the Repository:
```bash
git clone https://github.com/yourusername/emoji-storm.git
cd emoji-storm
```

### Install Dependencies:
```bash
npm install
```

### Start the Development Server:
```bash
npm run demo
```

### View the Demo:
Open [http://localhost:8080](http://localhost:8080) in your browser to see the EmojiStorm in action.

## Features
- **Customizable Items**: Rain emojis and/or images by passing an array of items.
- **Parallax Layers**: Multiple layers with different speeds and sizes for a depth effect.
- **Dynamic Sizing**: Items vary in size for a more natural appearance.
- **Spin Animation**: Items rotate as they fall.
- **Memory Optimized**: Emojis and images are removed from the DOM after their animation completes to prevent memory leaks.
- **Accessible Controls**: Buttons to trigger rain, drop single items, and clear all.

## Props
| Prop               | Type                                                                  | Default                                  | Description                                     |
|--------------------|-----------------------------------------------------------------------|------------------------------------------|-------------------------------------------------|
| items              | (string \| { type: 'emoji' \| 'image'; value: string })[]            | ['🥗', '🍕', '🥪', '🍔', '🍎', '🍇'] | Array of emojis or image URLs to display.        |
| triggerButtonLabel | string                                                                | 'Make it Rain!'                          | Label for the rain trigger button.              |
| dropButtonLabel    | string                                                                | 'Drop Single Emoji'                      | Label for the single drop button.               |
| clearButtonLabel   | string                                                                | 'Clear'                                   | Label for the clear button.                     |

## License
MIT License © 2024 Conzeon AB Jesper Wilfing

## Additional Optimizations Before Release

Before releasing your EmojiStorm component, consider the following optimizations and best practices to ensure it is robust, efficient, and user-friendly:

### 1. Performance Enhancements
- **Use requestAnimationFrame for Animations**: Instead of relying solely on CSS animations, integrating `requestAnimationFrame` can provide smoother and more performant animations, especially on lower-end devices.
- **Throttling and Debouncing**: Implement throttling or debouncing for functions like `triggerRain` and `dropSingleEmoji` to prevent performance issues from rapid, repeated calls.

### 2. Accessibility Improvements
- **Keyboard Navigation**: Ensure that all interactive elements (buttons) are accessible via keyboard navigation (e.g., using Tab key).
- **ARIA Attributes**: Add appropriate ARIA attributes to buttons and interactive elements to improve screen reader compatibility.

```tsx
<button
  onClick={triggerRain}
  aria-label="Trigger Emoji Rain"
  className={styles.button}
>
  {triggerButtonLabel}
</button>
```

### 3. Customization and Flexibility
- **Allow Custom Animation Durations and Speeds**: Expose props that let users customize animation durations, speeds, and other properties to fit different use cases.
- **Theming Support**: Integrate theming capabilities so that the component can adapt to different color schemes or styles based on the parent application.

### 4. TypeScript Enhancements
- **Strict Typing**: Ensure all TypeScript types are as strict as possible to catch potential bugs during development.
- **Prop Validation**: Validate props using TypeScript interfaces to provide clear contracts for component usage.

### 5. Testing
- **Comprehensive Unit Tests**: Expand your test suite to cover more scenarios, including edge cases. Use Jest and React Testing Library to simulate user interactions and verify component behavior.
- **Integration Tests**: Write integration tests to ensure that the component interacts correctly within larger applications.

### 6. Documentation
- **Detailed Examples**: Provide multiple usage examples in the README.md showcasing different configurations and use cases.
- **API Documentation**: Document all props, events, and methods available in the component for easy reference.

### 7. Bundle Optimization
- **Tree Shaking**: Ensure your build process supports tree shaking to eliminate unused code, reducing the final bundle size.
- **Code Splitting**: Implement code splitting to load only necessary parts of the component when needed.

### 8. Error Handling
- **Graceful Degradation**: Ensure the component fails gracefully in environments where certain features (like animations) are not supported.
- **Prop Validation Errors**: Provide meaningful error messages when invalid props are passed to the component.

### 9. Continuous Integration (CI)
- **Automated Testing**: Set up CI pipelines (e.g., GitHub Actions) to automatically run tests on each commit or pull request.
- **Linting and Formatting**: Integrate linting and formatting checks into your CI to maintain code quality.

### 10. Deployment and Distribution
- **NPM Publishing**: Ensure your package is properly configured for publishing on NPM, including correct `main` and `module` fields in `package.json`.
- **GitHub Releases**: Use GitHub releases to version your component and provide changelogs for each version.
- **CDN Hosting**: Consider hosting your component on a CDN for faster access if applicable.

### 11. Security Considerations
- **Validate Image URLs**: Ensure that image URLs provided to the component are from trusted sources to prevent security vulnerabilities like XSS attacks.
- **Content Security Policy (CSP)**: Advise users to implement CSP headers to restrict the sources from which images can be loaded.

### 12. Browser Compatibility
- **Cross-Browser Testing**: Test your component across different browsers and devices to ensure consistent behavior and appearance.
- **Polyfills**: Include necessary polyfills for older browsers that may not support certain modern JavaScript or CSS features used in your component.

### 13. Responsive Design
- **Adapt to Different Screen Sizes**: Ensure that the emoji rain effect scales well on various screen sizes, including mobile devices.
- **Touch Interactions**: Optimize the component for touch interactions if applicable.

### 14. Localization and Internationalization
- **Support Multiple Languages**: If your component includes text (e.g., button labels), ensure it supports localization for different languages.

### 15. Code Quality and Maintenance
- **Consistent Coding Standards**: Maintain consistent coding standards throughout the project using tools like ESLint and Prettier.
- **Modular Code Structure**: Keep your code modular and maintainable to facilitate future updates and feature additions.

### Final Checklist Before Release
- **All Features Implemented and Tested**: Ensure that all intended features are fully implemented and pass all tests.
- **Documentation Complete**: Your README.md should comprehensively cover installation, usage, customization, and contribution guidelines.
- **Performance Optimized**: The component should be optimized for performance, with minimal bundle size and efficient animations.
- **Accessibility Verified**: Confirm that the component is accessible to all users, including those using assistive technologies.
- **Security Audited**: Review the component for potential security vulnerabilities and address them accordingly.
- **CI/CD Pipelines Set Up**: Automated testing, linting, and build processes should be in place to maintain code quality.
- **Versioning and Release Management**: Use semantic versioning and maintain a clear changelog for each release.
- **Feedback Mechanism**: Provide a way for users to report issues or contribute to the project, such as through GitHub Issues and Pull Requests.

By following these optimizations and best practices, your EmojiStorm component will be well-prepared for a successful release, offering a high-quality experience to its users.

If you have any further questions or need assistance with specific aspects of the project, feel free to ask!
