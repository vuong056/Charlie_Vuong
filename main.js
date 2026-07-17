
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!prefersReducedMotion && window.AOS) {
        AOS.init({duration: 600, once: true});
    }

    // Smooth scroll + active menu on click
    $('a.nav-link[href^="#"]').on('click', function(e){
    e.preventDefault();

    const targetId = $(this).attr('href');
    const target = $(targetId);

    // set active immediately
    $('.nav-link').removeClass('active');
    $(this).addClass('active');

    if(target.length){
        const scrollTop = target.offset().top - ($('.top-menu').outerHeight() + 20);
        if (prefersReducedMotion) {
            window.scrollTo(0, scrollTop);
        } else {
            $('html, body').stop().animate({scrollTop}, 450);
        }
    }
});

    // Toggle section
    function toggleSection(title) {
    const section = title.closest('.collapsible');
    const body = section.find('.section-body');
    const isExpanded = title.attr('aria-expanded') === 'true';

    if (prefersReducedMotion) {
        body.toggle(!isExpanded);
    } else {
        body.stop(true, true).slideToggle(250);
    }
    section.toggleClass('section-collapsed', isExpanded);
    title.attr('aria-expanded', String(!isExpanded));
}

    $('.section-title').on('click', function(){
    toggleSection($(this));
}).on('keydown', function(event){
    if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        toggleSection($(this));
    }
});

    // Active menu on scroll
    const sections = $('section[id]');
    const navLinks = $('.nav-link');

    $(window).on('scroll', function(){
    const scrollPos = $(document).scrollTop() + 120;

    sections.each(function(){
    const top = $(this).offset().top;
    const bottom = top + $(this).outerHeight();
    const id = $(this).attr('id');

    if(scrollPos >= top && scrollPos <= bottom){
    navLinks.removeClass('active');
    $('.nav-link[href="#' + id + '"]').addClass('active');
}
});
});

    // Mobile sidebar toggle
    const openSidebar = $('#openSidebar');
    const mobileSidebar = $('#mobileSidebar');
    const mobileOverlay = $('#mobileOverlay');

    $('#openSidebar').on('click', function(){
    mobileSidebar.add(mobileOverlay).addClass('active');
    mobileSidebar.attr('aria-hidden', 'false');
    openSidebar.attr('aria-expanded', 'true');
    $('body').css('overflow', 'hidden');
    $('#closeSidebar').trigger('focus');
});
    $('#closeSidebar, #mobileOverlay').on('click', function(){
    mobileSidebar.add(mobileOverlay).removeClass('active');
    mobileSidebar.attr('aria-hidden', 'true');
    openSidebar.attr('aria-expanded', 'false');
    $('body').css('overflow', '');
    openSidebar.trigger('focus');
});

    $(document).on('keydown', function(event){
    if (event.key === 'Escape' && mobileSidebar.hasClass('active')) {
        $('#closeSidebar').trigger('click');
    }
});