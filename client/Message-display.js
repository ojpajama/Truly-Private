function addMessage(sender, content, sent = false){
    const messagesContainer = document.getElementById('Messages');
    
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message ' + (sent ? 'sent' : 'received');

    const metaDataDiv = document.createElement('div');
    metaDataDiv.className = 'meta-data';
    const contentDiv = document.createElement('div');
    contentDiv.className = 'content';


    const senderSpan = document.createElement('span');
    senderSpan.className = 'sender';
    senderSpan.textContent = sender + ' ';
    metaDataDiv.appendChild(senderSpan);
    
    const time = new Date();
    const TimeStampSpan = document.createElement('span');
    TimeStampSpan.className = 'timestamp';
    TimeStampSpan.textContent = time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds();
    metaDataDiv.appendChild(TimeStampSpan);

    contentDiv.appendChild(document.createTextNode( content ));

    messageDiv.appendChild(metaDataDiv);
    messageDiv.appendChild(contentDiv);

    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}


window.sodium = {
    onload: function(sodium) {
        sodium.keyPair = sodium.crypto_box_keypair();
        const publicKeyDisplay = document.getElementById('Public-Key');
        publicKeyDisplay.textContent = sodium.to_base64(sodium.keyPair.publicKey);

        console.log ('Sodium loaded and key pair generated.');
        console.log('Public Key:', sodium.to_base64(sodium.keyPair.publicKey));
        console.log('Secret Key:', sodium.to_base64(sodium.keyPair.privateKey));
    }
};


function encryptMessage(message, target) {

    const nonce = sodium.randombytes_buf(sodium.crypto_box_NONCEBYTES);

    const ciphertext = sodium.crypto_box_easy(
        sodium.from_string(message),
        nonce,
        sodium.from_base64(target),
        sodium.keyPair.privateKey
    );


    const time = new Date();
    const to_Send = {
        target: target,
        nonce: sodium.to_base64(nonce),
        timestamp: time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds(),
        message: sodium.to_base64(ciphertext)
    }
    const JsonString = JSON.stringify(to_Send);
    console.log(JsonString);
    return JsonString;
}


function decryptMessage (JsonString, from){
    const data = JSON.parse(JsonString);
    const nonce = sodium.from_base64(data.nonce);
    const ciphertext = sodium.from_base64(data.message);

    return sodium.to_string(
        sodium.crypto_box_open_easy(
            ciphertext,
            nonce,
            sodium.from_base64(from),
            sodium.keyPair.privateKey
        )
    );
}



const Message_Input = document.getElementById('Message-Input');
Message_Input.addEventListener('keyup', (event) => {
    if (event.key == 'Enter' && Message_Input.value.trim() !== '') {

        var jsonString = encryptMessage(Message_Input.value, sodium.to_base64(sodium.keyPair.publicKey));

        console.log(decryptMessage(jsonString, sodium.to_base64(sodium.keyPair.publicKey)));

        addMessage('You', Message_Input.value, true);
        Message_Input.value = '';
    }

})