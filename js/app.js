const emailAddresses = {};
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
            updateSelectOptions(email);
        }
    }

    // Update the collection select options
    function updateSelectOptions(newEmail) {
        let html = '';
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
            updateCollection(email);
        }
    }
    
    function updateCollection(email) {
        if (!emailAddresses[email]) {
            throw Error("Email address doesn't exist in collection");
        }
        let html = '';
        for (url of emailAddresses[email]) {
            html += `<div class="image">
                        <img src="${url}" alt="${url}">
                        <button>X</button>
                    </div>`;
        }

        $('.collection__images').html(html);

    }

    // Initiate page and load event handlers
    getImage();
    $('#get-image').on('click', getImage);

    $('#add-email').on('click', function (e) {
        const email = $('#email').val();

        addEmail(email);
    });

    $('#add-image').on('click', function (e) {
        const email = $('#collection').val();
        const imgUrl = $('#random-image').attr('src');

        addToCollection(email, imgUrl);
    });

    $('#collection').on('change', function (e) {
        const email = $('#collection').val();
        updateCollection(email);
    });
});




