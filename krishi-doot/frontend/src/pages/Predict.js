import React, { useState } from "react";
import axios from "axios";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/config";
import { useAuth } from "../context/auth-context";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  FaLeaf, FaTint, FaCloudRain, FaThermometerHalf,
  FaTachometerAlt, FaSeedling, FaFlask, FaCheckCircle
} from "react-icons/fa";

const initialValues = {
  nitrogen: 50, phosphorus: 50, potassium: 50,
  temperature: 25, humidity: 50, ph: 6.5, rainfall: 100
};

const fields = [
  { key: "nitrogen", label: "Nitrogen (N)", unit: "kg/ha", min: 0, max: 140, step: 1, icon: FaLeaf },
  { key: "phosphorus", label: "Phosphorus (P)", unit: "kg/ha", min: 0, max: 140, step: 1, icon: FaLeaf },
  { key: "potassium", label: "Potassium (K)", unit: "kg/ha", min: 0, max: 140, step: 1, icon: FaLeaf },
  { key: "temperature", label: "Temperature", unit: "°C", min: 0, max: 45, step: 0.1, icon: FaThermometerHalf },
  { key: "humidity", label: "Humidity", unit: "%", min: 0, max: 100, step: 1, icon: FaTint },
  { key: "ph", label: "Soil pH", unit: "pH", min: 0, max: 14, step: 0.1, icon: FaTachometerAlt },
  { key: "rainfall", label: "Rainfall", unit: "mm", min: 0, max: 300, step: 1, icon: FaCloudRain },
];

const styles = `
.kd-predict{--kd-bg:#07130e;--kd-panel:#0e2017;--kd-line:rgba(193,255,112,.16);--kd-lime:#c5ff70;--kd-text:#edf7ef;--kd-muted:#a7b9ab;color:var(--kd-text);background:radial-gradient(ellipse at 15% 0%,#153b27 0,transparent 42%),var(--kd-bg);min-height:70vh;padding:42px 0 64px}
.kd-predict *{box-sizing:border-box}.kd-predict .kd-wrap{width:min(1180px,calc(100% - 32px));margin:auto}
.kd-predict .kd-hero{text-align:center;margin:0 auto 30px;max-width:760px;animation:kd-rise .55s ease both}
.kd-predict .kd-eyebrow{display:inline-flex;align-items:center;gap:8px;color:var(--kd-lime);font-size:12px;font-weight:800;letter-spacing:.16em;text-transform:uppercase}
.kd-predict h1{font-size:clamp(30px,4vw,46px);line-height:1.1;letter-spacing:-.04em;margin:12px 0;color:var(--kd-text);font-weight:800}
.kd-predict .kd-hero p{color:var(--kd-muted);font-size:16px;line-height:1.7;margin:0}
.kd-predict .kd-layout{display:grid;grid-template-columns:minmax(0,1.1fr) minmax(300px,.9fr);gap:22px;align-items:start}
.kd-predict .kd-panel{background:linear-gradient(145deg,rgba(17,43,29,.96),rgba(9,25,17,.97));border:1px solid var(--kd-line);border-radius:22px;padding:clamp(18px,3vw,28px);box-shadow:0 20px 55px rgba(0,0,0,.18);animation:kd-rise .6s ease both}
.kd-predict .kd-panel h2{font-size:21px;margin:0 0 7px;color:var(--kd-text);font-weight:750}
.kd-predict .kd-sub{color:var(--kd-muted);font-size:13px;line-height:1.6;margin:0 0 20px}
.kd-predict .kd-tabs{display:flex;gap:5px;padding:5px;border:1px solid var(--kd-line);background:#07150e;border-radius:13px;margin:0 0 22px}
.kd-predict .kd-tab{flex:1;border:0;border-radius:9px;padding:10px 12px;color:#b9c9bd;background:transparent;cursor:pointer;font-weight:700}
.kd-predict .kd-tab[aria-selected=true]{background:var(--kd-lime);color:#122315}
.kd-predict .kd-fieldgrid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:17px}
.kd-predict .kd-field{min-width:0}.kd-predict .kd-labelrow{display:flex;justify-content:space-between;gap:10px;align-items:center;margin-bottom:9px}
.kd-predict .kd-label{font-size:13px;font-weight:700;color:#e5f0e7;display:flex;align-items:center;gap:7px}
.kd-predict .kd-label svg{color:var(--kd-lime);flex-shrink:0}
.kd-predict .kd-value{font-size:12px;color:var(--kd-lime);font-weight:800;white-space:nowrap}
.kd-predict input[type=range]{width:100%;accent-color:var(--kd-lime);cursor:pointer}
.kd-predict .kd-number{width:100%;background:#07150e;border:1px solid #2d4c38;border-radius:10px;padding:11px 12px;color:#f2f8f3;outline:none}
.kd-predict .kd-number:focus{border-color:var(--kd-lime);box-shadow:0 0 0 3px rgba(197,255,112,.1)}
.kd-predict .kd-help{color:#8fa596;font-size:11px;margin-top:5px}
.kd-predict .kd-submit{width:100%;border:0;border-radius:12px;background:var(--kd-lime);color:#122315;font-weight:850;padding:14px 16px;margin-top:24px;cursor:pointer;transition:transform .18s,filter .18s}
.kd-predict .kd-submit:hover{filter:brightness(1.06);transform:translateY(-2px)}.kd-predict .kd-submit:disabled{opacity:.65;cursor:wait;transform:none}
.kd-predict .kd-alert{border-radius:11px;padding:12px 14px;margin-top:15px;font-size:13px;line-height:1.55}.kd-predict .kd-error{background:#391c1b;color:#ffd8d5;border:1px solid #81413c}.kd-predict .kd-notice{background:#172c20;color:#c8e8ce;border:1px solid #315a3d}
.kd-predict .kd-empty{text-align:center;border:1px dashed #385341;border-radius:16px;padding:42px 18px}
.kd-predict .kd-emptyicon{width:58px;height:58px;display:grid;place-items:center;margin:0 auto 14px;border-radius:18px;background:#1a3624;color:var(--kd-lime);font-size:25px}
.kd-predict .kd-empty h3{margin:0 0 7px;color:#eaf4eb;font-size:17px}.kd-predict .kd-empty p{color:var(--kd-muted);font-size:13px;line-height:1.6;margin:0}
.kd-predict .kd-resultbanner{border-radius:16px;padding:22px;background:linear-gradient(130deg,#204d2e,#102d1e);border:1px solid rgba(197,255,112,.25);text-align:center}
.kd-predict .kd-resultbanner .kd-crop{font-size:clamp(28px,4vw,36px);font-weight:850;text-transform:capitalize;color:#fff;margin:7px 0}
.kd-predict .kd-confidence{display:inline-flex;gap:7px;align-items:center;border:1px solid rgba(197,255,112,.3);border-radius:999px;padding:6px 11px;color:var(--kd-lime);font-size:12px;font-weight:750}
.kd-predict .kd-sectiontitle{font-size:15px!important;margin:20px 0 11px!important}.kd-predict .kd-toplist{display:grid;gap:8px}
.kd-predict .kd-topitem{display:flex;justify-content:space-between;align-items:center;gap:12px;background:#0a1910;border:1px solid #254431;border-radius:11px;padding:11px 13px}
.kd-predict .kd-topname{font-weight:700;text-transform:capitalize}.kd-predict .kd-rank{font-size:11px;color:var(--kd-lime);font-weight:800}
.kd-predict .kd-advice{background:#0a1910;border:1px solid #254431;border-radius:11px;padding:12px 14px;color:#cbd9ce;font-size:13px;line-height:1.65;white-space:pre-wrap}
@keyframes kd-rise{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
@media(max-width:800px){.kd-predict .kd-layout{grid-template-columns:1fr}.kd-predict .kd-fieldgrid{grid-template-columns:1fr}.kd-predict{padding-top:30px}}
@media(prefers-reduced-motion:reduce){.kd-predict *{animation:none!important;transition:none!important}}
`;

export default function Predict() {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState("sliders");
  const [formData, setFormData] = useState(initialValues);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const changeValue = (key, rawValue) => {
    setFormData(prev => ({ ...prev, [key]: rawValue === "" ? "" : Number(rawValue) }));
    setPrediction(null);
    setNotice("");
  };

  const validate = () => {
    for (const field of fields) {
      const value = formData[field.key];
      if (value === "" || !Number.isFinite(Number(value))) return `${field.label} is required.`;
      if (Number(value) < field.min || Number(value) > field.max) {
        return `${field.label} must be between ${field.min} and ${field.max} ${field.unit}.`;
      }
    }
    return "";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationError = validate();
    if (validationError) { setError(validationError); return; }
    setLoading(true); setError(""); setNotice(""); setPrediction(null);
    const payload = Object.fromEntries(fields.map(field => [field.key, Number(formData[field.key])]));

    try {
      const response = await axios.post("https://krishidoot-backend.onrender.com/api/predict", payload, { timeout: 45000 });
      const result = response.data;
      if (!result || typeof result.crop !== "string" || !result.crop.trim()) {
        throw new Error("The prediction service returned an unexpected response. Please try again.");
      }
      setPrediction(result);
      if (currentUser) {
        try {
          await addDoc(collection(db, "predictions"), {
            userEmail: currentUser.email || null,
            crop: result.crop,
            confidence: result.confidence ?? null,
            inputs: payload,
            createdAt: serverTimestamp()
          });
        } catch (saveError) {
          console.error("Prediction history could not be saved:", saveError);
          setNotice("Your recommendation is ready, but it could not be saved to your account history.");
        }
      }
    } catch (err) {
      console.error("Crop prediction failed:", err);
      setError(err.response?.data?.error || (err.code === "ECONNABORTED"
        ? "The prediction server took too long to respond. Please try again."
        : err.message || "Could not get a recommendation. Please try again."));
    } finally { setLoading(false); }
  };

  const topCrops = Array.isArray(prediction?.top3) ? prediction.top3 : [];
  const fertilizerText = typeof prediction?.fertilizer === "string" ? prediction.fertilizer.trim() : "";

  return <>
    <Navbar />
    <style>{styles}</style>
    <main className="kd-predict">
      <div className="kd-wrap">
        <header className="kd-hero">
          <span className="kd-eyebrow"><FaSeedling /> GROW SMARTER WITH DATA</span>
          <h1>Crop Recommendation</h1>
          <p>Enter your soil nutrients and local weather conditions to request a crop recommendation from the prediction model.</p>
        </header>
        <div className="kd-layout">
          <section className="kd-panel">
            <h2>Soil &amp; climate details</h2>
            <p className="kd-sub">Use recent soil-test results and local weather estimates where possible. Switch between sliders and exact values.</p>
            <div className="kd-tabs" role="tablist" aria-label="Input mode">
              <button type="button" className="kd-tab" role="tab" aria-selected={activeTab === "sliders"} onClick={() => setActiveTab("sliders")}>Adjust sliders</button>
              <button type="button" className="kd-tab" role="tab" aria-selected={activeTab === "manual"} onClick={() => setActiveTab("manual")}>Enter values</button>
            </div>
            <form onSubmit={handleSubmit} noValidate>
              <div className="kd-fieldgrid">
                {fields.map(field => {
                  const Icon = field.icon;
                  const value = formData[field.key];
                  return <div className="kd-field" key={field.key}>
                    <div className="kd-labelrow">
                      <label className="kd-label" htmlFor={`predict-${field.key}`}><Icon /> {field.label}</label>
                      <span className="kd-value">{value === "" ? "—" : `${value} ${field.unit}`}</span>
                    </div>
                    {activeTab === "sliders" ? <>
                      <input id={`predict-${field.key}`} type="range" min={field.min} max={field.max} step={field.step} value={value === "" ? field.min : value} onChange={e => changeValue(field.key, e.target.value)} />
                      <div className="kd-help">Range: {field.min}–{field.max} {field.unit}</div>
                    </> : <>
                      <input className="kd-number" id={`predict-${field.key}`} type="number" min={field.min} max={field.max} step={field.step} value={value} onChange={e => changeValue(field.key, e.target.value)} required />
                      <div className="kd-help">Allowed: {field.min}–{field.max} {field.unit}</div>
                    </>}
                  </div>;
                })}
              </div>
              {error && <div className="kd-alert kd-error" role="alert">{error}</div>}
              {notice && <div className="kd-alert kd-notice" role="status">{notice}</div>}
              <button className="kd-submit" type="submit" disabled={loading}>{loading ? "Analyzing your conditions…" : "Get crop recommendation →"}</button>
            </form>
          </section>

          <section className="kd-panel" aria-live="polite">
            <h2>Recommendation results</h2>
            <p className="kd-sub">Results appear here after the prediction service responds successfully.</p>
            {!prediction ? <div className="kd-empty">
              <div className="kd-emptyicon"><FaSeedling /></div>
              <h3>{loading ? "Evaluating your inputs" : "Your recommendation will appear here"}</h3>
              <p>{loading ? "Please wait while the model processes the soil and climate values." : "Complete the soil and climate details, then select Get crop recommendation."}</p>
            </div> : <>
              <div className="kd-resultbanner">
                <FaSeedling style={{ color: "#c5ff70", fontSize: 28 }} />
                <div className="kd-sub" style={{ margin: "8px 0 0", color: "#d4e7d8" }}>MODEL RECOMMENDATION</div>
                <div className="kd-crop">{prediction.crop}</div>
                {prediction.confidence !== undefined && prediction.confidence !== null &&
                  <span className="kd-confidence"><FaCheckCircle /> Confidence: {String(prediction.confidence)}{typeof prediction.confidence === "number" && prediction.confidence <= 1 ? "" : "%"}</span>}
              </div>
              {topCrops.length > 0 && <>
                <h3 className="kd-sectiontitle">Other model-ranked options</h3>
                <div className="kd-toplist">{topCrops.map((item, index) => {
                  const cropName = typeof item === "string" ? item : item?.crop;
                  if (!cropName) return null;
                  return <div className="kd-topitem" key={`${cropName}-${index}`}><span className="kd-topname">{cropName}</span><span className="kd-rank">RANK {index + 1}</span></div>;
                })}</div>
              </>}
              {fertilizerText && <>
                <h3 className="kd-sectiontitle"><FaFlask style={{ color: "#c5ff70", marginRight: 7 }} /> Model-provided fertilizer note</h3>
                <div className="kd-advice">{fertilizerText}</div>
              </>}
              <div className="kd-alert kd-notice">This is a model-based suggestion, not a guarantee of yield. Confirm suitability with local seasonal guidance and soil-test results before making major planting or input decisions.</div>
            </>}
          </section>
        </div>
      </div>
    </main>
    <Footer />
  </>;
}
