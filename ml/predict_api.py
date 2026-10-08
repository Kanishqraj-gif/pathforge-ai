import sys
import json
import joblib
import pandas as pd


MODEL_FILE = "ml/model/learner_profile_model.pkl"


def main():

    # Receive JSON from Node.js
    raw_input = sys.stdin.read()

    if not raw_input:
        raise ValueError("No profile received.")

    profile = json.loads(raw_input)

    model = joblib.load(MODEL_FILE)

    data = pd.DataFrame([profile])

    prediction = model.predict(data)[0]

    probabilities = model.predict_proba(data)[0]

    confidence = float(max(probabilities))

    result = {
        "learner_type": prediction,
        "confidence": round(confidence, 4)
    }

    print(json.dumps(result))


if __name__ == "__main__":
    try:
        main()

    except Exception as error:

        print(
            json.dumps({
                "error": str(error)
            })
        )

        sys.exit(1)