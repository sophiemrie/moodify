<template>
  <header class="header">
    <div class="header-content">
      <h1>moodify</h1>
      <div v-if="user">
        <img :src="user.images[0].url" alt="User Image" class="user-image" />
        <span>{{ user.display_name }}</span>
        <button @click="logout">Logout</button>
      </div>
    </div>
  </header>
</template>

<script>
export default {
  data() {
    return {
      user: null
    };
  },
  methods: {
    logout() {
      localStorage.removeItem('spotify_token');
      this.$router.push({ name: 'Login' });
    },
    async fetchUserProfile() {
      const token = localStorage.getItem('spotify_token');
      if (token) {
        const response = await fetch('https://api.spotify.com/v1/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          this.user = await response.json();
        }
      }
    }
  },
  created() {
    this.fetchUserProfile();
  }
};
</script>

<style scoped>
.header {
  background-color: #ffcc5c;
  color: white;
  padding: 10px 20px;
  text-align: center;
  font-size: 24px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.user-image {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
}
button {
  background-color: #ff6b6b;
  color: white;
  border: none;
  padding: 5px 10px;
  font-size: 14px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}
button:hover {
  background-color: #ff4c4c;
}
</style>
