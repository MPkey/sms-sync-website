'use strict';

document.addEventListener('DOMContentLoaded', () => {
    initMobileNavigation();
    initJoinForm();
    initGalleryFilter();
});

/**
 * Steuert das Ein- und Ausklappen der Navigation auf mobilen Endgeräten.
 */
function initMobileNavigation() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navList = document.querySelector('.nav-list');

    if (!menuToggle || !navList) {
        return;
    }

    menuToggle.addEventListener('click', () => {
        const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
        menuToggle.setAttribute('aria-expanded', String(!isExpanded));
        navList.classList.toggle('is-open');
    });
}

/**
 * Validiert die Probetraining-Anfrage, erzeugt eine Zusammenfassung
 * und erstellt einen vorausgefüllten E-Mail-Link an die Gruppen-E-Mail.
 */
function initJoinForm() {
    const joinForm = document.getElementById('join-form');
    const resultBox = document.getElementById('form-result');

    if (!joinForm || !resultBox) {
        return;
    }

    joinForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const crewEmail = joinForm.getAttribute('data-crew-email') || 'mail.sms.offical2024@gmx.de';

        const formData = {
            name: document.getElementById('applicant-name').value.trim(),
            age: Number(document.getElementById('applicant-age').value),
            email: document.getElementById('applicant-email').value.trim(),
            experience: document.getElementById('dance-experience').value,
            message: document.getElementById('applicant-message').value.trim(),
            consent: document.getElementById('privacy-consent').checked
        };

        const isValid = validateFormFields(formData);

        if (!isValid) {
            resultBox.hidden = true;
            return;
        }

        renderSubmissionSummary(resultBox, formData, crewEmail);
        joinForm.reset();
    });
}

function validateFormFields(data) {
    let isFormValid = true;

    if (data.name.length < 2) {
        setFieldError('applicant-name', 'error-name', 'Bitte gib deinen vollständigen Namen ein (mind. 2 Zeichen).');
        isFormValid = false;
    } else {
        clearFieldError('applicant-name', 'error-name');
    }

    if (!data.age || data.age < 12 || data.age > 99) {
        setFieldError('applicant-age', 'error-age', 'Bitte gib ein gültiges Alter zwischen 12 und 99 Jahren an.');
        isFormValid = false;
    } else {
        clearFieldError('applicant-age', 'error-age');
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(data.email)) {
        setFieldError('applicant-email', 'error-email', 'Bitte gib eine gültige E-Mail-Adresse ein.');
        isFormValid = false;
    } else {
        clearFieldError('applicant-email', 'error-email');
    }

    if (data.experience === '') {
        setFieldError('dance-experience', 'error-experience', 'Bitte wähle dein aktuelles Erfahrungslevel aus.');
        isFormValid = false;
    } else {
        clearFieldError('dance-experience', 'error-experience');
    }

    if (!data.consent) {
        setFieldError('privacy-consent', 'error-consent', 'Bitte bestätige die Datenschutzerklärung, um fortzufahren.');
        isFormValid = false;
    } else {
        clearFieldError('privacy-consent', 'error-consent');
    }

    return isFormValid;
}

function setFieldError(inputId, errorId, message) {
    const inputElement = document.getElementById(inputId);
    const errorElement = document.getElementById(errorId);
    if (inputElement) {
        inputElement.classList.add('input-error');
        inputElement.setAttribute('aria-invalid', 'true');
    }
    if (errorElement) {
        errorElement.textContent = message;
    }
}

function clearFieldError(inputId, errorId) {
    const inputElement = document.getElementById(inputId);
    const errorElement = document.getElementById(errorId);
    if (inputElement) {
        inputElement.classList.remove('input-error');
        inputElement.removeAttribute('aria-invalid');
    }
    if (errorElement) {
        errorElement.textContent = '';
    }
}

function renderSubmissionSummary(container, data, crewEmail) {
    container.innerHTML = '';

    const heading = document.createElement('h3');
    heading.textContent = `Danke für deine Probetraining-Anfrage, ${data.name}!`;

    const intro = document.createElement('p');
    intro.textContent = `Deine Angaben wurden geprüft. Klicke auf den Button unten, um deine Anfrage direkt an ${crewEmail} zu senden:`;

    const list = document.createElement('ul');
    list.className = 'summary-list';

    const entries = [
        `Name: ${data.name}`,
        `Alter: ${data.age} Jahre`,
        `E-Mail: ${data.email}`,
        `Erfahrung: ${data.experience}`,
        `Nachricht: ${data.message || 'Keine zusätzliche Nachricht angegeben'}`
    ];

    entries.forEach((entryText) => {
        const listItem = document.createElement('li');
        listItem.textContent = entryText;
        list.appendChild(listItem);
    });

    const subject = encodeURIComponent(`Probetraining-Anfrage von ${data.name}`);
    const body = encodeURIComponent(
        `Hallo SMS Sync Team,\n\n` +
        `ich möchte gerne ein Probetraining bei euch anfragen:\n\n` +
        `Name: ${data.name}\n` +
        `Alter: ${data.age}\n` +
        `E-Mail: ${data.email}\n` +
        `Tanzerfahrung: ${data.experience}\n` +
        `Nachricht: ${data.message || '-'}\n\n` +
        `Viele Grüße\n${data.name}`
    );

    const mailLink = document.createElement('a');
    mailLink.href = `mailto:${crewEmail}?subject=${subject}&body=${body}`;
    mailLink.className = 'btn btn-primary';
    mailLink.textContent = 'Jetzt an Gruppen-E-Mail senden';

    container.append(heading, intro, list, mailLink);
    container.hidden = false;
    container.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

/**
 * Filtert die Galerie-Karten nach der gewählten Kategorie.
 */
function initGalleryFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryCards = document.querySelectorAll('.gallery-card');

    if (filterButtons.length === 0 || galleryCards.length === 0) {
        return;
    }

    filterButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const selectedCategory = button.getAttribute('data-filter');

            filterButtons.forEach((btn) => {
                btn.classList.remove('active');
                btn.setAttribute('aria-pressed', 'false');
            });
            button.classList.add('active');
            button.setAttribute('aria-pressed', 'true');

            galleryCards.forEach((card) => {
                const cardCategory = card.getAttribute('data-category');
                const shouldShow = selectedCategory === 'all' || cardCategory === selectedCategory;
                card.classList.toggle('is-hidden', !shouldShow);
            });
        });
    });
}