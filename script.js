const musicLibrary = [
    {
        id: 1,
        title: "Summer Breeze",
        artist: "Chill Waves",
        genre: "pop",
        duration: 180,
        albumArt: "/api/placeholder/300/300",
        audioSrc: "path_to_audio_file.mp3"
    },
    {
        id: 2,
        title: "Rock Anthem",
        artist: "The Rockers",
        genre: "rock",
        duration: 240,
        albumArt: "/api/placeholder/300/300",
        audioSrc: "path_to_audio_file.mp3"
    },
    {
        id: 3,
        title: "Jazz Night",
        artist: "Smooth Jazz Quartet",
        genre: "jazz",
        duration: 300,
        albumArt: "/api/placeholder/300/300",
        audioSrc: "path_to_audio_file.mp3"
    }
];

class MusicPlayer {
    constructor() {
        this.currentSongIndex = 0;
        this.isPlaying = false;
        this.audio = new Audio();
        this.filteredPlaylist = [...musicLibrary];
        
        this.initializeElements();
        this.setupEventListeners();
        this.renderPlaylist();
    }

    initializeElements() {
        this.playPauseBtn = document.getElementById('playPauseBtn');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.volumeSlider = document.getElementById('volumeSlider');
        
        
        this.albumArt = document.getElementById('albumArt');
        this.songTitle = document.getElementById('songTitle');
        this.artistName = document.getElementById('artistName');
        this.currentTimeSpan = document.getElementById('currentTime');
        this.durationSpan = document.getElementById('duration');
        this.progressBar = document.querySelector('.progress');
        this.progressContainer = document.querySelector('.progress-bar');
        
        this.playlistContainer = document.getElementById('playlistItems');
        this.searchInput = document.getElementById('searchInput');
        this.categoryFilter = document.getElementById('categoryFilter');
    }

    setupEventListeners() {
        this.playPauseBtn.addEventListener('click', () => this.togglePlay());
        this.prevBtn.addEventListener('click', () => this.playPrevious());
        this.nextBtn.addEventListener('click', () => this.playNext());
        this.volumeSlider.addEventListener('input', (e) => this.setVolume(e.target.value));
        
        
        this.progressContainer.addEventListener('click', (e) => this.seekTo(e));
        
        this.audio.addEventListener('timeupdate', () => this.updateProgress());
        this.audio.addEventListener('ended', () => this.playNext());
        
        this.searchInput.addEventListener('input', () => this.filterPlaylist());
        this.categoryFilter.addEventListener('change', () => this.filterPlaylist());
    }

    togglePlay() {
        if (this.audio.src) {
            if (this.isPlaying) {
                this.audio.pause();
                this.playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
            } else {
                this.audio.play();
                this.playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
            }
            this.isPlaying = !this.isPlaying;
        } else if (this.filteredPlaylist.length > 0) {
            this.playSong(0);
        }
    }

    playSong(index) {
        if (index >= 0 && index < this.filteredPlaylist.length) {
            const song = this.filteredPlaylist[index];
            this.currentSongIndex = index;
            
            this.audio.src = song.audioSrc;
            this.albumArt.src = song.albumArt;
            this.songTitle.textContent = song.title;
            this.artistName.textContent = song.artist;
            
            this.audio.play();
            this.isPlaying = true;
            this.playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
            
            this.updatePlaylistSelection();
        }
    }

    playNext() {
        const nextIndex = (this.currentSongIndex + 1) % this.filteredPlaylist.length;
        this.playSong(nextIndex);
    }

    playPrevious() {
        const prevIndex = (this.currentSongIndex - 1 + this.filteredPlaylist.length) % this.filteredPlaylist.length;
        this.playSong(prevIndex);
    }

    setVolume(value) {
        this.audio.volume = value / 100;
    }

    updateProgress() {
        const { currentTime, duration } = this.audio;
        if (duration) {
            const progressPercent = (currentTime / duration) * 100;
            this.progressBar.style.width = `${progressPercent}%`;
            this.currentTimeSpan.textContent = this.formatTime(currentTime);
            this.durationSpan.textContent = this.formatTime(duration);
        }
    }

    seekTo(e) {
        const width = this.progressContainer.clientWidth;
        const clickX = e.offsetX;
        const duration = this.audio.duration;
        
        this.audio.currentTime = (clickX / width) * duration;
    }

    formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    filterPlaylist() {
        const searchTerm = this.searchInput.value.toLowerCase();
        const category = this.categoryFilter.value;
        
        this.filteredPlaylist = musicLibrary.filter(song => {
            const matchesSearch = song.title.toLowerCase().includes(searchTerm) || 
                                song.artist.toLowerCase().includes(searchTerm);
            const matchesCategory = category === 'all' || song.genre === category;
            
            return matchesSearch && matchesCategory;
        });
        
        this.renderPlaylist();
    }

    renderPlaylist() {
        this.playlistContainer.innerHTML = '';
        
        this.filteredPlaylist.forEach((song, index) => {
            const li = document.createElement('li');
            li.className = 'playlist-item';
            if (index === this.currentSongIndex) li.classList.add('active');
            
            li.innerHTML = `
                <img src="${song.albumArt}" alt="${song.title}">
                <div class="song-info">
                    <h4>${song.title}</h4>
                    <p>${song.artist}</p>
                </div>
            `;
            
            li.addEventListener('click', () => this.playSong(index));
            this.playlistContainer.appendChild(li);
        });
    }

    updatePlaylistSelection() {
        const items = this.playlistContainer.getElementsByClassName('playlist-item');
        Array.from(items).forEach((item, index) => {
            item.classList.toggle('active', index === this.currentSongIndex);
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new MusicPlayer();
});