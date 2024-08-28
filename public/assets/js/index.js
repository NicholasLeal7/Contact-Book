const options = document.querySelectorAll('.header .option');
const contents = document.querySelectorAll('.content');
const btnAddContact = document.querySelector('#btn_add_contact');
const btnCloseModal = document.querySelectorAll('.modal-header .icon');
const contactsList = document.querySelector('.contacts-list');
const formAddContact = document.querySelector("#form_add_contact");
const formEditProfile = document.querySelector("#form_edit_profile");
const formEditContact = document.querySelector("#form_edit_contact");
const btnDelete = document.querySelector('.btn-delete');
const btnConfirmKeep = document.querySelector('#confirm_keep');
const btnConfirmDelete = document.querySelector('#confirm_delete');
const contactsCount = document.querySelector('.contact-count span');
const btnUpdate = document.querySelector(".btn-update");
const btnExit = document.querySelector("#btnExit");
const btnClear = document.querySelector(".clear-button");
const inputSerch = document.querySelector('#input_search');

function notify(title, icon, body, timeout) {
    //debugger;
    document.querySelector(".alert-header span").innerHTML = title;
    document.querySelector(".alert-header i").className = "";
    document.querySelector(".alert-header i").classList.add("fa-solid");
    document.querySelector(".alert-header i").classList.add(icon);
    document.querySelector(".alert-body").innerHTML = body;
    document.querySelector(".alert-message").style.right = "20px";

    setTimeout(() => {
        document.querySelector(".alert-message").style.right = "-500px";
    }, timeout);
};

let contactsData = [];
let currentData = 0;

function generateContacts(response) {
    let html = '';
    if (response.length === 0) {
        html = `
            <div class="not-founded">
                <div class="img">
                    <i class="fa-solid fa-child-reaching"></i>
                </div>
                <span>No contacts found.</span>
            </div>
        `;
        return html;
    }
    for (let i in response) {
        let pfp = response[i].photo_url ? response[i].photo_url : 'default.jpg';
        html += `
             <div class="contact" data-contact-id="${response[i].contact_id}">
                <div class="profile-img"><img src="media/${pfp}" alt=""></div>
                <div class="profile-info">
                    <span class="name">${response[i].name}</span>
                    <span class="subtitle">${response[i].phone}</span>
                </div>
            </div>
        `;
        contactsData[response[i].contact_id] = {
            name: response[i].name,
            email: response[i].email,
            phone: response[i].phone,
            photo_url: pfp,
            createdAt: response[i].createdAt
        };
    }
    contactsCount.innerHTML = parseInt(contactsCount.innerHTML) + response.length;
    return html;
}

document.addEventListener("DOMContentLoaded", async () => {

    if (!localStorage.getItem('authentication-token')) return window.location.href = "login.html";

    await fetch("/contacts", {
        method: 'get',
        headers: {
            'Content-type': 'application/json',
            'Authorization': "Bearer " + localStorage.getItem('authentication-token')
        }
    })
        .then(response => response.json())
        .then(response => {
            if (response.error) return window.location.href = "login.html";
            contactsList.innerHTML = generateContacts(response.contacts);
        });

    await fetch("/user", {
        method: 'get',
        headers: {
            'Content-type': 'application/json',
            'Authorization': "Bearer " + localStorage.getItem('authentication-token')
        }
    })
        .then(response => response.json())
        .then(response => {
            if (response.error) return window.location.href = "login.html";
            const pfp = response.user.photo_url ? response.user.photo_url : 'default.jpg';
            document.querySelector(".my-profile-img img").setAttribute("src", "media/" + pfp);
            document.querySelector("#user_name").value = response.user.name;
            document.querySelector("#user_email").value = response.user.email;
            document.querySelector("#user_phone").value = response.user.phone;
        });
});

btnCloseModal.forEach((value) => {
    value.addEventListener('click', () => {
        value.closest('.modal').style.display = 'none';
    });
});

btnAddContact.addEventListener('click', () => {
    document.querySelector('.modal-add-contact').style.display = "flex";
});

formAddContact.addEventListener('submit', async (evt) => {
    evt.preventDefault();
    const form = new FormData(formAddContact);

    await fetch('/contacts', {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('authentication-token')
        },
        body: form
    })
        .then(response => response.json())
        .then(response => {
            if (response.error) {
                notify("Error", "fa-circle-info", response.error, 5000);
                return;
            };
            let array = [response.contact];
            contactsList.innerHTML = contactsList.innerHTML + generateContacts(array);
            document.querySelector('.modal-add-contact').style.display = 'none';
            notify("Error", "fa-check", 'Contact added successfully!', 5000);
        });
});

options.forEach((value) => {
    value.addEventListener("click", () => {
        if (value.getAttribute("flag") == 1) return;
        options.forEach(value => {
            value.setAttribute("flag", "0");
            value.classList.remove("active")
        });
        contents.forEach(value => value.classList.remove("active"));
        value.setAttribute("flag", "1");

        value.classList.add("active");
        document.querySelector(".content." + value.getAttribute("option")).classList.add("active");
    });
})

contactsList.addEventListener('click', (evt) => {
    if (evt.target && evt.target.classList.contains('contact')) {
        const index = evt.target.getAttribute('data-contact-id');
        currentData = index;
        const date = new Date(contactsData[index].createdAt);

        document.querySelector('.pfp-img img').setAttribute('src', 'media/' + contactsData[index].photo_url);
        document.querySelector('.modal-edit-contact .date-add .date').innerHTML = date.toLocaleDateString('en-US');
        document.querySelector('.modal-edit-contact-name').value = contactsData[index].name;
        document.querySelector('.modal-edit-contact-email').value = contactsData[index].email;
        document.querySelector('.modal-edit-contact-phone').value = contactsData[index].phone;

        document.querySelector('.modal-edit-contact').style.display = "flex";
    }
});

btnDelete.addEventListener('click', () => {
    document.querySelector('.modal-edit-contact').style.display = "none";
    document.querySelector('.modal-confirm').style.display = "flex";
});

btnConfirmKeep.addEventListener('click', () => {
    document.querySelector('.modal-confirm').style.display = "none";
    document.querySelector('.modal-edit-contact').style.display = "flex";
});

btnConfirmDelete.addEventListener('click', async () => {
    await fetch('../contacts/' + currentData, {
        method: 'delete',
        headers: {
            'Content-type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('authentication-token')
        }
    })
        .then(response => response.json())
        .then(response => {
            if (response.error) {
                notify("Error", "fa-circle-info", response.error, 5000);
                return;
            };
            document.querySelector('.contact[data-contact-id="' + currentData + '"]').remove();
            //contactsData.splice(currentData, 1);
            contactsCount.innerHTML = parseInt(contactsCount.innerHTML) - 1;
            document.querySelector('.modal-confirm').style.display = "none";
            document.querySelector('.modal-edit-contact').style.display = "none";
            notify("Success", "fa-check", 'Contact removed successfully!', 5000);
        })
        .catch(err => console.log(err));
});

formEditProfile.addEventListener('submit', async (evt) => {
    evt.preventDefault();
    const form = new FormData(formEditProfile);

    await fetch('/user', {
        method: 'put',
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('authentication-token')
        },
        body: form
    })
        .then(response => response.json())
        .then(response => {
            if (response.error) {
                notify("Error", "fa-circle-info", response.error, 5000);
                return;
            }
            const pfp = response.user.photo_url ? response.user.photo_url : 'default.jpg';
            document.querySelector(".my-profile-img img").setAttribute("src", "media/" + pfp);
            document.querySelector("#user_name").value = response.user.name;
            document.querySelector("#user_email").value = response.user.email;
            document.querySelector("#user_phone").value = response.user.phone;
            notify("Success", "fa-circle-check", 'Profile updated successfully!', 5000);
        })
        .catch(err => console.log(err));
});

btnUpdate.addEventListener('click', () => document.querySelector("#trigger_submit").click());

formEditContact.addEventListener('submit', async (evt) => {
    evt.preventDefault();
    const form = new FormData(formEditContact);
    const data = {};

    await fetch('/contacts/' + currentData, {
        method: 'put',
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('authentication-token')
        },
        body: form
    })
        .then(response => response.json())
        .then(response => {
            if (response.error) {
                notify("Error", "fa-circle-info", response.error, 5000);
                return;
            }
            const pfp = response.contact.photo_url ? response.contact.photo_url : 'default.jpg';
            document.querySelector('.contact[data-contact-id="' + currentData + '"] .profile-img img').setAttribute('src', 'media/' + pfp);
            document.querySelector('.contact[data-contact-id="' + currentData + '"] .profile-info .name').innerHTML = response.contact.name;
            document.querySelector('.contact[data-contact-id="' + currentData + '"] .profile-info .subtitle').innerHTML = response.contact.phone;
            contactsData[currentData] = {
                name: response.contact.name,
                email: response.contact.email,
                phone: response.contact.phone,
                photo_url: pfp
            }
            document.querySelector('.modal-edit-contact').style.display = "none";
            notify("Success", "fa-circle-check", 'Contact updated successfully!', 5000);
        })
        .catch(err => console.log(err));
});

btnExit.addEventListener('click', () => {
    localStorage.clear();
    window.location.href = 'login.html';
});

const getSearch = () => {
    const value = inputSerch.value;
    const contacts = document.querySelectorAll('.contact');

    contacts.forEach(contact => {
        let contact_id = contact.getAttribute('data-contact-id');
        if (
            (contactsData[contact_id].name.toLowerCase()).includes(value.toLowerCase()) ||
            (contactsData[contact_id].phone.toLowerCase()).includes(value.toLowerCase())
        ) {
            contact.style.display = 'flex';
        } else {
            contact.style.display = 'none';
        }
    });
};

btnClear.addEventListener('click', () => {
    inputSerch.value = '';
    getSearch();
});

inputSerch.addEventListener('input', getSearch);