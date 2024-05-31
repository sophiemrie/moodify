<template>
  <div class="mood-selector-container">
    <Header />
    <div v-if="token">
      <h3>Select your mood:</h3>
      <div class="emoji-container">
        <span @click="selectMood('happy')">😊</span>
        <span @click="selectMood('sad')">😢</span>
        <span @click="selectMood('energetic')">💪</span>
        <span @click="selectMood('relaxed')">😌</span>
      </div>
      <div v-if="selectedMood">
        <h4>Selected Mood: {{ selectedMood }}</h4>
        <form @submit.prevent="createPlaylist">
          <div>
            <label for="playlistName">Playlist Name:</label>
            <input id="playlistName" v-model="playlistName" required />
          </div>
          <div>
            <label for="songCount">Number of Songs (max 25):</label>
            <input id="songCount" v-model.number="songCount" type="number" min="1" max="25" required />
          </div>
          <button type="submit">Create Playlist</button>
        </form>
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
      selectedMood: '',
      playlistName: '',
      songCount: 1
    };
  },
  methods: {
    selectMood(mood) {
      this.selectedMood = mood;
    },
    async createPlaylist() {
      if (!this.token) return;

      // Create playlist
      const response = await axios.post(
        'https://api.spotify.com/v1/me/playlists',
        {
          name: this.playlistName,
          description: `Playlist created based on mood: ${this.selectedMood}`,
          public: false
        },
        {
          headers: {
            Authorization: `Bearer ${this.token}`
          }
        }
      );

      const playlistId = response.data.id;

      // Add tracks to playlist based on mood
      const tracks = await this.fetchTracksBasedOnMood(this.selectedMood, this.songCount);
      if (tracks.length > 0) {
        await axios.post(
          `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
          {
            uris: tracks
          },
          {
            headers: {
              Authorization: `Bearer ${this.token}`
            }
          }
        );
      }

      // Redirect to playlist detail page
      this.$router.push({ name: 'PlaylistDetail', params: { id: playlistId } });
    },
    async fetchTracksBasedOnMood(mood, limit) {
      const response = await axios.get(
        `https://api.spotify.com/v1/recommendations`,
        {
          params: {
            seed_genres: mood,
            limit: limit
          },
          headers: {
            Authorization: `Bearer ${this.token}`
          }
        }
      );
      return response.data.tracks.map(track => track.uri);
    }
  },
  created() {
    this.token = localStorage.getItem('spotify_token');
    if (!this.token) {
      this.$router.push({ name: 'Login' });
    }
  }
};
</script>

<style scoped>
.mood-selector-container {
  padding: 20px;
  background: #f0f0f0;
  min-height: 100vh;
}
h3 {
  color: #ffcc5c;
}
.emoji-container {
  display: flex;
  justify-content: space-around;
  margin: 20px 0;
}
.emoji-container span {
  font-size: 48px;
  cursor: pointer;
}
form {
  display: flex;
  flex-direction: column;
}
form div {
  margin-bottom: 10px;
}
button {
  background-color: #4da6ff;
  color: white;
  border: none;
  padding: 10px;
  font-size: 16px;
  border-radius: 5px;
  cursor: pointer;
}
button:hover {
  background-color: #3b8ed0;
}
</style>
