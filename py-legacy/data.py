from flask import Flask, jsonify
from markupsafe import escape
import random
import faker

app = Flask(__name__)
fake = faker.Faker()
customer_types = ["Masivo", "Preferente", "Premium"]

def generate_credit_card_campaign_data(num_records=200):
    data = []
    for _ in range(num_records):
        record = {
            "nombre_cliente": fake.name(),
            "monto_tarjeta": round(random.uniform(500000, 15000000), 0),
            "tasa_interes": round(random.uniform(5, 15), 0),
            "tipo_cliente": random.choice(customer_types),
        }
        data.append(record)
    return data

@app.route("/<name>")
def hello(name):
    return f"Hello, {escape(name)}!"

@app.route("/campaign-data")
def campaign_data():
    data = generate_credit_card_campaign_data()
    return jsonify(data)

if __name__ == "__main__":
    app.run(debug=True)
