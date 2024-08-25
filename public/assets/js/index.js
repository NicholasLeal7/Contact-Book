const options = document.querySelectorAll('.header .option');
const contents = document.querySelectorAll('.content');
const btnAddContact = document.querySelector('#btn_add_contact');
const btnCloseModal = document.querySelectorAll('.modal-header .icon');
const contactsList = document.querySelector('.contacts-list');
const formAddContact = document.querySelector("#form_add_contact");
const btnDelete = document.querySelector('.btn-delete');
const btnConfirmKeep = document.querySelector('#confirm_keep');
const btnConfirmDelete = document.querySelector('#confirm_delete');
const contactsCount = document.querySelector('.contact-count span');

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
            url_photo: pfp
        };
    }
    contactsCount.innerHTML = parseInt(contactsCount.innerHTML) + response.length;
    return html;
}

function addEventListeners() {

}

document.addEventListener("DOMContentLoaded", async () => {
    if (!localStorage.getItem('authentication-token')) window.location.href = "login.html";
    await fetch("/contacts", {
        method: 'get',
        headers: {
            'Content-type': 'application/json',
            'Authorization': "Bearer " + localStorage.getItem('authentication-token')
        }
    })
        .then(response => response.json())
        .then(response => {
            contactsList.innerHTML = generateContacts(response.contacts);
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
    const data = {};

    form.forEach((value, key) => {
        data[key] = value;
    });

    await fetch('/contacts', {
        method: 'POST',
        headers: {
            'Content-type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('authentication-token')
        },
        body: JSON.stringify(data)
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
    console.log('../contacts/' + currentData);
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
            contactsCount.innerHTML = parseInt(contactsCount.innerHTML) - 1;
            document.querySelector('.modal-confirm').style.display = "none";
            document.querySelector('.modal-edit-contact').style.display = "none";
            notify("Error", "fa-check", 'Contact removed successfully!', 5000);
        });
});
