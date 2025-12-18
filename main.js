
    AOS.init({duration:800, once:true});

    // Smooth scroll + active menu on click
    $('a.nav-link[href^="#"]').on('click', function(e){
    e.preventDefault();

    const targetId = $(this).attr('href');
    const target = $(targetId);

    // set active immediately
    $('.nav-link').removeClass('active');
    $(this).addClass('active');

    if(target.length){
    $('html, body').stop().animate({
    scrollTop: target.offset().top - ($('.top-menu').outerHeight() + 20)
}, 600);
}
});

    // Toggle section
    $('.section-title').on('click', function(){
    const section = $(this).closest('.collapsible');
    const body = section.find('.section-body');

    body.slideToggle(300);
    section.toggleClass('section-collapsed');
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
    $('#openSidebar').on('click', function(){
    $('#mobileSidebar, #mobileOverlay').addClass('active');
});
    $('#closeSidebar, #mobileOverlay').on('click', function(){
    $('#mobileSidebar, #mobileOverlay').removeClass('active');
});