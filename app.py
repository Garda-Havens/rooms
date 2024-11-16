from flask import Flask, render_template, request, flash, redirect
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

app = Flask(__name__)
app.secret_key = "your_secret_key"  # Required for flash messages

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

# Route to handle form submission and send email
@app.route("/submit", methods=["POST"])
def submit():
    try:
        # Retrieve form data
        check_in = request.form["check-in"]
        check_out = request.form["check-out"]
        room_type = request.form["room-type"]
        email = request.form["email"]
        special_requests = request.form["special-requests"]

        # Email configuration
        sender_email = "your_email@example.com"  # Replace with your email
        sender_password = "your_email_password"  # Replace with your email password
        receiver_email = "barbazeni.a@gmail.com"  # Replace with the recipient's email

        # Email content
        subject = "Room Availability Request"
        body = f"""
        New Availability Request:

        Check-in Date: {check_in}
        Check-out Date: {check_out}
        Number of Guests: {room_type}
        Email: {email}
        Special Requests: {special_requests}
        """

        # Set up the MIME email
        message = MIMEMultipart()
        message["From"] = sender_email
        message["To"] = receiver_email
        message["Subject"] = subject
        message.attach(MIMEText(body, "plain"))

        # Send email using SMTP
        with smtplib.SMTP("smtp.gmail.com", 587) as server:  # Use the appropriate SMTP server
            server.starttls()
            server.login(sender_email, sender_password)
            server.sendmail(sender_email, receiver_email, message.as_string())

        # Flash success message and redirect
        flash("Your request has been submitted successfully!", "success")
    except Exception as e:
        # Flash error message and redirect
        flash(f"An error occurred: {e}", "error")

    return redirect("/availability")

if __name__ == "__main__":
    app.run(debug=True)
