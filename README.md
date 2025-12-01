# Live Polling System

A real-time polling application built with React, Redux, Express, and Socket.io.

## 🎯 Features

### Teacher Features
- ✅ Create multi-question quizzes with customizable options
- ✅ View live polling results with real-time bar charts
- ✅ Smart question flow - can only ask next question when ALL students have answered
- ✅ Configurable timer per question (30s, 60s, 90s, or 120s)
- ✅ Remove/kick students from session
- ✅ See connected students with answer status in real-time
- ✅ Mark correct answers for each question

### Student Features
- ✅ Enter unique name on first visit (enforced uniqueness)
- ✅ Submit answers once per question
- ✅ View live polling results after submission
- ✅ 60-second (configurable) timer to answer each question
- ✅ Instant feedback on correct/incorrect answers
- ✅ Clean, intuitive interface

### Real-time Features
- ✅ Instant vote updates using Socket.io
- ✅ Live student connection tracking
- ✅ Real-time answer status indicators
- ✅ Synchronized countdown timer
- ✅ Responsive mobile-friendly design

## 🎨 Design

UI follows a custom color palette:
- Primary Blue: `#5767D0`
- Vibrant Purple: `#4F0DCE`
- Light Purple: `#7765DA`
- Light Gray: `#F2F2F2`
- Dark Gray: `#373737`
- Medium Gray: `#8E8E8E`

## Prerequisites
- Node.js (v16 or higher)

## How to Run

1. Open a terminal in this directory.

2. Install dependencies (if not already done):
   ```bash
   npm install
   cd server && npm install
   cd ../client && npm install
   cd ..
   ```
   *(Note: The `npm install` in root also installs `concurrently`)*

3. Start the application (Backend + Frontend):
   ```bash
   npm start
   ```

4. Access the application:
   - **Home Page**: [http://localhost:5173/](http://localhost:5173/)
   - **Teacher View**: [http://localhost:5173/teacher](http://localhost:5173/teacher)
   - **Student View**: [http://localhost:5173/student](http://localhost:5173/student)

## 📁 Project Structure
```
polling-system/
├── client/               # React Frontend (Vite)
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── store/       # Redux store & slices
│   │   ├── styles/      # CSS files
│   │   └── socket.js    # Socket.io client
│   └── package.json
├── server/              # Express Backend
│   ├── socket/          # Socket event handlers
│   ├── state/           # In-memory state management
│   ├── server.js        # Main server file
│   └── package.json
├── DEPLOYMENT.md        # Deployment guide
├── FEATURES.md          # Detailed features documentation
└── README.md            # This file
```

## 🚀 Deployment

For production deployment instructions, see [DEPLOYMENT.md](DEPLOYMENT.md).

Quick summary:
1. Deploy backend to Render/Railway/Heroku
2. Update `client/src/socket.js` with backend URL
3. Deploy frontend to Vercel/Netlify/Render
4. Update CORS settings in backend

## 📖 User Guide

### For Teachers:
1. Navigate to `/teacher`
2. Create quiz with multiple questions
3. Add options and mark correct answers
4. Set timer duration (30-120s)
5. Click "Start Quiz"
6. Monitor student progress in real-time
7. Advance to next question when all students answer
8. Remove disruptive students if needed

### For Students:
1. Navigate to `/student`
2. Enter unique name
3. Answer questions within time limit
4. View results after submission
5. See correct answers highlighted
6. Wait for teacher to advance to next question

## 🛠️ Technology Stack

- **Frontend**: React 18, Redux Toolkit, React Router, Vite
- **Backend**: Express.js, Socket.io
- **Styling**: Custom CSS with CSS Variables
- **Real-time**: WebSocket connections via Socket.io

## 📋 Features Documentation

For detailed features list and technical implementation, see [FEATURES.md](FEATURES.md).

## 🧪 Testing

To test the application:
1. Open teacher view in one browser window
2. Open student views in multiple incognito/private windows
3. Create a poll as teacher
4. Join as students with different names
5. Answer questions and observe real-time updates
6. Test removing students
7. Verify "Next Question" only works when all answered

## 🔒 Security Notes

⚠️ This is a demo/educational project. For production use, consider:
- Add proper authentication (JWT/OAuth)
- Implement rate limiting
- Use database instead of in-memory storage
- Add input sanitization
- Enable HTTPS only
- Implement proper session management
- Add logging and monitoring

## 📝 License

This project is for educational/portfolio purposes.

## 🤝 Contributing

This is a portfolio project, but suggestions and feedback are welcome!

## 📧 Support

For issues or questions, please check:
- Browser console for client-side errors
- Server logs for backend issues
- WebSocket connection status
- CORS configuration if deployed

---

Made with ❤️ using React, Redux, and Socket.io
