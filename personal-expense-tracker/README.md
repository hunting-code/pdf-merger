# Personal Expense Tracker

A simple web app to track your daily expenses — built with Python (Flask) and a single HTML page.
All your data is saved to `expenses.csv` on your computer. Nothing is sent anywhere.

## File structure

```
personal-expense-tracker/
├── app.py              ← Flask backend (all routes live here)
├── expenses.csv        ← Created automatically on first run
├── README.md           ← This file
└── templates/
    └── index.html      ← The entire frontend (HTML + CSS + JS)
```

## How to run

**Step 1 — Install Flask** (one-time setup)

```bash
pip install flask
```

**Step 2 — Start the server**

```bash
python app.py
```

You should see this in your terminal:

```
==================================================
  Personal Expense Tracker is running!
  Open http://localhost:5000 in your browser
==================================================
```

**Step 3 — Open the app**

Go to [http://localhost:5000](http://localhost:5000) in any browser.

**Step 4 — Stop the server**

Press `Ctrl + C` in the terminal when you're done.

---

## Features

- Add expenses with a description, amount (₹), category, and date
- Delete any expense with one click
- Live summary: total spent, number of entries, top category
- Bar chart: spending by category
- Line chart: spending over time
- Data saved to `expenses.csv` — persists across restarts

## Categories

`Food` · `Transport` · `Shopping` · `Bills` · `Entertainment` · `Other`

## Troubleshooting

| Problem | Fix |
|---|---|
| `ModuleNotFoundError: No module named 'flask'` | Run `pip install flask` |
| Port 5000 already in use | Run `python app.py` and look for the error — another app is using port 5000. Close it, or change `app.run(port=5001)` in `app.py`. |
| Changes not showing up | Flask runs in debug mode — it auto-reloads. Hard-refresh the browser with `Cmd+Shift+R` (Mac) or `Ctrl+Shift+R` (Windows). |
