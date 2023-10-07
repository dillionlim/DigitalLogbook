const formsg = require('@opengovsg/formsg-sdk')();

var start = true;

const openaccesshash = new Set(openaccessset);
var cnt = 0;

addEventListener('fetch', (event) => {
  event.respondWith(handleRequest(event.request));
});

function appendFormFieldValue(question, fieldType, answer, answerArray) {
	let fieldValue;
	fieldValue = answer || (Array.isArray(answerArray) ? answerArray.join(", ") : "");
	if(fieldValue!="") return `<b>${question}:</b> ${fieldValue}`;
	else return `<b>${question}:</b> N/A`;
}

async function handleRequest(request) {
  const { method, url, headers } = request;

  if (method === 'POST' && url.endsWith('/submissions') && headers.get('X-FormSG-Signature')) {
    const body = await request.json();

    formsg.webhooks.authenticate(headers.get('X-FormSG-Signature'), POST_URI);

    const submission = HAS_ATTACHMENTS
      ? await formsg.crypto.decryptWithAttachments(formSecretKey, body.data)
      : formsg.crypto.decrypt(formSecretKey, body.data);

    if (submission) {
      const formResponses = submission.responses;
      const messages = [];
      const filteredmessages = [];

      let entryId = await counterStore.get('counter');
			if (!entryId) {
				entryId = 1;
			}

      messages.push(`<b>xLogbook [ID ${entryId}]</b> <pre>\n</pre>`);
      filteredmessages.push(`<b>xLogbook [ID ${entryId}]</b> <pre>\n</pre>`);

			entryId = parseInt(entryId) + 1;
      await counterStore.put('counter', entryId);

      for (const formField of formResponses) {
        const { question, fieldType, answer, answerArray, isHeader } = formField;
        let formattedField = "";
        if(!isHeader){
          formattedField = appendFormFieldValue(questionset[cnt], fieldType, answer, answerArray);
          cnt+=1;
        }
        else{
          if(start){
            start=false;
            formattedField = "";
          }
          else formattedField = " ";
        }
        if(formattedField!=""){
          messages.push(String(formattedField));
          if(openaccesshash.has(cnt))filteredmessages.push(String(formattedField));
        }
      }
      var message = messages.join('<pre>\n</pre>');
      var filteredmessage = filteredmessages.join('<pre>\n</pre>');
      await sendMessageToTelegramBot(message, chatId1, channelId1);
      await sendMessageToTelegramBot(filteredmessage, chatId2, channelId2);
      console.log("Submitted!");
      return new Response('Form submission processed successfully', { status: 200 });
    } else {
      await sendMessageToTelegramBot("Error 400: Failed to decrypt form submission. Contact the System Administrator if this error persists.", chatId1, channelId1);
      console.log('Failed to decrypt submission');
      return new Response('Failed to decrypt form submission', { status: 400 });
    }
  } else {
    if (request.method === "POST")
      await sendMessageToTelegramBot("Error 404: Does not end with /submissions. Check the webhook URL to ensure that it ends with /submissions.",chatId1, channelId1);
    else
      console.log("Error: This is not a POST message. Please send a post message.");
    return new Response("Not found", { status: 404 });
  }
}

async function sendMessageToTelegramBot(message, chatId, threadId) {
  console.log("Sending message");
  const url = `https://api.telegram.org/bot${botToken}/sendMessage?chat_id=${chatId}&parse_mode=HTML&text=${encodeURIComponent(message)}&message_thread_id=${threadId}`;
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
  if (!response.ok) {
    const errorMessage = `Failed to send message to Telegram bot: ${response.status} ${response.statusText}. Contact the System Administrator if this error persists.`;
    console.log(errorMessage);
    return;
  }
  return;
}
