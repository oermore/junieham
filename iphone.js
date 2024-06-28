document.addEventListener('DOMContentLoaded', () => {
    const searchBar = document.getElementById('search-bar');
    const searchButton = document.getElementById('search-button');
    const imageGallery = document.getElementById('image-gallery');
    const oermore = document.getElementById('oermore');
    const ham = document.getElementById('ham');
    const adminModal = document.getElementById('admin-modal');
    const adminButton = document.getElementById('admin-button');
    const adminLoginButton = document.getElementById('admin-login');
    const passwordInput = document.getElementById('admin-password');
    const closePopups = document.querySelectorAll('.close');
    const uploadModal = document.getElementById('upload-modal');
    const uploadButton = document.getElementById('upload-button');
    const imageUrlInput = document.getElementById('image-url');
    const tagInput = document.getElementById('tag-input');
    const imagePopup = document.getElementById('image-popup');
    const popupImage = document.getElementById('popup-image');
    const downloadLink = document.getElementById('download-link');

    const getLocalStorageImages = () => {
        try {
            return JSON.parse(localStorage.getItem('images')) || [];
        } catch (e) {
            return [];
        }
    };

    let images = getLocalStorageImages();
    let deleteMode = false;

    const renderImages = () => {
        imageGallery.innerHTML = '';
        images.forEach((image, index) => {
            const imgBox = document.createElement('div');
            imgBox.classList.add('image-box');
            imgBox.style.backgroundImage = `url("${image.src}")`;

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.classList.add('delete-checkbox');
            checkbox.dataset.index = index;

            imgBox.appendChild(checkbox);

            imgBox.addEventListener('click', () => {
                if (deleteMode) {
                    checkbox.checked = !checkbox.checked;
                } else {
                    // 이미지 팝업 표시
                    popupImage.src = image.src;
                    imagePopup.style.display = 'block';
                    downloadLink.href = image.src;
                    downloadLink.style.display = 'block';
                }
            });

            // 이미지가 로드되지 않는 경우 대체 이미지 표시
            const imgTest = new Image();
            imgTest.src = image.src;
            imgTest.onerror = () => {
                imgBox.style.backgroundImage = 'url("error.png")'; // 대체 이미지 경로
            };

            imageGallery.appendChild(imgBox);
        });

        if (deleteMode) {
            imageGallery.classList.add('delete-mode');
        } else {
            imageGallery.classList.remove('delete-mode');
        }
    };

    const saveImages = () => {
        localStorage.setItem('images', JSON.stringify(images));
    };

    oermore.addEventListener('click', () => {
        adminModal.style.display = 'block';
    });

    ham.addEventListener('click', () => {
        adminModal.style.display = 'block';
    });

    adminButton.addEventListener('click', () => {
        adminModal.style.display = 'block';
    });

    closePopups.forEach(button => {
        button.onclick = () => {
            adminModal.style.display = 'none';
            uploadModal.style.display = 'none';
            imagePopup.style.display = 'none';
            downloadLink.style.display = 'none';
        };
    });

    adminLoginButton.addEventListener('click', () => {
        const password = passwordInput.value;
        if (password === '06280') {
            adminModal.style.display = 'none';
            adminButton.style.display = 'none';

            deleteMode = true;
            renderImages();

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete Selected Images';
            deleteButton.classList.add('admin-button', 'show');
            document.body.appendChild(deleteButton);

            deleteButton.addEventListener('click', () => {
                const checkboxes = document.querySelectorAll('.delete-checkbox:checked');
                const indicesToDelete = Array.from(checkboxes).map(checkbox => parseInt(checkbox.dataset.index));

                images = images.filter((_, index) => !indicesToDelete.includes(index));
                saveImages();
                renderImages();

                deleteButton.remove();
                deleteMode = false;
            });

            uploadModal.style.display = 'block';

            uploadButton.addEventListener('click', () => {
                const imageUrl = imageUrlInput.value;
                const tags = tagInput.value.split(',').map(tag => tag.trim());
                if (imageUrl) {
                    images.push({ src: imageUrl, tags: tags });
                    saveImages();
                    renderImages();

                    imageUrlInput.value = '';
                    tagInput.value = '';
                }
            });
        } else {
            alert('Incorrect password');
        }
    });

    searchButton.addEventListener('click', () => {
        const searchText = searchBar.value.toLowerCase();
        const filteredImages = images.filter(image => image.tags.some(tag => tag.toLowerCase().includes(searchText)));
        renderFilteredImages(filteredImages);
    });

    const renderFilteredImages = (filteredImages) => {
        imageGallery.innerHTML = '';
        filteredImages.forEach((image, index) => {
            const imgBox = document.createElement('div');
            imgBox.classList.add('image-box');
            imgBox.style.backgroundImage = `url("${image.src}")`;

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.classList.add('delete-checkbox');
            checkbox.dataset.index = index;

            imgBox.appendChild(checkbox);

            imgBox.addEventListener('click', () => {
                if (deleteMode) {
                    checkbox.checked = !checkbox.checked;
                } else {
                    popupImage.src = image.src;
                    imagePopup.style.display = 'block';
                    downloadLink.href = image.src;
                    downloadLink.style.display = 'block';
                }
            });

            // 이미지가 로드되지 않는 경우 대체 이미지 표시
            const imgTest = new Image();
            imgTest.src = image.src;
            imgTest.onerror = () => {
                imgBox.style.backgroundImage = 'url("error.png")'; // 대체 이미지 경로
            };

            imageGallery.appendChild(imgBox);
        });
    };

    renderImages();
});
