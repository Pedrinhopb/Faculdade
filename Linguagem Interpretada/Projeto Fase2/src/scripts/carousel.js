 let currentSlide = 0;
        const slides = document.querySelectorAll('.carousel-slide');
        const totalSlides = slides.length;

        function createDots() {
            const dotsContainer = document.getElementById('dots');
            for (let i = 0; i < totalSlides; i++) {
                const dot = document.createElement('span');
                dot.className = 'dot' + (i === 0 ? ' active' : '');
                dot.onclick = () => goToSlide(i);
                dotsContainer.appendChild(dot);
            }
        }

        function updateCarousel() {
            const carousel = document.getElementById('carousel');
            carousel.style.transform = `translateX(-${currentSlide * 100}%)`;
            
            document.querySelectorAll('.dot').forEach((dot, index) => {
                dot.classList.toggle('active', index === currentSlide);
            });
        }

        function mudarSlide(direction) {
            currentSlide = (currentSlide + direction + totalSlides) % totalSlides;
            updateCarousel();
        }

        function goToSlide(index) {
            currentSlide = index;
            updateCarousel();
        }

        createDots();
        updateCarousel();

        setInterval(() => {
            mudarSlide(1);
        }, 5000);