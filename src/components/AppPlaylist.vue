<template>
  <div class="playlist-container">
    <Header :user="user" />
    <div v-if="token">
      <h3>Your Playlists:</h3>
      <ul>
        <li v-for="playlist in paginatedPlaylists" :key="playlist.id" @click="goToDetail(playlist.id)">
          {{ playlist.name }}
        </li>
      </ul>
      <div class="pagination">
        <button @click="prevPage" :disabled="currentPage === 1">Previous</button>
        <span>Page {{ currentPage }} of {{ totalPages }}</span>
        <button @click="nextPage" :disabled="currentPage === totalPages">Next</button>
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
      playlists: [],
      currentPage: 1,
      pageSize: 10
    };
  },
  computed: {
    paginatedPlaylists() {
      const start = (this.currentPage - 1) * this.pageSize;
      const end = this.currentPage * this.pageSize;
      return this.playlists.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.playlists.length / this.pageSize);
    }
  },
  methods: {
    async fetchPlaylists() {
      if (!this.token) return;
      try {
        let response = await axios.get('https://api.spotify.com/v1/me/playlists', {
          headers: {
            Authorization: `Bearer ${this.token}`
          },
          params: {
            limit: 50 // Maximum number of playlists to fetch per request
          }
        });

        // Fetch additional playlists if there are more than 50
        let allPlaylists = response.data.items;
        while (response.data.next) {
          response = await axios.get(response.data.next, {
            headers: {
              Authorization: `Bearer ${this.token}`
            }
          });
          allPlaylists = allPlaylists.concat(response.data.items);
        }

        this.playlists = allPlaylists;
      } catch (error) {
        console.error('Error fetching playlists:', error);
      }
    },
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
    goToDetail(id) {
      this.$router.push({ name: 'PlaylistDetail', params: { id } });
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    }
  },
  created() {
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    this.token = params.get('access_token');
    if (this.token) {
      localStorage.setItem('spotify_token', this.token);
      this.fetchPlaylists();
      this.fetchUser();
    } else {
      this.token = localStorage.getItem('spotify_token');
      if (this.token) {
        this.fetchPlaylists();
        this.fetchUser();
      }
    }
  },
  watch: {
    $route: 'fetchPlaylists' // Reload playlists when the route changes
  }
};
</script>

<style scoped>
.playlist-container {
  padding: 20px;
  background: #f0f0f0;
  min-height: 100vh;
}
h3 {
  color: #4da6ff;
}
ul {
  list-style: none;
  padding: 0;
}
li {
  background: white;
  padding: 10px;
  margin: 5px 0;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.2s;
}
li:hover {
  transform: scale(1.05);
}
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 20px 0;
}
button {
  background-color: #ffcc5c;
  color: white;
  border: none;
  padding: 10px;
  font-size: 16px;
  border-radius: 5px;
  cursor: pointer;
  margin: 0 10px;
}
button:hover {
  background-color: #e6b34b;
}
button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
</style>
