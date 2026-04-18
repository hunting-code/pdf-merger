"""
Personal Expense Tracker - Flask Backend
Run with: python app.py
"""

import csv
import os
from flask import Flask, request, jsonify, render_template

app = Flask(__name__)

# The CSV file where all expenses are saved on disk
CSV_FILE = "expenses.csv"

# The column headers for the CSV file
CSV_HEADERS = ["id", "date", "description", "category", "amount"]


# Creates the CSV file with headers if it doesn't already exist
def init_csv():
    if not os.path.exists(CSV_FILE):
        with open(CSV_FILE, "w", newline="") as f:
            writer = csv.DictWriter(f, fieldnames=CSV_HEADERS)
            writer.writeheader()
        print(f"[INFO] Created new {CSV_FILE}")


# Reads all expenses from the CSV file and returns them as a list of dicts
def read_expenses():
    expenses = []
    with open(CSV_FILE, "r", newline="") as f:
        reader = csv.DictReader(f)
        for row in reader:
            # Convert amount from string back to a float for math
            row["amount"] = float(row["amount"])
            expenses.append(row)
    return expenses


# Writes a list of expense dicts back to the CSV file, replacing all content
def write_expenses(expenses):
    with open(CSV_FILE, "w", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=CSV_HEADERS)
        writer.writeheader()
        writer.writerows(expenses)


# Generates the next unique ID by finding the max existing ID and adding 1
def next_id(expenses):
    if not expenses:
        return 1
    # Pull out all IDs as integers, then return max + 1
    return max(int(e["id"]) for e in expenses) + 1


# --- Routes ---

# Serves the main dashboard HTML page
@app.route("/")
def index():
    return render_template("index.html")


# Returns all expenses as a JSON array (called by the frontend on page load)
@app.route("/expenses")
def get_expenses():
    expenses = read_expenses()
    return jsonify(expenses)


# Accepts a new expense from the frontend form and appends it to the CSV
@app.route("/add", methods=["POST"])
def add_expense():
    data = request.get_json()

    # Basic validation — make sure all required fields are present
    required = ["desc", "amount", "category", "date"]
    for field in required:
        if not data.get(field):
            return jsonify({"error": f"Missing field: {field}"}), 400

    # Try to parse amount as a positive number
    try:
        amount = float(data["amount"])
        if amount <= 0:
            raise ValueError
    except ValueError:
        return jsonify({"error": "Amount must be a positive number"}), 400

    expenses = read_expenses()

    # Build the new expense row
    new_expense = {
        "id": next_id(expenses),
        "date": data["date"],
        "description": data["desc"],
        "category": data["category"],
        "amount": round(amount, 2),  # Round to 2 decimal places like currency
    }

    expenses.append(new_expense)
    write_expenses(expenses)

    return jsonify({"success": True, "expense": new_expense}), 201


# Deletes a single expense by its ID
@app.route("/delete/<int:expense_id>", methods=["DELETE"])
def delete_expense(expense_id):
    expenses = read_expenses()

    # Keep every expense whose ID does NOT match the one to delete
    updated = [e for e in expenses if int(e["id"]) != expense_id]

    if len(updated) == len(expenses):
        # Nothing was removed — the ID didn't exist
        return jsonify({"error": "Expense not found"}), 404

    write_expenses(updated)
    return jsonify({"success": True})


# --- Entry point ---

if __name__ == "__main__":
    init_csv()  # Make sure the CSV file exists before we start
    print("=" * 50)
    print("  Personal Expense Tracker is running!")
    print("  Open http://localhost:5000 in your browser")
    print("=" * 50)
    app.run(debug=True)  # debug=True auto-reloads when you edit app.py
