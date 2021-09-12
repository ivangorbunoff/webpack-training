function createAnalytics(): object {
    let counter = 0;
    let isDestroyed: boolean = false;

    const listener = (): number => counter++;
    document.addEventListener('click', listener);

    return {
        destroy() {
            document.removeEventListener('click', listener);
            isDestroyed = true;
        },

        getClicks() {
            if (isDestroyed) {
                return `Analytics is destroyed. Total clicks = ${counter}`;
            }
            return counter;
        }
    }
}

window['analitycs'] = createAnalytics();