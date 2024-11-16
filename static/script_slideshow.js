document.addEventListener("DOMContentLoaded", () => {
    // Initialize slideshows for each room
    const slideshows = document.querySelectorAll(".slideshow-container");

    slideshows.forEach((slideshow) => {
        const slides = slideshow.querySelectorAll(".slide");
        let currentIndex = 0;

        const showSlide = () => {
            // Hide all slides
            slides.forEach((slide, index) => {
                slide.classList.remove("active");
                slide.style.opacity = 0;
            });

            // Show the current slide
            slides[currentIndex].classList.add("active");
            slides[currentIndex].style.opacity = 1;

            // Move to the next slide
            currentIndex = (currentIndex + 1) % slides.length;
        };

        // Start the slideshow
        showSlide();
        setInterval(showSlide, 5000); // Change slide every 5 seconds
    });
});
