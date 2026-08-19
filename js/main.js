/* ===================================================
   DEEP TRAIL — Main Script
   jQuery + Vanilla JS
   =================================================== */

$(function () {

    /* --- Variables --- */
    var $window = $(window);
    var $body = $('body');
    var $header = $('#header');
    var $loader = $('#loader');
    var $scrollProgress = $('#scrollProgress');
    var $topBtn = $('#topBtn');
    var scrollThreshold = 60;

    /* ===========================
       LOADER
       =========================== */
    if (document.readyState === 'complete') {
        setTimeout(function () {
            $loader.addClass('loaded');
            initHeroReveal();
        }, 1200);
    } else {
        $(window).on('load', function () {
            setTimeout(function () {
                $loader.addClass('loaded');
                initHeroReveal();
            }, 1200);
        });
    }

    /* ===========================
       HERO REVEAL (after loader)
       =========================== */
    function initHeroReveal() {
        $('#hero .reveal').each(function (i) {
            var $el = $(this);
            setTimeout(function () {
                $el.addClass('revealed');
            }, i * 200 + 300);
        });
    }

    /* ===========================
       HERO PARTICLES
       =========================== */
    (function createParticles() {
        var $container = $('#heroParticles');
        var count = 30;
        for (var i = 0; i < count; i++) {
            var size = Math.random() * 2 + 1;
            var left = Math.random() * 100;
            var dur = Math.random() * 10 + 6;
            var delay = Math.random() * 10;
            var opacity = Math.random() * 0.4 + 0.1;

            $('<span class="hero-particle"></span>')
                .css({
                    width: size + 'px',
                    height: size + 'px',
                    left: left + '%',
                    bottom: '-5%',
                    '--dur': dur + 's',
                    '--del': delay + 's',
                    opacity: opacity
                })
                .appendTo($container);
        }
    })();

    /* ===========================
       HEADER SCROLL EFFECT
       =========================== */
    function handleHeaderScroll() {
        if ($window.scrollTop() > scrollThreshold) {
            $header.addClass('scrolled');
        } else {
            $header.removeClass('scrolled');
        }
    }

    /* ===========================
       SCROLL PROGRESS BAR
       =========================== */
    function handleScrollProgress() {
        var scrollTop = $window.scrollTop();
        var docHeight = $(document).height() - $window.height();
        var progress = (scrollTop / docHeight) * 100;
        $scrollProgress.css('width', progress + '%');
    }

    /* ===========================
       TOP BUTTON
       =========================== */
    function handleTopButton() {
        if ($window.scrollTop() > 600) {
            $topBtn.addClass('visible');
        } else {
            $topBtn.removeClass('visible');
        }
    }

    $topBtn.on('click', function () {
        $('html, body').animate({ scrollTop: 0 }, 800, 'swing');
    });

    /* ===========================
       SCROLL REVEAL (Intersection Observer)
       =========================== */
    function initScrollReveal() {
        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    var $el = $(entry.target);
                    var delay = parseFloat($el.css('--delay') || $el.attr('style')?.match(/--delay:\s*([\d.]+)s/)?.[1] || 0) * 1000;

                    setTimeout(function () {
                        $el.addClass('revealed');
                    }, delay);

                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: '0px 0px -60px 0px'
        });

        $('.reveal').not('#hero .reveal').each(function () {
            observer.observe(this);
        });
    }

    initScrollReveal();

    /* ===========================
       REVIEW CAROUSEL (center focus)
       =========================== */
    (function initReviewCarousel() {
        var $track = $('#reviewTrack');
        var $slides = $track.find('.review-slide');
        var $dots = $('#reviewDots');
        var current = 0;
        var total = $slides.length;

        $slides.eq(0).addClass('active');

        for (var i = 0; i < total; i++) {
            $dots.append('<span class="review-dot' + (i === 0 ? ' active' : '') + '" data-index="' + i + '"></span>');
        }

        function goTo(index) {
            if (index < 0) index = total - 1;
            if (index >= total) index = 0;
            current = index;

            $track.css('transform', 'translateX(-' + (current * 100) + '%)');
            $slides.removeClass('active');
            $slides.eq(current).addClass('active');
            $dots.find('.review-dot').removeClass('active');
            $dots.find('.review-dot[data-index="' + current + '"]').addClass('active');
        }

        $('.review-prev').on('click', function () { goTo(current - 1); });
        $('.review-next').on('click', function () { goTo(current + 1); });

        $dots.on('click', '.review-dot', function () {
            goTo($(this).data('index'));
        });

        var startX = 0;
        var isDragging = false;
        $track.on('touchstart', function (e) {
            startX = e.originalEvent.touches[0].clientX;
            isDragging = true;
        }).on('touchend', function (e) {
            if (!isDragging) return;
            var diff = startX - e.originalEvent.changedTouches[0].clientX;
            if (Math.abs(diff) > 50) {
                diff > 0 ? goTo(current + 1) : goTo(current - 1);
            }
            isDragging = false;
        });
    })();

    /* ===========================
       DESTINATION TRACK (horizontal scroll)
       =========================== */
    (function initDestTrack() {
        var $track = $('#destTrack');
        var $indicator = $('#trackIndicator');
        var $cards = $track.find('.dest-card').not('.filter-hidden');
        var cardCount = $cards.length;
        var visibleCount = 3;

        function getVisibleCount() {
            var w = window.innerWidth;
            if (w <= 768) return 1;
            if (w <= 1024) return 2;
            return 3;
        }

        function buildDots() {
            $indicator.empty();
            visibleCount = getVisibleCount();
            var dotCount = Math.max(1, cardCount - visibleCount + 1);
            for (var i = 0; i < dotCount; i++) {
                $indicator.append('<span class="track-dot' + (i === 0 ? ' active' : '') + '" data-index="' + i + '"></span>');
            }
        }

        function updateDots() {
            var scrollLeft = $track[0].scrollLeft;
            var cardWidth = $cards.first().outerWidth(true);
            var activeIndex = Math.round(scrollLeft / cardWidth);
            $indicator.find('.track-dot').removeClass('active');
            $indicator.find('.track-dot[data-index="' + activeIndex + '"]').addClass('active');

            var maxScroll = $track[0].scrollWidth - $track[0].clientWidth;
            $('.track-prev').toggleClass('disabled', scrollLeft <= 10);
            $('.track-next').toggleClass('disabled', scrollLeft >= maxScroll - 10);
        }

        buildDots();

        $track.on('scroll', function () {
            requestAnimationFrame(updateDots);
        });

        $indicator.on('click', '.track-dot', function () {
            var index = $(this).data('index');
            var cardWidth = $cards.first().outerWidth(true);
            $track[0].scrollTo({ left: cardWidth * index, behavior: 'smooth' });
        });

        $('.track-prev').on('click', function () {
            var cardWidth = $cards.first().outerWidth(true);
            $track[0].scrollBy({ left: -cardWidth, behavior: 'smooth' });
        });

        $('.track-next').on('click', function () {
            var cardWidth = $cards.first().outerWidth(true);
            $track[0].scrollBy({ left: cardWidth, behavior: 'smooth' });
        });

        $(window).on('resize', function () {
            buildDots();
            updateDots();
        });

        setTimeout(updateDots, 100);
    })();

    /* ===========================
       DESTINATION FILTER
       =========================== */
    $('.filter-btn').on('click', function () {
        var $this = $(this);
        var filter = $this.data('filter');
        var $track = $('#destTrack');

        $('.filter-btn').removeClass('active');
        $this.addClass('active');

        var $cards = $track.find('.dest-card');

        $cards.each(function () {
            var $card = $(this);
            $card.stop(true);

            if (filter === 'all' || $card.data('category') === filter) {
                $card.removeClass('filter-hidden').css({ opacity: 0 }).animate({ opacity: 1 }, 400);
            } else {
                $card.animate({ opacity: 0 }, 200, function () {
                    $card.addClass('filter-hidden');
                });
            }
        });

        $track[0].scrollTo({ left: 0, behavior: 'smooth' });
    });

    /* ===========================
       SMOOTH SCROLL (GNB Links)
       =========================== */
    $('a[href^="#"]').on('click', function (e) {
        var target = $(this.getAttribute('href'));
        if (target.length) {
            e.preventDefault();
            var offset = $header.outerHeight() + 20;
            $('html, body').animate({
                scrollTop: target.offset().top - offset
            }, 800, 'swing');

            if ($('.nav-menu').hasClass('open')) {
                $('.nav-menu').removeClass('open');
                $('.mobile-toggle').removeClass('active');
            }
        }
    });

    /* ===========================
       ACTIVE NAV LINK ON SCROLL
       =========================== */
    function handleActiveNav() {
        var scrollPos = $window.scrollTop() + 200;
        var sections = ['#about', '#destinations', '#services', '#reviews'];

        sections.forEach(function (id) {
            var $section = $(id);
            if ($section.length) {
                var top = $section.offset().top - $header.outerHeight() - 40;
                var bottom = top + $section.outerHeight();
                var linkHref = 'a[href="' + id + '"]';

                if (scrollPos >= top && scrollPos < bottom) {
                    $('.nav-link').removeClass('active');
                    $(linkHref).addClass('active');
                }
            }
        });
    }

    /* ===========================
       MOBILE MENU TOGGLE
       =========================== */
    $('.mobile-toggle').on('click', function () {
        $(this).toggleClass('active');
        $('.nav-menu').toggleClass('open');
    });

    /* ===========================
       PARALLAX (Hero + Visual Breaks)
       =========================== */
    function handleParallax() {
        var scroll = $window.scrollTop();
        var heroHeight = $('#hero').outerHeight();
        var winH = $window.height();

        if (scroll < heroHeight) {
            var opacity = 1 - (scroll / heroHeight) * 0.8;
            var translateY = scroll * 0.3;
            $('.hero-content').css({
                opacity: opacity,
                transform: 'translateY(' + translateY + 'px)'
            });
        }

        $('[data-parallax]').each(function () {
            var $el = $(this);
            var $bg = $el.find('.visual-break-bg');
            var rect = this.getBoundingClientRect();

            if (rect.bottom > 0 && rect.top < winH) {
                var progress = (winH - rect.top) / (winH + rect.height);
                var offset = (progress - 0.5) * 60;
                $bg.css('transform', 'translateY(' + offset + 'px)');
            }
        });
    }

    /* ===========================
       DEST CARD TILT (3D)
       =========================== */
    if (window.innerWidth > 768) {
        $('.dest-card').on('mousemove', function (e) {
            var $card = $(this);
            var rect = this.getBoundingClientRect();
            var x = e.clientX - rect.left;
            var y = e.clientY - rect.top;
            var centerX = rect.width / 2;
            var centerY = rect.height / 2;
            var rotateX = ((y - centerY) / centerY) * -4;
            var rotateY = ((x - centerX) / centerX) * 4;

            $card.css('transform', 'perspective(1000px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) translateY(-8px)');
        }).on('mouseleave', function () {
            $(this).css('transform', 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)');
        });
    }

    /* ===========================
       HERO CLICK RIPPLE
       =========================== */
    $(document).on('click', function (e) {
        var $ripple = $('<span class="click-ripple"></span>').css({
            left: e.pageX + 'px',
            top: e.pageY + 'px'
        });

        $body.append($ripple);

        $ripple.on('animationend', function () {
            $ripple.remove();
        });
    });

    /* ===========================
       SCROLL EVENT (Throttled)
       =========================== */
    var scrollTicking = false;

    $window.on('scroll', function () {
        if (!scrollTicking) {
            window.requestAnimationFrame(function () {
                handleHeaderScroll();
                handleScrollProgress();
                handleTopButton();
                handleActiveNav();
                handleParallax();
                scrollTicking = false;
            });
            scrollTicking = true;
        }
    });

    handleHeaderScroll();

});