const PORT = 4000
const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config()

const TMDB_BASE_URL = "https://api.themoviedb.org/3/";

const app = express();

const corsOptions = {
    origin: process.env.DESTER_FRONTEND_URL,
    optionsSuccessStatus: 200
}

app.use(cors(corsOptions));

app.get(`/`, (req, res) => {
    res.json({
        message: "Server is up and running"
    })
});

app.get(`/home`, (req, res) => {
    axios
    .get(`${process.env.DESTER_BACKEND_URL}/home`)
    .then((response) => {
        res.json(response.data)
    })
    .catch((err) => {
        delete err.stack;
        delete err.config;
        res.json(err);
    })
})

app.get(`/movies`, (req, res) => {
    axios
    .get(`${process.env.DESTER_BACKEND_URL}/movies?_sort=createdAt:DESC`)
    .then(({ data }) => {
        const externalItems = data.map(({ tmdb_id }) => {
            return axios
            .get(`${TMDB_BASE_URL}movie/${tmdb_id}?api_key=${process.env.DESTER_TMDB_API_KEY}&append_to_response=images&include_image_language=en`)
            .then(({ data }) => {
                return data
            })
        });
        Promise
        .all(externalItems)
        .then(externalItems => {
            let movieResult = data.map(movie => {
                const tmdbItem = externalItems.find(tmdbMovie => tmdbMovie.id === movie.tmdb_id);
                    movie.video_info = null;
                    movie.tmdb_title = tmdbItem ? tmdbItem.title : null;
                    movie.tmdb_overview = tmdbItem ? tmdbItem.overview : null;
                    movie.tmdb_poster_path = tmdbItem ? tmdbItem.poster_path : null;
                    movie.tmdb_backdrop_path = tmdbItem ? tmdbItem.backdrop_path : null;
                    movie.tmdb_genres = tmdbItem ? tmdbItem.genres : null;
                    movie.tmdb_logo_images = tmdbItem ? tmdbItem.images.logos[0] : null;
                    movie.tmdb_release_date = tmdbItem ? tmdbItem.release_date : null;
                    movie.tmdb_release_status = tmdbItem ? tmdbItem.status : null;
                    movie.tmdb_production_companies = tmdbItem ? tmdbItem.production_companies : null;
                    movie.tmdb_video_runtime = tmdbItem ? tmdbItem.episode_run_time : null;
                    movie.tmdb_vote_average = tmdbItem ? tmdbItem.vote_average : null;
                return movie;
            });
            res.json(movieResult)
        })
        .catch((err) => {
            delete err.stack;
            delete err.config;
            res.json(err);
        });
    });
});

app.get(`/movies_featured`, (req, res) => {
    axios
    .get(`${process.env.DESTER_BACKEND_URL}/movies?featured=true`)
    .then(({ data }) => {
        const externalItems = data.map(({ tmdb_id }) => {
            return axios
            .get(`${TMDB_BASE_URL}movie/${tmdb_id}?api_key=${process.env.DESTER_TMDB_API_KEY}&append_to_response=images&include_image_language=en`)
            .then(({ data }) => {
            return data;
            });
        });
        Promise
        .all(externalItems)
        .then(externalItems => {
            let movieResult = data.map(movie => {
                const tmdbItem = externalItems.find(tmdbMovie => tmdbMovie.id === movie.tmdb_id);
                    movie.video_info = null;
                    movie.tmdb_title = tmdbItem ? tmdbItem.title : null;
                    movie.tmdb_overview = tmdbItem ? tmdbItem.overview : null;
                    movie.tmdb_poster_path = tmdbItem ? tmdbItem.poster_path : null;
                    movie.tmdb_backdrop_path = tmdbItem ? tmdbItem.backdrop_path : null;
                    movie.tmdb_genres = tmdbItem ? tmdbItem.genres : null;
                    movie.tmdb_logo_images = tmdbItem ? tmdbItem.images.logos[0] : null;
                    movie.tmdb_release_date = tmdbItem ? tmdbItem.first_air_date : null;
                    movie.tmdb_release_status = tmdbItem ? tmdbItem.status : null;
                    movie.tmdb_production_companies = tmdbItem ? tmdbItem.production_companies : null;
                    movie.tmdb_video_runtime = tmdbItem ? tmdbItem.episode_run_time : null;
                    movie.tmdb_vote_average = tmdbItem ? tmdbItem.vote_average : null;
                return movie;
            });
            res.json(movieResult)
        })
        .catch((err) => {
            delete err.stack;
            delete err.config;
            res.json(err);
        });
    });
});

app.get(`/movie/:tmdb_id`, (req, res) => {
    const tmdb_id = req.params.tmdb_id;
    const apiMain = axios.get(`${process.env.DESTER_BACKEND_URL}/movies?tmdb_id=${tmdb_id}`)
    const apiTmdb = axios.get(`${TMDB_BASE_URL}movie/${tmdb_id}?api_key=${process.env.DESTER_TMDB_API_KEY}&append_to_response=credits,images,videos&include_image_language=en`)
    Promise
    .all([apiMain,apiTmdb])
    .then((values) => {
        const resa1 = values[0].data[0];
        const resa2 = values[1].data;
        let movieResult = {
            ...resa2,
            ...resa1
        };
        res.json(movieResult);
    })
    .catch((err) => {
        delete err.stack;
        delete err.config;
        res.json(err);
    });
});

app.get(`/series`, (req, res) => {
    axios
    .get(`${process.env.DESTER_BACKEND_URL}/series?_sort=createdAt:DESC`)
    .then(({ data }) => {
        const externalItems = data.map(({ tmdb_id }) => {
            return axios
            .get(`${TMDB_BASE_URL}tv/${tmdb_id}?api_key=${process.env.DESTER_TMDB_API_KEY}&append_to_response=images&include_image_language=en`)
            .then(({ data }) => {
            return data;
            });
        });
        Promise
        .all(externalItems)
        .then(externalItems => {
            let serieResult = data.map(serie => {
                const tmdbItem = externalItems.find(tmdbSerie => tmdbSerie.id === serie.tmdb_id);
                    serie.video_info = null;
                    serie.tmdb_title = tmdbItem ? tmdbItem.name : null;
                    serie.tmdb_overview = tmdbItem ? tmdbItem.overview : null;
                    serie.tmdb_poster_path = tmdbItem ? tmdbItem.poster_path : null;
                    serie.tmdb_backdrop_path = tmdbItem ? tmdbItem.backdrop_path : null;
                    serie.tmdb_genres = tmdbItem ? tmdbItem.genres : null;
                    serie.tmdb_logo_images = tmdbItem ? tmdbItem.images.logos[0] : null;
                    serie.tmdb_release_date = tmdbItem ? tmdbItem.first_air_date : null;
                    serie.tmdb_release_status = tmdbItem ? tmdbItem.status : null;
                    serie.tmdb_production_companies = tmdbItem ? tmdbItem.production_companies : null;
                    serie.tmdb_video_runtime = tmdbItem ? tmdbItem.episode_run_time : null;
                    serie.tmdb_vote_average = tmdbItem ? tmdbItem.vote_average : null;
                return serie;
            });
            res.json(serieResult)
        })
        .catch((err) => {
            delete err.stack;
            delete err.config;
            res.json(err);
        });
    });
});

app.get(`/series_featured`, (req, res) => {
    axios
    .get(`${process.env.DESTER_BACKEND_URL}/series?featured=true`)
    .then(({ data }) => {
        const externalItems = data.map(({ tmdb_id }) => {
            return axios
            .get(`${TMDB_BASE_URL}tv/${tmdb_id}?api_key=${process.env.DESTER_TMDB_API_KEY}&append_to_response=images&include_image_language=en`)
            .then(({ data }) => {
            return data;
            });
        });
        Promise
        .all(externalItems)
        .then(externalItems => {
            let serieResult = data.map(serie => {
                const tmdbItem = externalItems.find(tmdbSerie => tmdbSerie.id === serie.tmdb_id);
                    serie.video_info = null;
                    serie.tmdb_title = tmdbItem ? tmdbItem.name : null;
                    serie.tmdb_overview = tmdbItem ? tmdbItem.overview : null;
                    serie.tmdb_poster_path = tmdbItem ? tmdbItem.poster_path : null;
                    serie.tmdb_backdrop_path = tmdbItem ? tmdbItem.backdrop_path : null;
                    serie.tmdb_genres = tmdbItem ? tmdbItem.genres : null;
                    serie.tmdb_logo_images = tmdbItem ? tmdbItem.images.logos[0] : null;
                    serie.tmdb_release_date = tmdbItem ? tmdbItem.first_air_date : null;
                    serie.tmdb_release_status = tmdbItem ? tmdbItem.status : null;
                    serie.tmdb_production_companies = tmdbItem ? tmdbItem.production_companies : null;
                    serie.tmdb_video_runtime = tmdbItem ? tmdbItem.episode_run_time : null;
                    serie.tmdb_vote_average = tmdbItem ? tmdbItem.vote_average : null;
                return serie;
            });
            res.json(serieResult)
        })
        .catch((err) => {
            delete err.stack;
            delete err.config;
            res.json(err);
        });
    });
});

app.get(`/serie/:tmdb_id`, (req, res) => {
    const tmdb_id = req.params.tmdb_id;
    const apiMain = axios.get(`${process.env.DESTER_BACKEND_URL}/series?tmdb_id=${tmdb_id}`)
    const apiTmdb = axios.get(`${TMDB_BASE_URL}tv/${tmdb_id}?api_key=${process.env.DESTER_TMDB_API_KEY}&append_to_response=credits,images,videos&include_image_language=en`)
    Promise
    .all([apiMain,apiTmdb])
    .then((values) => {
        const resa1 = values[0].data[0];
        const resa2 = values[1].data;
        let serieResult = {
            ...resa2,
            ...resa1
        };
        res.json(serieResult);
    })
    .catch((err) => {
        delete err.stack;
        delete err.config;
        res.json(err);
    });
});

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))