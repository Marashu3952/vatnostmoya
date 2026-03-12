/**
 * Винтажное Портфолио - JavaScript
 * Функционал: переключение темы, мобильное меню, анимации, форма
 */

document.addEventListener('DOMContentLoaded', () => {
    // Инициализация всех модулей
    initThemeToggle();
    initMobileMenu();
    initScrollAnimations();
    initHeaderScroll();
    initContactForm();
    initSmoothScroll();
});

/**
 * Переключение светлой/тёмной темы
 */
function initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    const html = document.documentElement;
    
    // Проверка сохранённой темы
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        html.setAttribute('data-theme', 'dark');
    }
    
    themeToggle.addEventListener('click', () => {
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        if (newTheme === 'dark') {
            html.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
        } else {
            html.removeAttribute('data-theme');
            localStorage.setItem('theme', 'light');
        }
    });
}

/**
 * Мобильное меню (бургер)
 */
function initMobileMenu() {
    const burger = document.getElementById('burger');
    const nav = document.getElementById('nav');
    const menuLinks = document.querySelectorAll('.header__menu-link');
    
    burger.addEventListener('click', () => {
        burger.classList.toggle('active');
        nav.classList.toggle('active');
        document.body.style.overflow = nav.classList.contains('active') ? 'hidden' : '';
    });
    
    // Закрытие меню при клике на ссылку
    menuLinks.forEach(link => {
        link.addEventListener('click', () => {
            burger.classList.remove('active');
            nav.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
    
    // Закрытие меню при клике вне его
    document.addEventListener('click', (e) => {
        if (!nav.contains(e.target) && !burger.contains(e.target)) {
            burger.classList.remove('active');
            nav.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

/**
 * Анимации при скролле (Intersection Observer)
 */
function initScrollAnimations() {
    const fadeElements = document.querySelectorAll('.fade-in');
    
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -100px 0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    fadeElements.forEach(el => observer.observe(el));
}

/**
 * Эффект шапки при скролле
 */
function initHeaderScroll() {
    const header = document.getElementById('header');
    
    const observerOptions = {
        rootMargin: '-100px 0px 0px 0px',
        threshold: 0
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }, observerOptions);
    
    // Наблюдаем за первым элементом после шапки
    const firstSection = document.querySelector('.about');
    if (firstSection) {
        observer.observe(firstSection);
    }
}

/**
 * Обработка формы контактов
 */
function initContactForm() {
    const form = document.getElementById('contactForm');
    const statusElement = document.getElementById('formStatus');
    
    if (!form) return;
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Сброс предыдущих ошибок
        resetFormErrors();
        
        // Валидация
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        const errors = validateFormData(data);
        
        if (errors.length > 0) {
            showFormErrors(errors);
            return;
        }
        
        // Имитация отправки формы
        const submitBtn = form.querySelector('.contact__btn');
        const originalText = submitBtn.innerHTML;
        
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span>Отправка...</span>';
        
        try {
            // Имитация задержки сети
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Успешная отправка
            statusElement.textContent = 'Спасибо! Ваше сообщение отправлено.';
            statusElement.className = 'contact__status contact__status--success';
            form.reset();
            
            // Очистка статуса через 5 секунд
            setTimeout(() => {
                statusElement.textContent = '';
                statusElement.className = 'contact__status';
            }, 5000);
            
        } catch (error) {
            statusElement.textContent = 'Произошла ошибка. Попробуйте позже.';
            statusElement.className = 'contact__status contact__status--error';
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
        }
    });
    
    // Валидация в реальном времени
    const inputs = form.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', () => {
            validateField(input);
        });
        
        input.addEventListener('input', () => {
            if (input.classList.contains('error')) {
                validateField(input);
            }
        });
    });
}

/**
 * Валидация данных формы
 */
function validateFormData(data) {
    const errors = [];
    
    // Проверка имени
    if (!data.name || data.name.trim().length < 2) {
        errors.push({ field: 'name', message: 'Введите корректное имя (минимум 2 символа)' });
    }
    
    // Проверка email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!data.email || !emailRegex.test(data.email)) {
        errors.push({ field: 'email', message: 'Введите корректный email' });
    }
    
    // Проверка сообщения
    if (!data.message || data.message.trim().length < 10) {
        errors.push({ field: 'message', message: 'Сообщение должно содержать минимум 10 символов' });
    }
    
    return errors;
}

/**
 * Валидация отдельного поля
 */
function validateField(field) {
    const value = field.value.trim();
    let error = '';
    
    switch (field.name) {
        case 'name':
            if (value.length < 2) {
                error = 'Введите корректное имя (минимум 2 символа)';
            }
            break;
        case 'email':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                error = 'Введите корректный email';
            }
            break;
        case 'message':
            if (value.length < 10) {
                error = 'Сообщение должно содержать минимум 10 символов';
            }
            break;
    }
    
    const errorElement = document.getElementById(`${field.name}Error`);
    if (errorElement) {
        errorElement.textContent = error;
    }
    
    if (error) {
        field.classList.add('error');
    } else {
        field.classList.remove('error');
    }
    
    return !error;
}

/**
 * Отображение ошибок формы
 */
function showFormErrors(errors) {
    errors.forEach(({ field, message }) => {
        const input = document.querySelector(`[name="${field}"]`);
        const errorElement = document.getElementById(`${field}Error`);
        
        if (input) {
            input.classList.add('error');
        }
        
        if (errorElement) {
            errorElement.textContent = message;
        }
    });
}

/**
 * Сброс ошибок формы
 */
function resetFormErrors() {
    const errorInputs = document.querySelectorAll('.contact__input.error, .contact__textarea.error');
    const errorMessages = document.querySelectorAll('.contact__error');
    
    errorInputs.forEach(input => input.classList.remove('error'));
    errorMessages.forEach(el => el.textContent = '');
}

/**
 * Плавный скролл по якорным ссылкам
 */
function initSmoothScroll() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            
            if (href === '#') return;
            
            const target = document.querySelector(href);
            
            if (target) {
                e.preventDefault();
                
                const headerHeight = document.getElementById('header').offsetHeight;
                const targetPosition = target.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}
