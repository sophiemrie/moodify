<template>
  <div class="mood-selector-container">
    <Header :user="user" />
    <h2 style="text-align: center">Select Your Mood</h2>
    <div class="mood-list">
      <div v-for="(mood, index) in moods" :key="index" :class="['mood-item', { selected: selectedMood === index }]"
        @click="selectMood(index)">
        <img :src="mood.image" :alt="mood.name" class="mood-image" />
      </div>
    </div>
    <div v-if="selectedMood !== null" class="mood-details-card">
      <div class="mood-details">
        <div v-if="selectedMood !== null" class="selected-mood">
      <h3>Selected Mood: {{ moods[selectedMood].displayName }}</h3>
    </div>
        <input v-model="playlistName" placeholder="Enter Playlist Name" class="playlist-name-input" />
        <input type="number" min="1" max="50" placeholder="Number of Songs (max. 50)"
          class="number-of-songs-input" />
        <button @click="createPlaylist" class="create-playlist-button">
          Create Playlist
        </button>
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
      moods: [
        { name: 'study', displayName: 'productive', image: require('@/assets/images/study.png') },
        { name: 'hip-hop', displayName: 'cool', image: require('@/assets/images/cool.png') },
        { name: 'sad', displayName: 'sad', image: require('@/assets/images/sad.png') },
        { name: 'romance', displayName: 'in love', image: require('@/assets/images/love.png') },
        { name: 'happy', displayName: 'happy', image: require('@/assets/images/happy.png') },
        { name: 'party', displayName: 'energetic', image: require('@/assets/images/party.png') },
        { name: 'sleep', displayName: 'sleepy', image: require('@/assets/images/sleepy.png') }
      ],
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
          description: `A ${this.moods[this.selectedMood].displayName} playlist`,
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
            seed_genres: this.moods[this.selectedMood].name
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

        //alert('Playlist created successfully!');
        this.$router.push('/callback');
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

.mood-list {
  display: flex;
  justify-content: space-between;
  width: 90%;
  margin: 5%;
}

.mood-item {
  cursor: pointer;
  height: 100px;
  width: 100px;
}

.mood-item.selected {
  box-shadow: 0 0 15px 15px rgba(250, 183, 20, 0.8);
  border-radius: 100px;
}

.mood-image {
  width: 100px;
  height: 100px;
  border-radius: 10px;
}

.mood-image:hover{
  transform: scale(1.1);
}

.mood-details-card {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.mood-details {
  display: flex;
  flex-direction: column;
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.3);
  width: 90%;
  max-width: 500px;
}

.playlist-name-input,
.number-of-songs-input {
  display: block;
  width: 90%;
  margin: 2% 5%;
  padding: 10px;
  font-size: 16px;
  border-radius: 5px;
  border: 1px solid #6482F4;
  color: #010201;
}

.create-playlist-button{
  width: 40%;
  margin: 2% 30%;
}
</style>
