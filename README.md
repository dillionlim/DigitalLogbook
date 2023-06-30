# MTC Digital Logbook

This repository holds the code for the Telegram bot for Motor Transport Centre, making use of the FormSG API to receive encrypted POST requests containing form responses, and filtering and outputting these responses to telegram.

The bot was hosted on Cloudflare, using the free tier.

## Installation and Setup Guide

**Prerequisites:** Node.JS (this bot was tested on V18.13.0), NPM (this bot was tested on V8.19.1)

1. Install Wrangler CLI.

Heavy development will be done locally, so it is recommended to install Wrangler CLI. You can do so through npm:

```npm
npm install -g wrangler
```

You may see detailed [installation instructions](https://developers.cloudflare.com/workers/wrangler/install-and-update/).

2. Sign up for a Cloudflare account if you do not have one. You then need to authenticate Wrangler with your Cloudflare account.

```npm
wrangler login
```

When Wrangler automatically opens your browser to display Cloudflare’s consent screen, click the Allow button. This will send an API Token to Wrangler.

2. Pull the files from Github.
```console
git clone https://github.com/dillionlim/DigitalLogbook.git
```

3. Create a Cloudflare worker.

Go to workers & pages, and click create application. Name it digital-logbook.

Next, click view at the routes column, and click add route. Your route should be digital-logbook.[domain-name].workers.dev, where domain-name is your own domain name.

Next, go to settings and click variables. Scroll down to KV Namespace Bindings and click edit variables. Click `+ Add Binding` and insert "counterStore" as a variable name. Take note of the namespace ID, you will need it later.

4. Edit the file `.dev.vars`.
`.dev.vars` contains two lines.
The first line is to be replaced with your Telegram bot token.
The second line is to be replaced with your formSG form secret token.

To get your Telegram bot token, simply open Telegram, message @BotFather, and ask to make a new bot. Follow the instructions and you will get a bot token.

Add your telegram bot to your group chat.

5. Edit the file `wrangler.toml`.
`wrangler.toml` contains many of the important configuration settings for the bot.

First, in `kv_namespaces`, insert your KV namespace ID from above.

Next, `chatId1` and `chatId2` are the Telegram chat IDs of the unfiltered and filtered chats respectively.

The `POST_URI` parameter contains the URI of the worker, which should be of the form "https://digital-logbook.[domain-name].workers.dev/submissions".

Next, `HAS_ATTACHMENTS` simply is a boolean of whether your form contains attachments. This is not currently handled.

The `openaccessset` parameter contains a list of question numbers which should be included in the filtered chat.

For example, if `openaccessset = [1, 4, 7, 8, 9]`, then questions 1, 4, 7, 8 and 9 will be included in the filtered chat.

Lastly, `questionset` simply is a list of strings that can be used to replace the question titles in the form. Do ensure that the length of the list is equal to the number of questions in the form.

6. Include secrets.

The necessary secrets are:
- botToken
- formSecretKey

Run `echo <VALUE> | wrangler secret put <NAME>` for each of these secrets.

With example bot tokens and form secret keys, you should be running:

```console
echo 123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11 | wrangler secret put botToken
echo ABC-DEF1234ghIkl-zyx57W2v1u123ew11= | wrangler secret put formSecretKey
```

7. Deploy your application.
Simply run `wrangler deploy` to deploy your telegram bot.

Do note that if your telegram group is a supergroup and has multiple topics, you will need to manually quantify them in `index.js`. This will be fixed in a future release.
