# -*- coding: utf-8 -*-
"""
ChlorisGarden — Streamlit Dashboard & ML Demo
=============================================

Deskripsi:
ChlorisGarden adalah aplikasi web berbasis AI yang membantu pengguna mendeteksi
penyakit pada tanaman pangan melalui citra daun. Pada versi pilot Streamlit ini,
model yang tersedia masih berfokus pada tanaman tomat dengan 4 label:
bacterial_spot, early_blight, healthy, dan late_blight.

Jalankan lokal:
    streamlit run streamlit-app/app.py

Untuk Streamlit Community Cloud:
    Main file path: streamlit-app/app.py
"""

from __future__ import annotations

import json
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple

import numpy as np
import pandas as pd
import streamlit as st
from PIL import Image, ImageOps

# =============================================================================
# Page configuration
# =============================================================================
st.set_page_config(
    page_title="ChlorisGarden | Dashboard Deteksi Tanaman Pangan",
    page_icon="🌿",
    layout="wide",
    initial_sidebar_state="expanded",
)

# =============================================================================
# Path configuration
# =============================================================================
APP_DIR = Path(__file__).resolve().parent
ROOT_DIR = APP_DIR.parent
IMG_SIZE = (224, 224)

DEFAULT_CLASS_NAMES = ["bacterial_spot", "early_blight", "healthy", "late_blight"]

MODEL_CANDIDATES = [
    APP_DIR / "models_export" / "plant_disease_v1.keras",
    APP_DIR / "models" / "plant_disease_v1.keras",
    ROOT_DIR / "models_export" / "plant_disease_v1.keras",
    ROOT_DIR / "models" / "plant_disease_v1.keras",
    ROOT_DIR / "plant_disease_v1.keras",
]

CLASS_NAMES_CANDIDATES = [
    APP_DIR / "models_export" / "class_names.json",
    APP_DIR / "models" / "class_names.json",
    APP_DIR / "class_names.json",
    ROOT_DIR / "models_export" / "class_names.json",
    ROOT_DIR / "models" / "class_names.json",
    ROOT_DIR / "class_names.json",
]

# =============================================================================
# Project data
# =============================================================================
TEAM_MEMBERS = [
    ("Moch. Zacky Febrio", "AI Engineering", "Kecerdasan Buatan"),
    ("Mario Cristian Simatupang", "AI Engineering", "Kecerdasan Buatan"),
    ("Raihan Fathir Muhammad", "FullStack Developer", "Pengembangan Web"),
    ("Muhammad Rafhli Alfarizi", "FullStack Developer", "Pengembangan Web"),
    ("Tiara Christiani Sinaga", "Data Science", "Ilmu Data"),
    ("Katarina Susi Wulandari", "Data Science", "Ilmu Data"),
]

CLASS_LABELS = {
    "bacterial_spot": "Bacterial Spot",
    "early_blight": "Early Blight",
    "healthy": "Healthy",
    "late_blight": "Late Blight",
}

CLASS_DISTRIBUTION = {
    "bacterial_spot": 2127,
    "early_blight": 1000,
    "healthy": 1591,
    "late_blight": 1909,
}

SPLIT_DISTRIBUTION = {
    "Train": 4627,
    "Validation": 991,
    "Test": 995,
}

MODEL_METRICS = {
    "Total Dataset": "6.627 gambar",
    "Test Accuracy": "91,16%",
    "Target Accuracy": "≥85%",
    "Input Model": "224×224 RGB",
}

CLASSIFICATION_REPORT = pd.DataFrame(
    [
        {"Class": "bacterial_spot", "Precision": 0.94, "Recall": 0.96, "F1-Score": 0.95, "Support": 320},
        {"Class": "early_blight", "Precision": 0.91, "Recall": 0.61, "F1-Score": 0.73, "Support": 150},
        {"Class": "healthy", "Precision": 0.97, "Recall": 0.99, "F1-Score": 0.98, "Support": 239},
        {"Class": "late_blight", "Precision": 0.85, "Recall": 0.95, "F1-Score": 0.90, "Support": 286},
    ]
)

DISEASE_INFO: Dict[str, Dict[str, Any]] = {
    "bacterial_spot": {
        "emoji": "🦠",
        "name": "Bacterial Spot",
        "scientific_name": "Xanthomonas vesicatoria",
        "severity": "Medium",
        "description": "Bercak kecil gelap atau tampak berair pada daun. Area sekitar bercak dapat menguning dan menyebar ke bagian daun lain.",
        "symptoms": [
            "Bercak kecil berwarna cokelat tua hingga hitam.",
            "Daun dapat menguning di sekitar area bercak.",
            "Pada kondisi parah, daun mengering dan gugur.",
        ],
        "treatment": [
            "Pangkas daun yang terinfeksi dan buang jauh dari tanaman.",
            "Hindari penyiraman dari atas agar daun tidak terlalu lembap.",
            "Jaga jarak antar tanaman agar sirkulasi udara baik.",
        ],
        "prevention": [
            "Gunakan benih atau bibit sehat.",
            "Bersihkan alat berkebun setelah digunakan.",
            "Lakukan rotasi tanaman jika memungkinkan.",
        ],
    },
    "early_blight": {
        "emoji": "🍂",
        "name": "Early Blight",
        "scientific_name": "Alternaria solani",
        "severity": "Medium",
        "description": "Penyakit jamur yang biasanya muncul pada daun tua bagian bawah. Ciri khasnya berupa bercak cokelat dengan pola melingkar seperti target.",
        "symptoms": [
            "Bercak cokelat dengan pola konsentris.",
            "Daun bagian bawah lebih sering terkena terlebih dahulu.",
            "Daun menguning lalu mengering jika infeksi berlanjut.",
        ],
        "treatment": [
            "Pangkas daun yang terinfeksi.",
            "Gunakan mulsa untuk mengurangi percikan tanah ke daun.",
            "Kurangi kelembapan berlebih di sekitar tanaman.",
        ],
        "prevention": [
            "Rotasi tanaman.",
            "Jaga jarak tanam.",
            "Hindari menanam tomat terlalu rapat.",
        ],
    },
    "healthy": {
        "emoji": "✅",
        "name": "Healthy / Sehat",
        "scientific_name": "Solanum lycopersicum",
        "severity": "Low",
        "description": "Daun tidak menunjukkan pola penyakit utama yang dikenali oleh model.",
        "symptoms": [
            "Warna daun relatif hijau merata.",
            "Tidak terlihat bercak penyakit dominan.",
            "Tekstur daun terlihat normal.",
        ],
        "treatment": [
            "Pertahankan perawatan rutin.",
            "Pastikan penyiraman tidak berlebihan.",
            "Lakukan pemeriksaan daun secara berkala.",
        ],
        "prevention": [
            "Gunakan media tanam yang bersih.",
            "Pastikan cahaya dan nutrisi cukup.",
            "Jaga kebersihan area tanam.",
        ],
    },
    "late_blight": {
        "emoji": "🍄",
        "name": "Late Blight",
        "scientific_name": "Phytophthora infestans",
        "severity": "High",
        "description": "Penyakit yang dapat menyebar cepat pada kondisi lembap. Gejalanya berupa bercak besar gelap atau basah pada daun.",
        "symptoms": [
            "Bercak besar berwarna cokelat gelap atau kehitaman.",
            "Daun tampak basah atau layu.",
            "Penyebaran dapat berlangsung cepat pada cuaca lembap.",
        ],
        "treatment": [
            "Segera buang bagian tanaman yang terinfeksi.",
            "Pisahkan tanaman yang terindikasi parah.",
            "Kurangi kelembapan daun dan area sekitar tanaman.",
        ],
        "prevention": [
            "Hindari penyiraman langsung ke daun.",
            "Jaga sirkulasi udara.",
            "Pantau tanaman secara rutin terutama saat musim hujan.",
        ],
    },
}

# =============================================================================
# Utility functions
# =============================================================================
def find_existing_file(candidates: List[Path]) -> Optional[Path]:
    for path in candidates:
        if path.exists():
            return path
    return None


def load_class_names() -> List[str]:
    class_path = find_existing_file(CLASS_NAMES_CANDIDATES)
    if class_path is None:
        return DEFAULT_CLASS_NAMES

    try:
        with open(class_path, "r", encoding="utf-8") as file:
            data = json.load(file)

        if isinstance(data, list) and all(isinstance(item, str) for item in data):
            return data
    except Exception:
        pass

    return DEFAULT_CLASS_NAMES


def get_custom_objects() -> Dict[str, Any]:
    import tensorflow as tf

    class SEBlock(tf.keras.layers.Layer):
        def __init__(self, ratio: int = 16, **kwargs: Any) -> None:
            super().__init__(**kwargs)
            self.ratio = ratio

        def build(self, input_shape: Tuple[Optional[int], ...]) -> None:
            channels = int(input_shape[-1])
            hidden_units = max(channels // self.ratio, 1)
            self.gap = tf.keras.layers.GlobalAveragePooling2D()
            self.dense_1 = tf.keras.layers.Dense(hidden_units, activation="relu")
            self.dense_2 = tf.keras.layers.Dense(channels, activation="sigmoid")
            self.reshape = tf.keras.layers.Reshape((1, 1, channels))

        def call(self, inputs: Any) -> Any:
            scale = self.reshape(self.dense_2(self.dense_1(self.gap(inputs))))
            return inputs * scale

        def get_config(self) -> Dict[str, Any]:
            config = super().get_config()
            config.update({"ratio": self.ratio})
            return config

    class FocalLoss(tf.keras.losses.Loss):
        def __init__(self, gamma: float = 2.0, alpha: float = 0.25, **kwargs: Any) -> None:
            super().__init__(**kwargs)
            self.gamma = gamma
            self.alpha = alpha

        def call(self, y_true: Any, y_pred: Any) -> Any:
            y_pred = tf.clip_by_value(y_pred, 1e-7, 1.0)
            cross_entropy = -y_true * tf.math.log(y_pred)
            focal_weight = tf.pow(1.0 - y_pred, self.gamma)
            return tf.reduce_mean(tf.reduce_sum(self.alpha * focal_weight * cross_entropy, axis=-1))

        def get_config(self) -> Dict[str, Any]:
            config = super().get_config()
            config.update({"gamma": self.gamma, "alpha": self.alpha})
            return config

    return {"SEBlock": SEBlock, "FocalLoss": FocalLoss}


@st.cache_resource(show_spinner=False)
def load_model() -> Tuple[Optional[Any], Optional[str], Optional[str]]:
    model_path = find_existing_file(MODEL_CANDIDATES)

    if model_path is None:
        return None, None, "Model file belum ditemukan."

    try:
        import tensorflow as tf

        model = tf.keras.models.load_model(
            str(model_path),
            custom_objects=get_custom_objects(),
            compile=False,
        )
        return model, str(model_path), None
    except ImportError:
        return None, str(model_path), "TensorFlow belum terpasang. Cek requirements.txt."
    except Exception as err:
        return None, str(model_path), f"Gagal memuat model: {err}"


def prepare_image(image: Image.Image) -> np.ndarray:
    from tensorflow.keras.applications.efficientnet import preprocess_input

    image = ImageOps.exif_transpose(image).convert("RGB").resize(IMG_SIZE)
    array = np.asarray(image, dtype=np.float32)
    batch = np.expand_dims(array, axis=0)
    return preprocess_input(batch)


def predict_image(image: Image.Image, model: Any, class_names: List[str]) -> Dict[str, Any]:
    import tensorflow as tf

    batch = prepare_image(image)
    probabilities = model.predict(batch, verbose=0)[0]
    probabilities = np.asarray(probabilities, dtype=np.float32)

    if probabilities.max() > 1.0 or probabilities.min() < 0.0:
        probabilities = tf.nn.softmax(probabilities).numpy()

    order = np.argsort(probabilities)[::-1]
    top_idx = int(order[0])
    top_class = class_names[top_idx]
    top_confidence = float(probabilities[top_idx]) * 100

    ranking = []
    for idx in order:
        class_name = class_names[int(idx)]
        ranking.append(
            {
                "class": class_name,
                "label": CLASS_LABELS.get(class_name, class_name),
                "confidence": float(probabilities[int(idx)]) * 100,
            }
        )

    return {
        "top_class": top_class,
        "top_label": CLASS_LABELS.get(top_class, top_class),
        "confidence": top_confidence,
        "ranking": ranking,
    }


# =============================================================================
# Load assets
# =============================================================================
class_names = load_class_names()
model, model_path, model_error = load_model()

# =============================================================================
# Sidebar
# =============================================================================
with st.sidebar:
    st.title("🌿 ChlorisGarden")
    st.caption("AI-powered food crop disease detection")

    st.divider()
    st.subheader("Status Model")
    if model is not None:
        st.success("Model siap digunakan")
        st.caption(model_path)
    else:
        st.warning("Mode dashboard aktif")
        if model_error:
            st.caption(model_error)
        st.caption("Prediksi gambar akan aktif jika model .keras tersedia.")

    st.subheader("Label Pilot")
    for class_name in class_names:
        info = DISEASE_INFO.get(class_name, {"emoji": "🌱", "name": class_name})
        st.write(f"{info['emoji']} {info['name']}")

    st.divider()
    st.subheader("Tim")
    for name, role, _field in TEAM_MEMBERS:
        st.write(f"**{name}**")
        st.caption(role)

# =============================================================================
# Header
# =============================================================================
st.title("🌿 ChlorisGarden — Dashboard Deteksi Penyakit Tanaman Pangan")
st.markdown(
    "ChlorisGarden adalah aplikasi web berbasis AI yang membantu pengguna mendeteksi penyakit "
    "pada tanaman pangan melalui citra daun. Pengguna dapat mengunggah foto atau menggunakan "
    "kamera, lalu sistem menampilkan hasil diagnosis, tingkat confidence, serta informasi penyakit "
    "yang relevan."
)
st.info(
    "Catatan: cakupan produk ChlorisGarden adalah tanaman pangan. Namun, model pada versi pilot "
    "Streamlit ini masih berfokus pada tanaman tomat dengan 4 label deteksi."
)

# =============================================================================
# Tabs
# =============================================================================
tab_overview, tab_dashboard, tab_prediction, tab_encyclopedia, tab_team = st.tabs(
    ["Overview", "Dashboard Data Science", "Prediksi AI", "Ensiklopedia", "Tim"]
)

with tab_overview:
    st.subheader("Ringkasan Project")

    col1, col2, col3, col4 = st.columns(4)
    col1.metric("Dataset Pilot", MODEL_METRICS["Total Dataset"])
    col2.metric("Test Accuracy", MODEL_METRICS["Test Accuracy"])
    col3.metric("Target", MODEL_METRICS["Target Accuracy"], "tercapai")
    col4.metric("Input Model", MODEL_METRICS["Input Model"])

    st.markdown(
        """
        **Tujuan utama:** memberikan alat bantu deteksi awal penyakit tanaman yang mudah digunakan
        oleh petani, pelajar, dan masyarakat umum.

        **Alur kerja aplikasi:**
        1. Pengguna mengunggah foto daun atau memakai kamera.
        2. Sistem mengirim gambar ke backend/ML service.
        3. Model AI memprediksi label penyakit.
        4. Aplikasi menampilkan hasil diagnosis, confidence score, dan rekomendasi awal.
        """
    )

    st.warning(
        "Hasil diagnosis adalah rekomendasi awal. Untuk keputusan lapangan, validasi dengan ahli "
        "pertanian tetap disarankan."
    )

with tab_dashboard:
    st.subheader("Dashboard Data Science")

    split_df = pd.DataFrame(
        [{"Split": split, "Jumlah Gambar": total} for split, total in SPLIT_DISTRIBUTION.items()]
    )
    class_df = pd.DataFrame(
        [
            {
                "Label": CLASS_LABELS.get(label, label),
                "Jumlah Gambar": total,
            }
            for label, total in CLASS_DISTRIBUTION.items()
        ]
    )

    left_col, right_col = st.columns(2)

    with left_col:
        st.markdown("#### Distribusi Data per Split")
        st.bar_chart(split_df, x="Split", y="Jumlah Gambar", use_container_width=True)
        st.dataframe(split_df, use_container_width=True, hide_index=True)

    with right_col:
        st.markdown("#### Distribusi Data per Kelas")
        st.bar_chart(class_df, x="Label", y="Jumlah Gambar", use_container_width=True)
        st.dataframe(class_df, use_container_width=True, hide_index=True)

    st.markdown("#### Classification Report pada Test Set")
    st.dataframe(CLASSIFICATION_REPORT, use_container_width=True, hide_index=True)

    st.markdown(
        """
        **Insight singkat:**
        - Model sudah melewati target akurasi minimum 85%.
        - Kelas `healthy` memiliki performa paling stabil berdasarkan F1-score.
        - Kelas `early_blight` masih perlu ditingkatkan karena recall lebih rendah dibanding kelas lain.
        - Pengembangan berikutnya dapat menambah data dan augmentasi untuk kelas yang performanya masih rendah.
        """
    )

with tab_prediction:
    st.subheader("Prediksi Penyakit dari Citra Daun")

    if model is None:
        st.warning(
            "Model belum ditemukan, sehingga tab ini hanya menampilkan placeholder. "
            "Letakkan `plant_disease_v1.keras` dan `class_names.json` di folder "
            "`streamlit-app/models/` agar prediksi aktif."
        )

    upload_col, result_col = st.columns([0.95, 1.05], gap="large")

    with upload_col:
        uploaded_file = st.file_uploader(
            "Unggah gambar daun (.jpg, .jpeg, .png)",
            type=["jpg", "jpeg", "png"],
            help="Gunakan foto daun yang jelas, cukup cahaya, dan tidak buram.",
        )

        if uploaded_file is not None:
            image = Image.open(uploaded_file)
            st.image(image, caption="Gambar yang diunggah", use_container_width=True)
        else:
            image = None
            st.info("Unggah gambar untuk melihat hasil prediksi.")

    with result_col:
        st.markdown("#### Hasil Prediksi")

        if image is None:
            st.write("Belum ada gambar yang dianalisis.")
        elif model is None:
            st.error("Prediksi belum bisa dijalankan karena model belum tersedia.")
        else:
            if st.button("Jalankan Prediksi", type="primary", use_container_width=True):
                with st.spinner("Menganalisis gambar..."):
                    try:
                        result = predict_image(image, model, class_names)
                    except Exception as err:
                        st.exception(err)
                        st.stop()

                disease = DISEASE_INFO.get(result["top_class"], {})
                st.success("Prediksi selesai")

                metric_a, metric_b = st.columns(2)
                metric_a.metric("Diagnosis", f"{disease.get('emoji', '🌱')} {result['top_label']}")
                metric_b.metric("Confidence", f"{result['confidence']:.2f}%")

                if result["confidence"] < 60:
                    st.warning(
                        "Confidence masih rendah. Coba gunakan foto yang lebih terang, fokus, "
                        "dan hanya menampilkan daun yang ingin dianalisis."
                    )

                st.markdown(f"**Deskripsi:** {disease.get('description', 'Informasi belum tersedia.')}")
                st.markdown("**Rekomendasi awal:**")
                for item in disease.get("treatment", ["Lakukan pemeriksaan manual untuk validasi."]):
                    st.write(f"- {item}")

                st.markdown("#### Probabilitas Semua Kelas")
                for item in result["ranking"]:
                    st.progress(
                        max(0.0, min(item["confidence"] / 100, 1.0)),
                        text=f"{item['label']} — {item['confidence']:.2f}%",
                    )

with tab_encyclopedia:
    st.subheader("Ensiklopedia Penyakit Tanaman")

    selected_label = st.selectbox(
        "Pilih penyakit/kelas",
        options=list(DISEASE_INFO.keys()),
        format_func=lambda key: DISEASE_INFO[key]["name"],
    )

    info = DISEASE_INFO[selected_label]

    st.markdown(f"### {info['emoji']} {info['name']}")
    st.caption(f"Nama ilmiah/terkait: {info['scientific_name']} | Severity: {info['severity']}")
    st.write(info["description"])

    col_symptom, col_treatment, col_prevention = st.columns(3)

    with col_symptom:
        st.markdown("#### Gejala")
        for item in info["symptoms"]:
            st.write(f"- {item}")

    with col_treatment:
        st.markdown("#### Penanganan")
        for item in info["treatment"]:
            st.write(f"- {item}")

    with col_prevention:
        st.markdown("#### Pencegahan")
        for item in info["prevention"]:
            st.write(f"- {item}")

with tab_team:
    st.subheader("Tim Pengembang")
    team_df = pd.DataFrame(TEAM_MEMBERS, columns=["Nama", "Peran", "Bidang"])
    st.dataframe(team_df, use_container_width=True, hide_index=True)

    st.markdown(
        """
        Project ini dikembangkan sebagai bagian dari Capstone Project Coding Camp 2026 by DBS Bank.
        Pembagian peran mencakup AI Engineering, Data Science, dan FullStack Development.
        """
    )

st.divider()
st.caption(
    "© 2026 ChlorisGarden Team. Dashboard ini dibuat untuk kebutuhan demo, dokumentasi, "
    "dan deployment publik melalui Streamlit Cloud."
)
