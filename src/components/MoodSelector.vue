<template>
  <div class="mood-selector-container">
    <Header :user="user" />
    <div v-if="token">
      <h3>Select Your Mood:</h3>
      <div class="mood-buttons">
        <button v-for="mood in moods" :key="mood" @click="selectMood(mood)">
          {{ mood }}
        </button>
      </div>
      <div v-if="selectedMood">
        <h4>Create Playlist based on {{ selectedMood }} mood</h4>
        <input type="text" v-model="playlistName" placeholder="Playlist Name" />
        <input type="number" v-model="playlistSize" placeholder="Number of Songs" min="1" max="25" />
        <button @click="createPlaylist">Create Playlist</button>
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
      moods: ['Happy', 'Sad', 'Energetic', 'Calm'],
      selectedMood: null,
      playlistName: '',
      playlistSize: 10
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
    selectMood(mood) {
      this.selectedMood = mood;
    },
    async createPlaylist() {
      if (!this.playlistName || !this.selectedMood || this.playlistSize < 1 || this.playlistSize > 25) {
        alert('Please fill all fields correctly.');
        return;
      }

      try {
        const response = await axios.post('https://api.spotify.com/v1/users/' + this.user.id + '/playlists', {
          name: this.playlistName,
          description: `A ${this.selectedMood} playlist`,
          public: false
        }, {
          headers: {
            Authorization: `Bearer ${this.token}`
          }
        });

        const playlistId = response.data.id;

        // Add tracks based on mood
        const moodTracks = await axios.get(`https://api.spotify.com/v1/recommendations`, {
          headers: {
            Authorization: `Bearer ${this.token}`
          },
          params: {
            limit: this.playlistSize,
            seed_genres: this.selectedMood.toLowerCase()
          }
        });

        const trackUris = moodTracks.data.tracks.map(track => track.uri);

        await axios.post(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
          uris: trackUris
        }, {
          headers: {
            Authorization: `Bearer ${this.token}`
          }
        });

        alert('Playlist created successfully!');
      } catch (error) {
        console.error('Error creating playlist:', error);
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
    } else {
      this.token = localStorage.getItem('spotify_token');
      if (this.token) {
        this.fetchUser();
      }
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
  color: #4da6ff;
}

.mood-buttons {
  display: flex;
  flex-wrap: wrap;
}

.mood-buttons button {
  background-color: #ffcc5c;
  color: white;
  border: none;
  padding: 10px 20px;
  font-size: 16px;
  border-radius: 5px;
  cursor: pointer;
  margin: 5px;
}

.mood-buttons button:hover {
  background-color: #e6b34b;
}

input[type="text"],
input[type="number"] {
  display: block;
  margin: 10px 0;
  padding: 10px;
  font-size: 16px;
  border-radius: 5px;
  border: 1px solid #ccc;
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
  background-color: #3b8edc;
}
</style>
