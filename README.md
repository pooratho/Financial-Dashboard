# 📊 Comprehensive Financial Analytics Dashboard

A modern, full-stack financial management platform designed to track, analyze, and visualize cash flows. This project implements a decoupled architecture, featuring a high-performance frontend communicating seamlessly with a robust REST API backend.

## 🏗️ System Architecture & Workflow

The application operates on a modern Client-Server model, ensuring scalability and clear separation of concerns:
- **Frontend (Client):** Built with Next.js and React. Responsible for UI/UX, client-side state management, interactive data visualization, and localized data formatting.
- **Backend (API):** A Django-powered RESTful API that handles business logic, database transactions, and secure data delivery.
- **Data Flow:** The frontend fetches real-time financial data (transactions, KPI metrics, trend points) via HTTP endpoints. The data is parsed, normalized (including strict string-to-number conversions for graphical rendering), and injected into dynamic UI components.

## ✨ Core Features

### 📈 Data Visualization & Reporting
- **Interactive Trend Analysis:** Dynamic line charts rendering income vs. expenses over time, engineered to handle edge cases like single-data-point rendering and missing datasets.
- **Categorical Breakdown:** Donut charts providing a clear, color-coded view of expense distribution across custom categories.
- **Real-time KPIs:** Instant calculation and display of Total Balance, Net Profit, and overall Cash Flow ratios.

### 🌍 Localization & Smart Formatting
- **Persian Calendar (Jalali):** Full integration of the Jalali date system for all transaction logs, filter inputs, and chart axes.
- **Currency Normalization:** Automated formatting for Iranian Toman to ensure highly readable financial figures.

### ⚡ Technical Highlights
- **Robust API Integration:** Built-in safeguards for data mismatching, including case-insensitive key mapping (e.g., mapping backend `INCOME` to frontend `income`).
- **Responsive UI:** A mobile-first approach utilizing Tailwind CSS, ensuring the dashboard is fully functional and visually consistent across desktop and mobile devices.

## 🛠️ Technology Stack

**Frontend Ecosystem (This Repository):**
- **Core:** Next.js, React
- **Styling:** Tailwind CSS
- **Data Visualization:** Recharts / Tremor
- **Localization:** Jalali-React / Moment-Jalaali

**Backend & Infrastructure (Connected Server):**
- **Core:** Django, Python
- **Architecture:** REST API
- **Deployment:** Nginx, PM2 (Hosted on a dedicated production server)

## 📂 Core Frontend Structure

```text
├── components/       # Reusable UI components (Charts, Cards, Tables)
├── pages/            # Next.js routing and main dashboard views
├── services/         # API call configurations and data fetching logic
├── utils/            # Helper functions (Date conversion, currency formatting)
└── public/           # Static assets and images
