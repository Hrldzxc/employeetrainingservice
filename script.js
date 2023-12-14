function showSection(sectionId) {
    const sections = document.querySelectorAll('main section');
    sections.forEach(section => {
        section.style.display = 'none';
    });

    const selectedSection = document.getElementById(sectionId);
    if (selectedSection) {
        selectedSection.style.display = 'block';
    }

    if (sectionId === 'viewApplicants') {
        displayApplicants();
    }
}

function deleteApplication(email) {
    const xmlDoc = new DOMParser().parseFromString(document.getElementById('xmlData').textContent, 'text/xml');
    const applicants = xmlDoc.getElementsByTagName("applicant");

    for (let i = 0; i < applicants.length; i++) {
        const applicantEmail = applicants[i].getElementsByTagName("email")[0].textContent;

        if (applicantEmail === email) {
            xmlDoc.documentElement.removeChild(applicants[i]);
            break;
        }
    }

    updateApplicants(xmlDoc);
}

function updateApplicants(xmlDoc) {
    const xmlString = new XMLSerializer().serializeToString(xmlDoc);
    document.getElementById('xmlData').textContent = xmlString;

    displayApplicants();
}

function displayApplicants() {
    const applicantList = document.getElementById('applicantList');
    applicantList.innerHTML = '';

    const xmlDoc = new DOMParser().parseFromString(document.getElementById('xmlData').textContent, 'text/xml');
    const applicants = xmlDoc.getElementsByTagName("applicant");

    for (let i = 0; i < applicants.length; i++) {
        const fullName = applicants[i].getElementsByTagName("fullName")[0].textContent;
        const email = applicants[i].getElementsByTagName("email")[0].textContent;

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete Application';
        deleteButton.onclick = function () {
            deleteApplication(email);
        };

        const applicantDiv = document.createElement('div');
        applicantDiv.innerHTML = `<p><strong>Full Name:</strong> ${fullName}</p><p><strong>Email:</strong> ${email}</p>`;
        applicantDiv.appendChild(deleteButton);

        applicantList.appendChild(applicantDiv);
    }
}

function submitApplication() {
    const fullName = document.getElementById('fullName').value;
    const email = document.getElementById('email').value;

    const xmlDoc = new DOMParser().parseFromString(document.getElementById('xmlData').textContent, 'text/xml');
    const applicants = xmlDoc.getElementsByTagName("applicants")[0];

    const newApplicant = xmlDoc.createElement("applicant");
    const fullNameElement = xmlDoc.createElement("fullName");
    const emailElement = xmlDoc.createElement("email");

    fullNameElement.textContent = fullName;
    emailElement.textContent = email;

    newApplicant.appendChild(fullNameElement);
    newApplicant.appendChild(emailElement);

    applicants.appendChild(newApplicant);

    updateApplicants(xmlDoc);

    // Reset the form
    document.getElementById('applicationForm').reset();
}