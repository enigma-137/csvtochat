# Steps to MVP

1. clean up homepage steps:
   - user drops/uploads a file (neeed dropzone added)
   - user can write a prompt or click one of the provided suggestions (with load more?)
   - user clicks a suggestion or writes a prompt and clicks enter
2. still on homepage but different we do background processing:
   - uploading CSV file to S3 and getting URL back to be used from LLM/Codesandbox
   - we store the url and chatId in the DB and redirect the user to the chat page
3. chat page:
   - user can see the chat history and the csv file and we start processing the chat message?
   - we create or restore the codesandbox instance and send it the csv file to download and process it with python?
