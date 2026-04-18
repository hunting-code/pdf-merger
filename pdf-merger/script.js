// ============================================
// MergeFlow - PDF & Image Merger
// ============================================

// State
let files = [];
let draggedItem = null;

// DOM Elements
const dropzone = document.getElementById('dropzone');
const fileInput = document.getElementById('file-input');
const fileListContainer = document.getElementById('file-list-container');
const fileList = document.getElementById('file-list');
const fileCount = document.getElementById('file-count');
const mergeBtn = document.getElementById('merge-btn');
const clearAllBtn = document.getElementById('clear-all');
const sortFilesBtn = document.getElementById('sort-files');
const progressContainer = document.getElementById('progress-container');
const progressFill = document.getElementById('progress-fill');
const progressPercent = document.getElementById('progress-percent');
const themeToggle = document.getElementById('theme-toggle');
const toastContainer = document.getElementById('toast-container');
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const mobileMenu = document.querySelector('.mobile-menu');
const navLinks = document.querySelectorAll('.nav-link');
const faqItems = document.querySelectorAll('.faq-item');

// ============================================
// Initialization
// ============================================

function init() {
    setupEventListeners();
    loadTheme();
    setupSmoothScroll();
}

// ============================================
// Event Listeners
// ============================================

function setupEventListeners() {
    // Dropzone events
    dropzone.addEventListener('click', () => fileInput.click());
    dropzone.addEventListener('dragover', handleDragOver);
    dropzone.addEventListener('dragleave', handleDragLeave);
    dropzone.addEventListener('drop', handleDrop);
    fileInput.addEventListener('change', handleFileSelect);

    // Merge button
    mergeBtn.addEventListener('click', mergeFiles);

    // Clear all
    clearAllBtn.addEventListener('click', clearAllFiles);

    // Sort files
    sortFilesBtn.addEventListener('click', sortFilesAlphabetically);

    // Theme toggle
    themeToggle.addEventListener('click', toggleTheme);

    // Mobile menu
    mobileMenuBtn.addEventListener('click', toggleMobileMenu);

    // FAQ accordion
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => toggleFaq(item));
    });

    // Nav link active state
    setupNavScrollSpy();
}

// ============================================
// File Handling
// ============================================

function handleDragOver(e) {
    e.preventDefault();
    dropzone.classList.add('drag-over');
}

function handleDragLeave(e) {
    e.preventDefault();
    dropzone.classList.remove('drag-over');
}

function handleDrop(e) {
    e.preventDefault();
    dropzone.classList.remove('drag-over');

    const droppedFiles = Array.from(e.dataTransfer.files);
    processFiles(droppedFiles);
}

function handleFileSelect(e) {
    const selectedFiles = Array.from(e.target.files);
    processFiles(selectedFiles);
    fileInput.value = ''; // Reset for re-selection
}

async function processFiles(newFiles) {
    const validTypes = [
        'application/pdf',
        'image/png',
        'image/jpeg',
        'image/jpg',
        'image/webp'
    ];

    const maxSize = 50 * 1024 * 1024; // 50MB

    for (const file of newFiles) {
        // Check file size
        if (file.size > maxSize) {
            showToast('error', 'File Too Large', `${file.name} exceeds 50MB limit`);
            continue;
        }

        // Check file type
        if (!validTypes.includes(file.type)) {
            showToast('warning', 'Unsupported Format', `${file.name} is not a PDF or image`);
            continue;
        }

        // Check for duplicates
        if (files.some(f => f.name === file.name && f.size === file.size)) {
            showToast('warning', 'Duplicate File', `${file.name} is already added`);
            continue;
        }

        // Add file
        const fileData = {
            id: Date.now() + Math.random(),
            file: file,
            name: file.name,
            size: formatFileSize(file.size),
            type: getFileType(file.type),
            icon: file.type === 'application/pdf' ? 'pdf' : 'image'
        };

        files.push(fileData);
    }

    updateFileList();
}

function getFileType(mimeType) {
    if (mimeType === 'application/pdf') return 'PDF';
    if (mimeType.includes('png')) return 'PNG';
    if (mimeType.includes('jpeg') || mimeType.includes('jpg')) return 'JPG';
    if (mimeType.includes('webp')) return 'WEBP';
    return 'File';
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// ============================================
// File List UI
// ============================================

function updateFileList() {
    if (files.length === 0) {
        fileListContainer.style.display = 'none';
        mergeBtn.disabled = true;
        return;
    }

    fileListContainer.style.display = 'block';
    fileCount.textContent = files.length;
    mergeBtn.disabled = false;

    renderFileList();
}

function renderFileList() {
    fileList.innerHTML = files.map((fileData, index) => `
        <div class="file-item" draggable="true" data-id="${fileData.id}" data-index="${index}">
            <div class="file-icon ${fileData.icon}">
                ${getFileIcon(fileData.icon)}
            </div>
            <div class="file-info">
                <div class="file-name">${escapeHtml(fileData.name)}</div>
                <div class="file-size">${fileData.size}</div>
            </div>
            <button class="file-remove" data-id="${fileData.id}" title="Remove file">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="18" y1="6" x2="6" y2="18"/>
                    <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
            </button>
        </div>
    `).join('');

    // Add drag and drop listeners to file items
    setupFileItemListeners();
}

function getFileIcon(type) {
    if (type === 'pdf') {
        return `
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
                <polyline points="10 9 9 9 8 9"/>
            </svg>
        `;
    }
    return `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
            <circle cx="8.5" cy="8.5" r="1.5"/>
            <polyline points="21 15 16 10 5 21"/>
        </svg>
    `;
}

function setupFileItemListeners() {
    // Remove buttons
    document.querySelectorAll('.file-remove').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = parseFloat(e.currentTarget.dataset.id);
            removeFile(id);
        });
    });

    // Drag and drop for reordering
    document.querySelectorAll('.file-item').forEach(item => {
        item.addEventListener('dragstart', handleItemDragStart);
        item.addEventListener('dragend', handleItemDragEnd);
        item.addEventListener('dragover', handleItemDragOver);
        item.addEventListener('drop', handleItemDrop);
        item.addEventListener('dragleave', handleItemDragLeave);
    });
}

function removeFile(id) {
    files = files.filter(f => f.id !== id);
    updateFileList();
    showToast('success', 'File Removed', 'The file has been removed from the list');
}

function clearAllFiles() {
    if (files.length === 0) return;

    files = [];
    updateFileList();
    showToast('success', 'All Files Cleared', 'The file list has been reset');
}

function sortFilesAlphabetically() {
    files.sort((a, b) => a.name.localeCompare(b.name));
    updateFileList();
    showToast('success', 'Files Sorted', 'Files are now sorted alphabetically');
}

// ============================================
// Drag and Drop Reordering
// ============================================

function handleItemDragStart(e) {
    draggedItem = this;
    this.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', this.dataset.index);
}

function handleItemDragEnd(e) {
    this.classList.remove('dragging');
    document.querySelectorAll('.file-item').forEach(item => {
        item.classList.remove('drag-over');
    });
    draggedItem = null;
}

function handleItemDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (this !== draggedItem) {
        this.classList.add('drag-over');
    }
}

function handleItemDrop(e) {
    e.preventDefault();
    this.classList.remove('drag-over');

    if (this === draggedItem) return;

    const fromIndex = parseInt(draggedItem.dataset.index);
    const toIndex = parseInt(this.dataset.index);

    // Reorder array
    const [movedItem] = files.splice(fromIndex, 1);
    files.splice(toIndex, 0, movedItem);

    updateFileList();
}

function handleItemDragLeave(e) {
    this.classList.remove('drag-over');
}

// ============================================
// PDF Merging
// ============================================

async function mergeFiles() {
    if (files.length === 0) {
        showToast('warning', 'No Files', 'Please add files to merge first');
        return;
    }

    // Show progress
    progressContainer.style.display = 'block';
    mergeBtn.disabled = true;

    try {
        const { PDFDocument } = PDFLib;
        const mergedPdf = await PDFDocument.create();

        let completed = 0;
        const total = files.length;

        for (const fileData of files) {
            const file = fileData.file;

            if (file.type === 'application/pdf') {
                // Handle PDF files
                const arrayBuffer = await file.arrayBuffer();
                const pdf = await PDFDocument.load(arrayBuffer);
                const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
                copiedPages.forEach(page => mergedPdf.addPage(page));
            } else {
                // Handle image files
                const arrayBuffer = await file.arrayBuffer();
                let image;

                if (file.type.includes('png')) {
                    image = await mergedPdf.embedPng(arrayBuffer);
                } else if (file.type.includes('jpeg') || file.type.includes('jpg')) {
                    image = await mergedPdf.embedJpg(arrayBuffer);
                } else if (file.type.includes('webp')) {
                    // Convert WEBP to PNG
                    const bitmap = await createImageBitmap(file);
                    const canvas = document.createElement('canvas');
                    canvas.width = bitmap.width;
                    canvas.height = bitmap.height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(bitmap, 0, 0);
                    const pngDataUrl = canvas.toDataURL('image/png');
                    const pngArrayBuffer = await fetch(pngDataUrl).then(r => r.arrayBuffer());
                    image = await mergedPdf.embedPng(pngArrayBuffer);
                }

                // Add image as a new page
                const page = mergedPdf.addPage([image.width, image.height]);
                page.drawImage(image, {
                    x: 0,
                    y: 0,
                    width: image.width,
                    height: image.height,
                });
            }

            completed++;
            const percent = Math.round((completed / total) * 100);
            updateProgress(percent);
        }

        // Serialize and download
        const pdfBytes = await mergedPdf.save();
        downloadPdf(pdfBytes);

        showToast('success', 'Merge Complete!', 'Your PDF has been created successfully');

        // Reset
        setTimeout(() => {
            progressContainer.style.display = 'none';
            updateProgress(0);
            mergeBtn.disabled = false;
        }, 1000);

    } catch (error) {
        console.error('Merge error:', error);
        showToast('error', 'Merge Failed', 'An error occurred while merging files');
        progressContainer.style.display = 'none';
        updateProgress(0);
        mergeBtn.disabled = false;
    }
}

function updateProgress(percent) {
    progressFill.style.width = percent + '%';
    progressPercent.textContent = percent + '%';
}

function downloadPdf(pdfBytes) {
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `merged-${Date.now()}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

// ============================================
// Theme Toggle
// ============================================

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';

    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
}

function loadTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
}

// ============================================
// Mobile Menu
// ============================================

function toggleMobileMenu() {
    mobileMenu.classList.toggle('active');
    mobileMenuBtn.classList.toggle('active');
}

// ============================================
// Smooth Scroll
// ============================================

function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                // Close mobile menu if open
                mobileMenu.classList.remove('active');
            }
        });
    });
}

// ============================================
// Nav Scroll Spy
// ============================================

function setupNavScrollSpy() {
    const sections = document.querySelectorAll('section[id]');

    function updateActiveNav() {
        const scrollPos = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', updateActiveNav);
    updateActiveNav(); // Initial call
}

// ============================================
// FAQ Accordion
// ============================================

function toggleFaq(item) {
    const isActive = item.classList.contains('active');

    // Close all
    faqItems.forEach(i => i.classList.remove('active'));

    // Open clicked if wasn't active
    if (!isActive) {
        item.classList.add('active');
    }
}

// ============================================
// Toast Notifications
// ============================================

function showToast(type, title, message) {
    const icon = getToastIcon(type);
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
        <div class="toast-icon ${type}">
            ${icon}
        </div>
        <div class="toast-content">
            <div class="toast-title">${escapeHtml(title)}</div>
            <div class="toast-message">${escapeHtml(message)}</div>
        </div>
    `;

    toastContainer.appendChild(toast);

    // Auto remove
    setTimeout(() => {
        toast.classList.add('hiding');
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

function getToastIcon(type) {
    const icons = {
        success: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
            <polyline points="20 6 9 17 4 12"/>
        </svg>`,
        error: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
        </svg>`,
        warning: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
            <line x1="12" y1="9" x2="12" y2="13"/>
            <line x1="12" y1="17" x2="12.01" y2="17"/>
        </svg>`
    };
    return icons[type] || icons.success;
}

// ============================================
// Utility Functions
// ============================================

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ============================================
// Initialize App
// ============================================

document.addEventListener('DOMContentLoaded', init);
