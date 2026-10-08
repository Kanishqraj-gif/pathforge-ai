import pandas as pd
import joblib
import os

from sklearn.model_selection import train_test_split
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder
from sklearn.pipeline import Pipeline
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report


DATA_FILE = "ml/data/learner_profiles.csv"
MODEL_FILE = "ml/model/learner_profile_model.pkl"


print()
print("====================================")
print("PathForge ML Training")
print("====================================")


# ------------------------------------
# LOAD DATA
# ------------------------------------

df = pd.read_csv(DATA_FILE)

print(f"Dataset size: {len(df)} records")


# ------------------------------------
# FEATURES
# ------------------------------------

features = [
    "education",
    "field",
    "current_level",
    "experience_years",
    "career_switch",
    "dream_role",
    "career_track",
    "hours_per_week",
    "timeline_months"
]

target = "learner_type"


X = df[features]
y = df[target]


# ------------------------------------
# CATEGORICAL FEATURES
# ------------------------------------

categorical_features = [
    "education",
    "field",
    "current_level",
    "career_switch",
    "dream_role",
    "career_track"
]


numeric_features = [
    "experience_years",
    "hours_per_week",
    "timeline_months"
]


# ------------------------------------
# PREPROCESSING
# ------------------------------------

preprocessor = ColumnTransformer(
    transformers=[
        (
            "categorical",
            OneHotEncoder(
                handle_unknown="ignore"
            ),
            categorical_features
        ),

        (
            "numeric",
            "passthrough",
            numeric_features
        )
    ]
)


# ------------------------------------
# MODEL
# ------------------------------------

model = RandomForestClassifier(
    n_estimators=300,
    max_depth=15,
    random_state=42,
    class_weight="balanced"
)


pipeline = Pipeline(
    steps=[
        ("preprocessor", preprocessor),
        ("model", model)
    ]
)


# ------------------------------------
# TRAIN / TEST SPLIT
# ------------------------------------

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.20,
    random_state=42,
    stratify=y
)


print()
print("Training model...")


pipeline.fit(
    X_train,
    y_train
)


# ------------------------------------
# EVALUATION
# ------------------------------------

predictions = pipeline.predict(X_test)

accuracy = accuracy_score(
    y_test,
    predictions
)


print()
print("------------------------------------")
print(f"Model Accuracy: {accuracy * 100:.2f}%")
print("------------------------------------")

print()
print("Classification Report:")
print(
    classification_report(
        y_test,
        predictions
    )
)


# ------------------------------------
# SAVE MODEL
# ------------------------------------

os.makedirs(
    "ml/model",
    exist_ok=True
)

joblib.dump(
    pipeline,
    MODEL_FILE
)


print()
print("Model saved successfully:")
print(MODEL_FILE)

print()
print("====================================")
print("Training Complete")
print("====================================")