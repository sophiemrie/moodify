<template>
  <div class="playlist-detail-container">
    <Header :user="user" />
    <div v-if="token">
      <h3>{{ playlist?.name }}</h3>
      <iframe
        v-if="playlist"
        :src="`https://open.spotify.com/embed/playlist/${playlist.id}`"
        width="700"
        height="380"
        frameborder="0"
        allowtransparency="true"
        allow="encrypted-media"
      ></iframe>
      <ul>
        <li v-for="track in playlistTracks" :key="track.id" class="track-item">
          <img :src="track.album.images[0].url" alt="Track Image" class="track-image" />
          <div class="track-info">
            <span>{{ track.name }}</span>
            <span>{{ track.artists.map(artist => artist.name).join(', ') }}</span>
            <span>{{ track.album.name }}</span>
          </div>
        </li>
      </ul>
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
      playlistTracks: []
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
h3 {
  color: #4da6ff;
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
  background: white;
  padding: 10px;
  margin: 5px 0;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
.track-image {
  width: 50px;
  height: 50px;
  border-radius: 5px;
  margin-right: 10px;
}
.track-info {
  display: flex;
  flex-direction: column;
}
.track-info span {
  margin: 2px 0;
}
iframe {
  margin-top: 20px;
  border: none;
  border-radius: 10px;
}
</style>
