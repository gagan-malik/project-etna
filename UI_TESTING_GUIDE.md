# 🎨 UI Testing Guide

Test all the UI pages and components without needing a database!

---

## ✅ Pages to Test

### 1. **Home Page** (`/`)
- **URL:** http://localhost:3000
- **What to check:**
  - Page loads without errors
  - Navigation works
  - Theme toggle works (if visible)
  - Sidebar appears (if logged in)

### 2. **Login Page** (`/login`)
- **URL:** http://localhost:3000/login
- **What to check:**
  - Login form displays correctly
  - Input fields work
  - "Sign up" link works
  - OAuth buttons display (GitHub, Google)
  - Form validation (try submitting empty form)

### 3. **Signup Page** (`/signup`)
- **URL:** http://localhost:3000/signup
- **What to check:**
  - Signup form displays correctly
  - All input fields work (Name, Email, Password, Confirm Password)
  - "Login" link works
  - Form validation
  - Google signup button displays

### 4. **Chat Page** (`/chat`)
- **URL:** http://localhost:3000/chat
- **What to check:**
  - Welcome message displays (when no messages)
  - Input area works
  - File attachment button
  - Model selector dropdown
  - GitHub repo selector
  - Send button
  - Suggestions buttons work
  - Dark mode works

### 5. **Activity/History Page** (`/activity`)
- **URL:** http://localhost:3000/activity
- **What to check:**
  - Page loads
  - Empty state displays (no conversations yet)
  - Navigation works

### 6. **Settings Dialog**
- **How to access:** Click "Settings" in sidebar
- **What to check:**
  - Dialog opens
  - All settings tabs work (Notifications, Appearance, etc.)
  - Settings sidebar navigation
  - Close button works
  - Dark mode toggle in settings

### 7. **Test API Page** (`/test-api`)
- **URL:** http://localhost:3000/test-api
- **What to check:**
  - Page loads
  - All test buttons display
  - Input fields work
  - Results area displays
  - Clear button works

---

## 🧪 Interactive Testing Checklist

### Navigation
- [ ] Sidebar navigation works
- [ ] All menu items are clickable
- [ ] Active page is highlighted in sidebar
- [ ] Logo/header links to home
- [ ] Settings opens as dialog
- [ ] Help & Support link works

### Forms
- [ ] Login form inputs work
- [ ] Signup form inputs work
- [ ] Form validation displays errors
- [ ] Submit buttons are clickable
- [ ] Links between login/signup work

### Chat Interface
- [ ] Text input area expands
- [ ] File attachment button works
- [ ] Model selector opens dropdown
- [ ] GitHub repo selector works
- [ ] Send button is clickable
- [ ] Suggestions buttons work
- [ ] Character counter displays (if typing)

### Theme/Dark Mode
- [ ] Theme toggle button works
- [ ] Light mode displays correctly
- [ ] Dark mode displays correctly
- [ ] Theme persists on page refresh
- [ ] Settings theme selector works

### Responsive Design
- [ ] Test on mobile viewport (narrow browser)
- [ ] Sidebar collapses on mobile
- [ ] Forms are usable on mobile
- [ ] Chat interface works on mobile

---

## 🐛 Common Issues to Check

### Page Not Loading
- **Check:** Browser console for errors (F12)
- **Check:** Terminal for server errors
- **Fix:** Refresh page or restart dev server

### Styling Issues
- **Check:** CSS is loading
- **Check:** Tailwind classes are working
- **Fix:** Clear browser cache

### Navigation Not Working
- **Check:** Links are correct
- **Check:** Router is working
- **Fix:** Check browser console for errors

---

## 📱 Browser Testing

Test in multiple browsers:
- [ ] Chrome/Edge
- [ ] Firefox
- [ ] Safari (if on Mac)

---

## 🎯 Quick Test Script

Open browser console (F12) and run:

```javascript
// Test navigation
console.log('Testing navigation...');
document.querySelectorAll('a').forEach(link => {
  console.log('Link:', link.href, link.textContent);
});

// Test forms
console.log('Testing forms...');
document.querySelectorAll('form').forEach(form => {
  console.log('Form found:', form);
});

// Test buttons
console.log('Testing buttons...');
document.querySelectorAll('button').forEach(btn => {
  console.log('Button:', btn.textContent, btn.disabled);
});
```

---

## ✅ Success Criteria

All pages should:
- ✅ Load without errors
- ✅ Display correctly
- ✅ Be responsive
- ✅ Have working navigation
- ✅ Support dark mode
- ✅ Have accessible forms

---

## 🚀 Next Steps After UI Testing

Once UI is working:
1. Set up database (see `DATABASE_SETUP_SIMPLE.md`)
2. Test API routes (see `TEST_API.md`)
3. Test full user flow (signup → login → chat)

---

**Happy Testing! 🎨✨**

