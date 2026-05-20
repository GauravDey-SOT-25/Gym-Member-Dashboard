/**
 * Theme Module
 * Handles dark/light/system theme toggling and accent color selection.
 */

import { showToast } from './ui.js';

export const initThemeToggle = () => {
    const themeToggle = document.getElementById('theme-toggle');
    const themeCards = document.querySelectorAll('.theme-card');
    const htmlEl = document.documentElement;

    // Topbar Theme Toggle
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = htmlEl.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            htmlEl.setAttribute('data-theme', newTheme);
            
            // Update icon
            const icon = themeToggle.querySelector('i');
            if (newTheme === 'light') {
                icon.classList.remove('ph-moon');
                icon.classList.add('ph-sun');
            } else {
                icon.classList.remove('ph-sun');
                icon.classList.add('ph-moon');
            }

            // Sync with theme cards in Appearance settings
            syncThemeCards(newTheme, themeCards);
        });
    }

    // Appearance Settings Theme Cards
    themeCards.forEach(card => {
        card.addEventListener('click', () => {
            themeCards.forEach(c => c.classList.remove('active'));
            card.classList.add('active');
            
            const themeName = card.querySelector('span').textContent.toLowerCase();
            if (themeName === 'dark' || themeName === 'light') {
                htmlEl.setAttribute('data-theme', themeName);
                
                // Sync topbar icon
                if (themeToggle) {
                    const icon = themeToggle.querySelector('i');
                    if (themeName === 'light') {
                        icon.classList.remove('ph-moon');
                        icon.classList.add('ph-sun');
                    } else {
                        icon.classList.remove('ph-sun');
                        icon.classList.add('ph-moon');
                    }
                }
            } else if (themeName === 'system') {
                // Basic system preference check
                const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
                htmlEl.setAttribute('data-theme', prefersLight ? 'light' : 'dark');
            }
        });
    });
};

function syncThemeCards(theme, themeCards) {
    themeCards.forEach(card => {
        card.classList.remove('active');
        if (card.querySelector('span').textContent.toLowerCase() === theme) {
            card.classList.add('active');
        }
    });
}

export const initColorSwatches = () => {
    const colorSwatches = document.querySelectorAll('.color-swatch');

    colorSwatches.forEach(swatch => {
        swatch.addEventListener('click', () => {
            colorSwatches.forEach(s => s.classList.remove('active'));
            swatch.classList.add('active');
            
            let newColor = '#D9FF00'; // Default Lime
            if (swatch.classList.contains('purple')) newColor = '#9D4EDD';
            if (swatch.classList.contains('blue')) newColor = '#00B4D8';
            if (swatch.classList.contains('orange')) newColor = '#FF7900';
            
            document.documentElement.style.setProperty('--accent-primary', newColor);
            
            showToast('Accent color updated.');
        });
    });
};
