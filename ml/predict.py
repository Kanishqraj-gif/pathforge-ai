import joblib
import pandas as pd


MODEL_FILE = "ml/model/learner_profile_model.pkl"


# ------------------------------------
# LOAD MODEL
# ------------------------------------

model = joblib.load(MODEL_FILE)


def predict_learner(profile):

    data = pd.DataFrame([profile])

    learner_type = model.predict(data)[0]

    probabilities = model.predict_proba(data)[0]

    classes = model.classes_

    confidence = max(probabilities)

    return {
        "learner_type": learner_type,
        "confidence": round(
            float(confidence),
            4
        )
    }


# ------------------------------------
# TEST PROFILE
# ------------------------------------

profile = {
    "education": "BA",
    "field": "Arts",
    "current_level": "working_professional",
    "experience_years": 5,
    "career_switch": True,
    "dream_role": "HR Manager",
    "career_track": "hr_management",
    "hours_per_week": 6,
    "timeline_months": 18
}


result = predict_learner(profile)


print()
print("====================================")
print("PathForge Learner Prediction")
print("====================================")

print(
    f"Learner Type: {result['learner_type']}"
)

print(
    f"Confidence: {result['confidence'] * 100:.2f}%"
)

print()