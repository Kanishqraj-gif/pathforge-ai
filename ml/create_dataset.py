import random
import csv
import os

random.seed(42)

OUTPUT_FILE = "ml/data/learner_profiles.csv"

education_options = [
    "10th",
    "12th",
    "diploma",
    "BA",
    "BBA",
    "BCom",
    "BTech",
    "BCA",
    "BSc",
    "MBA",
    "MCA",
    "MA"
]

field_options = [
    "Arts",
    "Commerce",
    "Science",
    "Computer Science",
    "Management",
    "Engineering",
    "Humanities"
]

level_options = [
    "school_student",
    "college_student",
    "graduate",
    "working_professional"
]

career_options = [
    ("HR Manager", "hr_management"),
    ("HR Executive", "hr_management"),
    ("Talent Acquisition Specialist", "hr_management"),
    ("Marketing Manager", "marketing"),
    ("Digital Marketing Specialist", "marketing"),
    ("Data Scientist", "data_science"),
    ("Data Analyst", "data_science"),
    ("Machine Learning Engineer", "data_science"),
    ("Software Engineer", "software_engineering"),
    ("Full Stack Developer", "software_engineering"),
    ("UI UX Designer", "design"),
    ("Product Designer", "design"),
    ("Product Manager", "product_management"),
    ("Business Analyst", "business_analysis"),
]

records = []

for _ in range(2000):

    education = random.choice(education_options)
    field = random.choice(field_options)
    current_level = random.choice(level_options)

    if current_level == "school_student":
        education = random.choice(["10th", "12th"])
        experience_years = 0

    elif current_level == "college_student":
        education = random.choice(
            ["BTech", "BCA", "BBA", "BCom", "BSc", "BA"]
        )
        experience_years = random.choice([0, 0, 0, 1])

    elif current_level == "graduate":
        education = random.choice(
            ["BA", "BBA", "BCom", "BTech", "BCA", "BSc"]
        )
        experience_years = random.choice([0, 0, 1])

    else:
        education = random.choice(
            ["BA", "BBA", "BCom", "BTech", "BCA", "MBA", "MCA"]
        )
        experience_years = random.randint(1, 10)

    dream_role, career_track = random.choice(career_options)

    hours_per_week = random.randint(3, 20)

    timeline_months = random.choice(
        [3, 6, 9, 12, 18, 24, 36]
    )

    career_switch = False

    if current_level == "working_professional":
        career_switch = random.choice([True, False])

    elif random.random() < 0.12:
        career_switch = True

    # -------------------------------
    # RULE USED TO CREATE LABEL
    # -------------------------------

    if current_level == "school_student":

        learner_type = "school_explorer"

        if hours_per_week <= 6:
            starting_level = "foundation"
        else:
            starting_level = "beginner"

    elif current_level == "college_student":

        if experience_years == 0:
            learner_type = "college_beginner"
            starting_level = "beginner"
        else:
            learner_type = "college_developer"
            starting_level = "intermediate"

    elif current_level == "graduate":

        learner_type = "graduate_beginner"

        if experience_years >= 1:
            starting_level = "intermediate"
        else:
            starting_level = "beginner"

    else:

        if career_switch:

            learner_type = "career_switcher"

            if experience_years >= 5:
                starting_level = "intermediate"
            else:
                starting_level = "beginner"

        elif experience_years >= 5:

            learner_type = "career_advancer"
            starting_level = "intermediate"

        else:

            learner_type = "working_beginner"

            if experience_years >= 2:
                starting_level = "intermediate"
            else:
                starting_level = "beginner"

    records.append({
        "education": education,
        "field": field,
        "current_level": current_level,
        "experience_years": experience_years,
        "career_switch": career_switch,
        "dream_role": dream_role,
        "career_track": career_track,
        "hours_per_week": hours_per_week,
        "timeline_months": timeline_months,
        "learner_type": learner_type,
        "starting_level": starting_level
    })


os.makedirs("ml/data", exist_ok=True)

with open(
    OUTPUT_FILE,
    "w",
    newline="",
    encoding="utf-8"
) as file:

    writer = csv.DictWriter(
        file,
        fieldnames=records[0].keys()
    )

    writer.writeheader()
    writer.writerows(records)

print()
print("====================================")
print("PathForge Dataset Created")
print("====================================")
print(f"Records: {len(records)}")
print(f"File: {OUTPUT_FILE}")
print()