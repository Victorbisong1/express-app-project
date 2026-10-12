const express = require('express');
const app = express();
const PORT = 3000;

// Custom Middleware to check working hours
const workingHoursMiddleware = (req, res, next) => {
  const currentDate = new Date();
  const dayOfWeek = currentDate.getDay();   // 0 = Sunday, 1 = Monday ... 5 = Friday, 6 = Saturday
  const currentHour = currentDate.getHours(); // 0 to 23 hours

  // Is it Monday (1) through Friday (5)?
  const isWorkingDay = dayOfWeek >= 1 && dayOfWeek <= 5;

  // Is it between 9:00 AM (9) and 5:00 PM (17)?
  const isWorkingHour = currentHour >= 9 && currentHour < 17;

  if (isWorkingDay && isWorkingHour) {
    // If yes, let them pass to the website!
    next(); 
  } else {
    // If no, block them and show a closed message
    res.status(503).send(`
      <body style="font-family: Arial; text-align: center; margin-top: 50px;">
        <h1>🔒 We are closed right now!</h1>
        <p>This web application is only available during working hours:</p>
        <p><strong>Monday to Friday, from 9:00 to 17:00.</strong></p>
      </body>
    `);
  }
};

// 1. Tell Express to use our security guard middleware on ALL requests
app.use(workingHoursMiddleware);

// 2. Tell Express where to find our CSS and static files
app.use(express.static('public'));

// 3. Define the routes for our 3 pages
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

app.get('/services', (req, res) => {
  res.sendFile(__dirname + '/public/services.html');
});

app.get('/contact', (req, res) => {
  res.sendFile(__dirname + '/public/contact.html');
});

// 4. Start the server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});