const emailAddresses = JSON.parse(localStorage.getItem('collections')) || {};

$(document).ready(function () {
    // Get an image from the picsum api and display it
    function getImage() {
        const apiUrl = 'https://picsum.photos/500/400';
        fetch(apiUrl)
            .then(res => {
                if (res.ok) {
                    return res.url;
                } else {
                    throw Error(res.statusText);
                }
            })
            .then(data => {
                $('#random-image').attr('src', data);
            });
    }
    
    function addEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        email = email.toLowerCase();
        if (!re.test(email)) { // test if email address is valid
            $('#email + .error').text('Please enter a valid email address').slideDown();
            setTimeout(() => $('#email + .error').slideUp(500), 2000);
        } else if (emailAddresses[email]) { // test if email already exists
            $('#email + .error').text('Email address already exists').slideDown();
            setTimeout(() => $('#email + .error').slideUp(500), 2000);
            updateSelectOptions(email);
        } else { // Add the email address to the array
            $('#email + .error').hide();
            emailAddresses[email] = [];
            localStorage.setItem('collections', JSON.stringify(emailAddresses));
            updateSelectOptions(email);
            $('#email').val('');
        }
    }

    // Update the collection select options
    function updateSelectOptions(newEmail = '') {
        let html = '';
        if (!newEmail) {
            newEmail = Object.keys(emailAddresses)[0];
        }
        for (email in emailAddresses) {
            html += `<option ${newEmail === email ? 'selected' : ''} value="${email}">${email}</option>`;
        }
        $('#collection').html(html);
        updateCollection(newEmail);
    }

    // Add image to collection
    function addToCollection(email, url) {

        // if the image is not already in this collection add it
        if (emailAddresses[email].includes(url)) {
            $('#collection + .error').text('Image already in collection').slideDown();
            setTimeout(() => $('#collection + .error').slideUp(500), 2000);
        } else {
            emailAddresses[email].push(url);
            localStorage.setItem('collections', JSON.stringify(emailAddresses));
            updateCollection(email);
        }
    }
    
    function updateCollection(email) {
        if (!emailAddresses[email]) {
            $('.collection__title').text("Please add an email address");
            $('.collection__images').html('');
        } else {
            let html = '';
            for (url of emailAddresses[email]) {
                html += `<div class="image">
                            <a href="${url}" target="_blank">
                                <img src="${url}" alt="${url}">
                            </a>
                            <button class="remove-image">X</button>
                        </div>`;
            }
            localStorage.setItem('currentEmail', email);
            $('.collection__title').text(`${email}'s collection`);
            $('.collection__images').html(html);
        }
    }

    // Remove image from array
    function removeImage(target) {
        const url = $(target).prev('a').attr('href');
        const email = $('#collection').val();
        const index = emailAddresses[email].indexOf(url);
        
        // Update collection array
        emailAddresses[email].splice(index, 1);
        localStorage.setItem('collections', JSON.stringify(emailAddresses));

        $(target).parent('.image').fadeOut();
    }

    // Remove email address from collection
    function removeAll() {
        const email = $('#collection').val();
        delete emailAddresses[email];
        updateSelectOptions();
        localStorage.setItem('collections', JSON.stringify(emailAddresses));
    }

    // Initiate page and load event handlers
    updateSelectOptions(localStorage.getItem('currentEmail') || $('#collection').val());
    getImage();
    $('#get-image').on('click', getImage);

    $('#add-email').on('click', function (e) {
        const email = $('#email').val();

        addEmail(email);
    });

    $('#add-image').on('click', function (e) {
        const email = $('#collection').val();
        const imgUrl = $('#random-image').attr('src');
        if (!email) {
            $('#collection + .error').text('Please add an email address').slideDown();
            setTimeout(() => $('#collection + .error').slideUp(500), 2000);
        } else {
            addToCollection(email, imgUrl);
        }
    });

    $('#collection').on('change', function (e) {
        const email = $('#collection').val();
        updateCollection(email);
    });

    $('.collection__images').on('click', '.remove-image', function (e) {
        removeImage(e.target);
    });

    $('#remove-all').on('click', function (e) {
        removeAll();
    });
});




