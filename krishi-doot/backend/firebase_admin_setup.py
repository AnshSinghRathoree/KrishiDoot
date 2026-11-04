import os
from pathlib import Path
from threading import Lock

import firebase_admin
from firebase_admin import credentials, auth, firestore
from dotenv import load_dotenv


# Load backend environment variables
load_dotenv()

# Your existing Firebase project
FIREBASE_PROJECT_ID = os.getenv(
    "FIREBASE_PROJECT_ID",
    "krishidoot-c1888"
)

_firebase_app = None
_firestore_db = None
_init_lock = Lock()


# --------------------------------------------------
# Initialize Firebase Admin SDK
# --------------------------------------------------

def initialize_firebase():

    global _firebase_app, _firestore_db

    if _firebase_app is not None:
        return _firebase_app

    with _init_lock:

        if _firebase_app is not None:
            return _firebase_app

        credential_path = os.getenv(
            "GOOGLE_APPLICATION_CREDENTIALS"
        )

        if not credential_path:
            raise RuntimeError(
                "Firebase service account path is missing."
            )

        credential_path = Path(
            credential_path
        ).expanduser().resolve()

        if not credential_path.is_file():
            raise FileNotFoundError(
                "Firebase service account file was not found."
            )

        service_account = credentials.Certificate(
            str(credential_path)
        )

        # Reuse an already initialized default app if present.
        try:
            app = firebase_admin.get_app()

        except ValueError:
            app = firebase_admin.initialize_app(
                service_account,
                options={
                    "projectId": FIREBASE_PROJECT_ID
                }
            )

        if app.project_id != FIREBASE_PROJECT_ID:
            raise RuntimeError(
                "Firebase project ID does not match "
                "the configured project."
            )

        _firebase_app = app

        _firestore_db = firestore.client(
            app=_firebase_app
        )

        return _firebase_app


# --------------------------------------------------
# Verify Firebase login token
# --------------------------------------------------

def verify_firebase_id_token(id_token):

    if not isinstance(id_token, str) or not id_token.strip():
        raise ValueError("Firebase ID token is required.")

    app = initialize_firebase()

    decoded_token = auth.verify_id_token(
        id_token.strip(),
        app=app,
        check_revoked=False
    )

    return decoded_token


# --------------------------------------------------
# Get Firestore database
# --------------------------------------------------

def get_firestore_client():

    initialize_firebase()

    return _firestore_db