# Core Finance 💸

An offline-first financial management app focused on performance, rapid data entry, and clean architecture.

## 🚀 Current State: Transactions MVP
The core financial tracking module is complete and fully functional.

* **Transactions CRUD:** Insert, edit, and soft-delete records.
* **Financial Typing:** Logical and visual separation between Expenses (🔴), Incomes (🟢), and Investments (🔵).
* **Global FAB (Floating Action Button):** Quick access menu overlaid on the main navigation.
* **Currency Masks:** Real-time formatting during typing to ensure data integrity.
* **Local Persistence:** Global state managed natively with zero delays.

## 🛠️ Tech Stack
* **Framework:** React Native with Expo (SDK 58) and Expo Router (File-based routing)
* **Language:** TypeScript
* **State Management:** Zustand + AsyncStorage
* **UI/UX:** Native components, Ionicons, FontAwesome5

## 🗺️ Roadmap & Next Steps
- [ ] **Overview (Home):** Dashboard consolidating the Current Balance and expense/income summaries.
- [ ] **Authentication:** Access control and user login system.
- [ ] **Sync Queue:** Background synchronization with the FastAPI backend for cloud persistence.