# ============================================
#   NUMBER GUESSING GAME
#   Project 01 — Python Learning Roadmap
#   Concepts: variables, loops, if/else,
#             functions, random module
# ============================================

import random   # Python's built-in module for random numbers
import time     # We'll use this to add small dramatic pauses

# ── STEP 1: DEFINE DIFFICULTY LEVELS ──────────────────────────────────────────
# A dictionary maps a name (key) to its settings (value)
# Each difficulty has: how big the number range is, and max guesses allowed

DIFFICULTIES = {
    "easy":   {"range": 50,  "max_guesses": 10, "label": "Easy   (1–50,  10 guesses)"},
    "medium": {"range": 100, "max_guesses": 7,  "label": "Medium (1–100,  7 guesses)"},
    "hard":   {"range": 200, "max_guesses": 5,  "label": "Hard   (1–200,  5 guesses)"},
}

# ── STEP 2: A FUNCTION TO CALCULATE SCORE ─────────────────────────────────────
# Functions are reusable blocks of code.
# This one takes how many guesses were used and the difficulty, returns a score.

def calculate_score(attempts_used, max_guesses, difficulty_range):
    """Higher score for fewer attempts and harder difficulty."""
    base_score = (max_guesses - attempts_used + 1) * 10
    difficulty_bonus = difficulty_range // 10   # integer division (//) drops the decimal
    return base_score + difficulty_bonus


# ── STEP 3: THE MAIN GAME FUNCTION ────────────────────────────────────────────
# When Python sees "def", it creates a function we can call later.

def play_game():
    print("\n" + "=" * 45)
    print("   WELCOME TO THE NUMBER GUESSING GAME!")
    print("=" * 45)

    # ── Ask the player their name ──
    # input() pauses the program and waits for the user to type something
    player_name = input("\nWhat's your name? ").strip()  # .strip() removes accidental spaces
    if not player_name:
        player_name = "Player"   # default if they press Enter without typing

    print(f"\nHello, {player_name}! Let's play.")   # f"..." lets you insert variables inside text

    # ── Ask for difficulty ──
    print("\nChoose a difficulty:")
    for key, val in DIFFICULTIES.items():   # .items() gives us both key and value at once
        print(f"  [{key}]  {val['label']}")

    # Keep asking until they type a valid choice
    while True:                              # "True" makes this loop run forever...
        choice = input("\nYour choice: ").lower().strip()
        if choice in DIFFICULTIES:          # ...until we hit a "break"
            difficulty = DIFFICULTIES[choice]
            break
        print("Please type 'easy', 'medium', or 'hard'.")

    # ── Set up the round ──
    max_num      = difficulty["range"]
    max_guesses  = difficulty["max_guesses"]
    secret       = random.randint(1, max_num)   # picks a random whole number in the range

    print(f"\nI've picked a number between 1 and {max_num}.")
    print(f"You have {max_guesses} guesses. Good luck!\n")
    time.sleep(0.8)   # pause 0.8 seconds for dramatic effect

    # ── Guessing loop ──
    attempts = 0       # counter — starts at zero
    won      = False   # flag — tracks whether the player won

    while attempts < max_guesses:           # keep looping until guesses run out
        remaining = max_guesses - attempts
        print(f"Guesses remaining: {remaining}")

        # ── Get a valid number from the player ──
        while True:
            raw = input(f"Guess a number (1–{max_num}): ")
            try:
                guess = int(raw)            # convert text to integer
                if 1 <= guess <= max_num:   # check it's inside the valid range
                    break
                print(f"Please enter a number between 1 and {max_num}.")
            except ValueError:              # happens if they type letters instead of numbers
                print("That doesn't look like a number. Try again.")

        attempts += 1   # "+=" means "add 1 to itself" — shorthand for: attempts = attempts + 1

        # ── Check the guess ──
        if guess == secret:
            print(f"\n🎉  YES! The number was {secret}!")
            print(f"    You got it in {attempts} guess{'es' if attempts > 1 else ''}.")
            won = True
            break   # exit the while loop immediately
        elif guess < secret:
            diff = secret - guess
            if diff <= 5:
                print("⬆️   So close! A little higher.\n")
            else:
                print("⬆️   Too low! Go higher.\n")
        else:
            diff = guess - secret
            if diff <= 5:
                print("⬇️   So close! A little lower.\n")
            else:
                print("⬇️   Too high! Go lower.\n")

    # ── End of round ──
    if not won:
        print(f"\n😬  Out of guesses! The number was {secret}.")

    # ── Show score if they won ──
    if won:
        score = calculate_score(attempts, max_guesses, max_num)
        print(f"    Score: {score} points")

    # ── Play again? ──
    again = input("\nPlay again? (yes / no): ").strip().lower()
    if again in ("yes", "y"):
        play_game()   # calling the function inside itself = recursion!
    else:
        print(f"\nThanks for playing, {player_name}! See you next time.\n")


# ── STEP 4: THE ENTRY POINT ───────────────────────────────────────────────────
# This is a Python convention. The code inside only runs when YOU run this file
# directly — not if another file imports it.

if __name__ == "__main__":
    play_game()
