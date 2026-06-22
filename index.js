require('dotenv').config();
const express = require('express');
const axios = require('axios');
const app = express();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const PRIVATE_APP_ACCESS = process.env.PRIVATE_APP_ACCESS_TOKEN;

// ROUTE 1 - Homepage: fetch all Books custom objects and render the homepage
app.get('/', async (req, res) => {
    const url = 'https://api.hubapi.com/crm/v3/objects/2-231419013?properties=name,author,genre&limit=10';
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };
    try {
        const resp = await axios.get(url, { headers });
        const data = resp.data.results;
        res.render('homepage', { title: 'Books | HubSpot Practicum', data });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching books from HubSpot');
    }
});

// ROUTE 2 - Show the form to add a new Book
app.get('/update-cobj', (req, res) => {
    res.render('updates', {
        title: 'Update Custom Object Form | Integrating With HubSpot I Practicum'
    });
});

// ROUTE 3 - Handle form submission: create a new Book in HubSpot, then redirect home
app.post('/update-cobj', async (req, res) => {
    const { name, author, genre } = req.body;
    const url = 'https://api.hubapi.com/crm/v3/objects/2-231419013';
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };
    try {
        await axios.post(url, { properties: { name, author, genre } }, { headers });
        res.redirect('/');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error creating book in HubSpot');
    }
});

app.listen(3000, () => console.log('Listening on http://localhost:3000'));