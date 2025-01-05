# Expense Tracker Pro

A professional expense tracking application built with React and Material-UI, featuring comprehensive expense management, data visualization, and export capabilities.

![Expense Tracker Pro](screenshot.png)

## 🌟 Features

- **Modern UI/UX**: Clean and intuitive interface built with Material-UI
- **Expense Management**: 
  - Add, edit, and delete expenses
  - Categorize expenses
  - Filter by year
  - Test data generation for demonstration
- **Data Visualization**:
  - Real-time expense statistics
  - Category-wise breakdown
  - Monthly trends
- **Export Capabilities**:
  - Export to Excel with detailed summaries
  - Professional PDF reports with statistics
  - Support for both selected period and all-time data
- **Data Persistence**: Local storage implementation for expense data
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## 🚀 Live Demo

Check out the live demo: [Expense Tracker Pro](https://your-netlify-url.netlify.app)

## 🛠️ Technologies Used

- **React**: ^18.2.0
- **Material-UI**: ^6.3.1
- **PDF Generation**: jsPDF ^2.5.2
- **Excel Export**: xlsx ^0.18.5
- **Form Handling**: Formik ^2.4.6
- **Validation**: Yup ^1.6.1
- **Notifications**: React-Toastify ^11.0.2
- **Testing**: Jest and Cypress
- **State Management**: React Context API
- **Date Handling**: date-fns ^4.1.0

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/expense-tracker-pro.git
```

2. Install dependencies:
```bash
cd expense-tracker-pro
npm install
```

3. Start the development server:
```bash
npm start
```

4. Build for production:
```bash
npm run build
```

## 🔧 Configuration

The application uses several environment variables that can be configured:
- Create a `.env` file in the root directory
- Add necessary environment variables (if any)

## 📊 Project Structure

```
src/
├── components/         # React components
├── context/           # Context providers
├── services/          # Utility services
├── styles/            # CSS and style files
└── assets/           # Images and static files
```

## 🧪 Testing

Run the test suite:
```bash
npm test
```

Run Cypress end-to-end tests:
```bash
npm run cypress:open
```

## 📱 Responsive Design

The application is fully responsive and has been tested on:
- Desktop (1920x1080)
- Tablet (768x1024)
- Mobile (375x667)

## 🔒 Security

- Data is stored securely in local storage
- No sensitive information is exposed
- Form validation prevents malicious input

## 🚀 Deployment

The application can be deployed to various platforms:

### Netlify
1. Create a new site in Netlify
2. Connect to your GitHub repository
3. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `build`

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 Author

## 👨‍💻 Developer

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/siracalaks">
        <img src="https://github.com/siracalaks.png" width="100px;" alt="Developer Profile Picture"/>
        <br />
        <sub><b>Sirac</b></sub>
      </a>
    </td>
  </tr>
</table>

### Contact
- 📧 Email: [siracalaks@gmail.com](mailto:email@example.com)
- 💼 LinkedIn: [https://www.linkedin.com/in/sirac-alakus-64a29917a/](https://www.linkedin.com/in/sirac-alakus-64a29917a/)

---

<div align="center">

⭐️ If you enjoyed this project, don’t forget to give it a star!

</div>


## 🙏 Acknowledgments

- Material-UI for the amazing component library
- The React community for inspiration and support
- All contributors who helped improve this project

---

⭐️ If you found this project helpful, please give it a star on GitHub!
