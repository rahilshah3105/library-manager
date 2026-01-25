# 📚 Open Shelf Platform (Angular Library Manager)

A modern, community-driven library management system built with Angular 19. This application features an "Open Platform" architecture where anyone can browse, and any user can instantly become a publisher.

![Angular](https://img.shields.io/badge/angular-%23DD0031.svg?style=for-the-badge&logo=angular&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)

## ✨ Key Features

### 🌍 Open Community Platform
- **Information First**: The home screen immediately displays the book catalog—no barriers to entry.
- **Instant Publishing**: Unique "Publish Book" workflow allows any user to sign in and contribute to the library.
- **Simplified Access**: No complex registration. Any username/password combination grants publishing rights.

### 🛡️ Ownership & Permissions
- **Creator Ownership**: Books are permanently linked to their creator.
- **Smart Permissions**:
  - You can **Edit** and **Delete** books you published.
  - Books published by others appear as **Read Only**.
- **Sample Data**: Includes a curated collection of classics (owned by System Admin) that serves as a permanent reference.

### 🎨 Modern Experience
- **Full-Screen Details**: Immersive book detail pages with metadata and descriptions.
- **Dark Mode**: Fully supported dark theme for comfortable reading.
- **Responsive Design**: Mobile-first architecture that works on any device.

## 🚀 Getting Started

Follow these steps to set up the project locally:

### 1. Prerequisites
Ensure you have **Node.js** ensuring `npm` is installed.

### 2. Installation
Clone the repository and install dependencies:

```bash
# Clone the repository
git clone https://github.com/rahilshah3105/library-manager.git

# Navigate to project directory
cd library-manager

# Install dependencies
npm install
```

### 3. Running the Application
Start the development server:

```bash
npm start
```
*Alternatively, you can run `ng serve` if you have Angular CLI installed globally.*

### 4. Open in Browser
Navigate to `http://localhost:4200` to view the application.

## 📖 Usage Guide

| Goal | Action |
|------|--------|
| **Browse Books** | Simply scroll the home page. Use the search bar or genre filter to find specific titles. |
| **View Details** | Click on any book card to open the **Full Screen Detail View**. Click "Back" to return. |
| **Publish a Book** | Click **"Publish Book"** in the top right. Enter any username (e.g., "Alex") and password to login. |
| **Manage Books** | After login, the **Add Book** form opens automatically. You can also edit/delete any books *you* created. |

## 🛠️ Tech Stack

- **Framework**: Angular 19
- **Language**: TypeScript 5.x
- **Styling**: Vanilla CSS3 (Variables & Responsive Layouts)
- **Data Persistence**: LocalStorage (Persists your changes in the browser)

## 📝 License

This project is open source and available under the MIT License.
