import React, { useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
    FaSeedling,
    FaFlask,
    FaLeaf,
    FaCheckCircle,
    FaInfoCircle
} from "react-icons/fa";

const crops = [
    "apple", "banana", "blackgram", "chickpea", "coconut", "coffee", "cotton",
    "grapes", "jute", "kidneybeans", "lentil", "maize", "mango", "mothbeans",
    "mungbean", "muskmelon", "orange", "papaya", "pigeonpeas", "pomegranate",
    "rice", "watermelon"
];

const initialForm = { crop: "banana", nitrogen: "", phosphorus: "", potassium: "", ph: "" };

const styles = `
.kd-fert{--f-bg:#07130e;--f-panel:#10251a;--f-line:rgba(193,255,112,.17);--f-lime:#c5ff70;--f-text:#edf7ef;--f-muted:#a7b9ab;color:var(--f-text);background:radial-gradient(ellipse at 85% 0%,#1a432b 0,transparent 38%),var(--f-bg);min-height:70vh;padding:42px 0 64px}
.kd-fert *{box-sizing:border-box}.kd-fert .kf-wrap{width:min(1120px,calc(100% - 32px));margin:auto}
.kd-fert .kf-hero{text-align:center;max-width:760px;margin:0 auto 30px;animation:kf-rise .55s ease both}
.kd-fert .kf-eyebrow{display:inline-flex;align-items:center;gap:8px;color:var(--f-lime);font-size:12px;font-weight:800;letter-spacing:.16em;text-transform:uppercase}
.kd-fert h1{font-size:clamp(30px,4vw,46px);line-height:1.1;letter-spacing:-.04em;margin:12px 0;color:var(--f-text);font-weight:800}
.kd-fert .kf-hero p{color:var(--f-muted);font-size:16px;line-height:1.7;margin:0}
.kd-fert .kf-grid{display:grid;grid-template-columns:minmax(300px,.85fr) minmax(0,1.15fr);gap:22px;align-items:start}
.kd-fert .kf-card{background:linear-gradient(145deg,rgba(17,43,29,.97),rgba(9,25,17,.98));border:1px solid var(--f-line);border-radius:22px;padding:clamp(19px,3vw,28px);box-shadow:0 20px 55px rgba(0,0,0,.18);animation:kf-rise .6s ease both}
.kd-fert .kf-card h2{font-size:21px;margin:0 0 7px;color:var(--f-text);font-weight:750}
.kd-fert .kf-sub{color:var(--f-muted);font-size:13px;line-height:1.65;margin:0 0 21px}
.kd-fert .kf-form{display:grid;gap:16px}.kd-fert .kf-field label{display:block;font-size:13px;font-weight:750;color:#e6f1e8;margin-bottom:8px}
.kd-fert .kf-field input,.kd-fert .kf-field select{width:100%;background:#07150e;border:1px solid #2d4c38;border-radius:11px;padding:12px 13px;color:#f2f8f3;outline:none}
.kd-fert .kf-field select option{background:#10251a;color:#fff}
.kd-fert .kf-field input:focus,.kd-fert .kf-field select:focus{border-color:var(--f-lime);box-shadow:0 0 0 3px rgba(197,255,112,.1)}
.kd-fert .kf-unit{color:#8fa596;font-size:11px;margin-top:6px}
.kd-fert .kf-submit{width:100%;border:0;border-radius:12px;background:var(--f-lime);color:#122315;font-weight:850;padding:14px 16px;margin-top:3px;cursor:pointer;transition:transform .18s,filter .18s}
.kd-fert .kf-submit:hover{filter:brightness(1.06);transform:translateY(-2px)}.kd-fert .kf-submit:disabled{opacity:.65;cursor:wait;transform:none}
.kd-fert .kf-alert{border-radius:11px;padding:12px 14px;font-size:13px;line-height:1.55}.kd-fert .kf-error{background:#391c1b;color:#ffd8d5;border:1px solid #81413c}
.kd-fert .kf-placeholder{text-align:center;padding:42px 20px;border:1px dashed #385341;border-radius:16px}
.kd-fert .kf-placeholdericon{width:60px;height:60px;display:grid;place-items:center;margin:0 auto 14px;border-radius:18px;background:#1a3624;color:var(--f-lime);font-size:26px}
.kd-fert .kf-placeholder h3{font-size:17px;margin:0 0 7px;color:#eaf4eb}.kd-fert .kf-placeholder p{font-size:13px;color:var(--f-muted);line-height:1.65;margin:0}
.kd-fert .kf-resulthead{display:flex;align-items:center;gap:13px;background:linear-gradient(130deg,#204d2e,#102d1e);border:1px solid rgba(197,255,112,.25);border-radius:15px;padding:17px;margin-bottom:19px}
.kd-fert .kf-resulticon{width:44px;height:44px;border-radius:13px;background:rgba(197,255,112,.12);display:grid;place-items:center;color:var(--f-lime);font-size:20px;flex-shrink:0}
.kd-fert .kf-resulthead h3{font-size:20px;font-weight:800;margin:0 0 3px;text-transform:capitalize;color:#fff}
.kd-fert .kf-resulthead p{font-size:12px;color:#c4d9c8;margin:0}
.kd-fert .kf-sectiontitle{font-size:15px;font-weight:800;margin:20px 0 10px;color:#eaf4eb;display:flex;align-items:center;gap:8px}
.kd-fert .kf-advice{display:grid;gap:9px}.kd-fert .kf-adviceitem{display:flex;gap:10px;align-items:flex-start;background:#0a1910;border:1px solid #254431;border-radius:11px;padding:12px 13px;color:#d3e0d5;font-size:13px;line-height:1.65;overflow-wrap:anywhere}
.kd-fert .kf-adviceitem svg{color:var(--f-lime);margin-top:3px;flex-shrink:0}
.kd-fert .kf-note{margin-top:18px;background:rgba(197,255,112,.06);border:1px solid rgba(197,255,112,.18);border-radius:12px;padding:13px;color:#bdcfbf;font-size:12px;line-height:1.65}
@keyframes kf-rise{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
@media(max-width:800px){.kd-fert .kf-grid{grid-template-columns:1fr}.kd-fert{padding-top:30px}}
@media(prefers-reduced-motion:reduce){.kd-fert *{animation:none!important;transition:none!important}}
`;

export default function FertilizerAdvisor() {
    const [form, setForm] = useState(initialForm);
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (event) => {
        setForm(prev => ({ ...prev, [event.target.name]: event.target.value }));
        setResult(null);
        setError("");
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");
        setResult(null);
        const required = ["nitrogen", "phosphorus", "potassium", "ph"];
        for (const key of required) {
            if (form[key] === "" || !Number.isFinite(Number(form[key]))) {
                setError("Please enter a value for every soil parameter.");
                return;
            }
        }
        const bounds = [
            ["nitrogen", 0, 140, "Nitrogen"], ["phosphorus", 0, 140, "Phosphorus"],
            ["potassium", 0, 140, "Potassium"], ["ph", 0, 14, "Soil pH"]
        ];
        for (const [key, min, max, label] of bounds) {
            if (Number(form[key]) < min || Number(form[key]) > max) {
                setError(`${label} must be between ${min} and ${max}.`);
                return;
            }
        }

        setLoading(true);
        try {
            const payload = {
                crop: form.crop,
                nitrogen: Number(form.nitrogen),
                phosphorus: Number(form.phosphorus),
                potassium: Number(form.potassium),
                ph: Number(form.ph)
            };
            const response = await axios.post(
                "https://krishidoot-backend.onrender.com/api/fertilizer-advisor",
                payload,
                { timeout: 45000 }
            );
            if (!response.data || (!Array.isArray(response.data.advice) && typeof response.data.advice !== "string")) {
                throw new Error("The fertilizer service returned an unexpected response. Please try again.");
            }
            setResult(response.data);
        } catch (err) {
            console.error("Fertilizer advice failed:", err);
            setError(err.response?.data?.error || (err.code === "ECONNABORTED"
                ? "The fertilizer service took too long to respond. Please try again."
                : err.message || "Unable to fetch fertilizer advice. Please try again."));
        } finally {
            setLoading(false);
        }
    };

    const adviceItems = result
        ? (Array.isArray(result.advice) ? result.advice : String(result.advice).split(/\n|(?<=\.)\s+(?=[A-Z•-])/).map(s => s.trim()).filter(Boolean))
        : [];

    return <>
        <Navbar />
        <style>{styles}</style>
        <main className="kd-fert">
            <div className="kf-wrap">
                <header className="kf-hero">
                    <span className="kf-eyebrow"><FaLeaf /> SOIL HEALTH • SMARTER INPUTS</span>
                    <h1>Fertilizer Advisor</h1>
                    <p>Get crop-specific guidance from your soil nutrient readings. Use a recent soil test whenever possible for more meaningful advice.</p>
                </header>
                <div className="kf-grid">
                    <section className="kf-card">
                        <h2>Soil &amp; crop details</h2>
                        <p className="kf-sub">Enter the values from your soil report. Nutrient units should match the units expected by your model.</p>
                        <form className="kf-form" onSubmit={handleSubmit} noValidate>
                            <div className="kf-field">
                                <label htmlFor="fert-crop">Crop you are growing</label>
                                <select id="fert-crop" name="crop" value={form.crop} onChange={handleChange}>
                                    {crops.map(crop => <option key={crop} value={crop}>{crop.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/^./, c => c.toUpperCase())}</option>)}
                                </select>
                            </div>
                            {[
                                { key: "nitrogen", label: "Nitrogen (N)", unit: "Enter the soil-test value (kg/ha, if that is your model's unit)." },
                                { key: "phosphorus", label: "Phosphorus (P)", unit: "Use the unit expected by your soil test and model." },
                                { key: "potassium", label: "Potassium (K)", unit: "Use the unit expected by your soil test and model." },
                                { key: "ph", label: "Soil pH", unit: "Typical scale: 0–14; use your measured pH." }
                            ].map(field => <div className="kf-field" key={field.key}>
                                <label htmlFor={`fert-${field.key}`}>{field.label}</label>
                                <input id={`fert-${field.key}`} name={field.key} type="number" min="0" max={field.key === "ph" ? "14" : "140"} step={field.key === "ph" ? "0.1" : "any"} value={form[field.key]} onChange={handleChange} placeholder={field.key === "ph" ? "e.g. 6.5" : "Enter soil-test value"} required />
                                <div className="kf-unit">{field.unit}</div>
                            </div>)}
                            {error && <div className="kf-alert kf-error" role="alert">{error}</div>}
                            <button className="kf-submit" type="submit" disabled={loading}>{loading ? "Preparing advice…" : "Get fertilizer advice →"}</button>
                        </form>
                    </section>

                    <section className="kf-card" aria-live="polite">
                        <h2>Your fertilizer guidance</h2>
                        <p className="kf-sub">Recommendations returned by the connected fertilizer-advisor service will appear here.</p>
                        {!result ? <div className="kf-placeholder">
                            <div className="kf-placeholdericon"><FaFlask /></div>
                            <h3>{loading ? "Analyzing soil details" : "Advice tailored to your crop"}</h3>
                            <p>{loading ? "Please wait while the service processes your inputs." : "Choose your crop, enter all four soil values, and submit to see the returned guidance."}</p>
                        </div> : <>
                            <div className="kf-resulthead">
                                <div className="kf-resulticon"><FaSeedling /></div>
                                <div>
                                    <h3>{result.crop || form.crop}</h3>
                                    <p><FaCheckCircle style={{ display: "inline", marginRight: 5 }} />Advice received from the recommendation service</p>
                                </div>
                            </div>
                            {adviceItems.length > 0 && <>
                                <h3 className="kf-sectiontitle"><FaFlask style={{ color: "#c5ff70" }} /> Recommended actions</h3>
                                <div className="kf-advice">{adviceItems.map((item, index) => <div className="kf-adviceitem" key={`${index}-${item}`}><FaCheckCircle /> <span>{String(item).replace(/^\s*(?:\d+[.)]\s*|[-•]\s*)/, "")}</span></div>)}</div>
                            </>}
                            {result.message && <div className="kf-note">{String(result.message)}</div>}
                            <div className="kf-note"><FaInfoCircle style={{ display: "inline", marginRight: 6 }} />Nutrient requirements vary by crop variety, growth stage, soil type and region. This page does not estimate nutrient deficiencies using fixed generic targets; follow a soil-test report and local agricultural extension guidance before applying fertilizer.</div>
                        </>}
                    </section>
                </div>
            </div>
        </main>
        <Footer />
    </>;
}
