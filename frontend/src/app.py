from flask import Flask, request, jsonify
import joblib
import numpy as np
from flask_cors import CORS

# Charger le modèle et le scaler
model = joblib.load('SVM_model.pkl')
scaler = joblib.load('scaler.pkl')

app = Flask(__name__)
CORS(app)  # Permet de gérer les requêtes cross-origin (entre React et Flask)

# Séparer les prédictions par source
predictions_by_source = {
    "app": [],        # prédictions faites dans le composant App
    "predictionForm": []  # prédictions faites dans le composant PredictionForm
}

@app.route('/api/predict', methods=['POST'])
def predict_api():
    try:
        data = request.get_json()  # Récupérer les données JSON envoyées par React
        
        # Récupérer la source de la prédiction (par défaut "predictionForm" si non spécifiée)
        source = data.get('source', 'predictionForm')
        
        features = [
            float(data['IN_ALLEYS']),
            float(data['REST']),
            float(data['EAT']),
            float(data['ACTIVITY_LEVEL']),
            float(data['LPS']),
            float(data['disturbance']),
        ]
        
        input_data = np.array([features])
        input_scaled = scaler.transform(input_data)  # Normalisation des données
        pred = model.predict(input_scaled)[0]
        result = "OK ✅" if pred == 1 else "Not OK ❌"
        
        # Stocker la prédiction avec sa source
        prediction_record = {
            **data,
            'prediction': result
        }
        
        # Ajouter à la liste appropriée selon la source
        if source in predictions_by_source:
            predictions_by_source[source].append(prediction_record)
        else:
            # Si source inconnue, ajouter à predictionForm par défaut
            predictions_by_source["predictionForm"].append(prediction_record)
            
        return jsonify({'Pred': result})
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/api/predictions', methods=['GET'])
def get_predictions():
    # Obtenir la source demandée depuis les paramètres de requête
    source = request.args.get('source', 'all')
    
    if source == 'all':
        # Combinaison de toutes les prédictions
        all_predictions = []
        for src_predictions in predictions_by_source.values():
            all_predictions.extend(src_predictions)
        return jsonify(all_predictions)
    elif source in predictions_by_source:
        # Renvoyer uniquement les prédictions de la source spécifiée
        return jsonify(predictions_by_source[source])
    else:
        return jsonify([])

if __name__ == '__main__':
    app.run(debug=True)