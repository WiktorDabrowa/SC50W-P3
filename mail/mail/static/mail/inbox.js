document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);

  // By default, load the inbox
  load_mailbox('inbox');

  //Sending Emails
  document.querySelector('#compose-submit').addEventListener('click', send_email);
 
});

function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#message-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';


  
}  

function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#message-view').style.display = 'none';
  document.querySelector('#emails-view').style.display = 'block';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

  // Query the server for data
fetch(`/emails/${mailbox}`)
.then(response => response.json())
.then(emails => {

  // Print emails
  //console.log(emails);

  // Create a div for every email
  const mailbox_div = document.querySelector('#emails-view')

  for(const email of emails) {

    // Get Particular data from Json 
    let sender = email['sender'];
    let subject = email['subject'];
    let timestamp = email['timestamp'] 

    // Create HTML elements
    const email_container = document.createElement('div')
    const email_wrapper = document.createElement('div')
    const title_div = document.createElement('div')
    const timestamp_div = document.createElement('div')
    const sender_div = document.createElement('div')
    const archive_btn = document.createElement('button')
    const iconSvg = document.createElement('svg');
    const iconPath = document.createElement('path')

    // Assign classes and attributes to divs
    email_wrapper.classList.add('email_wrapper')
    email_container.classList.add('email_container')
    email_container.setAttribute('id',`${email['id']}`)
    title_div.classList.add('title_div')
    timestamp_div.classList.add('timestamp_div')
    sender_div.classList.add('sender_div')
    archive_btn.classList.add('archive_btn')
    archive_btn.setAttribute('id',`archive_${email['id']}`)
    iconSvg.setAttribute('fill','currentColor')
    iconSvg.setAttribute('viewBox','0 0 16 16')
    iconSvg.setAttribute('height', '16')
    iconSvg.setAttribute('width', '16')
    iconSvg.setAttribute('xmlns','http://www.w3.org/2000/svg')
    iconPath.setAttribute('d', 'M0 2a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1v7.5a2.5 2.5 0 0 1-2.5 2.5h-9A2.5 2.5 0 0 1 1 12.5V5a1 1 0 0 1-1-1V2zm2 3v7.5A1.5 1.5 0 0 0 3.5 14h9a1.5 1.5 0 0 0 1.5-1.5V5H2zm13-3H1v2h14V2zM5 7.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5z')
    archive_btn.innerHTML = 'Arch'

    // Populate divs with data
    iconSvg.append(iconPath);
    title_div.innerText = `Subject: ${String(subject)}`;
    sender_div.innerText = `Sent by: ${String(sender)}`;
    timestamp_div.innerHTML = String(timestamp);
    archive_btn.append(iconSvg)
  
    if (email['read'] === true) {
      email_container.style.backgroundColor = '#8080803d'
    } else {
      email_container.style.backgroundColor = 'White'
    }

    // Add elements to document
    email_container.append(title_div)
    email_container.append(sender_div)
    email_container.append(timestamp_div)
    email_wrapper.append(archive_btn)
    email_wrapper.append(email_container)
    mailbox_div.append(email_wrapper)
    email_container.addEventListener('click', () => load_email(`${email['id']}`))
    if (mailbox === 'archive') {
    archive_btn.addEventListener('click', () => unarchive_email(`${email['id']}`))
    } else {
    archive_btn.addEventListener('click', () => archive_email(`${email['id']}`))
    }
    }
    
});
}


function send_email() {

  // Set Variables to send in JSON
  const mail_recipents = document.querySelector('#compose-recipients').value;
  const mail_subject = document.querySelector('#compose-subject').value;
  const mail_body = document.querySelector('#compose-body').value;
  
  // Send data to the server
  fetch('/emails', {
     method: 'POST',
     headers:{
      'Content-type' : 'application/json'
     },
     body: JSON.stringify({
         recipients: mail_recipents,
         subject: mail_subject,
         body: mail_body,
     })
   })
   .then(response => response.json())
   .then(result => {

     // Print result
     console.log(result);
   });

   // Load the 'sent' Mailbox
   load_mailbox('sent')
}


function load_email(id) {

  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#message-view').style.display = 'block';
  

fetch(`emails/${id}`)
.then(response => response.json())
.then(email => {
  const sender = email['sender'];
  const timestamp = email['timestamp'];
  const recipients = email['recipients'];
  const subject = email['subject'];
  const body = email['body'];

  document.querySelector('#email_title').innerHTML = String(subject);
  document.querySelector('#email_sender').innerHTML = `From: ${sender} | On: ${timestamp} | Sent to: ${recipients}`;
  document.querySelector('#email_body').innerHTML = String(body);
});
fetch(`emails/${id}`, {
  method: 'PUT',
  body: JSON.stringify({
      read : true
  })
})
}

function archive_email(id) {
  fetch (`emails/${id}`, {
    method: 'PUT',
    body: JSON.stringify({
      archived : true
  })
  })
  console.log(`This email has id :${id}`)
  load_mailbox('inbox')
}
function unarchive_email(id) {
  fetch (`emails/${id}`, {
    method: 'PUT',
    body: JSON.stringify({
      archived : false
  })
  })
  load_mailbox('archive')
}