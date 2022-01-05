const PORT = 4000
const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config()

const TMDB_BASE_URL = "https://api.themoviedb.org/3/";

const app = express();

var corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200
}

app.use(cors(corsOptions));

app.get(`/`, (req, res) => {
    res.json({
        message: "Server is up and running"
    })
})

app.get('/profile', (req, res) => {
    res.send(JSON.stringify(req.oidc.user));
});

app.get(`/movies`, (req, res) => {
    axios
    .get(`${process.env.DESTER_BACKEND_URL}/movies?_sort=createdAt:DESC`)
    .then(({ data }) => {
        const externalItems = data.map(({ tmdb_id }) => {
            return axios
            .get(`${TMDB_BASE_URL}movie/${tmdb_id}?api_key=${process.env.DESTER_TMDB_API_KEY}&append_to_response=images`)
            .then(({ data }) => {
            return data;
            });
        });
        Promise
        .all(externalItems)
        .then(externalItems => {
            res.json(externalItems);
        })
        .catch((err) => {
            res.json(err[Object.keys[0]]);
        });
    });
});

app.get(`/movies_featured`, (req, res) => {
    axios
    .get(`${process.env.DESTER_BACKEND_URL}/movies?featured=true`)
    .then(({ data }) => {
        const externalItems = data.map(({ tmdb_id }) => {
            return axios
            .get(`${TMDB_BASE_URL}movie/${tmdb_id}?api_key=${process.env.DESTER_TMDB_API_KEY}&append_to_response=images`)
            .then(({ data }) => {
            return data;
            });
        });
        Promise
        .all(externalItems)
        .then(externalItems => {
            res.json(externalItems);
        })
        .catch((err) => {
            console.log(err[Object.keys[0]]);
        });
    });
});

app.get(`/movie/:tmdb_id`, (req, res) => {
    const tmdb_id = req.params.tmdb_id;
    axios.get(`${TMDB_BASE_URL}movie/${tmdb_id}?api_key=${process.env.DESTER_TMDB_API_KEY}&append_to_response=credits,videos`)
    .then(function (response) {
        res.json(response.data);
    })
    .catch((err) => {
        res.json(err[Object.keys[0]]);
    });
});

app.get(`/series`, (req, res) => {
    axios
    .get(`${process.env.DESTER_BACKEND_URL}/series?_sort=createdAt:DESC`)
    .then(({ data }) => {
        const externalItems = data.map(({ tmdb_id }) => {
            return axios
            .get(`${TMDB_BASE_URL}tv/${tmdb_id}?api_key=${process.env.DESTER_TMDB_API_KEY}&append_to_response=images`)
            .then(({ data }) => {
            return data;
            });
        });
        Promise
        .all(externalItems)
        .then(externalItems => {
            res.json(externalItems);
        })
        .catch((err) => {
            res.json(err[Object.keys[0]]);
        });
    });
});

app.get(`/series_featured`, (req, res) => {
    axios
    .get(`${process.env.DESTER_BACKEND_URL}/series?featured=true`)
    .then(({ data }) => {
        const externalItems = data.map(({ tmdb_id }) => {
            return axios
            .get(`${TMDB_BASE_URL}tv/${tmdb_id}?api_key=${process.env.DESTER_TMDB_API_KEY}&append_to_response=images`)
            .then(({ data }) => {
            return data;
            });
        });
        Promise
        .all(externalItems)
        .then(externalItems => {
            res.json(externalItems);
        })
        .catch((err) => {
            res.json(err[Object.keys[0]]);
        });
    });
});

app.get(`/serie/:tmdb_id`, (req, res) => {
    const tmdb_id = req.params.tmdb_id;
    axios.get(`${TMDB_BASE_URL}tv/${tmdb_id}?api_key=${process.env.DESTER_TMDB_API_KEY}&append_to_response=credits,videos`)
    .then(function (response) {
        res.json(response.data);
    })
    .catch((err) => {
        res.json(err.message);
    });
});

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))