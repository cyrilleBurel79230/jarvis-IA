from flask import Blueprint, request, jsonify
from models import text_gen_pipeline

generate_text_bp = Blueprint('generate_text', __name__, url_prefix='/generate-text')

@generate_text_bp.route('', methods=['POST'])
def generate_text():
    print('Début generate_text')
    try:
        data = request.json
        if not data or 'prompt' not in data:
            return jsonify({'error': 'Champ prompt requis'}), 400

        prompt = data['prompt']
        result = text_gen_pipeline(prompt, max_length=100, num_return_sequences=1, do_sample=True)
        generated_text = result[0].get('generated_text', '').strip()
        print('Fin generate_text')
        return jsonify({'generated_text': generated_text})

    except Exception as e:
        return jsonify({'error': str(e)}), 500
