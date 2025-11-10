// JavaScript para el Álbum

// Configurar el modal para mostrar las fotos y videos
document.addEventListener('DOMContentLoaded', () => {
    const photoCards = document.querySelectorAll('.photo-card');
    const modalPhoto = document.getElementById('modalPhoto');
    const modalVideo = document.getElementById('modalVideo');
    const modalTitle = document.querySelector('#photoModal .modal-title');
    const photoModal = document.getElementById('photoModal');
    
    photoCards.forEach(card => {
        card.addEventListener('click', function() {
            const mediaType = this.getAttribute('data-type');
            const caption = this.querySelector('.photo-caption h4').textContent;
            
            if (mediaType === 'video') {
                // Es un video
                const videoSrc = this.getAttribute('data-video-src');
                
                if (videoSrc && modalVideo) {
                    // Ocultar imagen y mostrar video
                    modalPhoto.style.display = 'none';
                    modalVideo.style.display = 'block';
                    
                    // Aplicar estilos al video
                    modalVideo.style.maxWidth = '100%';
                    modalVideo.style.maxHeight = window.innerWidth > 768 ? '85vh' : '75vh';
                    modalVideo.style.width = 'auto';
                    modalVideo.style.height = 'auto';
                    modalVideo.style.objectFit = 'contain';
                    modalVideo.style.margin = '0 auto';
                    modalVideo.style.display = 'block';
                    
                    // Cargar el video
                    const videoSource = modalVideo.querySelector('source');
                    if (videoSource) {
                        videoSource.src = videoSrc;
                        modalVideo.load();
                    }
                    
                    if (modalTitle) {
                        modalTitle.textContent = caption;
                    }
                }
            } else {
                // Es una imagen
                const img = this.querySelector('.photo-img');
                
                if (img && modalPhoto) {
                    // Ocultar video y mostrar imagen
                    modalVideo.style.display = 'none';
                    
                    // Aplicar estilos a la imagen
                    modalPhoto.src = img.src;
                    modalPhoto.alt = img.alt;
                    modalPhoto.style.maxWidth = '100%';
                    modalPhoto.style.maxHeight = window.innerWidth > 768 ? '85vh' : '75vh';
                    modalPhoto.style.width = 'auto';
                    modalPhoto.style.height = 'auto';
                    modalPhoto.style.objectFit = 'contain';
                    modalPhoto.style.margin = '0 auto';
                    modalPhoto.style.display = 'block';
                    modalPhoto.style.transform = 'scale(1)';
                    
                    // Esperar a que la imagen cargue para ajustar el tamaño
                    modalPhoto.onload = function() {
                        const maxHeight = window.innerWidth > 768 ? '85vh' : '75vh';
                        this.style.maxHeight = maxHeight;
                        this.style.maxWidth = '100%';
                        this.style.width = 'auto';
                        this.style.height = 'auto';
                    };
                    
                    if (modalTitle) {
                        modalTitle.textContent = caption;
                    }
                }
            }
        });
    });
    
    // Variable para controlar el zoom
    let isZoomed = false;
    
    // Detener video cuando se cierra el modal y resetear zoom
    if (photoModal) {
        photoModal.addEventListener('hidden.bs.modal', function() {
            if (modalVideo) {
                modalVideo.pause();
                modalVideo.currentTime = 0;
            }
            if (modalPhoto) {
                modalPhoto.style.transform = 'scale(1)';
                isZoomed = false;
            }
        });
        
        // Resetear zoom cuando se abre el modal
        photoModal.addEventListener('show.bs.modal', function() {
            if (modalPhoto) {
                modalPhoto.style.transform = 'scale(1)';
                isZoomed = false;
                if (window.innerWidth > 768) {
                    modalPhoto.style.cursor = 'zoom-in';
                }
            }
        });
    }
    
    // Efecto de zoom en imágenes (solo desktop)
    if (modalPhoto) {
        modalPhoto.addEventListener('click', function(e) {
            if (this.tagName === 'IMG' && window.innerWidth > 768 && this.complete) {
                e.stopPropagation();
                isZoomed = !isZoomed;
                const scale = isZoomed ? 2 : 1;
                this.style.transform = `scale(${scale})`;
                this.style.cursor = isZoomed ? 'zoom-out' : 'zoom-in';
                this.style.transition = 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
            }
        });
        
        // Establecer cursor inicial en desktop
        if (window.innerWidth > 768) {
            modalPhoto.style.cursor = 'zoom-in';
            modalPhoto.style.transition = 'transform 0.3s ease';
        }
    }
    
    // Optimizar videos cuando cargan
    if (modalVideo) {
        function optimizeVideo() {
            const maxHeight = window.innerWidth > 768 ? '85vh' : '75vh';
            modalVideo.style.maxWidth = '100%';
            modalVideo.style.maxHeight = maxHeight;
            modalVideo.style.width = 'auto';
            modalVideo.style.height = 'auto';
            modalVideo.style.objectFit = 'contain';
        }
        
        modalVideo.addEventListener('loadedmetadata', optimizeVideo);
        modalVideo.addEventListener('loadeddata', optimizeVideo);
    }
    
    // Ajustar tamaños al redimensionar ventana
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            const maxHeight = window.innerWidth > 768 ? '85vh' : '75vh';
            if (modalPhoto && modalPhoto.style.display !== 'none') {
                modalPhoto.style.maxHeight = maxHeight;
                if (isZoomed) {
                    modalPhoto.style.transform = 'scale(1)';
                    isZoomed = false;
                }
                if (window.innerWidth > 768) {
                    modalPhoto.style.cursor = 'zoom-in';
                } else {
                    modalPhoto.style.cursor = 'default';
                }
            }
            if (modalVideo && modalVideo.style.display !== 'none') {
                modalVideo.style.maxHeight = maxHeight;
            }
        }, 250);
    });
    
    // Animación de entrada para las tarjetas
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.6s ease-out forwards';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observar todas las tarjetas de fotos
    photoCards.forEach(card => {
        observer.observe(card);
    });
    
    // Efecto parallax suave en el header
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const header = document.querySelector('.album-header');
        if (header && scrolled < 300) {
            header.style.transform = `translateY(${scrolled * 0.3}px)`;
        }
    });
    
    // Agregar efecto de brillo a las fotos al hacer hover
    photoCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.filter = 'brightness(1.05)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.filter = 'brightness(1)';
        });
    });
});

// Efecto de carga suave para las imágenes y videos
document.addEventListener('DOMContentLoaded', () => {
    const images = document.querySelectorAll('.photo-img');
    images.forEach(img => {
        // Solo procesar si es una imagen, no un video
        if (img.tagName === 'IMG') {
            img.addEventListener('load', function() {
                this.style.opacity = '1';
            });
            
            // Si la imagen ya está cargada
            if (img.complete) {
                img.style.opacity = '1';
            } else {
                img.style.opacity = '0';
                img.style.transition = 'opacity 0.5s ease';
            }
        }
    });
    
    // Configurar thumbnails para videos - mostrar el primer frame
    const videos = document.querySelectorAll('.video-card video');
    videos.forEach(video => {
        // Intentar mostrar el primer frame
        video.addEventListener('loadedmetadata', function() {
            // Establecer el tiempo a un pequeño valor para mostrar el primer frame
            if (this.readyState >= 2) {
                this.currentTime = 0.1;
            }
        });
        
        // Cuando el video puede mostrar el frame, pausarlo
        video.addEventListener('canplay', function() {
            this.pause();
        });
        
        // Prevenir la reproducción automática al hacer hover
        video.addEventListener('mouseenter', function() {
            this.pause();
        });
    });
});


// Animación de entrada para el mensaje final
const messageCard = document.querySelector('.message-card');
if (messageCard) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.8s ease-out forwards';
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });
    
    messageCard.style.opacity = '0';
    messageCard.style.transform = 'translateY(30px)';
    observer.observe(messageCard);
}

