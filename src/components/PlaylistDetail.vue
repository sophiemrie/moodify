<template>
  <div class="playlist-detail-container">
    <Header :user="user" />
    <div v-if="token">
      <h3>{{ playlist?.name }}</h3>
      <div class="detail-container">
        <iframe v-if="playlist" :src="`https://open.spotify.com/embed/playlist/${playlist.id}`" width="700" height="380"
          frameborder="0" allowtransparency="true" allow="encrypted-media" class="spotify-playlist"></iframe>
        <ul>
          <li v-for="track in playlistTracks" :key="track.id" class="track-item">
            <img :src="track.album.images[0].url" alt="Track Image" class="track-image" />
            <div class="track-info">
              <span>{{ track.name }}</span>
              <span class="artist">{{ track.artists.map(artist => artist.name).join(', ') }}</span>
              <span class="album">Album: {{ track.album.name }}</span>
            </div>
            <div class="youtube">
            <button v-if="!trackYoutubeLinks[track.id]" @click="fetchYouTubeLink(track)">Watch Youtube-Video</button>
            <div v-if="trackYoutubeLinks[track.id]" class="youtube-video">
              <iframe :src="convertToEmbedUrl(trackYoutubeLinks[track.id])" width="560" height="315" frameborder="0"
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen></iframe>
            </div>
          </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import Header from './AppHeader.vue';
import axios from 'axios';

export default {
  components: {
    Header
  },
  data() {
    return {
      token: null,
      user: null,
      playlist: null,
      playlistTracks: [],
      trackYoutubeLinks: {}
    };
  },
  methods: {
    async fetchUser() {
      if (!this.token) return;
      try {
        const response = await axios.get('https://api.spotify.com/v1/me', {
          headers: {
            Authorization: `Bearer ${this.token}`
          }
        });
        this.user = response.data;
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    },
    async fetchPlaylist() {
      if (!this.token) return;
      const playlistId = this.$route.params.id;
      try {
        const response = await axios.get(`https://api.spotify.com/v1/playlists/${playlistId}`, {
          headers: {
            Authorization: `Bearer ${this.token}`
          }
        });
        this.playlist = response.data;
        this.playlistTracks = response.data.tracks.items.map(item => item.track);
      } catch (error) {
        console.error('Error fetching playlist:', error);
      }
    },
    async fetchYouTubeLink(track) {
      try {
        const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
          params: {
            key: "AIzaSyAEFtJeWTJW34GgutO9n-9UAxY1A5NCFNE",
            q: track.name + ' ' + track.artists.map(artist => artist.name).join(', '),
            part: 'snippet',
            type: 'video'
          }
        });
        const videoId = response.data.items[0].id.videoId;
        this.$set(this.trackYoutubeLinks, track.id, `https://www.youtube.com/watch?v=${videoId}`);
      } catch (error) {
        console.error('Error fetching YouTube link:', error);
      }
    },
    convertToEmbedUrl(url) {
      const embedUrl = url.replace("watch?v=", "embed/");
      return embedUrl;
    }
  },
  created() {
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    this.token = params.get('access_token');
    if (this.token) {
      localStorage.setItem('spotify_token', this.token);
      this.fetchUser();
      this.fetchPlaylist();
    } else {
      this.token = localStorage.getItem('spotify_token');
      if (this.token) {
        this.fetchUser();
        this.fetchPlaylist();
      }
    }
  }
};
</script>

<style scoped>
.playlist-detail-container {
  padding: 20px;
  background: #f0f0f0;
  min-height: 100vh;
}

img {
  width: 300px;
  height: auto;
  border-radius: 10px;
  margin-bottom: 20px;
}

ul {
  list-style: none;
  padding: 0;
}

.track-item {
  display: flex;
  align-items: center;
  vertical-align: middle;
  background: white;
  padding: 10px;
  margin: 5px 0;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.track-image {
  width: 50px;
  height: 50px;
  margin: 5px;
}

.track-info {
  display: flex;
  flex-direction: column;
  width: 30%;
}

.youtube {
  width: 70%;
  display: flex;
  justify-content: space-around;
}

.youtube-video {
  width: 100%;
}

.track-info span {
  margin: 2px 0;
}

.artist {
  font-size: smaller;
}

.album {
  font-size: x-small;
}

.youtube-video iframe {
  border: none;
  border-radius: 10px;
  width: 100%;
}

.detail-container {
  display: flex;
  justify-content: space-between;
}

.detail-container .spotify-playlist {
  width: 45%;
  padding-left: 2.5%;
  height: 100vh;
}

.detail-container ul {
  width: 45%;
  padding-right: 2.5%;
}
</style>
