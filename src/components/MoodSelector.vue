<template>
  <div class="mood-selector-container">
    <Header :user="user" />
    <div v-if="token">
      <h3>Select Your Mood:</h3>
      <div class="emojies">
        <img src="@/assets/images/study.png" @click="selectMood('study')" />
        <img src="@/assets/images/cool.png" @click="selectMood('hip-hop')" />
        <img src="@/assets/images/sad.png" @click="selectMood('sad')" />
        <img src="@/assets/images/love.png" @click="selectMood('romance')" />
        <img src="@/assets/images/happy.png" @click="selectMood('happy')" />
        <img src="@/assets/images/party.png" @click="selectMood('party')" />
        <img src="@/assets/images/sleepy.png" @click="selectMood('sleep')" />
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
  background: #FFF9E8;
  min-height: 100vh;
}

.emojies {
  width: 90%;
  padding-left: 5%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.emojies img{
  width: 100px;
  height: 100px;
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
</style>
