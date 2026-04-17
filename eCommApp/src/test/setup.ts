import '@testing-library/jest-dom'

// Global test setup for all tests

// Mock HTMLDialogElement methods not supported by jsdom
HTMLDialogElement.prototype.showModal = HTMLDialogElement.prototype.showModal || function (this: HTMLDialogElement) {
    this.setAttribute('open', '');
};
HTMLDialogElement.prototype.close = HTMLDialogElement.prototype.close || function (this: HTMLDialogElement) {
    this.removeAttribute('open');
};