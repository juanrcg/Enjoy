
# **HANGOUT** 🎥 - Version **CAPYBARA**

Welcome to **HANGOUT**, the ultimate platform for connecting with others and buying or selling products and services. Currently in the **CAPYBARA** version, HANGOUT allows you to easily upload and list your products and services for sale, while staying connected through real-time chat and video calls.

---

## **🚀 Features**

- **Product & Service Listings**: Upload your products and services to the feed, making them available for potential buyers.
- **Real-Time Chat**: Communicate instantly with potential buyers or sellers through real-time messaging.
- **Video Calls**: Engage in high-quality one-on-one video calls to discuss deals, products, or services.
- **Cross-Platform Compatibility**: Whether you're using a phone, tablet, or computer, HANGOUT is designed to work seamlessly on all devices.
- **User Authentication**: Secure login and user management with AWS Cognito.
- **Secure and Scalable**: Powered by AWS services and WebSocket integration, ensuring fast and secure communication.
  
---

## **📜 Installation**

### Prerequisites

Before running the project, make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v14 or higher)
- [npm](https://npmjs.com)
- [AWS Cognito](https://aws.amazon.com/cognito/), for user authentication

### Steps

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/juanrcg/CAPYBARA.git
   cd CAPYBARA
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Set up AWS Cognito**:
   - Create a new AWS Cognito user pool and configure the application with the appropriate keys and credentials.
   - Update the configuration in the `AccountContext.js` file with your AWS credentials.

4. **Start the Development Server**:
   ```bash
   npm start
   ```

   The app will be running at `http://localhost:3000`.

---

## **🔧 Technology Stack**

- **Frontend**: React.js, JSX, CSS, WebSockets (for real-time communication)
- **Backend**: Node.js, Express, WebSocket, AWS Lambda (for API calls)
- **Video Calling**: PeerJS
- **Authentication**: AWS Cognito
- **State Management**: React Context API

---

## **🌟 Key Features**

### 1. **Sell Products & Services** 🛒
Easily upload products and services to the feed and sell directly through the platform. Share your offers with the community, manage product details, and make connections.

### 2. **Real-Time Video Calls** 🎥
Engage in one-on-one video calls with your customers or sellers to discuss deals or products in more detail.

### 3. **Instant Messaging** 💬
Chat instantly with buyers or sellers using real-time messaging to negotiate, clarify questions, and move deals forward.

### 4. **User Authentication** 🔐
HANGOUT integrates with AWS Cognito to manage secure logins and user profiles. Your personal information and transactions are always safe.

### 5. **Cross-Device Compatibility** 📱💻
Access HANGOUT from any device—whether you’re on your mobile phone or desktop, you can manage products and engage in calls anytime.

---

## **🔄 Future Features**

- **Shopping Cart**: Add a shopping cart functionality for a smoother checkout process.
- **Group Video Calls**: Enable video calls with multiple participants for group discussions and meetings.
- **Push Notifications**: Get notified when a product is sold, or a message is received.
- **Payment Integration**: Implement payment gateways so transactions can be completed directly through the app.

---

## **📱 Preview**

![Preview Image](https://your-preview-image-url.com)

---

## **🔗 Links**

- **GitHub Repository**: [https://github.com/juanrcg/CAPYBARA](https://github.com/juanrcg/CAPYBARA)
- **Live Demo**: (Add link to live demo if available)

---

## **💬 Contributing**

We welcome contributions! If you have ideas or improvements, feel free to fork the repository, open an issue, or submit a pull request. For contribution guidelines, check out the [CONTRIBUTING.md](CONTRIBUTING.md) file.

---

## **📑 License**

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

---

### **Developed by [Juan Campusano](https://github.com/juanrcg)**
