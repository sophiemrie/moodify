<template>
  <div class="header">
    <div class="user-info">
      <img :src="user?.images?.[0]?.url || 'default-avatar.png'" alt="User Avatar" />
      <span>{{ user?.display_name || 'Guest' }}</span>
      <button @click="logout">Logout</button>
    </div>
    <nav class="nav-menu">
      <router-link to="/callback">Playlists</router-link>
      <router-link to="/mood">Create Playlist</router-link>
    </nav>
  </div>
</template>

<script>
export default {
  props: ['user'],
  methods: {
    logout() {
      localStorage.removeItem('spotify_token');
      window.location = '/';
    }
  }
};
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  background-color: #6482F4;
  color: white;
  border-radius: 5px;
}
.user-info {
  display: flex;
  align-items: center;
}
.user-info img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
}
.user-info span {
  margin-right: 20px;
}
.nav-menu {
  display: flex;
}
.nav-menu a {
  color: white;
  text-decoration: none;
  margin: 0 10px;
  font-size: 16px;
}
.nav-menu a:hover {
  color: #FFAA2B;
}

</style>
