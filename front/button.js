function scrollToPosition(position) {
    const scrollY = window.scrollY;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;

    if (position === 'top') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (position === 'middle') {
        window.scrollTo({ top: documentHeight / 2 - windowHeight / 2, behavior: 'smooth' });
    } else if (position === 'bottom') {
        window.scrollTo({ top: documentHeight - windowHeight, behavior: 'smooth' });
    }
}