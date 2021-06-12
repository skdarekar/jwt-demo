require("dotenv/config");
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const { verify } = require('jsonwebtoken');
const { hash, compare } = require('bcryptjs');

const { fakeDB } = require('./fakeDb');

// 1. Register users
// 2. Login users
// 3. Logout users
// 4. Setup protected route
// 5. Get new access token with refresh token

const server = express();

// Use express middleware for easier cookie handling
server.use(cookieParser());

server.use(
    cors({
        origin: "http://localhost:3000",
        credentials: true
    })
);

// Needed to be able to read body data
server.use(express.json()); // to support JSON-encoded bodies
server.use(express.urlencoded()); // to support URL-encoded bodies

server.listen(process.env.PORT, () => {
    console.log(`Server listening on PORT ${process.env.PORT}`);
});

server.post('/register', async (req, res) => {
    const { email, password } = req.body;
    try {
        // 1. Check if user exists
        const user = fakeDB.some(user => user.email === email);
        if (user) throw Error("User already exists");

        const hashedPassword = await hash(password, 10);
        console.log("hashedPassword", hashedPassword);

        fakeDB.push({
            id: fakeDB.length,
            email: email,
            password: hashedPassword
        });

        res.send({ message: "User created" });

    } catch (error) {
        console.log(error);
        res.send({
            error: `${error.message}`
        })
    }
});