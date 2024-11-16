from flask import Flask, render_template

app = Flask(__name__)

# Route for the homepage (root URL)
@app.route("/")
def home():
    return render_template("home.html")

# Route for the About Us page
@app.route("/about")
def about():
    return render_template("about.html")

# Route for the Rooms page
@app.route("/rooms")
def rooms():
    return render_template("rooms.html")

# Route for the Prices & Services page
@app.route("/prices")
def prices():
    return render_template("prices.html")

# Route for the Availability form page
@app.route("/availability")
def availability():
    return render_template("availability.html")

if __name__ == "__main__":
    app.run(debug=True)
