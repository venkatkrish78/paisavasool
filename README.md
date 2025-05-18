# PaisaVasool - Grocery Price Comparison & Aggregation

PaisaVasool is a web application that helps users save money on grocery shopping by comparing prices across multiple e-commerce platforms in Bangalore. The application allows users to create shopping lists, fetches real-time prices from major grocery delivery services, and suggests optimal shopping strategies to maximize savings.

![PaisaVasool App](https://joyofandroid.com/wp-content/uploads/2019/09/best-grocery-store-price-comparison-apps-android.png)

## Features

- **Shopping List Creation**: Create and manage multiple grocery shopping lists with customizable quantities and units.
- **Real-Time Price Comparison**: Compare prices across Amazon, BigBasket, Blinkit, and JioMart in real-time.
- **Smart Optimization**: Algorithm suggests the optimal way to split your shopping across platforms to maximize savings.
- **Delivery Fee Consideration**: Takes into account delivery fees and minimum order values for true cost comparison.
- **No Login Required**: Start comparing prices immediately without creating an account or sharing personal information.
- **Bangalore-Specific**: All price comparisons and delivery options are optimized for Bangalore.
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices.

## Technologies Used

- **Frontend**:
  - Next.js 14
  - React 18
  - TypeScript
  - Tailwind CSS
  - Framer Motion for animations
  - Radix UI components
  - Lucide React for icons

- **Backend**:
  - Next.js API Routes
  - Prisma ORM
  - PostgreSQL database

- **Deployment**:
  - Vercel (frontend and serverless functions)
  - Supabase (PostgreSQL database)

## Installation and Setup

### Prerequisites

- Node.js 18.x or higher
- npm or yarn
- PostgreSQL database

### Installation Steps

1. Clone the repository:
   ```bash
   git clone https://github.com/venkatkrish78/paisavasool.git
   cd paisavasool
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the app directory with the following variables:
   ```
   DATABASE_URL="postgresql://username:password@localhost:5432/paisavasool"
   ```

4. Initialize the database:
   ```bash
   cd app
   npx prisma migrate dev --name init
   npx prisma generate
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

6. Open your browser and navigate to `http://localhost:3000`

## Usage Instructions

### Creating a Shopping List

1. Navigate to the Dashboard by clicking "Get Started" on the homepage
2. Click on "New Shopping List" button
3. Give your list a name and start adding grocery items
4. For each item, specify the name, quantity, and unit (optional)
5. Click "Save" to create your shopping list

### Comparing Prices

1. From the Dashboard, select a shopping list
2. The application will automatically fetch prices from all supported platforms
3. View the price comparison for each item across different platforms
4. See the total cost for your entire shopping list on each platform

### Optimizing Your Shopping

1. After comparing prices, click on "Optimize Shopping"
2. The application will suggest the optimal way to split your shopping across platforms
3. View potential savings compared to buying everything from a single platform
4. Choose to follow the suggested optimization or shop from a single platform

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

Venkat Krishnan - [@venkatkrish78](https://github.com/venkatkrish78)

Project Link: [https://github.com/venkatkrish78/paisavasool](https://github.com/venkatkrish78/paisavasool)
