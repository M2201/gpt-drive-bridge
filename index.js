const express = require('express');
const { google } = require('googleapis');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());

const oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI
);

oauth2Client.setCredentials({
  refresh_token: process.env.REFRESH_TOKEN
});

const drive = google.drive({ version: 'v3', auth: oauth2Client });

app.get('/list-files', async (req, res) => {
  console.log("/list-files route was hit");

  try {
    const folderId = process.env.FOLDER_ID;
    const response = await drive.files.list({
      q: `'${folderId}' in parents and trashed = false`,
      fields: 'files(id, name, mimeType, webViewLink)',
    });

    res.json(response.data.files);
  } catch (error) {
    console.error('Google Drive API error:', error.response?.data || error.message);
    res.status(500).send('Failed to fetch files');
  }
});