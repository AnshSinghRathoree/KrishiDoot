import React, { useState } from "react"
import axios from "axios"

const crops = [
    "apple",
    "banana",
    "blackgram",
    "chickpea",
    "coconut",
    "coffee",
    "cotton",
    "grapes",
    "jute",
    "kidneybeans",
    "lentil",
    "maize",
    "mango",
    "mothbeans",
    "mungbean",
    "muskmelon",
    "orange",
    "papaya",
    "pigeonpeas",
    "pomegranate",
    "rice",
    "watermelon"
]

function FertilizerAdvisor() {
    const [form, setForm] = useState({
        crop: "banana",
        nitrogen: "",
        phosphorus: "",
        potassium: "",
        ph: ""
    })

    const [result, setResult] = useState(null)

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            const res = await axios.post(
                "http://127.0.0.1:5000/api/fertilizer-advisor",
                form
            )

            setResult(res.data)
        } catch (error) {
            alert("Unable to fetch fertilizer advice")
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-white py-10 px-4">
            <div className="max-w-6xl mx-auto">

                {/* Header */}
                <div className="text-center mb-10">
                    <h1 className="text-5xl font-bold text-green-700 mb-3">
                        🌱 Fertilizer Advisor
                    </h1>
                    <p className="text-gray-600 text-lg">
                        AI-powered fertilizer recommendations for better crop growth
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">

                    {/* Form Card */}
                    <div className="bg-white rounded-3xl shadow-xl p-8 border border-green-100">
                        <h2 className="text-2xl font-semibold text-green-700 mb-6">
                            Enter Soil Details
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-4">

                            <select
                                name="crop"
                                value={form.crop}
                                onChange={handleChange}
                                className="w-full border rounded-xl px-4 py-3"
                            >
                                {crops.map((crop, index) => (
                                    <option key={index} value={crop}>
                                        {crop.charAt(0).toUpperCase() + crop.slice(1)}
                                    </option>
                                ))}
                            </select>

                            <input
                                type="number"
                                name="nitrogen"
                                placeholder="Nitrogen (N)"
                                onChange={handleChange}
                                className="w-full border rounded-xl px-4 py-3"
                            />

                            <input
                                type="number"
                                name="phosphorus"
                                placeholder="Phosphorus (P)"
                                onChange={handleChange}
                                className="w-full border rounded-xl px-4 py-3"
                            />

                            <input
                                type="number"
                                name="potassium"
                                placeholder="Potassium (K)"
                                onChange={handleChange}
                                className="w-full border rounded-xl px-4 py-3"
                            />

                            <input
                                type="number"
                                step="0.1"
                                name="ph"
                                placeholder="pH Value"
                                onChange={handleChange}
                                className="w-full border rounded-xl px-4 py-3"
                            />

                            <button className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl text-lg font-semibold transition">
                                Get Smart Advice
                            </button>
                        </form>
                    </div>
                    {/* Result Card */}
                    <div className="bg-gradient-to-r from-[#083844] via-[#0a4452] to-[#0d5563] rounded-3xl shadow-2xl p-8 border border-green-400/20 text-white">

                        {!result ? (
                            <div className="text-center py-24">
                                <h2 className="text-3xl font-bold text-green-300 mb-4">
                                    Recommendation Result
                                </h2>

                                <p className="text-gray-300 text-lg">
                                    Fill the form to receive fertilizer guidance
                                </p>
                            </div>
                        ) : (
                            <>
                                {/* Heading */}
                                <h2 className="text-4xl font-bold mb-10 leading-tight">
                                    🌱 Results for{" "}
                                    <span className="text-green-400 capitalize">
                                        {result.crop}
                                    </span>
                                </h2>

                                {/* Soil Nutrient Deficiencies */}
                                <div className="mb-10">
                                    <h3 className="text-2xl font-semibold mb-5">
                                        Soil Nutrient Deficiencies:
                                    </h3>

                                    {(() => {
                                        const ideal = {
                                            apple: { n: 80, p: 45, k: 60 },
                                            banana: { n: 100, p: 50, k: 80 },
                                            blackgram: { n: 25, p: 45, k: 20 },
                                            chickpea: { n: 30, p: 50, k: 30 },
                                            coconut: { n: 90, p: 40, k: 100 },
                                            coffee: { n: 90, p: 45, k: 70 },
                                            cotton: { n: 120, p: 60, k: 60 },
                                            grapes: { n: 80, p: 50, k: 90 },
                                            jute: { n: 100, p: 45, k: 50 },
                                            kidneybeans: { n: 35, p: 50, k: 30 },
                                            lentil: { n: 30, p: 45, k: 25 },
                                            maize: { n: 110, p: 50, k: 40 },
                                            mango: { n: 75, p: 40, k: 70 },
                                            mothbeans: { n: 25, p: 40, k: 20 },
                                            mungbean: { n: 25, p: 45, k: 20 },
                                            muskmelon: { n: 80, p: 45, k: 90 },
                                            orange: { n: 85, p: 45, k: 75 },
                                            papaya: { n: 90, p: 50, k: 90 },
                                            pigeonpeas: { n: 30, p: 45, k: 25 },
                                            pomegranate: { n: 70, p: 40, k: 80 },
                                            rice: { n: 120, p: 60, k: 40 },
                                            watermelon: { n: 85, p: 45, k: 95 }
                                        }

                                        const cropData = ideal[result.crop] || { n: 80, p: 40, k: 40 }

                                        const nDef = Math.max(cropData.n - Number(form.nitrogen), 0)
                                        const pDef = Math.max(cropData.p - Number(form.phosphorus), 0)
                                        const kDef = Math.max(cropData.k - Number(form.potassium), 0)

                                        return (
                                            <ul className="space-y-3 text-lg text-gray-100">
                                                <li>
                                                    • Nitrogen:{" "}
                                                    <span className="font-bold text-green-300">
                                                        {nDef} kg/ha deficient
                                                    </span>
                                                </li>

                                                <li>
                                                    • Phosphorus:{" "}
                                                    <span className="font-bold text-green-300">
                                                        {pDef} kg/ha deficient
                                                    </span>
                                                </li>

                                                <li>
                                                    • Potassium:{" "}
                                                    <span className="font-bold text-green-300">
                                                        {kDef} kg/ha deficient
                                                    </span>
                                                </li>
                                            </ul>
                                        )
                                    })()}
                                </div>

                                {/* Chemical Fertilizer Recommendation */}
                                <div className="mb-10">
                                    <h3 className="text-2xl font-semibold text-green-300 mb-5">
                                        🧪 Chemical Fertilizer Recommendation:
                                    </h3>

                                    <ul className="space-y-4 text-lg text-gray-100">
                                        {result.advice.map((item, index) => (
                                            <li
                                                key={index}
                                                className="bg-white/5 rounded-xl px-4 py-3 border border-white/10"
                                            >
                                                • {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Organic Alternatives */}
                                <div className="mb-10">
                                    <h3 className="text-2xl font-semibold text-green-300 mb-5">
                                        🌿 Organic Alternatives:
                                    </h3>

                                    <ul className="space-y-3 text-lg text-gray-100">
                                        <li>• Nitrogen: Use compost, FYM or vermicompost</li>
                                        <li>• Phosphorus: Use bone meal or phosphate compost</li>
                                        <li>• Potassium: Use wood ash or banana peel compost</li>
                                    </ul>
                                </div>

                                {/* Tip */}
                                <div className="mt-6 pt-6 border-t border-white/10">
                                    <p className="italic text-green-200 text-xl">
                                        Tip: Combine organic and inorganic practices for sustainable farming.
                                    </p>
                                </div>
                            </>
                        )}
                    </div>
                </div>

            </div>
        </div>

    )
}

export default FertilizerAdvisor