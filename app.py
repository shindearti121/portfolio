import os
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS

app = Flask(__name__, static_folder='.')
CORS(app)

@app.route('/')
def index():
    return send_from_directory('.', 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory('.', path)

@app.route('/profile-picture')
def get_profile_picture():
    directory = "profile picture"
    filename = "WhatsApp Image 2026-06-18 at 8.09.19 AM.jpeg"
    return send_from_directory(directory, filename)

@app.route('/achievement-image')
def get_achievement_image():
    directory = "Achivements"
    filename = "achievement.png"
    return send_from_directory(directory, filename)

@app.route('/api/contact', methods=['POST'])
def contact():
    try:
        data = request.json
        name = data.get('name')
        email = data.get('email')
        subject = data.get('subject')
        message = data.get('message')

        # Log the received data
        print(f"Received message from {name} ({email}):")
        print(f"Subject: {subject}")
        print(f"Message: {message}")

        # In a real app, you might send an email or save to a database here
        
        return jsonify({"status": "success", "message": "Message received successfully!"}), 200
    except Exception as e:
        print(f"Error processing contact form: {e}")
        return jsonify({"status": "error", "message": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
