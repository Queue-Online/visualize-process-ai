# Visual Process Design Tool for AI

A powerful visual process design tool built with React and React Flow, designed specifically for AI process support. Create flowcharts, system architectures, and user journeys with an intuitive drag-and-drop interface.

## 🚀 Features

- **Drag & Drop Components**: Easy-to-use component palette with various node types
- **Custom Node Types**: HTML elements, databases, APIs, decision points, user actions, and external services
- **Real-time Editing**: Live properties panel for configuring node details
- **Professional UI**: Clean, modern interface with Tailwind CSS styling
- **Type-safe**: Built with TypeScript for better development experience

## 🏗️ Architecture

- **Frontend**: React 18 + TypeScript
- **Flow Library**: React Flow (@xyflow/react)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React

## 🛠️ Phase 1: Foundation ✅

The foundation phase has been completed with:

- ✅ React project setup with TypeScript and React Flow
- ✅ Core application architecture and component structure
- ✅ Responsive UI layout with sidebar, canvas, and properties panel
- ✅ Component palette with categorized drag-and-drop elements
- ✅ Properties panel for node configuration
- ✅ Basic node creation and connection functionality

## 🎯 Available Node Types

### UI Components
- **Web Page** 🌐 - HTML pages or routes
- **Form** 📝 - HTML forms with inputs
- **Button** 🔘 - Clickable button elements

### Backend Components
- **Database** 🗄️ - Database operations (CRUD)
- **API Call** 🔌 - REST API endpoints

### Logic Components
- **Decision** ❓ - Conditional logic branches
- **User Action** 👆 - User interactions

### External Services
- **Payment** 💳 - Payment gateway integrations
- **Authentication** 🔐 - User authentication services

## 🚀 Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm start
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📋 Usage Examples

### Creating a Login Flow
1. Drag a "Web Page" node for the login page
2. Add a "Form" node for the login form
3. Connect to a "Database" node for user validation
4. Add a "Decision" node for success/failure paths
5. Configure properties for each node

### Building an E-commerce Flow
1. Start with a "Web Page" for the product page
2. Add "User Action" nodes for interactions
3. Include "Payment" external service
4. Connect with appropriate decision points

## 🔄 Next Phases

- **Phase 2**: Custom node types and advanced drag-and-drop
- **Phase 3**: Save/load functionality and export features
- **Phase 4**: Advanced features and collaboration tools

## 🤝 Contributing

This project is in active development. Feel free to contribute ideas and improvements!