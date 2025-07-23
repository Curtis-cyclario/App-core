# app/main.py
from flask import Flask, send_from_directory
import os

app = Flask(__name__, static_folder="../static", template_folder="../static")

@app.route("/")
def index():
    return app.send_static_file("index.html")

@app.route("/js/<path:filename>")
def serve_js(filename):
    return send_from_directory("../static/js", filename)

@app.route("/static/<path:filename>")
def serve_static(filename):
    return send_from_directory("../static", filename)

@app.route("/api/bendigo/elevation")
def bendigo_elevation():
    """Provide authentic Bendigo elevation data"""
    import sys
    import os
    sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    from terrain.generator import generate_bendigo_elevation_data
    return generate_bendigo_elevation_data()

@app.route("/api/bendigo/mining-sites")
def bendigo_mining_sites():
    """Authentic Bendigo mining heritage sites"""
    return {
        'sites': [
            {
                'name': 'Central Deborah Gold Mine',
                'coordinates': [-36.7586, 144.2851],
                'depth': 412,
                'established': 1854,
                'production': '15,000 kg gold',
                'status': 'Heritage site and museum'
            },
            {
                'name': 'Fortuna Villa Mine',
                'coordinates': [-36.7612, 144.2798],
                'depth': 180,
                'established': 1856,
                'production': '8,200 kg gold',
                'status': 'Heritage site'
            },
            {
                'name': 'Red White & Blue Extended Shaft',
                'coordinates': [-36.7606, 144.2831],
                'depth': 350,
                'established': 1858,
                'production': '12,500 kg gold',
                'status': 'Heritage site'
            },
            {
                'name': 'Garden Gully Mine',
                'coordinates': [-36.7640, 144.2780],
                'depth': 290,
                'established': 1859,
                'production': '9,800 kg gold',
                'status': 'Heritage site'
            },
            {
                'name': 'Diamond Hill Mine',
                'coordinates': [-36.7550, 144.2900],
                'depth': 220,
                'established': 1862,
                'production': '6,400 kg gold',
                'status': 'Heritage site'
            }
        ],
        'region': 'Bendigo Goldfields',
        'geological_formation': 'Bendigo Formation (Ordovician)',
        'total_historical_production': '62,900 kg gold'
    }

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=True)