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
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';


  
}  

function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';

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

    // Get Particular data from Json TODO
    let sender = email['sender'];
    let subject = email['subject'];
    let timestamp = email['timestamp'] 

    // Create HTML elements
    const email_container = document.createElement('div')
    const title_div = document.createElement('div')
    const timestamp_div = document.createElement('div')
    const sender_div = document.createElement('div')

    // Assign classes to divs
    email_container.classList.add('email_container')
    title_div.classList.add('title_div')
    title_div.setAttribute('id',`${email['id']}`)
    timestamp_div.classList.add('timestamp_div')
    sender_div.classList.add('sender_div')
    
    // Populate divs with data
    title_div.innerText = `Subject: ${String(subject)}`
    sender_div.innerText = `Sent by: ${String(sender)}`
    timestamp_div.innerHTML = String(timestamp)
    if (email['read'] === true) {
      email_container.style.backgroundColor = '#8080803d'
    } else {
      email_container.style.backgroundColor = 'White'
    }

    // Add elements to document
    email_container.append(title_div)
    email_container.append(sender_div)
    email_container.append(timestamp_div)
    mailbox_div.append(email_container)
  
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
