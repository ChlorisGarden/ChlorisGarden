import os
from io import BytesIO
import numpy as np
import requests
import tensorflow as tf
from fastapi import FastAPI, HTTPException
from PIL import Image
from pydantic import BaseModel
from tensorflow.keras.applications.efficientnet import preprocess_input

app = FastAPI(
    title="Plant Disease Classification Service",
    description="Microservice untuk klasifikasi penyakit tanaman",
)

@tf.keras.utils.register_keras_serializable(package="Custom", name="SEBlock")
class SEBlock(tf.keras.layers.Layer):
    def __init__(self, ratio=16, **kwargs):
        super().__init__(**kwargs)
        self.ratio = ratio

    def build(self, input_shape):
        C = input_shape[-1]
        self.gap = tf.keras.layers.GlobalAveragePooling2D()
        self.d1 = tf.keras.layers.Dense(C // self.ratio, activation="relu")
        self.d2 = tf.keras.layers.Dense(C, activation="sigmoid")
        self.rs = tf.keras.layers.Reshape((1, 1, C))

    def call(self, x):
        return x * self.rs(self.d2(self.d1(self.gap(x))))

    def get_config(self):
        c = super().get_config()
        c.update({"ratio": self.ratio})
        return c

@tf.keras.utils.register_keras_serializable(package="Custom", name="FocalLoss")
class FocalLoss(tf.keras.losses.Loss):
    def __init__(self, gamma=2.0, alpha=0.25, **kwargs):
        super().__init__(**kwargs)
        self.gamma, self.alpha = gamma, alpha

    def call(self, y_true, y_pred):
        y_pred = tf.clip_by_value(y_pred, 1e-7, 1.0)
        ce = -y_true * tf.math.log(y_pred)
        fw = tf.pow(1.0 - y_pred, self.gamma)
        return tf.reduce_mean(tf.reduce_sum(self.alpha * fw * ce, axis=-1))

    def get_config(self):
        c = super().get_config()
        c.update({"gamma": self.gamma, "alpha": self.alpha})
        return c

# Load Model
MODEL_PATH = os.path.join(os.path.dirname(__file__), "model.keras")

try:
    model = tf.keras.models.load_model(
        MODEL_PATH,
        custom_objects={"SEBlock": SEBlock, "FocalLoss": FocalLoss},
        compile=False,
    )
    print("✓ Berhasil memuat model.keras dengan Custom Layers!")
except Exception as e:
    print(f"✗ Gagal memuat model: {str(e)}")
    model = None

# Class Label (Sorted)
CLASS_LABELS = [
    "bacterial_spot",
    "early_blight",
    "healthy",
    "late_blight",
]

# Skema data request body menggunakan Pydantic
class PredictRequest(BaseModel):
    imageUrl: str


@app.get("/")
def index():
    return {"status": "running", "service": "ML Inference Service"}


@app.post("/predict")
async def predict_disease(payload: PredictRequest):
    if model is None:
        raise HTTPException(
            status_code=500, detail="Model AI belum berhasil dimuat di server."
        )

    try:
        # Downloading image from S3 URL
        response = requests.get(payload.imageUrl, timeout=15)
        if response.status_code != 200:
            raise HTTPException(
                status_code=400,
                detail="Gagal mengambil file gambar dari URL S3.",
            )

        # Open image, Convert it into an RGB
        img = Image.open(BytesIO(response.content)).convert("RGB")

        # Image Pre-Processing
        img = img.resize((224, 224))
        img_array = np.array(img).astype(np.float32)

        # Pixel Normalization
        img_array = preprocess_input(img_array)

        # Batch Dimension
        img_array = np.expand_dims(img_array, axis=0)

        # Predict
        predictions = model.predict(img_array)

        # Use Highest score
        confidence_score = np.max(predictions[0])
        predicted_index = np.argmax(predictions[0])
        predicted_label = CLASS_LABELS[predicted_index]

        return {
            "label": predicted_label,
            "confidenceScore": float(confidence_score),
        }

    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Terjadi error saat pemrosesan: {str(e)}"
        )