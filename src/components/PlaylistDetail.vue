<template>
  <div class="playlist-detail-container">
    <Header />
    <div v-if="token && tracks.length">
      <h3>{{ playlistName }}</h3>
      <ul>
        <li v-for="track in tracks" :key="track.track.id">
          <div class="track-info">
            <img :src="track.track.album.images[0].url" alt="Album cover">
            <div>
              <h4>{{ track.track.name }}</h4>
              <p>{{ track.track.artists[0].name }}</p>
            </div>
          </div>
          <iframe :src="'https://open.spotify.com/embed/track/' + track.track.id" width="300" height="80" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>
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
      playlistName: '',
      tracks: []
    };
  },
  methods: {
    async fetchPlaylistDetail() {
      if (!this.token) return;
      const playlistId = this.$route.params.id;
      const response = await axios.get(`https://api.spotify.com/v1/playlists/${playlistId}`, {
        headers: {
          'Authorization': `Bearer ${this.token}`
        }
      });
      this.playlistName = response.data.name;
      this.tracks = response.data.tracks.items;
    }
  },
  created() {
    this.token = localStorage.getItem('spotify_token');
    if (this.token) {
      this.fetchPlaylistDetail();
    } else {
      this.$router.push({ name: 'Login' });
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
  color: #b76eff;
  margin-bottom: 20px;
}
ul {
  list-style: none;
  padding: 0;
}
li {
  background: white;
  padding: 10px;
  margin: 10px 0;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
.track-info {
  display: flex;
  align-items: center;
}
.track-info img {
  width: 64px;
  height: 64px;
  margin-right: 10px;
}
.track-info h4 {
  margin: 0;
  color: #4da6ff;
}
.track-info p {
  margin: 0;
  color: #888;
}
iframe {
  margin-top: 10px;
}
</style>
