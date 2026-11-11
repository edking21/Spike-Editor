import random

# Define the choices
choices = ['rock', 'paper', 'scissors']

# Map choices to numbers: 1=rock, 2=paper, 3=scissors
choice_to_num = {'rock': 1, 'paper': 2, 'scissors': 3}

# Table of outcomes: key is user_num * 10 + comp_num
# The key for each outcome is calculated as (user_num * 10 + comp_num),
# where user_num and comp_num are the numeric representations of the user's and computer's choices.
# This ensures each possible matchup has a unique key (e.g., user: rock (1), computer: scissors (3) => 1*10+3=13).
table = {
    11: "It's a tie!",  # rock vs rock
    12: "Computer wins! Paper covers rock.",  # rock vs paper
    13: "You win! Rock breaks scissors.",  # rock vs scissors
    21: "You win! Paper covers rock.",  # paper vs rock
    22: "It's a tie!",  # paper vs paper
    23: "Computer wins! Scissors cuts paper.",  # paper vs scissors
    31: "Computer wins! Rock breaks scissors.",  # scissors vs rock
    32: "You win! Scissors cuts paper.",  # scissors vs paper
    33: "It's a tie!"  # scissors vs scissors
}

def get_user_choice():
    while True:
        user_input = input("Enter your choice (rock, paper, scissors): ").lower()
        if user_input in choices:
            return user_input
        else:
            print("Invalid choice. Please choose rock, paper, or scissors.")

def determine_winner(user, computer):
    user_num = choice_to_num[user]
    comp_num = choice_to_num[computer]
    key = user_num * 10 + comp_num
    return table[key]

def play_game():
    print("Welcome to Rock-Paper-Scissors!")
    user_choice = get_user_choice()
    computer_choice = random.choice(choices)
    print(f"You chose: {user_choice}")
    print(f"Computer chose: {computer_choice}")
    result = determine_winner(user_choice, computer_choice)
    print(result)

if __name__ == "__main__":
    play_game()