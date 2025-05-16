document.addEventListener("DOMContentLoaded", () => {
    const slideshows = document.querySelectorAll(".slideshow-container");

    slideshows.forEach((slideshow) => {
        const slides = slideshow.querySelectorAll(".slide");
        let currentIndex = 0;

        const showSlide = () => {
            slides.forEach((slide, index) => {
                slide.style.opacity = 0;
            });

            slides[currentIndex].style.opacity = 1;
            currentIndex = (currentIndex + 1) % slides.length;
        };

        showSlide();
        setInterval(showSlide, 5000);
    });

    // Gallery Modal Logic
    const modal = document.getElementById("gallery-modal");
    const modalImage = document.getElementById("modal-image");
    const caption = document.getElementById("caption");
    const prevButton = document.getElementById("prev-image");
    const nextButton = document.getElementById("next-image");
    const closeButton = document.querySelector(".close-modal");
    let galleryImages = [];
    let currentImageIndex = 0;

    document.querySelectorAll(".open-gallery").forEach(button => {
        button.addEventListener("click", (event) => {
            const room = event.target.getAttribute("data-room");
            const roomSlides = document.querySelectorAll(`#slideshow-${room} .slide img`);
            galleryImages = Array.from(roomSlides).map(img => img.src);
            currentImageIndex = 0;
            showModalImage();
            modal.style.display = "block";
        });
    });

    const showModalImage = () => {
        modalImage.src = galleryImages[currentImageIndex];
        caption.innerText = `Image ${currentImageIndex + 1} of ${galleryImages.length}`;
    };

    prevButton.addEventListener("click", () => {
        currentImageIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
        showModalImage();
    });

    nextButton.addEventListener("click", () => {
        currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
        showModalImage();
    });

    closeButton.addEventListener("click", () => {
        modal.style.display = "none";
    });

    // Close modal when clicking outside the image
    modal.addEventListener("click", (event) => {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });
});

