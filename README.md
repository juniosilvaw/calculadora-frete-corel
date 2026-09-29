# 📦 Freight Calculator

A modern and responsive freight calculator built with **React + TypeScript**, designed to estimate shipping costs based on package weight, shipping service, and destination region.

The project was created as a practical application of **frontend development, data handling, validation, component-based architecture, and AI-assisted development**.

---

## 🚀 Overview

**Freight Calculator** provides a simple interface for calculating shipping costs using predefined freight tables.

Users can:

* Enter the package weight
* Choose between **kg** and **g**
* Select the shipping service
* Select the region when using SEDEX
* Calculate the estimated shipping cost
* Clear the form and start a new calculation
* Receive validation feedback for invalid inputs
* View the calculated price in a dedicated result card

The application loads its freight pricing data dynamically from a JSON file, making the pricing structure easier to maintain and update.

---

## ✨ Features

### 🧮 Freight Calculation

The application supports:

* **SEDEX**

  * Metropolitan region
  * Interior region
* **PAC**
* Weight conversion between kilograms and grams
* Price calculation based on weight ranges
* Additional cost calculation for packages over **30 kg**

### ✅ Input Validation

The application validates:

* Empty weight fields
* Invalid or negative weights
* Missing shipping service
* Missing SEDEX region
* Invalid or unavailable weight ranges
* Failure to load the freight pricing table

### 🎨 User Interface

The interface was designed with usability and responsiveness in mind.

It includes:

* Responsive layout
* Interactive form controls
* Loading states
* Error alerts
* Result cards
* Visual feedback
* Accessible UI components
* Icons using Lucide React

### 🤖 AI Integration

The project also contains a reusable AI chat component designed to integrate with an LLM backend.

The `AIChatBox` component supports:

* User and assistant messages
* Loading states
* Markdown rendering
* Suggested prompts
* Auto-scrolling
* Keyboard interaction
* AI response visualization

This structure makes it possible to expand the project with AI-powered features in the future.

---

## 🛠️ Tech Stack

### Frontend

* **React 18**
* **TypeScript**
* **Vite**
* **Tailwind CSS**
* **Radix UI**
* **Lucide React**
* **React Query**
* **Wouter**

### Backend / Infrastructure

* **Node.js**
* **Express**
* **tRPC**
* **Drizzle ORM**
* **MySQL**
* **Zod**

### Development Tools

* **Vite**
* **TypeScript**
* **ESBuild**
* **Vitest**
* **Prettier**
* **pnpm**

---

## 📁 Project Structure

```text
calculadora-frete-react/
│
├── client/
│   ├── public/
│   │   └── tabelas_frete.json
│   │
│   └── src/
│       ├── components/
│       │   ├── ui/
│       │   └── AIChatBox.tsx
│       │
│       ├── contexts/
│       ├── hooks/
│       ├── lib/
│       ├── pages/
│       │   └── Home.tsx
│       │
│       ├── App.tsx
│       ├── index.css
│       └── main.tsx
│
├── server/
│   └── _core/
│
├── drizzle/
│   ├── relations.ts
│   └── schema.ts
│
├── patches/
│
├── package.json
└── README.md
```

---

## ⚙️ How the Calculation Works

The application first loads the freight table from:

```text
client/public/tabelas_frete.json
```

The user then provides:

```text
Weight
↓
Unit (kg / g)
↓
Shipping Service
↓
Region (SEDEX only)
↓
Calculation
↓
Estimated Freight Price
```

Internally, weights are converted to grams before the calculation is performed.

For packages within the predefined weight ranges, the application retrieves the corresponding price.

For packages above **30 kg**, an additional price per kilogram is applied.

---

## 📊 Freight Data

The current dataset contains pricing information for:

| Service | Region         | Maximum Base Weight |
| ------- | -------------- | ------------------: |
| SEDEX   | Metropolitan   |               30 kg |
| SEDEX   | Interior       |               30 kg |
| PAC     | National table |               30 kg |

> ⚠️ The values stored in `tabelas_frete.json` are application data and should be treated as estimates. Shipping prices and conditions may change.

---

## 💻 Getting Started

### Prerequisites

Make sure you have installed:

* Node.js
* pnpm
* Git

Check your versions:

```bash
node --version
pnpm --version
git --version
```

---

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/calculadora-frete-react.git
```

Enter the project directory:

```bash
cd calculadora-frete-react
```

---

### 2. Install dependencies

```bash
pnpm install
```

---

### 3. Start the development server

```bash
pnpm dev
```

The development environment will start according to the project's configured server.

---

### 4. Type checking

Run TypeScript validation with:

```bash
pnpm check
```

---

### 5. Run tests

```bash
pnpm test
```

---

### 6. Build for production

```bash
pnpm build
```

---

## 🧪 Development Workflow

A typical development workflow for this project is:

```bash
pnpm install
pnpm check
pnpm test
pnpm build
```

This helps ensure that the project is correctly typed, tested, and ready to be built.

---

## 🔮 Future Improvements

Possible improvements for future versions include:

* [ ] Add AI-powered freight recommendations
* [ ] Add CEP-based destination lookup
* [ ] Integrate a real shipping API
* [ ] Add package dimensions
* [ ] Calculate dimensional weight
* [ ] Add delivery time estimates
* [ ] Add freight history
* [ ] Add multiple package calculations
* [ ] Add authentication
* [ ] Add database persistence
* [ ] Add automated tests for freight calculations
* [ ] Add dark mode
* [ ] Add internationalization
* [ ] Deploy the application to production

---

## 🤖 AI-Assisted Development

This project was also developed as a practical experiment with **AI-assisted software development**.

AI tools were used as development support for activities such as:

* Exploring implementation approaches
* Generating development ideas
* Reviewing code
* Improving UI concepts
* Structuring components
* Troubleshooting development issues

The goal was not simply to generate code, but to use AI as a development assistant while understanding the architecture, logic, and technologies involved.

---

## 📚 What I Learned

This project provided practical experience with:

* React component architecture
* React Hooks
* TypeScript interfaces
* State management with `useState`
* Side effects with `useEffect`
* Form validation
* Conditional rendering
* JSON data consumption
* Asynchronous operations
* Loading and error states
* Responsive UI development
* Tailwind CSS
* Reusable components
* AI integration concepts
* Git and GitHub workflow

---

## 🎯 Project Goal

The main goal of this project is to transform a simple calculation problem into a **real-world web application**, while practicing modern frontend development concepts.

It is part of my journey as a **Software Engineering student** and represents my ongoing effort to build practical projects, improve my programming skills, and develop a professional portfolio.

---

## 👨‍💻 Author

**Juninho**

Software
