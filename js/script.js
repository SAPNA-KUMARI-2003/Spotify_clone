let currentsong = new Audio();
let songs;
let currfolder;

function convertSecondsToTime(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
}

async function getSongs(folder) {
    currfolder = folder;

    // Hardcoded song list (since folder listing is not allowed on GitHub Pages)
    const allSongs = {
        "cs": [
            "My Way - NEFFEX.mp3",
            "Skating On the Uppers - National Sweetheart.mp3"
        ],
        "sad_songs": [
            "Sad Track 1.mp3",
            "Sad Track 2.mp3"
        ]
    };

    songs = allSongs[folder] || [];

    // Show all songs in the playlist
    let songUL = document.querySelector(".songlist ul");
    songUL.innerHTML = "";

    for (const song of songs) {
        songUL.innerHTML += `<li>
            <img class="invert" src="img/music.svg" alt="">
            <div class="info">
                <div class="song-name">${song.replaceAll("%20", " ")}</div>
                <div>Sapna</div>
            </div>
            <div class="playnow">
                <img class="invert" src="img/play.svg" alt="">
            </div>
        </li>`;
    }

    // Add click listeners
    Array.from(songUL.getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", () => {
            playmusic(e.querySelector(".info").firstElementChild.innerHTML);
        });
    });

    return songs;
}

const playmusic = (track, pause = false) => {
    currentsong.src = `/${currfolder}/` + track;
    if (!pause) {
        currentsong.play();
        play.src = "img/pause.svg";
    }
    document.querySelector(".songinfo").innerHTML = decodeURI(track);
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
};

function displayAlbums() {
    const albums = [
        {
            folder: "cs",
            title: "Coding Songs",
            description: "Best tracks to code with"
        },
        {
            folder: "sad_songs",
            title: "Sad Songs",
            description: "Emotional hits"
        }
    ];

    let cardContainer = document.querySelector(".cardContainer");

    for (const album of albums) {
        cardContainer.innerHTML += `
        <div data-folder="${album.folder}" class="card">
            <div class="play-button">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="48" height="48" fill="#1ed760">
                    <circle cx="12" cy="12" r="10" stroke="#1ed760" stroke-width="3.5" fill="#1ed760" />
                    <path d="M8.5 8L16.5 12L8.5 16.5Z" fill="black" />
                </svg>
            </div>
            <img src="/${album.folder}/cover.jpg" alt="">
            <h3 class="artist-name">${album.title}</h3>
            <p class="artist-name">${album.description}</p>
        </div>`;
    }

    Array.from(document.getElementsByClassName("card")).forEach(e => {
        e.addEventListener("click", async () => {
            songs = await getSongs(e.dataset.folder);
            playmusic(songs[0]);
        });
    });
}

async function main() {
    // Load default playlist (first album)
    songs = await getSongs("cs");
    playmusic(songs[0], true);

    displayAlbums();

    play.addEventListener("click", () => {
        if (currentsong.paused) {
            currentsong.play();
            play.src = "img/pause.svg";
        } else {
            currentsong.pause();
            play.src = "img/play.svg";
        }
    });

    currentsong.addEventListener("timeupdate", () => {
        document.querySelector(".songtime").innerHTML = `${convertSecondsToTime(currentsong.currentTime)} / ${convertSecondsToTime(currentsong.duration)}`;
        document.querySelector(".circle").style.left = (currentsong.currentTime / currentsong.duration) * 100 + "%";
    });

    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentsong.currentTime = (currentsong.duration * percent) / 100;
    });

    document.querySelector(".hameburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0";
    });

    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-110%";
    });

    previous.addEventListener("click", () => {
        currentsong.pause();
        let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0]);
        if (index - 1 >= 0) {
            playmusic(songs[index - 1]);
        }
    });

    next.addEventListener("click", () => {
        currentsong.pause();
        let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0]);
        if (index + 1 < songs.length) {
            playmusic(songs[index + 1]);
        }
    });

    document.querySelector(".range input").addEventListener("change", (e) => {
        currentsong.volume = parseInt(e.target.value) / 100;
        const volumeImg = document.querySelector(".volume img");
        volumeImg.src = e.target.value == 0 ? "img/mute.svg" : "img/volume.svg";
    });

    document.querySelector(".volume > img").addEventListener("click", e => {
        const volumeBar = document.querySelector(".range input");
        if (e.target.src.includes("volume.svg")) {
            e.target.src = e.target.src.replace("volume.svg", "mute.svg");
            currentsong.volume = 0;
            volumeBar.value = 0;
        } else {
            e.target.src = e.target.src.replace("mute.svg", "volume.svg");
            currentsong.volume = 0.5;
            volumeBar.value = 50;
        }
    });
}

main();
