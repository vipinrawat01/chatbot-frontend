# Chatbot Snippet Integration Guide

This guide will help you integrate the chatbot snippet functionality into your new frontend project.

## Files Created

1. **ChatbotEmbedModal.tsx** - Modal for displaying and copying embed codes
2. **ChatbotBuilder.tsx** - Complete chatbot builder with design controls
3. **useCopySnippet.ts** - Custom hook for copying functionality

## Installation Steps

### 1. Copy the Component Files

Copy these files to your `src/components/` directory:
- `ChatbotEmbedModal.tsx`
- `ChatbotBuilder.tsx`
- `useCopySnippet.ts`

### 2. Install Required Dependencies

Add these dependencies to your project:

```bash
npm install lucide-react
# or
yarn add lucide-react
```

### 3. Update Your Main App

Add the ChatbotBuilder to your main app:

```tsx
// src/App.tsx or your main component
import ChatbotBuilder from './components/ChatbotBuilder';

function App() {
  return (
    <div className="App">
      <ChatbotBuilder />
    </div>
  );
}
```

### 4. Add Required CSS Classes

Make sure your Tailwind CSS includes these utilities. Add to your `tailwind.config.ts`:

```typescript
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      },
      spacing: {
        '88': '22rem',
      }
    },
  },
  plugins: [],
}
```

## How It Works

### 1. Chatbot Design Process

1. **User opens the ChatbotBuilder component**
2. **Design Tab**: Customize colors, text, and appearance
3. **Settings Tab**: Choose widget type (floating/embedded), position, size
4. **Preview Tab**: See live preview of the chatbot
5. **Save**: Store chatbot configuration in localStorage

### 2. Code Generation

When user clicks "Get Code":

1. **ChatbotEmbedModal opens**
2. **Generates HTML snippet** with unique chatbot ID
3. **Provides multiple integration options**:
   - HTML (direct paste)
   - React component
   - WordPress PHP code
4. **One-click copy functionality**

### 3. Generated Snippet Format

The system generates this HTML snippet:

```html
<div id="agentive_floating" data-chatbot-id="chatbot_1234567890" data-widget-type="floating"></div>
<script async src="https://yourapp.com/embed/v1/aiq-chat-widget.js"></script>
```

### 4. Widget Script Integration

To make the snippets work on user websites, you need to create the widget script endpoint:

#### Option A: Use Existing Widget Script
Point the snippet to your existing widget script from the original frontend:

```typescript
// In ChatbotEmbedModal.tsx, update the appUrl prop
appUrl="https://your-original-frontend.com"
```

#### Option B: Create New Widget Script
Copy the widget script files from the original frontend:
- `src/app/embed/v1/aiq-chat-widget.js/route.ts`
- `src/app/embed/v1/widget-loader-core.js`
- `src/app/embed/v1/widget-utils.ts`

## API Integration

### Required API Endpoints

Your backend needs these endpoints for the widget to work:

1. **GET** `/api/chatbot-instances/[id]/public-config`
   - Returns chatbot settings and configuration
   - Used by the widget script to load settings

2. **POST** `/api/chatbot-instances`
   - Create new chatbot instance
   - Save chatbot settings to database

3. **PUT** `/api/chatbot-instances/[id]`
   - Update existing chatbot
   - Modify chatbot settings

### Example API Response

```json
{
  "name": "My Chatbot",
  "uiSettings": {
    "headerText": "Chat with us",
    "headerColor": "#3B82F6",
    "userBubbleColor": "#3B82F6",
    "botBubbleColor": "#F3F4F6",
    "backgroundColor": "#FFFFFF",
    "fontFamily": "Inter, sans-serif",
    "borderRadius": 12,
    "chatbotType": "FLOATING_WIDGET"
  },
  "type": "FLOATING_WIDGET",
  "introMessage": "Hello! How can I help you today?"
}
```

## Customization Options

### Styling
- Modify colors in the component files
- Update Tailwind classes for different themes
- Add custom CSS for advanced styling

### Features
- Add more design controls (fonts, animations)
- Include additional widget types
- Add preview for different screen sizes
- Implement real-time collaboration

### Integration Types
- Add more code snippet formats (Vue.js, Angular)
- Include installation instructions
- Add preview iframe for testing

## Testing

1. **Create a chatbot** in the builder
2. **Customize the design** and settings
3. **Generate embed code**
4. **Test on a simple HTML page**:

```html
<!DOCTYPE html>
<html>
<head>
    <title>Test Page</title>
</head>
<body>
    <h1>Test Website</h1>
    <p>This is a test page for the chatbot widget.</p>
    
    <!-- Paste your generated snippet here -->
    <div id="agentive_floating" data-chatbot-id="your-chatbot-id" data-widget-type="floating"></div>
    <script async src="https://yourapp.com/embed/v1/aiq-chat-widget.js"></script>
</body>
</html>
```

## Troubleshooting

### Common Issues

1. **Widget not appearing**: Check console for script loading errors
2. **Styling not applied**: Verify API endpoint returns correct settings
3. **Copy not working**: Ensure HTTPS for clipboard API

### Debug Mode

Add debug logging to the widget script:

```javascript
console.log('AIQ Chat Widget: Loading chatbot', chatbotId);
console.log('AIQ Chat Widget: Settings loaded', settings);
```

## Next Steps

1. **Database Integration**: Replace localStorage with real database
2. **User Authentication**: Add user accounts and chatbot ownership
3. **Analytics**: Track chatbot usage and performance
4. **Advanced Features**: Add AI training, conversation flows
5. **White-label**: Allow custom branding and domains

## Support

For additional help:
- Check the original frontend code for reference
- Test with different chatbot configurations
- Verify API endpoints are working correctly
- Use browser developer tools for debugging 