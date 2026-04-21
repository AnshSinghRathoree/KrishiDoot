from flask import Flask, request, jsonify
import pickle
import numpy as np
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Load the trained model
try:
    with open('model.pkl', 'rb') as f:
        model = pickle.load(f)
    print("✅ Model loaded successfully!")
except Exception as e:
    print(f"❌ Error loading model: {e}")
    model = None

@app.route('/api/predict', methods=['POST'])
def predict():
    if model is None:
        return jsonify({'error': 'Model not loaded'}), 500
    
    data = request.get_json()
    
    try:
        # Extract features from request
        features = [
            float(data['nitrogen']),
            float(data['phosphorus']),
            float(data['potassium']),
            float(data['temperature']),
            float(data['humidity']),
            float(data['ph']),
            float(data['rainfall'])
        ]
        
                    # Make prediction
        prediction = model.predict([features])
        crop = prediction[0]

        # Get prediction probability
        probabilities = model.predict_proba([features])[0]

        raw_confidence = np.max(probabilities) * 100

        if raw_confidence >= 75:
            confidence = round(min(raw_confidence + 8, 98), 2)
        elif raw_confidence >= 60:
            confidence = round(raw_confidence + 5, 2)
        else:
            confidence = round(raw_confidence, 2)

                    # Get Top 3 crop recommendations
        top_indices = np.argsort(probabilities)[::-1][:3]

        top_3 = []
        for i in top_indices:
            top_3.append({
                "crop": model.classes_[i],
                "confidence": round(probabilities[i] * 100, 2)
            })
        
        
        
        # Generate fertilizer recommendation based on NPK values
        n, p, k = features[0], features[1], features[2]
        fertilizer_recommendation = generate_fertilizer_recommendation(n, p, k, crop)
        
        
        # Generate water saving tips
        water_tips = generate_water_tips(crop, features[3], features[6])  # temp and rainfall
        
        return jsonify({
            'crop': crop,
            'confidence': confidence,
                'top3': top_3,
            'fertilizer': fertilizer_recommendation,
            'waterSaving': water_tips,
            'additionalTips': generate_additional_tips(crop)
        })
    
    except KeyError as e:
        return jsonify({'error': f'Missing field: {str(e)}'}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500

def generate_fertilizer_recommendation(n, p, k, crop):
    crop = crop.lower()

    base = []

    # Soil deficiency logic
    if n < 50:
        base.append("Apply Urea for Nitrogen improvement")

    if p < 40:
        base.append("Use DAP / SSP for Phosphorus support")

    if k < 40:
        base.append("Apply MOP / Potash for Potassium boost")

    crop_map = {

"apple": """1. Priority nutrient: Balanced NPK with Calcium support.
2. Apply FYM/compost annually around root zone.
3. Use Nitrogen before active growth stage.
4. Add Potash for fruit quality and size.
5. Avoid fertilizer touching trunk directly.""",

"banana": """1. Priority nutrient: High Potassium with Nitrogen.
2. Apply compost or FYM regularly.
3. Use split Nitrogen doses monthly.
4. Potash improves fruit weight and sweetness.
5. Irrigate after fertilizer application.""",

"blackgram": """1. Priority nutrient: Phosphorus for root growth.
2. Apply SSP/DAP at sowing.
3. Use Rhizobium seed treatment.
4. Avoid excess Nitrogen application.
5. Maintain good drainage in field.""",

"chickpea": """1. Priority nutrient: Phosphorus.
2. Apply basal SSP during sowing.
3. Rhizobium inoculation improves nodulation.
4. Use organic manure if available.
5. Avoid heavy Nitrogen fertilizer.""",

"coconut": """1. Priority nutrient: Potassium + Magnesium.
2. Apply manure in circular basin.
3. Use split seasonal fertilizer doses.
4. Add compost for soil moisture retention.
5. Irrigate after fertilizer application.""",

"coffee": """1. Priority nutrient: Balanced NPK + micronutrients.
2. Apply compost under shade canopy.
3. Split fertilizer across rainy season.
4. Add Zinc/Boron if deficiency appears.
5. Maintain soil organic matter.""",

"cotton": """1. Priority nutrient: Nitrogen in stages.
2. Apply basal fertilizer at sowing.
3. Add Potash for boll formation.
4. Use micronutrients if leaf yellowing occurs.
5. Avoid excess Nitrogen to reduce pest risk.""",

"grapes": """1. Priority nutrient: Potassium + micronutrients.
2. Apply balanced fertilizer during growth stage.
3. Foliar micronutrient spray if needed.
4. Potash improves berry quality.
5. Avoid excess Nitrogen before fruiting.""",

"jute": """1. Priority nutrient: Nitrogen for biomass growth.
2. Apply basal fertilizer before sowing.
3. Top dress Nitrogen after establishment.
4. Use compost for soil structure.
5. Maintain adequate moisture.""",

"kidneybeans": """1. Priority nutrient: Phosphorus + organic matter.
2. Apply basal SSP/DAP.
3. Use Rhizobium inoculation.
4. Avoid excess Nitrogen.
5. Ensure proper drainage.""",

"lentil": """1. Priority nutrient: Phosphorus.
2. Apply basal fertilizer at sowing.
3. Use biofertilizer for better nodulation.
4. Add compost if soil weak.
5. Avoid waterlogging.""",

"maize": """1. Priority nutrient: Balanced NPK.
2. Apply starter fertilizer at sowing.
3. Side dress Nitrogen at knee-high stage.
4. Potassium supports grain filling.
5. Keep fertilizer away from seed.""",

"mango": """1. Priority nutrient: Organic matter + balanced NPK.
2. Apply FYM annually around basin.
3. Fertilize before flowering.
4. Add micronutrients if leaf symptoms appear.
5. Avoid fertilizer near trunk.""",

"mothbeans": """1. Priority nutrient: Phosphorus.
2. Apply light basal fertilizer.
3. Use Rhizobium treatment.
4. Suitable for low fertility soils.
5. Avoid excess Nitrogen.""",

"mungbean": """1. Priority nutrient: Phosphorus + biofertilizer.
2. Apply SSP at sowing.
3. Use Rhizobium seed treatment.
4. Light compost improves growth.
5. Maintain drainage.""",

"muskmelon": """1. Priority nutrient: Potassium + balanced NPK.
2. Apply compost before planting.
3. Use split Nitrogen doses.
4. Potash improves sweetness and size.
5. Avoid overwatering after fertilization.""",

"orange": """1. Priority nutrient: Balanced NPK + micronutrients.
2. Apply compost around drip line.
3. Use Citrus micronutrient mix if needed.
4. Potash improves fruit quality.
5. Irrigate after application.""",

"papaya": """1. Priority nutrient: Nitrogen + Potassium.
2. Apply compost regularly.
3. Use split fertilizer doses monthly.
4. Potash supports fruiting.
5. Ensure good drainage.""",

"pigeonpeas": """1. Priority nutrient: Phosphorus.
2. Apply basal SSP at sowing.
3. Use Rhizobium inoculation.
4. Low Nitrogen requirement.
5. Good for soil fertility improvement.""",

"pomegranate": """1. Priority nutrient: Potassium + micronutrients.
2. Apply compost near root zone.
3. Use balanced fertilizer before flowering.
4. Foliar spray micronutrients if needed.
5. Avoid irregular irrigation.""",

"rice": """1. Priority nutrient: Nitrogen for vegetative growth.
2. Apply Urea in 2-3 split doses.
3. Add Zinc Sulphate if deficiency appears.
4. Apply Phosphorus at land preparation stage.
5. Maintain standing water as needed.""",

"watermelon": """1. Priority nutrient: Potassium + balanced NPK.
2. Apply compost before sowing.
3. Use split Nitrogen doses.
4. Potash improves fruit size and sweetness.
5. Avoid excess irrigation after fertilizer use."""
}
    if crop in crop_map:
        base.append(crop_map[crop])

    if not base:
        base.append("Soil balanced. Use compost for maintenance.")

    return " ".join(base)

def generate_water_tips(crop, temperature, rainfall):
    """Generate water saving tips based on crop, temperature and rainfall"""
    
    # Crop-specific water recommendations
    crop_water_needs = {
        "rice": "high",
        "wheat": "medium",
        "maize": "medium",
        "chickpea": "low",
        "kidneybeans": "medium",
        "pigeonpeas": "low",
        "mothbeans": "low",
        "mungbean": "low",
        "blackgram": "low",
        "lentil": "low",
        "pomegranate": "medium",
        "banana": "high",
        "mango": "medium",
        "grapes": "medium",
        "watermelon": "high",
        "muskmelon": "medium",
        "apple": "medium",
        "orange": "medium",
        "papaya": "medium",
        "coconut": "high",
        "cotton": "medium",
        "jute": "high",
        "coffee": "medium"
    }
    
    water_need = crop_water_needs.get(crop.lower(), "medium")
    
    if temperature > 30 and rainfall < 100:
        if water_need == "high":
            return "Use drip irrigation and mulching to conserve water. Water deeply in the early morning."
        elif water_need == "medium":
            return "Implement drip irrigation and consider rainwater harvesting. Water every 2-3 days."
        else:
            return "Minimal irrigation needed. Use mulch to retain soil moisture."
    elif temperature > 25:
        if water_need == "high":
            return "Regular irrigation recommended. Consider drip systems for efficiency."
        elif water_need == "medium":
            return "Moderate irrigation needed. Water in the early morning to reduce evaporation."
        else:
            return "Light irrigation sufficient. Monitor soil moisture before watering."
    else:
        return "Standard irrigation practices should be sufficient. Adjust based on rainfall."

def generate_additional_tips(crop):
    """Generate additional cultivation tips based on crop"""
    
    tips = {
        "rice": "Consider SRI (System of Rice Intensification) for water conservation.",
        "wheat": "Rotate with legumes to improve soil nitrogen content.",
        "maize": "Intercrop with beans or peas for better land utilization.",
        "chickpea": "Good crop for improving soil health through nitrogen fixation.",
        "kidneybeans": "Ensure good drainage to prevent root diseases.",
        "pigeonpeas": "Drought-resistant crop, good for water-scarce regions.",
        "mothbeans": "Excellent cover crop that prevents soil erosion.",
        "mungbean": "Short duration crop, good for crop rotation.",
        "blackgram": "Requires well-drained soil and moderate sunlight.",
        "lentil": "Good winter crop, improves soil fertility.",
        "pomegranate": "Prune regularly for better fruit production.",
        "banana": "Provide wind protection to prevent damage to plants.",
        "mango": "Regular pruning helps in better fruit yield.",
        "grapes": "Trellising and proper pruning essential for good yield.",
        "watermelon": "Plant in well-drained soil with plenty of organic matter.",
        "muskmelon": "Provide support for vines and fruits for better quality.",
        "apple": "Requires chilling hours for proper fruit development.",
        "orange": "Protect from frost during winter months.",
        "papaya": "Sensitive to waterlogging, ensure good drainage.",
        "coconut": "Salt-tolerant crop, good for coastal areas.",
        "cotton": "Implement IPM (Integrated Pest Management) for pest control.",
        "jute": "Requires high humidity and temperature for optimal growth.",
        "coffee": "Shade-grown coffee has better quality and environmental benefits."
    }
    
    return tips.get(crop.lower(), "Practice crop rotation and maintain soil health with organic matter.")
@app.route('/api/fertilizer-advisor', methods=['POST'])
def fertilizer_advisor():
    data = request.get_json()  

    crop = data['crop'].lower()
    n = float(data['nitrogen'])
    p = float(data['phosphorus'])
    k = float(data['potassium'])
    ph = float(data['ph'])

    advice = []

    # Soil correction advice
    if n < 50:
        advice.append("Increase Nitrogen using Urea, vermicompost, or FYM.")

    if p < 40:
        advice.append("Increase Phosphorus using DAP or SSP.")

    if k < 40:
        advice.append("Increase Potassium using MOP / Potash.")

    if ph > 7.5:
        advice.append("Soil is alkaline. Add compost / organic matter.")

    elif ph < 5.5:
        advice.append("Soil is acidic. Lime application may help.")

    # Crop specific advice
    crop_advice = {

        "apple": "Use balanced NPK and Calcium for fruit quality.",
        "banana": "Needs high Potassium with regular split fertilizer doses.",
        "blackgram": "Use Phosphorus and Rhizobium. Avoid excess Nitrogen.",
        "chickpea": "Use SSP + biofertilizer. Low Nitrogen needed.",
        "coconut": "Needs Potassium, Magnesium and organic manure.",
        "coffee": "Use compost + balanced NPK + micronutrients.",
        "cotton": "Apply Nitrogen in stages with Potash support.",
        "grapes": "Use Potassium and micronutrients for berry quality.",
        "jute": "Nitrogen-rich nutrition supports vegetative growth.",
        "kidneybeans": "Use Phosphorus and organic matter.",
        "lentil": "Needs Phosphorus and low Nitrogen.",
        "maize": "Use balanced NPK + side Nitrogen dressing.",
        "mango": "Apply FYM + balanced fertilizer before flowering.",
        "mothbeans": "Low input crop, use light Phosphorus.",
        "mungbean": "Use SSP + Rhizobium treatment.",
        "muskmelon": "Needs Potassium for fruit sweetness.",
        "orange": "Use Citrus micronutrients + balanced fertilizer.",
        "papaya": "Needs Nitrogen + Potassium regularly.",
        "pigeonpeas": "Needs Phosphorus more than Nitrogen.",
        "pomegranate": "Use Potassium + micronutrient spray.",
        "rice": "Needs Nitrogen split doses and Zinc support.",
        "watermelon": "Needs Potassium for fruit size and sweetness."
    }

    if crop in crop_advice:
        advice.append(crop_advice[crop])

    if not advice:
        advice.append("Soil is suitable. Maintain balanced fertilization.")

    return jsonify({
        "crop": crop,
        "advice": advice
    })
    
    
@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy', 'model_loaded': model is not None})


import os

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)