# Bank Branches App

A professional React Native banking application built with Expo Router that displays bank branches with detailed information.

## 🎯 What We Built

A mobile app that fetches and displays a list of bank branches with:
- **Branch List Screen** - Shows all available branches with location and address
- **Branch Details Screen** - Displays full information including contact details and working hours
- **Professional Dark Theme** - Premium banking app appearance with dark navy/black backgrounds and blue accents
- **Smooth Navigation** - Easy navigation between branch list and detailed views

## 🎨 Design Features

### Color Scheme
- **Dark Navy Background**: `#0a0e27` - Main background
- **Slightly Lighter Navy**: `#0f1535` - Header background
- **Dark Blue-Gray Cards**: `#1a2847` - Card backgrounds
- **Bright Blue Accent**: `#3b82f6` - Borders and highlights
- **White Text**: `#ffffff` - Primary text for high contrast
- **Light Blue**: `#93c5fd` - Secondary text
- **Light Gray-Blue**: `#cbd5e1` - Content text

### UI Elements
- Professional card-based layout with blue left borders
- Strong shadows for depth and premium feel
- Centered titles with proper spacing
- Clean typography with proper font weights
- Responsive design for all screen sizes

## 🛠️ Tech Stack

- **React Native** - Mobile app framework
- **Expo Router** - File-based routing (v6.0.12)
- **TypeScript** - Type-safe development
- **Axios** - HTTP client for API requests
- **Expo Status Bar** - White text on dark background

## 📁 Project Structure

```
bank-branches-app/
├── app/
│   ├── (tabs)/
│   │   ├── index.tsx          # Main branches list screen
│   │   └── _layout.tsx        # Tab layout configuration
│   ├── branch_details.tsx     # Branch details screen
│   ├── _layout.tsx            # Root layout with Stack navigation
│   └── app.json               # App configuration
├── components/
│   ├── themed-text.tsx        # Themed text component
│   ├── themed-view.tsx        # Themed view component
│   └── ui/
│       └── icon-symbol.tsx    # Icon component
├── constants/
│   └── theme.ts               # Color theme constants
├── hooks/
│   └── use-color-scheme.ts    # Color scheme hook
└── README.md                  # This file
```

## 🚀 Key Features

### Branches Screen
- Displays list of all bank branches
- Shows branch name, location, and address
- Touch-friendly cards with visual feedback
- Loading state with spinner
- Error handling with user-friendly messages
- Empty state message when no branches found

### Branch Details Screen
- Full branch information display
- Contact information (phone, email, etc.)
- Working hours for each day
- Back navigation to branches list
- Professional header with back button

### API Integration
- Fetches data from bank branches API
- Handles nested API response structure: `data.data[].Brand[].Branch[]`
- Proper error handling and loading states
- Automatic data flattening for easy access

## 💻 Code Quality

### TypeScript
- Simple and clean type definitions
- Minimal but effective type annotations
- Uses `undefined` instead of `null` (TypeScript best practice)
- Proper interface definitions for API data

### Code Style
- Clean, readable code with inline comments
- Simplified API flattening using optional chaining (`?.`)
- Consistent naming conventions
- Professional component structure

## 🎯 What Makes It Professional

1. **Dark Theme** - Like premium banking apps (Revolut, N26)
2. **Proper Spacing** - Consistent padding and margins
3. **Visual Hierarchy** - Clear text sizes and weights
4. **Shadows & Depth** - Professional elevation effects
5. **Color Consistency** - Cohesive blue and dark color scheme
6. **Typography** - Clean fonts with proper weights
7. **User Experience** - Smooth navigation and loading states
8. **Error Handling** - Graceful error messages

## 📱 Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm start
   ```

3. Open Expo Go on your phone and scan the QR code

## 🔄 How It Works

1. **App Loads** - Fetches branch data from API
2. **Display List** - Shows all branches in a scrollable list
3. **User Taps Branch** - Navigates to detailed view
4. **Show Details** - Displays full branch information
5. **User Taps Back** - Returns to branch list

## ✨ Achievements

✅ Professional dark theme with blue gradients
✅ Responsive mobile UI
✅ Clean TypeScript implementation
✅ Proper error handling
✅ Smooth navigation between screens
✅ API data parsing and display
✅ Loading and empty states
✅ Professional banking app appearance

---

Built with ❤️ using React Native and Expo
