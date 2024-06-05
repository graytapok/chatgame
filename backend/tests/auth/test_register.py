from email.headerregistry import DateHeader
from email import message_from_bytes

import datetime
import imaplib
import time

def test_register(client, app):
    res = client.post("/api/auth/register", json={
        "username": "Test2",
        "email": app.config["MAIL_USERNAME"],
        "password": "Test2024!",
        "confirmPassword": "Test2024!"
    })

    assert res.status_code == 201

    server = app.config["MAIL_IMAP_SERVER"]
    username = app.config["MAIL_USERNAME"]
    password = app.config["MAIL_PASSWORD"]

    imap = imaplib.IMAP4_SSL(server, 993)
    imap.login(username, password)

    timeout = time.time() + 10
    while True:
        imap.select("Inbox")

        _, messages = imap.search(None, f'FROM {app.config["MAIL_USERNAME"]}')
        last_message = messages[0].split(b" ")[-1]

        if last_message:
            _, data = imap.fetch(last_message, "(RFC822)")
            message = message_from_bytes(data[0][1])

            message_date = {}
            DateHeader.parse(message.get("Date"), message_date)
            message_datetime = message_date["datetime"]

            now = datetime.datetime.now()

            subject = message.get("Subject") == "Registration - Chatgame"
            date = (
                message_datetime.year == now.year
                and message_datetime.month == now.month
                and message_datetime.day == now.day
                and (
                    message_datetime.minute == now.minute
                    or message_datetime.minute == now.minute - 1
                )
            )

            if subject and date:
                register_message = message
                break

        if timeout < time.time():
            raise Exception("Time limit exchanged")

    assert register_message.get("Subject") == "Registration - Chatgame"

    imap.store(messages[-1], "+FLAGS", "\\Deleted")
    imap.expunge()
    imap.close()
    imap.logout()



