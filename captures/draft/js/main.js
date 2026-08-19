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
    $(window).on('load', function () {
        setTimeout(function () {
            $loader.addClass('loaded');
            initHeroReveal();
        }, 1200);
    });

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
       COUNTER ANIMATION (About Stats)
       =========================== */
    function initCounters() {
        var counted = false;
        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting && !counted) {
                    counted = true;
                    $('.stat-num').each(function () {
                        var $this = $(this);
                        var target = parseInt($this.data('count'));
                        $({ count: 0 }).animate({ count: target }, {
                            duration: 2000,
                            easing: 'swing',
                            step: function () {
                                $this.text(Math.floor(this.count));
                            },
                            complete: function () {
                                $this.text(target);
                            }
                        });
                    });
                }
            });
        }, { threshold: 0.5 });

        var statsEl = document.querySelector('.about-stats');
        if (statsEl) observer.observe(statsEl);
    }

    initCounters();

    /* ===========================
       DESTINATION FILTER
       =========================== */
    $('.filter-btn').on('click', function () {
        var $this = $(this);
        var filter = $this.data('filter');

        $('.filter-btn').removeClass('active');
        $this.addClass('active');

        var $cards = $('.dest-card');

        if (filter === 'all') {
            $cards.each(function (i) {
                var $card = $(this);
                $card.stop(true);
                setTimeout(function () {
                    $card.removeClass('filter-hidden')
                         .css({ opacity: 0, transform: 'translateY(20px)' })
                         .animate({ opacity: 1 }, 400);
                    $card[0].style.transform = 'translateY(0)';
                }, i * 80);
            });
        } else {
            $cards.each(function (i) {
                var $card = $(this);
                $card.stop(true);
                if ($card.data('category') === filter) {
                    setTimeout(function () {
                        $card.removeClass('filter-hidden')
                             .css({ opacity: 0, transform: 'translateY(20px)' })
                             .animate({ opacity: 1 }, 400);
                        $card[0].style.transform = 'translateY(0)';
                    }, i * 80);
                } else {
                    $card.animate({ opacity: 0 }, 200, function () {
                        $card.addClass('filter-hidden');
                    });
                }
            });
        }
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
       PARALLAX (Hero)
       =========================== */
    function handleParallax() {
        var scroll = $window.scrollTop();
        var heroHeight = $('#hero').outerHeight();

        if (scroll < heroHeight) {
            var opacity = 1 - (scroll / heroHeight) * 0.8;
            var translateY = scroll * 0.3;
            $('.hero-content').css({
                opacity: opacity,
                transform: 'translateY(' + translateY + 'px)'
            });
        }
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