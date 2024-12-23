const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const app = express();
const PORT = 5000;


app.use(bodyParser.json());
app.use(cors());


const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);


app.post('/events', async (req, res) => {
    const { name, desc, loc, date } = req.body;
    const { data, error } = await supabase.from('events').insert({ name, desc, loc, date });
    if (error) return res.status(400).send(error);
    res.status(201).send(data);
});

app.get('/events', async (req, res) => {
    const { data, error } = await supabase.from('events').select('*');
    if (error) return res.status(400).send(error);
    res.status(200).send(data);
});

app.put('/events/:id', async (req, res) => {
    const { id } = req.params;
    const { name, desc, loc, date } = req.body;
    const { data, error } = await supabase.from('events').update({ name, desc, loc, date }).eq('id', id);
    if (error) return res.status(400).send(error);
    res.status(200).send(data);
});

app.delete('/events/:id', async (req, res) => {
    const { id } = req.params;
    const { error } = await supabase.from('events').delete().eq('id', id);
    if (error) return res.status(400).send(error);
    res.status(204).send();
});


app.post('/attendees', async (req, res) => {
    const { name, email, event_id } = req.body;
    const { data, error } = await supabase.from('attendees').insert({ name, email, event_id });
    if (error) return res.status(400).send(error);
    res.status(201).send(data);
});

app.get('/attendees', async (req, res) => {
    const { data, error } = await supabase.from('attendees').select('*');
    if (error) return res.status(400).send(error);
    res.status(200).send(data);
});

app.delete('/attendees/:id', async (req, res) => {
    const { id } = req.params;
    const { error } = await supabase.from('attendees').delete().eq('id', id);
    if (error) return res.status(400).send(error);
    res.status(204).send();
});

app.post('/tasks', async (req, res) => {
    const { name, deadline, status, attendee_id, event_id } = req.body;
    const { data, error } = await supabase.from('tasks').insert({ name, deadline, status, attendee_id, event_id });
    if (error) return res.status(400).send(error);
    res.status(201).send(data);
});


app.delete('/tasks/:id', async (req, res) => {
    const { id } = req.params;
    const { error } = await supabase.from('tasks').delete().eq('id', id);
    if (error) return res.status(400).send(error);
    res.status(204).send();
}
);

app.get('/tasks', async (req, res) => {
    const { data, error } = await supabase.from('tasks').select('*');
    if (error) return res.status(400).send
    res.status(200).send(data);
}
);
app.put('/tasks/:id', async (req, res) => {
    const { id } = req.params;
    const { name, deadline, status, attendee_id, event_id } = req.body;
    const { data, error } = await supabase.from('tasks').update({ name, deadline, status, attendee_id, event_id }).eq('id', id);
    if (error) return res.status(400).send(error);
    res.status(200).send(data);
});


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

