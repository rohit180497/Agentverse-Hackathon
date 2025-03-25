from flask import Flask, render_template, request, jsonify
import requests

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/get-route', methods=['POST'])
def get_route():
    data = {
        "source": request.form['source'],
        "destination": request.form['destination'],
        "departure_date": request.form['departure_date'],
        "return_date": request.form['return_date'],
        "no_of_people": int(request.form['no_of_people'])
    }
    try:
        response = requests.post("http://127.0.0.1:8001/trigger", json=data)
        return jsonify(response.json())
    except Exception as e:
        return jsonify({"error": str(e)})

if __name__ == '__main__':
    app.run(debug=True)