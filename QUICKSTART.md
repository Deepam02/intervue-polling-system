# Quick Start Guide

## 🚀 Running the Application Locally

### 1. Install Dependencies
```bash
npm install
cd server && npm install
cd ../client && npm install
cd ..
```

### 2. Start the Application
```bash
npm start
```

This will start:
- **Backend** on `http://localhost:3000`
- **Frontend** on `http://localhost:5173`

### 3. Access the Application

Open two browser windows:

**Window 1 - Teacher:**
```
http://localhost:5173/teacher
```

**Window 2 - Student (open multiple tabs):**
```
http://localhost:5173/student
```

Or start from the home page and select your role:
```
http://localhost:5173/
```

---

## 🎮 Testing the Features

### Step 1: Create a Poll (Teacher)
1. Open teacher view
2. Fill in first question (e.g., "What is 2+2?")
3. Add options: "3", "4", "5", "6"
4. Mark "4" as correct
5. Select duration (60s recommended)
6. Add more questions if desired
7. Click "Start Quiz"

### Step 2: Join as Students
1. Open student view in 3 different tabs/windows
2. Enter unique names:
   - Tab 1: "Alice"
   - Tab 2: "Bob"  
   - Tab 3: "Charlie"
3. All students should see the question

### Step 3: Test Smart Question Flow
1. Have Alice and Bob answer the question
2. **In Teacher View**: Notice:
   - Student list shows ✓ for Alice and Bob
   - Charlie shows ⏳ (waiting)
   - "Next Question" button is DISABLED
   - Message: "⏳ Waiting for all students to answer..."
3. Have Charlie answer
4. **In Teacher View**: Notice:
   - All students show ✓
   - "Next Question" button is now ENABLED
5. Click "Next Question" to proceed

### Step 4: Test Remove Student
1. In teacher view, find Charlie in the student list
2. Click the × button next to Charlie's name
3. **Charlie's tab**: Will show alert and redirect to home
4. **Teacher view**: Charlie removed from list

### Step 5: Test Timer
1. Let the timer run out on a question
2. All students and teacher see results automatically
3. Results show:
   - Correct answer highlighted in green
   - Vote percentages
   - Bar chart visualization

---

## ✅ Features to Demonstrate

### Teacher Features
- ✅ Create multi-question quiz
- ✅ Configurable timer (30/60/90/120s)
- ✅ View connected students with status
- ✅ Remove students
- ✅ "Next Question" only works when all answered
- ✅ Live results with bar charts

### Student Features
- ✅ Unique name enforcement
- ✅ Real-time question updates
- ✅ Answer submission
- ✅ Timer countdown
- ✅ Instant results after answering
- ✅ Correct/incorrect feedback

### Real-time Features
- ✅ All updates are instant
- ✅ Student list updates in real-time
- ✅ Vote counts update live
- ✅ Timer synchronized across all clients

---

## 🎨 UI Verification

Check that these colors are used throughout:

- **Primary Blue (#5767D0)**: Main buttons, badges
- **Vibrant Purple (#4F0DCE)**: Hover states
- **Light Gray (#F2F2F2)**: Background
- **Dark Gray (#373737)**: Text
- **Medium Gray (#8E8E8E)**: Secondary text

---

## 🐛 Troubleshooting

### Backend not starting?
```bash
cd server
npm install
npm start
```

### Frontend not starting?
```bash
cd client
npm install
npm run dev
```

### Port already in use?
- Backend: Change PORT in `server/server.js`
- Frontend: Port is auto-assigned by Vite

### Socket connection issues?
- Check `client/src/socket.js` has correct backend URL
- Ensure backend is running before frontend
- Check browser console for errors

---

## 📚 Documentation

- **README.md** - Overview and setup
- **FEATURES.md** - Complete feature list
- **DEPLOYMENT.md** - Production deployment guide
- **IMPLEMENTATION_SUMMARY.md** - What was implemented
- **CHECKLIST.md** - Pre-submission checklist

---

## 🎯 Key Requirements Verification

### Must-Have ✅
1. Functional system - Works perfectly
2. Teacher creates polls - Yes
3. Students answer polls - Yes
4. Both view results - Yes
5. Real-time Socket.io - Yes
6. UI matches design - Yes
7. Smart question flow - Yes (only advance when all answered)

### Good-to-Have ✅
1. Configurable timer - Yes (30/60/90/120s)
2. Remove student - Yes (with × button)
3. Well-designed UI - Yes (modern, responsive)

---

## 🚀 Next Steps

1. ✅ Test locally (follow steps above)
2. ⏳ Deploy to production (see DEPLOYMENT.md)
3. ⏳ Update socket URL for production
4. ⏳ Test deployed version

---

**Need Help?**

Check the documentation files or review the code comments. All features are fully implemented and ready to use!

---

**Status**: ✅ Ready for Testing and Deployment
